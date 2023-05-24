import React from 'react'
import { createStyles } from 'antd-style'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Row, Col, Image, Space, Input } from 'antd'

// 新建文件夹需要单独的逻辑
const NewFolderItem: React.FC = () => {
  const { styles, theme } = useStyles()

  return (
    <Row className={styles.container}>
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
          <Input size='small' maxLength={50} />
          <Button size='small' type='primary' icon={<CheckOutlined />} />
          <Button size='small' type='primary' icon={<CloseOutlined />} />
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
