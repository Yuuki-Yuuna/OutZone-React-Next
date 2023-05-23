import { OwnerType } from '../upload'

export interface NowFileListParams {
  nowDirectoryId: string
  ownerId: string
  ownerType: OwnerType
  pageIndex: number
}
