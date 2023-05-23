export interface FileInformation {
  id: string
  name: string
  size: number
  absolutePath: string
  parentDirectoryId: string
  contentType: ContentType
  icon: string
  createDate: string
  updateDate: string
}

export enum ContentType {
  directory,
  file
}
