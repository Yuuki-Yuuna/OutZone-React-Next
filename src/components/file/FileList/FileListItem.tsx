import React, { useEffect, useRef, useState } from 'react'
import { useHover } from 'ahooks'
import { createStyles } from 'antd-style'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Row, Button, Col, Checkbox, Image, Space, Input, InputRef } from 'antd'
import { ColumnType } from './FileList'
import { ContentType, FileInformation } from '~/type'

export interface FileListItemProps {
  file: FileInformation
  columns?: ColumnType[]
  renderTool?: (
    item: FileInformation,
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode
  isSelected: boolean
  toggleSelected: () => void
  unSelectAll: () => void
  hasContextMenu?: boolean //是否具有菜单，影响右键事件
}

const FileListItem: React.FC<FileListItemProps> = (props) => {
  const { styles, cx, theme } = useStyles()
  const {
    file,
    columns,
    renderTool,
    isSelected,
    toggleSelected,
    unSelectAll,
    hasContextMenu
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

  const onContextMenu = () => {
    if (!hasContextMenu || isSelected) {
      // 选中也不做操作
      return
    }
    unSelectAll()
    clearTimeout(selectTimer.current)
    toggleSelected() //不用等待
  }

  const selectTimer = useRef<NodeJS.Timer>()
  const onClick = () => {
    // 由于doubleClick，可以做防抖优化
    if (selectTimer.current) {
      clearTimeout(selectTimer.current)
    }
    selectTimer.current = setTimeout(toggleSelected, 200)
  }

  const onCheckBoxClick = (event: React.MouseEvent) => {
    event.stopPropagation() //阻止冒泡
    clearTimeout(selectTimer.current)
    toggleSelected()
  }

  const editRef = useRef<InputRef>(null)
  const [isEdit, setIsEdit] = useState(false) //是否正在编辑
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
    setIsEdit(false)
  }

  return (
    <Row
      ref={containerRef}
      className={cx(styles.container, isSelected && 'selected')}
      align='middle'
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <Col span={1} style={{ textAlign: 'center' }}>
        <Checkbox checked={isSelected} onClick={onCheckBoxClick} />
      </Col>
      <Col className={styles.fileInfo} span={11}>
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
              onBlur={() => setIsEdit(false)}
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
              onClick={() => setIsEdit(false)}
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
            {isHover && renderTool?.(file, setIsEdit)}
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
            style={{ display: isHover ? 'none' : undefined }}
          >
            {render?.(value, file) ?? value}
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

      &:hover {
        background: ${token.colorBgTextHover};
      }
      &.selected {
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
    `,
    filename: css`
      max-width: calc(100% - 144px);

      &:hover {
        color: ${token.colorPrimaryTextHover};
      }
    `,
    filenameHover: css`
      max-width: calc(100% - 180px);
    `
  }
})
