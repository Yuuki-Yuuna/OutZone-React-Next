import {
  Uploader,
  UploaderOption,
  UploadFile,
  UploadStatus
} from '~/store/uploader'

export type { Uploader, UploaderOption, UploadFile, UploadStatus }

export enum OwnerType {
  group,
  user
}
