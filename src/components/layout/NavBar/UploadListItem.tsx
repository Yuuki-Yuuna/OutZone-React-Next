import React from 'react'
import { observer } from 'mobx-react-lite'
import { createStyles } from 'antd-style'
import {
  LoadingOutlined,
  ArrowUpOutlined,
  PauseOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { Image, Progress, Space } from 'antd'
import { computedFileSize, getFileIconName } from '~/util'
import { UploadFile, UploadStatus, Uploader } from '~/type'

export interface UploadListItemProps {
  uploadFile: UploadFile
  uploader: Uploader
}

const uploadStatus: UploadStatus[] = ['waiting', 'pause']
const removeStatus: UploadStatus[] = ['waiting', 'success', 'fail']
const cancelStatus: UploadStatus[] = ['uploading', 'pause', 'compelete']
const pauseStatus: UploadStatus[] = ['uploading', 'compelete']

const UploadListItem: React.FC<UploadListItemProps> = observer((props) => {
  const { styles } = useStyles()
  const { uploadFile, uploader } = props

  const FileSpeed = observer(() => {
    switch (uploadFile.status) {
      case 'calculating':
        return <span>计算中</span>
      case 'waiting':
        return <span>等待中</span>
      case 'uploading':
        return <span>{computedFileSize(uploadFile.averageSpeed) + '/s'}</span>
      case 'pause':
        return <span>已暂停</span>
      case 'compelete':
        return <span>校验中</span>
      default:
        return <></>
    }
  })

  const FileRemoveOrCancel = () => {
    if (removeStatus.includes(uploadFile.status)) {
      uploader.removeFile(uploadFile)
    } else if (cancelStatus.includes(uploadFile.status)) {
      uploader.cancel(uploadFile)
    }
  }
  const FileUploadOrResume = () => {
    if (uploadFile.status === 'waiting') {
      uploader.upload(uploadFile)
    } else if (uploadFile.status === 'pause') {
      uploader.resume(uploadFile)
    }
  }

  return (
    <li className={styles.container}>
      <Image
        src={`/icon/${getFileIconName(uploadFile.name)}.png`}
        preview={false}
        width={40}
      />
      <div className={styles.info}>
        <h4>{uploadFile.name}</h4>
        <Progress
          percent={uploadFile.progress * 100}
          size={[240, 3]}
          showInfo={false}
          style={{ lineHeight: 1 }}
        />
        <div className={styles.status}>
          <span>{computedFileSize(uploadFile.size)}</span>
          <FileSpeed />
        </div>
      </div>
      <Space className={styles.options}>
        {uploadFile.status === 'calculating' ? (
          <LoadingOutlined />
        ) : (
          <>
            {pauseStatus.includes(uploadFile.status) && <PauseOutlined />}
            {uploadStatus.includes(uploadFile.status) && (
              <ArrowUpOutlined onClick={FileUploadOrResume} />
            )}
            <CloseOutlined onClick={FileRemoveOrCancel} />
          </>
        )}
      </Space>
    </li>
  )
})

export default UploadListItem

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70px;
      padding: 5px;
      gap: 16px;
    `,
    info: css`
      width: 240px;
      line-height: 1;

      h4 {
        margin: 0;
        line-height: ${token.lineHeightHeading4};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    `,
    status: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: ${token.colorTextTertiary};
      padding: 0 4px;
    `,
    options: css`
      .anticon {
        cursor: pointer;
        color: ${token.colorTextTertiary};
        font-size: ${token.fontSizeLG}px;

        &:not(.anticon-loading):hover {
          color: ${token.colorPrimaryHover};
        }
      }
    `
  }
})
