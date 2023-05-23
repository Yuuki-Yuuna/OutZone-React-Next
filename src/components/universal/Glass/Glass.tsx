import React from 'react'
import { createStyles } from 'antd-style'

const Glass: React.FC = () => {
  const { styles } = useStyles()

  return (
    <div className={styles.container}>
      <p>Welcome</p>
      <p>To</p>
      <p>OutZone</p>
    </div>
  )
}

export default Glass

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      width: 300px;
      height: 100%;
      padding-left: 50px;
      padding-top: 50px;
      backdrop-filter: blur(20px);
      background: transparent;
      flex-shrink: 0;

      p {
        font-size: 40px;
        font-weight: 900;
        color: #fff;
      }
    `
  }
})
