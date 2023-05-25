import React from 'react'
import { createStyles } from 'antd-style'
import { Button, Space } from 'antd'
import FileUpload from './FileUpload'
import { FileInformation } from '~/type'

export interface FileOptionProps {
  selectedFiles: FileInformation[]
  setEditFile: React.Dispatch<React.SetStateAction<FileInformation | null>>
  setEditNewFolder: React.Dispatch<React.SetStateAction<boolean>>
}

const FileOption: React.FC<FileOptionProps> = (props) => {
  const { styles } = useStyles()
  const { selectedFiles, setEditFile, setEditNewFolder } = props

  return (
    <div className={styles.container}>
      {selectedFiles?.length ? (
        <Button.Group>
          <Button shape='round'>分享</Button>
          {selectedFiles.length <= 1 && <Button shape='round'>共享</Button>}
          <Button shape='round'>下载</Button>
          <Button shape='round'>删除</Button>
          {selectedFiles.length <= 1 && (
            <Button shape='round' onClick={() => setEditFile(selectedFiles[0])}>
              重命名
            </Button>
          )}
          <Button shape='round'>复制</Button>
          <Button shape='round'>移动</Button>
        </Button.Group>
      ) : (
        <Space size='large'>
          <FileUpload />
          <Button shape='round' onClick={() => setEditNewFolder(true)}>
            新建文件夹
          </Button>
        </Space>
      )}
    </div>
  )
}

export default FileOption

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      padding: 6px 24px;
    `
  }
})
