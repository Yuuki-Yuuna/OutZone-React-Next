import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { UploadOutlined } from '@ant-design/icons'
import { App, Button } from 'antd'
import { useRootStore } from '~/store'
import { usePathId } from '~/hooks'
import { OwnerType, UploadFile } from '~/type'

const FileUpload: React.FC = observer(() => {
  const { message } = App.useApp()
  const [search] = useSearchParams()
  const path = search.get('path') || '/'
  const uploadPath = path == '/' ? path : path + '/'
  const { userInfo, pathId } = usePathId(uploadPath, OwnerType.user)

  const uploadRef = useRef<HTMLElement>(null)
  const { uploader } = useRootStore()
  uploader.onFileReady = (uploadFile) => {
    if (!userInfo || !pathId) {
      message.error('获取用户信息失败')
      uploader.removeFile(uploadFile)
      return
    }
    const extra = {
      destinationPath: pathId,
      ownerType: OwnerType.user,
      ownerId: userInfo.uId
    }
    Object.keys(uploadFile.extraData).forEach((key) => {
      const typedKey = key as keyof UploadFile['extraData']
      Object.assign(uploadFile.extraData[typedKey], extra)
    })
    // uploadFile.extraData.mergeData.fileIcon = ''
    uploader.upload(uploadFile)
  }

  useEffect(() => {
    const element = uploadRef.current
    if (element) {
      uploader.register(element)
      uploader.registerDrop(element)
    }

    return () => {
      uploader.unRegister()
      uploader.unRegisterDrop()
    }
    //mobx中的值引用发生变化时能够触发useEffect
  }, [uploader])

  return (
    <Button
      ref={uploadRef}
      icon={<UploadOutlined />}
      type='primary'
      shape='round'
    >
      上传
    </Button>
  )
})

export default FileUpload
