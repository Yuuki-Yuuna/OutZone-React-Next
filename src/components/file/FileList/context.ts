import { createContext } from 'react'
import { MenuProps } from 'antd'
import { FileInformation } from '~/type'

export interface ColumnType {
  title: string
  dataIndex: keyof FileInformation
  span: number //0到12格栅布局
  render?: (
    text: string | number | null,
    record: FileInformation
  ) => React.ReactNode
}

export interface FileListContextType {
  columns?: ColumnType[]
  renderTool?: (item: FileInformation) => React.ReactNode
  contextMenu?: MenuProps['items'] //右键菜单
  editFile?: FileInformation | null
  closeEdit?: () => void
  editNewFolder?: boolean //是否正在新建文件夹
  closeEditNewFolder?: () => void
}
export const FileListContext = createContext<FileListContextType>({})
