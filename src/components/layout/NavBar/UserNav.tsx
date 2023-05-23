import React from 'react'
import { createStyles } from 'antd-style'
import { UserOutlined, SwapOutlined, TeamOutlined } from '@ant-design/icons'
import { Space, Avatar } from 'antd'
import UploadDropdown from './UploadDropdown'

const UserNav: React.FC = () => {
  const { styles } = useStyles()

  return (
    <Space size='middle'>
      <Avatar icon={<UserOutlined />} />
      <TeamOutlined title='好友列表' className={styles.option} />
      <UploadDropdown>
        <SwapOutlined rotate={-90} title='传输列表' className={styles.option} />
      </UploadDropdown>
    </Space>
  )
}

export default UserNav

const useStyles = createStyles(({ token, css }) => {
  return {
    option: css`
      cursor: pointer;
      font-size: 18px;

      &:hover {
        color: ${token.colorPrimaryHover};
      }
    `
  }
})
