import React from 'react'
import { createStyles } from 'antd-style'
import {
  FolderOutlined,
  FolderOpenOutlined,
  FileImageOutlined,
  FileOutlined,
  CustomerServiceOutlined,
  PlayCircleOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  SendOutlined
} from '@ant-design/icons'
import { Layout, Menu, MenuProps } from 'antd'

const SideBar: React.FC = () => {
  const { styles } = useStyles()

  return (
    <Layout.Sider className={styles.container}>
      <Menu
        mode='inline'
        items={menuItems}
        defaultOpenKeys={['file']}
        defaultSelectedKeys={['all']}
      />
    </Layout.Sider>
  )
}

const menuItems: MenuProps['items'] = [
  {
    key: 'file',
    label: '我的文件',
    icon: <FolderOutlined />,
    children: [
      {
        key: 'all',
        label: '全部',
        icon: <FolderOpenOutlined />
      },
      {
        key: 'image',
        label: '图片',
        icon: <FileImageOutlined />
      },
      {
        key: 'document',
        label: '文档',
        icon: <FileOutlined />
      },
      {
        key: 'audio',
        label: '音频',
        icon: <CustomerServiceOutlined />
      },
      {
        key: 'video',
        label: '视频',
        icon: <PlayCircleOutlined />
      },
      {
        key: 'other',
        label: '其它',
        icon: <EllipsisOutlined />
      }
    ]
  },
  {
    key: 'share',
    label: '我的分享',
    icon: <SendOutlined />
  },
  {
    key: 'recycle',
    label: '回收站',
    icon: <DeleteOutlined />
  }
]

export default SideBar

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      &.ant-layout-sider {
        padding: 6px 0;
        background: ${token.colorBgElevated};
        border-inline-end: 1px solid ${token.colorBorderSecondary};

        .ant-menu-inline {
          border-inline-end: none;
        }
      }
    `
  }
})
