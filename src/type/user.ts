export interface LoginInfo {
  username: string
  password: string
}

export interface UserInfo {
  uId: string
  username: string
  icon: string | null
  additionalInformation: {
    rootDirectory: {
      id: string
      name: string
      absolutePath: string
      parentDirectoryId: string
      contentType: number
      icon: string | null
      size: number | null
      createDate: string | null
      updateDate: string | null
    }
  }
}
