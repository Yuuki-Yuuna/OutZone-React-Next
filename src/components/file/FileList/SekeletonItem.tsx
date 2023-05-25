import React, { useContext } from 'react'
import { createStyles } from 'antd-style'
import { Row, Col, Space, Skeleton } from 'antd'
import { FileListContext } from './context'

const SekeletonItem: React.FC = () => {
  const { styles, cx } = useStyles()
  const { columns } = useContext(FileListContext)

  return (
    <Row className={styles.container} align='middle'>
      <Col span={1} />
      <Col span={11}>
        <Space>
          <Skeleton.Avatar
            className={styles.sekeletonImage}
            shape='square'
            active
          />
          <Skeleton.Input className={styles.sekeletonText} active />
        </Space>
      </Col>

      {columns?.map((column) => (
        <Col span={column.span} key={column.dataIndex}>
          <Skeleton.Input
            className={cx(styles.sekeletonText, 'short')}
            active
          />
        </Col>
      ))}
    </Row>
  )
}

export default SekeletonItem

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      height: 50px;
      padding: 0 12px;
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
