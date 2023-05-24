import React, { useEffect, useRef, useState } from 'react'
import { useHover } from 'ahooks'
import { createStyles } from 'antd-style'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import {
  Row,
  Button,
  Col,
  Checkbox,
  Image,
  Space,
  Input,
  InputRef,
  Skeleton
} from 'antd'
import { FileListBaseProps } from './FileList'
import { ContentType, FileInformation } from '~/type'

export interface FileListItemProps extends FileListBaseProps {
  file: FileInformation
  isSelected: boolean
  toggleSelected: () => void
  unSelectAll: () => void
  hasContextMenu?: boolean //是否具有菜单，影响右键事件
  loading?: boolean
}

const FileListItem: React.FC<FileListItemProps> = (props) => {
  const { styles, cx, theme } = useStyles()
  const {
    file,
    columns,
    renderTool,
    editFile,
    closeEdit,
    isSelected,
    toggleSelected,
    unSelectAll,
    hasContextMenu,
    loading
  } = props
  const filename =
    file.contentType === ContentType.directory
      ? file.name.slice(1, -1)
      : file.name //处理文件名
  const containerRef = useRef<HTMLDivElement>(null)
  const isHover = useHover(containerRef)

  const onDoubleClick = () => {
    //进入文件夹或预览文件
    console.log('预览或进入文件')
  }

  const selectTimeout = useRef<NodeJS.Timeout>()
  const onClick = () => {
    if (loading) {
      return
    }
    // 由于doubleClick，可以做防抖优化
    if (selectTimeout.current) {
      clearTimeout(selectTimeout.current)
    }
    selectTimeout.current = setTimeout(() => {
      unSelectAll() //排他选择
      toggleSelected()
    }, 200)
  }

  const onCheckBoxClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    clearTimeout(selectTimeout.current)
    toggleSelected()
  }

  const onContextMenu = (event: React.MouseEvent) => {
    if (loading) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    if (!hasContextMenu || isSelected) {
      // 选中也不做操作
      return
    }
    unSelectAll()
    clearTimeout(selectTimeout.current)
    toggleSelected() //不用等待
  }

  const editRef = useRef<InputRef>(null)
  const isEdit = editFile === file
  const [editName, setEditName] = useState(filename) //最好设置初值
  useEffect(() => {
    if (isEdit) {
      editRef.current?.focus()
      const slices = filename.split('.')
      if (slices.length > 1) {
        editRef.current?.setSelectionRange(
          0,
          filename.length - slices.at(-1)!.length - 1
        ) //算个点的位置
      } else {
        editRef.current?.setSelectionRange(0, filename.length)
      }
    } else {
      setEditName(filename) //编辑完毕保证值正确(若修改会重新请求不影响)
    }
  }, [isEdit, filename])

  const onEditChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement
    setEditName(input.value)
  }
  const onEditDone = () => {
    // 其它逻辑
    closeEdit?.()
  }

  return (
    <Row
      ref={containerRef}
      className={cx(
        styles.container,
        isSelected && 'selected',
        loading && 'loading'
      )}
      align='middle'
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <Col span={1} style={{ textAlign: 'center' }}>
        {!loading && (
          <Checkbox checked={isSelected} onClick={onCheckBoxClick} />
        )}
      </Col>
      <Col className={cx(styles.fileInfo, loading && 'loading')} span={11}>
        {loading ? (
          <Space>
            <Skeleton.Avatar
              className={styles.sekeletonImage}
              shape='square'
              active
            />
            <Skeleton.Input className={styles.sekeletonText} active />
          </Space>
        ) : (
          <>
            <Image
              src={file.icon}
              preview={false}
              width={32}
              height={32}
              style={{ borderRadius: theme.borderRadius, objectFit: 'cover' }}
            />
            {isEdit ? (
              <Space onClick={(event) => event.stopPropagation()}>
                <Input
                  ref={editRef}
                  size='small'
                  value={editName}
                  onChange={onEditChange}
                  maxLength={50}
                />
                <Button
                  size='small'
                  type='primary'
                  icon={<CheckOutlined />}
                  onClick={onEditDone}
                />
                <Button
                  size='small'
                  type='primary'
                  icon={<CloseOutlined />}
                  onClick={() => closeEdit?.()}
                />
              </Space>
            ) : (
              <>
                <span
                  className={cx(
                    styles.text,
                    styles.filename,
                    isHover && styles.filenameHover
                  )}
                >
                  {filename}
                </span>
                {isHover && renderTool?.(file)}
              </>
            )}
          </>
        )}
      </Col>
      {columns?.map((column) => {
        const { dataIndex, render, span } = column
        const value = file[dataIndex]
        return (
          <Col
            className={styles.text}
            span={span}
            key={dataIndex}
            style={{ display: !loading && isHover ? 'none' : 'unset' }}
          >
            {loading ? (
              <Skeleton.Input
                className={cx(styles.sekeletonText, 'short')}
                active
              />
            ) : (
              render?.(value, file) ?? value
            )}
          </Col>
        )
      })}
    </Row>
  )
}

export default FileListItem

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      height: 50px;
      padding: 0 12px;

      &:not(.loading):hover {
        background: ${token.colorBgTextHover};
      }
      &:not(.loading).selected {
        background: ${token.colorPrimaryBg};
      }
    `,
    text: css`
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    `,
    fileInfo: css`
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;

      &.loading {
        cursor: default;
      }
    `,
    filename: css`
      max-width: calc(100% - 144px);

      &:hover {
        color: ${token.colorPrimaryTextHover};
      }
    `,
    filenameHover: css`
      max-width: calc(100% - 180px);
    `,
    sekeletonImage: css`
      cursor: default;

      &.ant-skeleton.ant-skeleton-element .ant-skeleton-avatar {
        width: 28px;
        height: 28px;
        border-radius: ${token.borderRadius}px;
      }
    `,
    sekeletonText: css`
      display: flex !important;
      align-items: center;
      cursor: default;

      &.ant-skeleton.ant-skeleton-element .ant-skeleton-input {
        width: 180px;
        height: 16px;
        min-width: unset;

        &.short {
          width: 48px;
        }
      }
    `
  }
})
