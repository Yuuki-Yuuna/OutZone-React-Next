import { makeAutoObservable, runInAction } from 'mobx'
import { ExtraData, UploadFile, UploadStatus } from './uploadFile'
import { Trigger, createTrigger } from './trigger'
import { calculateFile } from './calculate'
import { RequestList } from './requestList'

type Awaitble<T> = T | Promise<T>

export type UploaderOption = Readonly<{
  accept: string //接受的文件类型
  multiple: boolean //文件多选(multiple实现)
  directoryMode: boolean //选择文件夹上传(multiple失效)
  chunkSize: number //分块大小(byte)
  target: string
  mergeTarget: string
  precheckTarget: string
  concurrency: number
  headers: () => Record<string, string>
  withCredentials: boolean
  retryCount: number
  progressCallbacksInterval: number
  successCodes: number[]
  skipCodes: number[]
  failCodes: number[]
  data?: (uploadFile: Readonly<UploadFile>) => ExtraData['data']
  mergeData?: (uploadFile: Readonly<UploadFile>) => ExtraData['mergeData']
  precheckData?: (uploadFile: Readonly<UploadFile>) => ExtraData['precheckData']
}>

export interface UploaderListener {
  //拖拽事件
  onDragEnter?: (event: DragEvent) => void
  onDragOver?: (event: DragEvent) => void
  onDragLeave?: (event: DragEvent) => void
  //文件事件
  onFileAdded?: (file: File) => Awaitble<boolean | void>
  onFileReady?: (file: UploadFile) => Awaitble<void>
  onFileRemoved?: (file: UploadFile) => void
  //传输事件
  onFileStart?: (file: UploadFile) => void
  onFileProgress?: (file: UploadFile) => void
  onFilePause?: (file: UploadFile) => void
  onFileCancel?: (file: UploadFile) => void
  onFileComplete?: (file: UploadFile) => void
  onFileSuccess?: (file: UploadFile) => void
  onFileFail?: (file: UploadFile, error: Error) => void
}

export class Uploader implements UploaderListener {
  readonly fileList: UploadFile[] = [] //注意！和vue不一样，数组中的对象不会被代理
  readonly option: UploaderOption
  private readonly _trigger: Trigger
  private readonly _requestList: RequestList
  private _clickElement: HTMLElement | null = null
  private _dropElement: HTMLElement | null = null

  onDragEnter?: (event: DragEvent) => void
  onDragOver?: (event: DragEvent) => void
  onDragLeave?: (event: DragEvent) => void
  onFileAdded?: (file: File) => Awaitble<boolean | void>
  onFileReady?: (file: UploadFile) => Awaitble<void>
  onFileRemoved?: (file: UploadFile) => void
  onFileStart?: (file: UploadFile) => void
  onFileProgress?: (file: UploadFile) => void
  onFilePause?: (file: UploadFile) => void
  onFileCancel?: (file: UploadFile) => void
  onFileComplete?: (file: UploadFile) => void
  onFileSuccess?: (file: UploadFile) => void
  onFileFail?: (file: UploadFile, error: Error) => void

  constructor(option?: Partial<UploaderOption>) {
    this.option = { ...defaultOption, ...option }
    this._trigger = createTrigger(this)
    this._requestList = new RequestList(this)
    makeAutoObservable(this)
  }

  register(element: HTMLElement) {
    if (this._clickElement) {
      this.unRegister()
    }
    const { clickTrigger } = this._trigger
    element.addEventListener('click', clickTrigger)
    this._clickElement = element
  }

  unRegister() {
    const { clickTrigger } = this._trigger
    this._clickElement?.removeEventListener('click', clickTrigger)
    this._clickElement = null
  }

  registerDrop(element: HTMLElement) {
    if (this._dropElement) {
      this.unRegisterDrop()
    }
    const { dropTrigger, dragEnterTrigger, dragLeaveTrigger, dragOverTrigger } =
      this._trigger
    element.addEventListener('drop', dropTrigger)
    element.addEventListener('dragenter', dragEnterTrigger)
    element.addEventListener('dragover', dragOverTrigger)
    element.addEventListener('dragleave', dragLeaveTrigger)
    this._dropElement = element
  }

  unRegisterDrop() {
    const { dropTrigger, dragEnterTrigger, dragLeaveTrigger, dragOverTrigger } =
      this._trigger
    this._dropElement?.removeEventListener('drop', dropTrigger)
    this._dropElement?.removeEventListener('dragenter', dragEnterTrigger)
    this._dropElement?.removeEventListener('dragover', dragOverTrigger)
    this._dropElement?.removeEventListener('dragleave', dragLeaveTrigger)
    this._dropElement = null
  }

  async addFile(file: File, extraData: Partial<ExtraData> = {}) {
    const result = (await this.onFileAdded?.(file)) ?? true
    if (!result) {
      return
    }
    const uploadFile = new UploadFile(file) //在类中代理过了
    const { data, mergeData, precheckData } = this.option
    runInAction(() => {
      Object.assign(uploadFile.extraData.data, {
        ...data?.(uploadFile),
        ...extraData.data
      })
      Object.assign(uploadFile.extraData.data, {
        ...mergeData?.(uploadFile),
        ...extraData.mergeData
      })
      Object.assign(uploadFile.extraData.precheckData, {
        ...precheckData?.(uploadFile),
        ...extraData.precheckData
      })
      this.fileList.push(uploadFile)
    })
    try {
      await calculateFile(this, uploadFile)
      runInAction(() => {
        uploadFile.status = 'waiting'
        this.onFileReady?.(uploadFile)
      })
    } catch {
      runInAction(() => {
        uploadFile.status = 'fail'
        throw new Error('something wrong when file chunk is calculated.')
      })
    }
  }

  async addFileList(fileList: File[]) {
    for (const file of fileList) {
      await this.addFile(file)
    }
  }

  removeFile(uploadFile: UploadFile) {
    const index = this.fileList.findIndex((item) => item.uid === uploadFile.uid)
    const canRemove = (
      ['waiting', 'success', 'fail'] as UploadStatus[]
    ).includes(uploadFile.status)
    if (canRemove && index !== -1) {
      this.fileList.splice(index, 1)
      this.onFileRemoved?.(uploadFile) //返回普通对象
    }
  }

  upload(uploadFile: UploadFile) {
    if (uploadFile.status === 'waiting') {
      runInAction(() => (uploadFile.status = 'uploading'))
      this._requestList.uploadRequest(uploadFile)
    }
  }

  uploadAll() {
    this.fileList
      .filter((item) => item.status === 'waiting')
      .forEach((file) => this.upload(file))
  }

  pause(uploadFile: UploadFile) {
    if (uploadFile.status === 'uploading') {
      runInAction(() => (uploadFile.status = 'pause'))
      this._requestList.clearRequest(uploadFile)
    }
  }

  pauseAll() {
    this.fileList
      .filter((item) => item.status === 'uploading')
      .forEach((file) => this.pause(file))
  }

  cancel(uploadFile: UploadFile) {
    const canCancel = (
      ['uploading', 'pause', 'compelete'] as UploadStatus[]
    ).includes(uploadFile.status)
    if (canCancel) {
      runInAction(() => (uploadFile.status = 'pause')) //还是先pause
      this._requestList.clearRequest(uploadFile, true)
      this.removeFile(uploadFile)
    }
  }

  resume(uploadFile: UploadFile) {
    if (uploadFile.status === 'pause') {
      runInAction(() => (uploadFile.status = 'uploading'))
      this._requestList.uploadRequest(uploadFile, true)
    }
  }
}

export default Uploader

const defaultOption: UploaderOption = {
  target: '/',
  mergeTarget: '/',
  precheckTarget: '/',
  accept: '',
  multiple: true,
  directoryMode: false,
  chunkSize: 2 * 1024 * 1024,
  concurrency: 3,
  headers: () => ({}),
  withCredentials: false,
  retryCount: 3,
  progressCallbacksInterval: 200,
  successCodes: [200, 201, 202],
  skipCodes: [204, 205, 206],
  failCodes: [400, 403, 404, 415, 500, 501]
}
