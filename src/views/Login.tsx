import React from 'react'
import { createStyles, useResponsive } from 'antd-style'
import Glass from '~/components/universal/Glass/Glass'
import LoginForm from '~/components/form/LoginForm/LoginForm'

const Login: React.FC = () => {
  const { styles } = useStyles()
  const { md } = useResponsive()

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {md && <Glass />}
        <LoginForm />
      </div>
    </div>
  )
}

export default Login

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      position: relative;
      min-height: 100vh;
      background: url('/bg.jpg') no-repeat;
      background-size: cover;
    `,
    box: css`
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      display: flex;
      width: fit-content;
      height: 380px;
      box-shadow: ${token.boxShadow};
      border-radius: ${token.borderRadius}px;
    `
  }
})
