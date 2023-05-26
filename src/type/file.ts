export enum ContentType {
  directory,
  file
}

export interface FileInformation {
  id: string
  name: string
  size: number | null
  absolutePath: string
  parentDirectoryId: string
  contentType: ContentType
  icon: string
  createDate: string
  updateDate: string
}
