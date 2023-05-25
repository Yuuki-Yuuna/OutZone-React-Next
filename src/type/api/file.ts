import { OwnerType } from '../upload'

export interface FileListByPathParams {
  path: string
  ownerId: string
  ownerType: OwnerType
  pageIndex: number
}
