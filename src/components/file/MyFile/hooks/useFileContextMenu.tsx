import {
  DownloadOutlined,
  ShareAltOutlined,
  UsergroupAddOutlined,
  CopyOutlined,
  DragOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { MenuProps } from 'antd'
import { FileInformation } from '~/type'

const singleKeys = ['open', 'rename'] //仅限单个文件选中时的功能

export const useFileContextMenu = (
  selectedFiles: FileInformation[]
): MenuProps['items'] => {
  const dropdownItems: MenuProps['items'] = [
    {
      key: 'open',
      label: (
        <div>
          <span>打开</span>
        </div>
      )
    },
    {
      key: 'download',
      label: (
        <div>
          <DownloadOutlined />
          <span>下载</span>
        </div>
      )
    },
    {
      key: 'share',
      label: (
        <div>
          <ShareAltOutlined />
          <span>分享</span>
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
    },
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
      key: 'rename',
      label: (
        <div>
          <EditOutlined />
          <span>重命名</span>
        </div>
      )
    },
    {
      key: 'delete',
      label: (
        <div>
          <DeleteOutlined />
          <span>删除</span>
        </div>
      )
    }
  ]

  if (selectedFiles.length > 1) {
    return dropdownItems.filter(
      (item) => !singleKeys.includes(item?.key as string)
    )
  }

  return dropdownItems
}
