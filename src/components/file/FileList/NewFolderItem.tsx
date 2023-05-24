import React, { useEffect, useRef, useState } from 'react'
import { createStyles } from 'antd-style'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Row, Col, Image, Space, Input, InputRef } from 'antd'

export interface NewFolderItemProps {
  editNewFolder?: boolean //是否正在新建文件夹
  closeEditNewFolder?: () => void
}

// 新建文件夹需要单独的逻辑
const NewFolderItem: React.FC<NewFolderItemProps> = (props) => {
  const { styles, theme } = useStyles()
  const { editNewFolder, closeEditNewFolder } = props

  const inputRef = useRef<InputRef>(null)
  const [editName, setEditName] = useState('')
  useEffect(() => {
    if (editNewFolder) {
      inputRef.current?.focus()
    }
    setEditName('')
  }, [editNewFolder])

  const onEditChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement
    setEditName(input.value)
  }

  const createNewFolder = () => {
    //其他逻辑
    closeEditNewFolder?.()
  }

  return (
    <Row
      className={styles.container}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Col span={1}>{/*仅占位 */}</Col>
      <Col className={styles.editInfo} span={11}>
        <Image
          src={'/icon/folder.png'}
          preview={false}
          width={32}
          height={32}
          style={{ borderRadius: theme.borderRadius, objectFit: 'cover' }}
        />
        <Space onClick={(event) => event.stopPropagation()}>
          <Input
            ref={inputRef}
            size='small'
            maxLength={50}
            value={editName}
            onChange={onEditChange}
          />
          <Button
            size='small'
            type='primary'
            icon={<CheckOutlined />}
            onClick={createNewFolder}
          />
          <Button
            size='small'
            type='primary'
            icon={<CloseOutlined />}
            onClick={closeEditNewFolder}
          />
        </Space>
      </Col>
    </Row>
  )
}

export default NewFolderItem

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      height: 50px;
      padding: 0 12px;

      &:hover {
        background: ${token.colorBgTextHover};
      }
    `,
    editInfo: css`
      display: flex;
      align-items: center;
      gap: 12px;
    `
  }
})
