import React from 'react'
import { observer } from 'mobx-react-lite'
import { createStyles } from 'antd-style'
import UploadListItem from './UploadListItem'
import { useRootStore } from '~/store'

const UploadList: React.FC = observer(() => {
  const { styles } = useStyles()
  const { uploader } = useRootStore()

  const { fileList } = uploader
  const finishedNum = fileList.filter(
    (uploadFile) => uploadFile.status === 'success'
  ).length

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span className={styles.name}>传输列表</span>
        <span className={styles.total}>
          上传完成（{finishedNum}/{fileList.length}）
        </span>
      </div>
      <ul>
        {fileList.map((uploadFile) => (
          <UploadListItem
            key={uploadFile.uid}
            uploadFile={uploadFile}
            uploader={uploader}
          />
        ))}
      </ul>
      <p className={styles.tips}>- 仅展示本次上传任务 -</p>
    </div>
  )
})

export default UploadList

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      cursor: default;
    `,
    title: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      height: 40px;
      border-bottom: 1px solid ${token.colorBorderSecondary};
    `,
    name: css`
      color: ${token.colorTextTertiary};
      font-size: ${token.fontSizeSM}px;
    `,
    total: css`
      font-size: ${token.fontSizeHeading4};
      font-weight: ${token.fontWeightStrong};
    `,
    tips: css`
      text-align: center;
      color: ${token.colorTextQuaternary};
      font-size: 10px;
      margin: 0;
    `
  }
})
