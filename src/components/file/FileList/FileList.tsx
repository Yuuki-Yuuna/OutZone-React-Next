import React, { useEffect, useRef } from 'react'
import { useSelections, useUpdateEffect } from 'ahooks'
import { createStyles } from 'antd-style'
import { Row, Col, Checkbox, RowProps, Dropdown, MenuProps } from 'antd'
import FileListItem from './FileListItem'
import { FileInformation } from '~/type'

export interface FileListProps {
  dataSource?: FileInformation[]
  justify?: RowProps['justify']
  columns?: ColumnType[]
  renderTool?: (
    item: FileInformation,
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode
  onSelectedChange?: (selected: FileInformation[]) => void
  contextMenu?: MenuProps['items'] //右键菜单
  loading?: boolean
}

export interface ColumnType {
  title: string
  dataIndex: keyof FileInformation
  span: number //0到12格栅布局
  render?: (text: string | number, record: FileInformation) => React.ReactNode
}

const FileList: React.FC<FileListProps> = (props) => {
  const { styles } = useStyles()
  const {
    dataSource,
    columns,
    justify,
    renderTool,
    contextMenu,
    onSelectedChange
  } = props

  const listRef = useRef<HTMLDivElement>(null)

  const {
    selected,
    allSelected,
    partiallySelected,
    isSelected,
    toggle,
    toggleAll,
    unSelectAll
  } = useSelections(dataSource ?? [])
  useEffect(() => {
    onSelectedChange?.(selected)
  }, [onSelectedChange, selected])
  useUpdateEffect(() => {
    unSelectAll() //dataSource变化时取消所有选择
  }, [dataSource])

  return (
    <div className={styles.container}>
      {dataSource?.length ? (
        <>
          <Row
            className={styles.header}
            justify={justify}
            align='middle'
            wrap={false}
          >
            <Col span={1} style={{ textAlign: 'center' }}>
              <Checkbox
                checked={allSelected}
                indeterminate={partiallySelected}
                onClick={toggleAll}
              />
            </Col>
            <Col span={11}>文件名</Col>
            {columns?.map((column) => (
              <Col span={column.span} key={column.dataIndex}>
                {column.title}
              </Col>
            ))}
          </Row>
          <div
            ref={listRef}
            className={styles.list}
            style={{
              height: `calc(100vh - ${
                listRef.current?.getBoundingClientRect().top
              }px)`
            }}
          >
            <Dropdown
              disabled={!contextMenu}
              menu={{ items: contextMenu }}
              trigger={['contextMenu']}
              overlayClassName={styles.contextMenu}
            >
              <div>
                {dataSource.map((item) => (
                  <FileListItem
                    key={item.id}
                    file={item}
                    renderTool={renderTool}
                    columns={columns}
                    isSelected={isSelected(item)}
                    toggleSelected={() => toggle(item)}
                    unSelectAll={unSelectAll}
                    hasContextMenu={!!contextMenu}
                  />
                ))}
              </div>
            </Dropdown>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default FileList

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      flex: 1;
      cursor: default;
    `,
    header: css`
      height: 40px;
      color: ${token.colorTextHeading};
      font-weight: ${token.fontWeightStrong};
      padding: 0 12px;
    `,
    list: css`
      overflow-y: auto;
    `,
    contextMenu: css`
      min-width: 120px;

      .anticon {
        margin-right: 6px;
      }
    `
  }
})
