import React from 'react'
import { createStyles } from 'antd-style'
import { Button, Space } from 'antd'
import FileUpload from './FileUpload'

const FileOption: React.FC = () => {
  const { styles } = useStyles()

  return (
    <div className={styles.container}>
      <Space size='large'>
        <FileUpload />
        <Button shape='round'>新建文件夹</Button>
      </Space>
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
