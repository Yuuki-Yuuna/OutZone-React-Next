import React, { useContext, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { UploadOutlined } from '@ant-design/icons'
import { App, Button } from 'antd'
import { useRootStore } from '~/store'
import { useUserInfo } from '~/hooks'
import { OwnerType, UploadFile } from '~/type'

const FileUpload: React.FC = observer(() => {
  const { message } = App.useApp()
  const { data: userInfo } = useUserInfo()

  const uploadRef = useRef<HTMLElement>(null)
  const { uploader } = useRootStore()
  uploader.onFileReady = (uploadFile) => {
    if (!userInfo) {
      message.error('获取用户信息失败')
      uploader.removeFile(uploadFile)
      return
    }
    const extra = {
      // 没有时获取根文件夹
      destinationPath: '/',
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
