import React from 'react'
import { createStyles } from 'antd-style'
import { Space } from 'antd'
import FileUpload from './FileUpload'

const FileOption: React.FC = () => {
  const { styles } = useStyles()

  return (
    <Space className={styles.container}>
      <FileUpload />
    </Space>
  )
}

export default FileOption

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      padding: 5px 24px;
    `
  }
})
