import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { createStyles } from 'antd-style'

const FilePath: React.FC = () => {
  const { styles } = useStyles()
  const [search] = useSearchParams()
  const path = search.get('path') || '/'

  return <div className={styles.container}>占位</div>
}

export default FilePath

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      padding: 12px 24px;
    `
  }
})
