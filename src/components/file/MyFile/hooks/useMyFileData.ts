import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteScroll } from 'ahooks'
import { App } from 'antd'
import { useDelayLoadingDone, useUserInfo } from '~/hooks'
import { fileApi } from '~/api'
import { OwnerType } from '~/type'

export const useMyFileData = (listRef: React.RefObject<HTMLDivElement>) => {
  const { message } = App.useApp()
  const [search] = useSearchParams()
  const path = search.get('path') || '/'
  const uploadPath = path == '/' ? path : path + '/' //非根最后都有'/'

  const { data: userInfo, loading: userInfoLoading } = useUserInfo()
  const pageIndexRef = useRef(0)
  const {
    data: fileListRes,
    loading: firstLoading,
    loadingMore,
    reload
  } = useInfiniteScroll(
    async () => {
      if (userInfo) {
        return fileApi
          .getFileListByPath({
            path: uploadPath,
            ownerId: userInfo.uId,
            ownerType: OwnerType.user,
            pageIndex: pageIndexRef.current
          })
          .then((data) => {
            pageIndexRef.current++
            return { list: data, noMore: !data.length }
          })
      }
      return { list: [], noMore: false }
    },
    {
      manual: true,
      target: listRef,
      isNoMore: (res) => res?.noMore ?? false,
      onError(err) {
        message.error(err.message)
      }
    }
  )
  useEffect(() => {
    if (userInfo) {
      pageIndexRef.current = 0
      reload()
    }
  }, [userInfo, reload])
  const loading = userInfoLoading || firstLoading || loadingMore
  const delayLoading = useDelayLoadingDone(loading)

  return {
    userInfo,
    fileList: fileListRes?.list,
    loading: delayLoading
  }
}
