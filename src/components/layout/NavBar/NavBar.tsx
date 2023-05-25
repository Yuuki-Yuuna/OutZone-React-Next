import React, { useContext } from 'react'
import { createStyles } from 'antd-style'
import { Layout, Image, Divider, Switch } from 'antd'
import IconFont from '~/components/icon/IconFont'
import UserNav from './UserNav'
import { ThemeChangeContext } from '~/contexts'

const NavBar: React.FC = () => {
  const { styles } = useStyles()
  const { appearance, changeAppearance } = useContext(ThemeChangeContext)

  return (
    <Layout.Header className={styles.container}>
      <Image src='/logo.png' preview={false} />
      <div style={{ flex: 1 }}></div>
      <UserNav />
      <Divider type='vertical' />
      <Switch
        defaultChecked={appearance == 'dark'}
        checkedChildren={<IconFont type='moon' />}
        unCheckedChildren={<IconFont type='sun' />}
        onChange={changeAppearance}
      />
    </Layout.Header>
  )
}

export default NavBar

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      display: flex;
      align-items: center;
      line-height: 1;
      margin-bottom: 6px;
      box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
      background: ${token.colorBgElevated};
    `
  }
})
