import React, { useContext, useState } from 'react'
import { createStyles } from 'antd-style'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Image } from 'antd'
import FolderDetail from './FolderDetail'
import { computedFileSize } from '~/util'
import { ContentType, FileInformation } from '~/type'


export interface FilePreviewProps {
  selectedFiles: FileInformation[]
}

const FilePreview: React.FC<FilePreviewProps> = (props) => {
  const { styles, cx } = useStyles()
  const { selectedFiles } = props
  const [isFold, setIsfold] = useState(false) //折叠

  const FileDetail: React.FC = () => {
    switch (selectedFiles.length) {
      case 0:
        return (
          <div className={styles.empty}>
            <Image src={'/empty.png'} preview={false} />
            <p>选中文件/文件夹，查看详情</p>
          </div>
        )
      case 1:
        return selectedFiles[0]?.contentType === ContentType.directory ? (
          <FolderDetail file={selectedFiles[0]} />
        ) : (
          <div className={styles.detail}>
            <div className={styles.imageBox}>
              <Image
                src={selectedFiles[0].icon}
                preview={false}
                style={{ borderRadius: '9.5px' }}
              />
            </div>
            <h4>{selectedFiles[0].name}</h4>
            <ul>
              <li>
                创建时间：
                {new Date(selectedFiles[0].createDate).toLocaleString()}
              </li>
              <li>
                最后修改：
                {new Date(selectedFiles[0].updateDate).toLocaleString()}
              </li>
              <li>文件格式：{selectedFiles[0].name.split('.').at(-1)}</li>
              <li>文件大小：{computedFileSize(selectedFiles[0].size)}</li>
              <li>
                所在目录：
                {selectedFiles[0].absolutePath}
              </li>
            </ul>
          </div>
        )
      default:
        return (
          <div className={styles.imageBox}>
            <Image src={'/icon/folder.png'} width={128} preview={false} />
          </div>
        )
    }
  }

  return (
    <div className={cx(styles.container, !isFold && styles.containerBorder)}>
      <div className={styles.title}>
        {selectedFiles.length > 1 ? (
          <h4
            className={cx(isFold && styles.hide)}
          >{`共选中${selectedFiles.length}个文件`}</h4>
        ) : (
          <h4 className={cx(isFold && styles.hide)}>
            {selectedFiles[0]?.contentType === ContentType.directory
              ? '文件夹内容'
              : '文件详情'}
          </h4>
        )}
        <span onClick={() => setIsfold((preIsFlod) => !preIsFlod)}>
          {isFold ? (
            <>
              <LeftOutlined />
              展开
            </>
          ) : (
            <>
              <RightOutlined />
              收起
            </>
          )}
        </span>
      </div>
      <div className={cx(styles.preview, isFold && styles.hide)}>
        <FileDetail />
      </div>
    </div>
  )
}

export default FilePreview

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      flex-shrink: 0;
      padding: 0 12px;

      h4 {
        margin: 0;
        font-weight: ${token.fontWeightStrong};
      }
    `,
    containerBorder: css`
      border-inline-start: 1px solid ${token.colorBorderSecondary};
    `,
    hide: css`
      display: none;
    `,
    title: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 42px;
      font-size: ${token.fontSizeSM};

      & > span {
        cursor: pointer;
        font-size: 12px;
        color: ${token.colorTextDescription};

        .anticon {
          margin-right: 6px;
        }
      }
    `,
    preview: css`
      position: relative;
      width: 250px;
    `,
    empty: css`
      position: absolute;
      top: 150px;
      left: 50%;
      transform: translateX(-50%);

      p {
        white-space: nowrap;
        margin: 5px 0 0 0;
        font-size: 12px;
        color: ${token.colorTextPlaceholder};
      }
    `,
    imageBox: css`
      text-align: center;
    `,
    detail: css`
      padding: 8px 16px;
      li {
        list-style: none;
        margin-top: 10px;
        font-size: 12px;
        font-weight: 500;
        color: ${token.colorTextDescription};
      }
    `
  }
})
