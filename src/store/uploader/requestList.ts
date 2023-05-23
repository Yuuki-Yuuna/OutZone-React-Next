import { runInAction } from 'mobx'
import { Uploader, UploaderOption } from './uploader'
import { UploadFile, TestChunk, Chunk } from './uploadFile'

interface UploadRequest {
  uploadFile: UploadFile
  current: number //当前块号，合并或预检等为-1
  start: () => Promise<RequestResult>
}

type LoadHandler = (
  resolve: (value: RequestResult | PromiseLike<RequestResult>) => void,
  retrySend: () => void
) => () => void

interface StartOption {
  uploadFile: UploadFile
  xhr: XMLHttpRequest
  send: () => void
  loadHandler: LoadHandler
}

enum RequestResult {
  precheck, //需要上传
  test, //需要上传
  skip,
  real,
  success,
  fail,
  abort
}

const requestMap = new WeakMap<UploadFile, XMLHttpRequest[]>() //用于终止请求和统计请求
const requestMapAdd = (uploadFile: UploadFile, xhr: XMLHttpRequest) => {
  if (!requestMap.has(uploadFile)) {
    requestMap.set(uploadFile, [])
  }
  const xhrs = requestMap.get(uploadFile)!
  xhrs.push(xhr)
}
const requestMapRemove = (uploadFile: UploadFile, xhr: XMLHttpRequest) => {
  const xhrs = requestMap.get(uploadFile)
  if (xhrs) {
    requestMap.set(
      uploadFile,
      xhrs.filter((item) => item !== xhr)
    )
  }
}

export class RequestList {
  uploader: Uploader
  uploadRequests: UploadRequest[] = []
  currentRequest = 0

  constructor(uploader: Uploader) {
    this.uploader = uploader
  }

  //开始上传一个文件的方法
  uploadRequest = async (uploadFile: UploadFile, resume: boolean = false) => {
    uploadFile.lastTimestamp = Date.now()
    this.uploader.onFileStart?.(uploadFile)
    if (resume) {
      for (let current = 0; current < uploadFile.chunks.length; current++) {
        this.addRequest(createTestRequest(this.uploader, uploadFile, current))
      }
    } else {
      this.addRequest(createPrecheckRequest(this.uploader, uploadFile))
    }
  }

  // 内部方法
  addRequest(request: UploadRequest) {
    this.uploadRequests.push(request)
    this.requestNext()
  }

  clearRequest(uploadFile: UploadFile, cancel: boolean = false) {
    this.uploadRequests = this.uploadRequests.filter(
      (item) => item.uploadFile !== uploadFile
    )
    requestMap.get(uploadFile)?.forEach((xhr) => xhr.abort())
    requestMap.delete(uploadFile)
    runInAction(() => {
      uploadFile.chunksLoaded = new Array(uploadFile.chunks.length).fill(0)
      uploadFile.averageSpeed = 0
      uploadFile.currentSpeed = 0
    })
    const { onFileCancel, onFilePause } = this.uploader
    cancel ? onFileCancel?.(uploadFile) : onFilePause?.(uploadFile)
  }

  requestNext() {
    const { concurrency, progressCallbacksInterval } = this.uploader.option
    const { onFileProgress, onFileComplete, onFileSuccess, onFileFail } =
      this.uploader
    while (this.currentRequest < concurrency && this.uploadRequests.length) {
      this.currentRequest++
      const uploadRequest = this.uploadRequests.shift()!
      const { uploadFile, current, start } = uploadRequest
      start().then((result) => {
        switch (result) {
          case RequestResult.precheck:
            for (
              let current = 0;
              current < uploadFile.chunks.length;
              current++
            ) {
              this.addRequest(
                createTestRequest(this.uploader, uploadFile, current)
              )
            }
            break
          case RequestResult.test:
            this.addRequest(
              createRealRequest(this.uploader, uploadFile, current)
            )
            break
          case RequestResult.skip:
          case RequestResult.real:
            if (uploadFile.isCompleted) {
              runInAction(() => (uploadFile.status = 'compelete'))
              onFileComplete?.(uploadFile)
              this.addRequest(createMergeRequest(this.uploader, uploadFile))
            }
            break
          case RequestResult.success:
            // 过快更新进度，例如从precheck跳过来
            if (
              Date.now() - uploadFile.lastTimestamp <
              progressCallbacksInterval
            ) {
              runInAction(() => {
                uploadFile.chunksLoaded = uploadFile.chunks.map(
                  (chunk) => chunk.currentSize
                )
              })
              uploadFile.update()
              onFileProgress?.(uploadFile)
            }
            runInAction(() => (uploadFile.status = 'success'))
            onFileSuccess?.(uploadFile)
            break
          case RequestResult.fail:
            this.clearRequest(uploadFile, false)
            runInAction(() => (uploadFile.status = 'fail'))
            onFileFail?.(
              uploadFile,
              new Error('there is a file failed when upload')
            )
        }

        this.currentRequest--
        if (this.uploadRequests.length) {
          this.requestNext()
        }
      })
    }
  }
}

const createTestRequest = (
  uploader: Uploader,
  uploadFile: UploadFile,
  current: number
): UploadRequest => {
  const {
    target,
    headers,
    withCredentials,
    successCodes,
    skipCodes,
    failCodes,
    progressCallbacksInterval
  } = uploader.option
  const checkInterval = () =>
    Date.now() - uploadFile.lastTimestamp >= progressCallbacksInterval
  const xhr = new XMLHttpRequest()
  xhr.withCredentials = withCredentials

  const testChunk: TestChunk = { ...uploadFile.chunks[current] } //值传递
  Reflect.deleteProperty(testChunk, 'file')

  const params = new URLSearchParams()
  for (const key in testChunk) {
    params.append(key, testChunk[key as keyof TestChunk].toString())
  }
  const extra = uploadFile.extraData.data
  Object.keys(extra).forEach((key) => params.append(key, extra[key]))

  const send = () => {
    xhr.open('get', `${target}?${params.toString()}`)
    const requestHeaders = headers()
    Object.keys(requestHeaders).forEach((key) =>
      xhr.setRequestHeader(key, requestHeaders[key])
    )
    xhr.send()
  }
  const loadHandler: LoadHandler = (resolve, retrySend) => {
    return () => {
      if (successCodes.includes(xhr.status)) {
        resolve(RequestResult.test)
      } else if (skipCodes.includes(xhr.status)) {
        runInAction(() => {
          uploadFile.chunksLoaded[current] =
            uploadFile.chunks[current].currentSize
        })
        if (checkInterval()) {
          uploadFile.update()
          uploader.onFileProgress?.(uploadFile)
        }
        resolve(RequestResult.skip)
      } else if (failCodes.includes(xhr.status)) {
        resolve(RequestResult.fail)
      } else {
        retrySend()
      }
    }
  }

  return {
    uploadFile,
    current,
    start: createStart(uploader.option, {
      xhr,
      uploadFile,
      loadHandler,
      send
    })
  }
}

const createRealRequest = (
  uploader: Uploader,
  uploadFile: UploadFile,
  current: number
): UploadRequest => {
  const {
    target,
    headers,
    withCredentials,
    successCodes,
    failCodes,
    progressCallbacksInterval
  } = uploader.option
  const checkInterval = () =>
    Date.now() - uploadFile.lastTimestamp >= progressCallbacksInterval
  const xhr = new XMLHttpRequest()
  xhr.withCredentials = withCredentials
  xhr.upload.addEventListener('progress', (event) => {
    runInAction(() => {
      uploadFile.chunksLoaded[current] =
        (event.loaded / event.total) * uploadFile.chunks[current].currentSize
    })
    if (checkInterval()) {
      uploadFile.update()
      uploader.onFileProgress?.(uploadFile)
    }
  })

  const chunk = uploadFile.chunks[current]
  const formData = new FormData()
  for (const key in chunk) {
    let value = chunk[key as keyof Chunk]
    if (typeof value === 'number') {
      value = value.toString()
    }
    formData.append(key, value)
  }
  const extra = uploadFile.extraData.data
  Object.keys(extra).forEach((key) => formData.append(key, extra[key]))

  const send = () => {
    xhr.open('post', target)
    const requestHeaders = headers()
    Object.keys(requestHeaders).forEach((key) =>
      xhr.setRequestHeader(key, requestHeaders[key])
    )
    xhr.send(formData)
  }
  const loadHandler: LoadHandler = (resolve, retrySend) => {
    return () => {
      if (successCodes.includes(xhr.status)) {
        resolve(RequestResult.real)
      } else if (failCodes.includes(xhr.status)) {
        resolve(RequestResult.fail)
      } else {
        retrySend()
      }
    }
  }

  return {
    uploadFile,
    current,
    start: createStart(uploader.option, {
      xhr,
      uploadFile,
      loadHandler,
      send
    })
  }
}

const createMergeRequest = (
  uploader: Uploader,
  uploadFile: UploadFile
): UploadRequest => {
  const { mergeTarget, headers, withCredentials, successCodes, failCodes } =
    uploader.option
  const xhr = new XMLHttpRequest()
  xhr.withCredentials = withCredentials

  const chunk = { ...uploadFile.chunks[0] }
  Reflect.deleteProperty(chunk, 'file')
  Reflect.deleteProperty(chunk, 'chunkIndex')
  const formData = new FormData()
  for (const key in chunk) {
    let value = chunk[key as keyof Chunk]
    if (typeof value === 'number') {
      value = value.toString()
    }
    formData.append(key, value)
  }
  const extra = uploadFile.extraData.mergeData
  Object.keys(extra).forEach((key) => formData.append(key, extra[key]))

  const send = () => {
    xhr.open('post', mergeTarget)
    const requestHeaders = headers()
    Object.keys(requestHeaders).forEach((key) =>
      xhr.setRequestHeader(key, requestHeaders[key])
    )
    xhr.send(formData)
  }
  const loadHandler: LoadHandler = (resolve, retrySend) => {
    return () => {
      if (successCodes.includes(xhr.status)) {
        resolve(RequestResult.success)
      } else if (failCodes.includes(xhr.status)) {
        resolve(RequestResult.fail)
      } else {
        retrySend()
      }
    }
  }

  return {
    uploadFile,
    current: -1,
    start: createStart(uploader.option, {
      xhr,
      uploadFile,
      loadHandler,
      send
    })
  }
}

const createPrecheckRequest = (
  uploader: Uploader,
  uploadFile: UploadFile
): UploadRequest => {
  const {
    precheckTarget,
    headers,
    withCredentials,
    successCodes,
    skipCodes,
    failCodes
  } = uploader.option
  const xhr = new XMLHttpRequest()
  xhr.withCredentials = withCredentials

  const chunk = { ...uploadFile.chunks[0] }
  Reflect.deleteProperty(chunk, 'file')
  Reflect.deleteProperty(chunk, 'chunkIndex')
  const data = JSON.stringify({
    ...chunk,
    ...uploadFile.extraData.precheckData
  })

  const send = () => {
    xhr.open('post', precheckTarget)
    const requestHeaders = headers()
    Object.keys(requestHeaders).forEach((key) =>
      xhr.setRequestHeader(key, requestHeaders[key])
    )
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(data)
  }
  const loadHandler: LoadHandler = (resolve, retrySend) => {
    return () => {
      if (successCodes.includes(xhr.status)) {
        resolve(RequestResult.precheck)
      } else if (skipCodes.includes(xhr.status)) {
        resolve(RequestResult.success)
      } else if (failCodes.includes(xhr.status)) {
        resolve(RequestResult.fail)
      } else {
        retrySend()
      }
    }
  }

  return {
    uploadFile,
    current: -1,
    start: createStart(uploader.option, {
      xhr,
      uploadFile,
      loadHandler,
      send
    })
  }
}

//抽离公共逻辑
const createStart = (option: UploaderOption, startOption: StartOption) => {
  const { retryCount } = option
  const { xhr, uploadFile, send, loadHandler } = startOption

  return () => {
    return new Promise<RequestResult>((resolve) => {
      let retry = 0
      const retrySend = () => {
        if (retry < retryCount) {
          retry++
          send()
          requestMapAdd(uploadFile, xhr)
        } else {
          resolve(RequestResult.fail)
        }
      }

      xhr.addEventListener('load', loadHandler(resolve, retrySend))
      xhr.addEventListener('error', () => retrySend())
      xhr.addEventListener('abort', () => resolve(RequestResult.abort))
      xhr.addEventListener('loadend', () => requestMapRemove(uploadFile, xhr))

      send()
      requestMapAdd(uploadFile, xhr)
    })
  }
}
