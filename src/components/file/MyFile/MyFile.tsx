import React, { useState } from 'react'
import { createStyles } from 'antd-style'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import FileOption from './FileOption'
import FilePath from './FilePath'
import FileTool from './FileTool'
import FilePreview from './FilePreview'
import FileList, { FileListProps } from '~/components/file/FileList/FileList'
import { useMyFileData } from './hooks/useMyFileData'
import { useFileContextMenu } from './hooks/useFileContextMenu'
import { computedFileSize } from '~/util'
import { FileInformation } from '~/type'

const MyFile: React.FC = () => {
  const { styles } = useStyles()
  const { fileList, loading: dataLoading } = useMyFileData()

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
  const columns: NonNullable<FileListProps['columns']> = [
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
    <div className={styles.container}>
      <Spin
        wrapperClassName={styles.spin}
        spinning={false}
        indicator={<LoadingOutlined />}
        size='large'
      >
        <FileOption {...{ selectedFiles, setEditFile, setEditNewFolder }} />
        <div className={styles.fileManage}>
          <div className={styles.myFile}>
            <FilePath />
            <FileList
              dataSource={fileList}
              loading={dataLoading}
              columns={columns}
              renderTool={(item) => (
                <FileTool file={item} setEditFile={setEditFile} />
              )}
              contextMenu={contextMenu}
              editFile={editFile}
              closeEdit={() => setEditFile(null)}
              editNewFolder={editNewFolder}
              closeEditNewFolder={() => setEditNewFolder(false)}
              onSelectedChange={(selected) => setSelectedFiles(selected)}
            />
          </div>
          <FilePreview selectedFiles={selectedFiles} />
        </div>
      </Spin>
    </div>
  )
}

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
    `,
    spin: css`
      & > div > .ant-spin {
        max-height: 100%;
      }
    `
  }
})
