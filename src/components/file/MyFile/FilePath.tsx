import React from 'react'
import { createStyles } from 'antd-style'

const FilePath: React.FC = () => {
  const { styles } = useStyles()

  return <div className={styles.container}>占位</div>
}

export default FilePath

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      padding: 0 24px;
    `
  }
})
