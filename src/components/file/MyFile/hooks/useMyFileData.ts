import { useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { App } from 'antd'
import { useUserInfo } from '~/hooks'
import { fileApi } from '~/api'
import { OwnerType } from '~/type'

export const useMyFileData = () => {
  const { message } = App.useApp()
  const [search] = useSearchParams()

  const { data: userInfo, loading: userInfoLoading } = useUserInfo()
  const pathId =
    search.get('path') || userInfo?.additionalInformation.rootDirectory.id
  const { data: fileList, loading: fileListLoading } = useRequest(
    async () => {
      if (userInfo && pathId) {
        return fileApi.getNowFileList({
          nowDirectoryId: pathId,
          ownerId: userInfo.uId,
          ownerType: OwnerType.user,
          pageIndex: 0
        })
      }
    },
    {
      refreshDeps: [userInfo, pathId],
      onError(err) {
        message.error(err.message)
      }
    }
  )

  return {
    userInfo,
    fileList,
    pathId,
    loading: userInfoLoading || fileListLoading
  }
}
