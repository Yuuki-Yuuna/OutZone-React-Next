import { useRequest } from 'ahooks'
import { App } from 'antd'
import { fileApi } from '~/api'
import { useDelayLoadingDone, useUserInfo } from '~/hooks'
import { OwnerType } from '~/type'

export const useFilePreviewData = (uploadPath: string) => {
  const { message } = App.useApp()
  const { data: userInfo, loading: userInfoLoading } = useUserInfo()
  const { data: previewList, loading: previewLoading } = useRequest(
    async () => {
      if (userInfo) {
        return fileApi.getFileListByPath({
          path: uploadPath,
          ownerId: userInfo.uId,
          ownerType: OwnerType.user,
          pageIndex: 0
        })
      }
    },
    {
      refreshDeps: [userInfo],
      onError(err) {
        message.error(err.message)
      }
    }
  )
  const delayLoading = useDelayLoadingDone(
    userInfoLoading || previewLoading,
    400
  )

  return {
    userInfo,
    previewList,
    loading: delayLoading
  }
}
