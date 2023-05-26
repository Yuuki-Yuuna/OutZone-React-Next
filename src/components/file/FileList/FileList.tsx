import React, { forwardRef, useEffect } from 'react'
import { useSelections, useUpdateEffect } from 'ahooks'
import { createStyles } from 'antd-style'
import { Row, Col, Checkbox, Dropdown, Skeleton } from 'antd'
import FileListItem from './FileListItem'
import SekeletonItem from './SekeletonItem'
import NewFolderItem from './NewFolderItem'
import { FileListContext, FileListContextType } from './context'
import { FileInformation } from '~/type'

export interface FileListProps extends FileListContextType {
  dataSource?: FileInformation[]
  loading?: boolean
  height?: string
  onSelectedChange?: (selected: FileInformation[]) => void
}

const FileList = forwardRef<HTMLDivElement, FileListProps>((props, ref) => {
  const { styles } = useStyles()
  const {
    columns,
    dataSource,
    loading,
    height,
    contextMenu,
    editNewFolder,
    onSelectedChange
  } = props

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
    <FileListContext.Provider value={props}>
      <div className={styles.container}>
        {loading || dataSource?.length ? (
          <>
            <Row className={styles.header} align='middle' wrap={false}>
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
                ) : selected.length ? (
                  `已选中${selected.length}个文件/文件夹`
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
            <div ref={ref} className={styles.list} style={{ height }}>
              {loading ? (
                Array.from(new Array(10).keys()).map((item) => (
                  <SekeletonItem key={item} />
                ))
              ) : (
                <>
                  {editNewFolder && <NewFolderItem />}
                  <Dropdown
                    disabled={!contextMenu}
                    menu={{ items: contextMenu }}
                    trigger={['contextMenu']}
                    overlayClassName={styles.contextMenu}
                  >
                    <div>
                      {dataSource?.map((item) => (
                        <FileListItem
                          key={item.id}
                          file={item}
                          isSelected={isSelected(item)}
                          toggleSelected={() => toggle(item)}
                          unSelectAll={unSelectAll}
                        />
                      ))}
                    </div>
                  </Dropdown>
                </>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </FileListContext.Provider>
  )
})

export default FileList

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      cursor: default;
      flex: 1;
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
