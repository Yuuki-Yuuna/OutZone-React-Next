import { request } from '~/util'
import { FileInformation, FileListByPathParams } from '~/type'

export const fileApi = {
  getFileListByPath(params: FileListByPathParams) {
    return request.get<FileInformation[]>('/file/manage/path', { params })
  }
}
