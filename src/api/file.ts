import { useRequest } from 'ahooks'
import { App } from 'antd'
import { request } from '~/util'
import { FileInformation, NowFileListParams } from '~/type'

export const fileApi = {
  getNowFileList(params: NowFileListParams) {
    return request.post<FileInformation[]>(
      '/file/manage/getNowFileList',
      params
    )
  }
}
