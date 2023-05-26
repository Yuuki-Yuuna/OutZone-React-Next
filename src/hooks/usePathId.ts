import { useRequest } from 'ahooks'
import { App } from 'antd'
import { useUserInfo } from './useUserInfo'
import { fileApi } from '~/api'
import { OwnerType } from '~/type'

export const usePathId = (path: string, ownerType: OwnerType) => {
  const { message } = App.useApp()
  const { data: userInfo, loading: userInfoLoading } = useUserInfo()
  const { data: pathIdRes, loading: pathIdLoading } = useRequest(
    async () => {
      if (userInfo) {
        return fileApi.getPathId({
          ownerId: userInfo.uId,
          ownerType,
          path
        })
      }
    },
    {
      cacheKey: 'pathId',
      refreshDeps: [userInfo],
      onError(err) {
        message.error(err.message)
      }
    }
  )

  return {
    userInfo,
    pathId: pathIdRes?.id,
    loading: userInfoLoading || pathIdLoading
  }
}
