import { useRequest } from 'ahooks'
import { App } from 'antd'
import { userApi } from '~/api'

export const useUserInfo = () => {
  const { message } = App.useApp()

  return useRequest(userApi.userInfo, {
    cacheKey: 'userInfo',
    onError(err) {
      message.error(err.message)
    }
  })
}
