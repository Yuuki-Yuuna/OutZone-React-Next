import { request } from '~/util'
import { FileInformation, FileListByPathParams, PathParams } from '~/type'

export const fileApi = {
  getPathId(params: PathParams) {
    return request.get<FileInformation>('/file/manage/path/info', { params })
  },
  getFileListByPath(params: FileListByPathParams) {
    return request.get<FileInformation[]>('/file/manage/path', { params })
  }
}
