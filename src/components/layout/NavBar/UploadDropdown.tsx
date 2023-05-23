import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useUpdateEffect } from 'ahooks'
import { createStyles } from 'antd-style'
import { Badge, Dropdown } from 'antd'
import UploadList from './UploadList'
import { useRootStore } from '~/store'

export interface UploadDropdownProps {
  children: React.ReactNode
}

const UploadDropdown: React.FC<UploadDropdownProps> = observer(
  ({ children }) => {
    const { styles } = useStyles()
    const { uploader } = useRootStore()

    const { fileList } = uploader
    const uploadNum = fileList.filter(
      (uploadFile) => uploadFile.status !== 'success'
    ).length

    const [open, setOpen] = useState(false)
    useUpdateEffect(() => {
      fileList.length && setOpen(true)
    }, [fileList.length])

    return (
      <Badge count={uploadNum} size='small'>
        <Dropdown
          overlayClassName={styles.overlay}
          placement='bottomRight'
          align={{ offset: [80, 20] }}
          dropdownRender={() => <UploadList />}
          trigger={['click']}
          onOpenChange={(status) => setOpen(status)}
          open={open}
        >
          {children}
        </Dropdown>
      </Badge>
    )
  }
)

export default UploadDropdown

const useStyles = createStyles(({ token, css }) => {
  return {
    overlay: css`
      width: 400px;
      height: 320px;
      background-color: ${token.colorBgElevated};
      border-radius: ${token.borderRadiusLG}px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
    `
  }
})
