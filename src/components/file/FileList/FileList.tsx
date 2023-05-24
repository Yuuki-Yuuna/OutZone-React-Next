import React, { useEffect, useRef } from 'react'
import { useSelections, useUpdateEffect } from 'ahooks'
import { createStyles } from 'antd-style'
import {
  Row,
  Col,
  Checkbox,
  RowProps,
  Dropdown,
  MenuProps,
  Skeleton
} from 'antd'
import FileListItem from './FileListItem'
import NewFolderItem from './NewFolderItem'
import { FileInformation } from '~/type'

export interface FileListBaseProps {
  columns?: ColumnType[]
  renderTool?: (item: FileInformation) => React.ReactNode
  editFile?: FileInformation | null //正在编辑的文件
  closeEdit?: () => void
}

export interface FileListProps extends FileListBaseProps {
  dataSource?: FileInformation[]
  justify?: RowProps['justify']
  onSelectedChange?: (selected: FileInformation[]) => void
  contextMenu?: MenuProps['items'] //右键菜单
  editNewFolder?: boolean //是否正在新建文件夹
  closeEditNewFolder?: () => void
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
    columns,
    justify,
    dataSource,
    renderTool,
    editFile,
    closeEdit,
    contextMenu,
    editNewFolder,
    closeEditNewFolder,
    onSelectedChange,
    loading
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
              {loading ? (
                <Skeleton.Button className={styles.sekeletonButton} active />
              ) : (
                <Checkbox
                  checked={allSelected}
                  indeterminate={partiallySelected}
                  onClick={toggleAll}
                />
              )}
            </Col>
            <Col span={11}>
              {loading ? (
                <Skeleton.Input className={styles.sekeletonText} active />
              ) : (
                '文件名'
              )}
            </Col>
            {columns?.map((column) => (
              <Col span={column.span} key={column.dataIndex}>
                {loading ? (
                  <Skeleton.Input className={styles.sekeletonText} active />
                ) : (
                  column.title
                )}
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
            {!loading && editNewFolder && (
              <NewFolderItem
                editNewFolder={editNewFolder}
                closeEditNewFolder={closeEditNewFolder}
              />
            )}
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
                    editFile={editFile}
                    closeEdit={closeEdit}
                    columns={columns}
                    isSelected={isSelected(item)}
                    toggleSelected={() => toggle(item)}
                    unSelectAll={unSelectAll}
                    hasContextMenu={!!contextMenu}
                    loading={loading}
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
    `,
    sekeletonButton: css`
      display: flex !important;
      justify-content: center;
      align-items: center;

      &.ant-skeleton.ant-skeleton-element .ant-skeleton-button {
        width: 16px;
        height: 16px;
        min-width: unset;
      }
    `,
    sekeletonText: css`
      display: flex !important;
      align-items: center;

      &.ant-skeleton.ant-skeleton-element .ant-skeleton-input {
        width: 40px;
        height: 16px;
        min-width: unset;
      }
    `
  }
})
