import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { getToken } from './token'
import { ResponseData } from '~/type'

export const baseURL = import.meta.env.DEV
  ? 'http://172.23.252.223:9528/api'
  : 'http://192.168.123.130:9527/api'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    const token = getToken()
    config.headers['token'] = token
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const result = response.data
    if (result.code >= 200 && result.code < 300) {
      return response
    }
    return Promise.reject(new RequestError(result.code, result.msg, response))
  },
  (error: AxiosError) => {
    const { code, response } = error
    switch (code) {
      case 'ECONNABORTED':
        return Promise.reject(new RequestError(code, '请求超时', response))
      case 'ERR_NETWORK':
        return Promise.reject(new RequestError(code, '网络错误', response))
      case 'ERR_BAD_REQUEST':
        return Promise.reject(new RequestError(code, '请求错误', response))
      case 'ERR_BAD_RESPONSE':
        return Promise.reject(new RequestError(code, '响应错误', response))
      default:
        return Promise.reject(
          new RequestError('ERR_UNKNOWN', '未知错误', response)
        )
    }
  }
)

export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return new Promise<T>((resolve, reject) => {
      instance
        .get<ResponseData<T>>(url, config)
        .then(responseResolver)
        .then((res) => resolve(res.data)) //认定了返回数据结构必须遵循ResponseData
        .catch((err) => reject(err))
    })
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return new Promise<T>((resolve, reject) => {
      instance
        .post<ResponseData<T>>(url, data, config)
        .then(responseResolver)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  }
}

// 处理响应数据
const responseResolver = (res: AxiosResponse<ResponseData>) => {
  const { data: responseData } = res
  if (!Reflect.has(responseData, 'data')) {
    throw new RequestError(responseData.code, '响应数据格式错误', res)
  }
  return responseData
}

export class RequestError extends Error {
  code: string | number //服务端返回的自定义code或axios的错误code
  status?: number //http状态码
  response?: AxiosResponse

  constructor(code: string | number, msg: string, response?: AxiosResponse) {
    super(msg)
    this.name = 'RequestError'
    this.code = code
    this.response = response
    this.status = response?.status
  }
}
