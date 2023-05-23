import React from 'react'
import { createStyles } from 'antd-style'
import { Layout } from 'antd'
import NavBar from '~/components/layout/NavBar/NavBar'
import SideBar from '~/components/layout/Sidebar/SideBar'
import MyFile from '~/components/file/MyFile/MyFile'

const Home: React.FC = () => {
  const { styles } = useStyles()

  return (
    <Layout className={styles.container}>
      <NavBar />
      <Layout style={{ flexDirection: 'row' }}>
        <SideBar />
        <Layout.Content>
          <MyFile />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Home

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      min-width: 1024px;
      min-height: 100vh;
    `
  }
})
