import { useRef, useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { App } from 'antd'
import { useUserInfo } from '~/hooks'
import { fileApi } from '~/api'
import { OwnerType } from '~/type'

const minInterval = 500 // 最小间隔

export const useMyFileData = () => {
  const { message } = App.useApp()
  const [search] = useSearchParams()
  const path = search.get('path') || '/'

  const { data: userInfo, loading: userInfoLoading } = useUserInfo()
  const { data: fileList, loading: fileListLoading } = useRequest(
    async () => {
      if (userInfo) {
        return fileApi.getFileListByPath({
          ownerId: userInfo.uId,
          ownerType: OwnerType.user,
          pageIndex: 0,
          path
        })
      }
    },
    {
      refreshDeps: [userInfo, path],
      onError(err) {
        message.error(err.message)
      }
    }
  )

  const timestampRef = useRef(Date.now()) //检测加载间隔，只检测了fileList
  const timeoutRef = useRef<NodeJS.Timeout>()
  const loading = userInfoLoading || fileListLoading
  const [minLoading, setMinLoading] = useState(loading) //加载时间最低500ms
  useUpdateEffect(() => {
    clearTimeout(timeoutRef.current)
    if (!loading) {
      const dt = Date.now() - timestampRef.current
      if (dt < minInterval) {
        timeoutRef.current = setTimeout(
          () => setMinLoading(false),
          minInterval - dt
        )
      } else {
        setMinLoading(false)
      }
    }
    timestampRef.current = Date.now()
  }, [loading])

  return {
    userInfo,
    fileList,
    loading: minLoading
  }
}
