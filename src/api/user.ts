import { request } from '~/util'
import { LoginInfo, UserInfo } from '~/type'

export const userApi = {
  userLogin(params: LoginInfo) {
    return request.post<{ token: string }>('/sso/login/login', params)
  },
  userInfo() {
    return request.get<UserInfo>('/user/userinfo/user')
  }
}
