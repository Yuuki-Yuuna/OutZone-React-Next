import { OwnerType } from '../upload'

export interface PathParams {
  path: string
  ownerId: string
  ownerType: OwnerType
}

export interface FileListByPathParams extends PathParams {
  pageIndex: number
}
