import React, { createContext, useState } from 'react'
import { createStyles } from 'antd-style'
import FileOption from './FileOption'
import FilePath from './FilePath'
import FileTool from './FileTool'
import FilePreview from './FilePreview'
import FileList, { ColumnType } from '~/components/file/FileList/FileList'
import { useMyFileData } from './hooks/useMyFileData'
import { useFileContextMenu } from './hooks/useFileContextMenu'
import { UserInfo, FileInformation } from '~/type'
import { computedFileSize } from '~/util'

const MyFile: React.FC = () => {
  const { styles } = useStyles()
  const { userInfo, fileList, pathId, loading } = useMyFileData()

  const tempData: FileInformation[] = [
    {
      id: '1',
      name: '/test215141514215151241315134151avagasgaagavdfjg/',
      size: 0,
      absolutePath: '/',
      parentDirectoryId: '-1',
      contentType: 0,
      icon: '/icon/folder.png',
      createDate: '-',
      updateDate: '2023-05-01T14:36:11'
    },
    {
      id: '2',
      name: '/test215141514215151241315134151avagasgaagavdfjg/',
      size: 0,
      absolutePath: '/',
      parentDirectoryId: '-1',
      contentType: 0,
      icon: '/icon/folder.png',
      createDate: '2023-05-01T18:30:11',
      updateDate: '2023-05-01T14:36:11'
    },
    {
      id: '3',
      name: 'zipFile.rar',
      size: 1024 * 1024 * 10,
      absolutePath: '/',
      parentDirectoryId: '-1',
      contentType: 1,
      icon: '/icon/zip.png',
      createDate: '2023-05-01T14:36:11',
      updateDate: '2023-05-01T18:30:11'
    }
  ]
  // console.log(tempData)
  const columns: ColumnType[] = [
    {
      title: '修改时间',
      dataIndex: 'updateDate',
      span: 6,
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: '大小',
      dataIndex: 'size',
      span: 6,
      render: (text) => computedFileSize(text as number)
    }
  ]
  const [testData] = useState(tempData)

  const [editNewFolder, setEditNewFolder] = useState(false)
  const [editFile, setEditFile] = useState<FileInformation | null>(null) //正在编辑的文件
  const [selectedFiles, setSelectedFiles] = useState<FileInformation[]>([]) //被选中的所有文件
  const contextMenu = useFileContextMenu(selectedFiles)

  return (
    <MyFileContext.Provider value={{ selectedFiles, pathId, userInfo }}>
      <div className={styles.container}>
        <FileOption {...{ setEditFile, setEditNewFolder }} />
        <div className={styles.fileManage}>
          <div className={styles.myFile}>
            <FilePath />
            <FileList
              columns={columns}
              renderTool={(item) => (
                <FileTool file={item} setEditFile={setEditFile} />
              )}
              editFile={editFile}
              closeEdit={() => setEditFile(null)}
              editNewFolder={editNewFolder}
              closeEditNewFolder={() => setEditNewFolder(false)}
              contextMenu={contextMenu}
              dataSource={testData}
              loading={loading}
              onSelectedChange={(selected) => setSelectedFiles(selected)}
            />
          </div>
          <FilePreview />
        </div>
      </div>
    </MyFileContext.Provider>
  )
}

export interface MyFileContextType {
  selectedFiles?: FileInformation[]
  userInfo?: UserInfo
  pathId?: string
}
export const MyFileContext = createContext<MyFileContextType>({})

export default MyFile

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      flex: 1;
      height: 100%;
      background: ${token.colorBgContainer};
      cursor: default;
    `,
    fileManage: css`
      display: flex;
    `,
    myFile: css`
      flex: 1;
      min-width: 540px;
      height: 100%;
    `
  }
})
