import React, { useRef, useState } from 'react'
import { createStyles } from 'antd-style'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import FileOption from './FileOption'
import FilePath from './FilePath'
import FileTool from './FileTool'
import FilePreview from './FilePreview'
import FileList, { FileListProps } from '~/components/file/FileList/FileList'
import { useFileContextMenu } from './hooks/useFileContextMenu'
import { useMyFileData } from './hooks/useMyFileData'
import { computedFileSize } from '~/util'
import { FileInformation } from '~/type'

const MyFile: React.FC = () => {
  const { styles } = useStyles()

  const listRef = useRef<HTMLDivElement>(null)
  const { fileList, loading: dataLoading } = useMyFileData(listRef)

  const columns: NonNullable<FileListProps['columns']> = [
    {
      title: '修改时间',
      dataIndex: 'updateDate',
      span: 6,
      render: (text) => new Date(text as string).toLocaleString()
    },
    {
      title: '大小',
      dataIndex: 'size',
      span: 6,
      render: (text) => computedFileSize(text as number)
    }
  ]

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
              ref={listRef}
              height={`calc(100vh - ${
                listRef.current?.getBoundingClientRect().top
              }px)`}
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
