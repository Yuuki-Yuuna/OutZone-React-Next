import React, { useState } from 'react'
import { createStyles } from 'antd-style'
import { Image, List, Skeleton } from 'antd'
import { ContentType, FileInformation } from '~/type'

export interface FolderDetailProps {
  file: FileInformation
}

const FolderDetail: React.FC<FolderDetailProps> = (props) => {
  const { styles, theme } = useStyles()
  const { file } = props
  const filename =
    file.contentType === ContentType.directory
      ? file.name.slice(1, -1)
      : file.name

  const [tempLoading, setTempLoading] = useState(false)
  const [tempPreviewList] = useState<FileInformation[]>([
    {
      id: '1',
      name: 'okdasfagagagqawqfabagagasdasahtdjygf',
      size: 1024,
      absolutePath: '/',
      parentDirectoryId: '-1',
      contentType: 1,
      icon: '/icon/image.png',
      createDate: '-',
      updateDate: '2023-05-01T14:36:11'
    }
  ])

  const folderPreviewItemRender = (item: FileInformation) => {
    return (
      <List.Item className={styles.listItem}>
        {/* <Skeleton.Avatar
          active
          size='small'
          shape='square'
          style={{ borderRadius: theme.borderRadius }}
        />
        <Skeleton.Input className={styles.sekeleton} active /> */}
        <Image
          src={item.icon}
          preview={false}
          width={32}
          height={32}
          style={{ borderRadius: '6px', objectFit: 'cover' }}
        />
        <span className={styles.text}>{filename}</span>
      </List.Item>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Image src={file.icon} preview={false} width={32} />
        <span className={styles.text}>{filename}</span>
      </div>
      <List
        style={{ height: 500, overflowY: 'auto' }}
        dataSource={tempPreviewList}
        renderItem={folderPreviewItemRender}
      />
      {/* 大于20个文件显示省略 */}
    </div>
  )
}

export default FolderDetail

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css``,
    title: css`
      padding: 12px 0;
      border-bottom: 1px solid ${token.colorBorderSecondary};

      & > span {
        font-size: ${token.fontSizeLG}px;
        font-weight: 600;
      }
    `,
    listItem: css`
      &.ant-list-item {
        justify-content: flex-start;
        padding: 12px 6px;
      }

      & > span {
        height: 40px;
        line-height: 40px;
      }
    `,
    text: css`
      display: inline-block;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 6px;
      max-width: 70%;
    `,
    sekeleton: css`
      height: 16px;
      margin-left: 6px;

      &.ant-skeleton.ant-skeleton-element .ant-skeleton-input {
        height: 100%;
      }
    `
  }
})
