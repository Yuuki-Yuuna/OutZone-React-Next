import React, { useState } from 'react'
import { createStyles } from 'antd-style'
import { Image, List, Skeleton } from 'antd'
import { useFilePreviewData } from './hooks/useFilePreviewData'
import { ContentType, FileInformation } from '~/type'

export interface FolderDetailProps {
  file: FileInformation
}

const maxPreview = 20

const FolderDetail: React.FC<FolderDetailProps> = (props) => {
  const { styles, theme } = useStyles()
  const { file } = props
  const filename =
    file.contentType === ContentType.directory
      ? file.name.slice(1, -1)
      : file.name

  const { previewList, loading } = useFilePreviewData(file.absolutePath)

  const folderPreviewItemRender = (item: FileInformation) => {
    return (
      <List.Item className={styles.listItem}>
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
  const folderSekeletonItemRender = (item: number) => {
    return (
      <List.Item className={styles.listItem}>
        <Skeleton.Avatar
          active
          size='small'
          shape='square'
          style={{ borderRadius: theme.borderRadius }}
        />
        <Skeleton.Input className={styles.sekeleton} active />
      </List.Item>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Image src={file.icon} preview={false} width={32} />
        <span className={styles.text}>{filename}</span>
      </div>
      {loading ? (
        <List
          dataSource={Array.from(new Array(10).keys())}
          renderItem={folderSekeletonItemRender}
        />
      ) : previewList?.length ? (
        <List
          footer={
            previewList.length > maxPreview && (
              <p className={styles.info}>更多文件请在文件夹内查看</p>
            )
          }
          style={{ height: 520, overflowY: 'auto' }}
          dataSource={previewList.slice(0, maxPreview)}
          renderItem={folderPreviewItemRender}
        />
      ) : (
        <div className={styles.empty}>
          <Image src={'/emptyFolder.png'} width={60} preview={false} />
          <p className={styles.info}>此文件夹为空</p>
        </div>
      )}
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
        border-block-end: none;
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
    `,
    info: css`
      margin: 0;
      font-size: 12px;
      text-align: center;
      color: ${token.colorTextDescription};
    `,
    empty: css`
      position: absolute;
      top: 150px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
    `
  }
})
