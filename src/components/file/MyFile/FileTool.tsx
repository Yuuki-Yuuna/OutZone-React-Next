import React from 'react'
import { createStyles } from 'antd-style'
import {
  ShareAltOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  CopyOutlined,
  DragOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons'
import { Space, Dropdown, MenuProps } from 'antd'
import { FileInformation } from '~/type'

export interface FileToolProps {
  file: FileInformation
  setEditFile: React.Dispatch<React.SetStateAction<FileInformation | null>> //只允许一个文件正在编辑
}

const FileTool: React.FC<FileToolProps> = (props) => {
  const { styles } = useStyles()
  const { file, setEditFile } = props

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'copy',
      label: (
        <div>
          <CopyOutlined />
          <span>复制</span>
        </div>
      )
    },
    {
      key: 'move',
      label: (
        <div>
          <DragOutlined />
          <span>移动</span>
        </div>
      )
    },
    {
      key: 'group',
      label: (
        <div>
          <UsergroupAddOutlined />
          <span>共享</span>
        </div>
      )
    }
  ]

  return (
    <Space
      className={styles.container}
      onClick={(event) => event.stopPropagation()}
    >
      <ShareAltOutlined className={styles.icon} title='分享' />
      <DownloadOutlined className={styles.icon} title='下载' />
      <DeleteOutlined className={styles.icon} title='删除' />
      <EditOutlined
        className={styles.icon}
        title='重命名'
        onClick={() => setEditFile(file)}
      />
      <Dropdown
        menu={{ items: dropdownItems }}
        placement='bottom'
        overlayClassName={styles.overlay}
        getPopupContainer={(trigger) => trigger.parentElement!}
      >
        <EllipsisOutlined className={styles.icon} />
      </Dropdown>
    </Space>
  )
}

export default FileTool

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      position: absolute;
      right: 12px;

      .anticon {
        font-size: ${token.fontSizeLG}px;
      }
    `,
    overlay: css`
      min-width: 100px !important;

      .anticon {
        margin-right: 6px;
      }
    `,
    icon: css`
      color: ${token.colorPrimary};
    `
  }
})
