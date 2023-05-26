import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteScroll, useUpdateEffect } from 'ahooks'
import { App } from 'antd'
import { useUserInfo } from '~/hooks'
import { fileApi } from '~/api'
import { OwnerType } from '~/type'

const minInterval = 500 // 最小间隔

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
  const timestampRef = useRef(Date.now()) //检测加载间隔，只检测了fileList
  const timeoutRef = useRef<NodeJS.Timeout>()
  const loading = userInfoLoading || firstLoading || loadingMore
  const [minLoading, setMinLoading] = useState(loading) //加载时间最低500ms
  useUpdateEffect(() => {
    clearTimeout(timeoutRef.current)
    if (!loading) {
      const dt = Date.now() - timestampRef.current
      if (dt < minInterval) {
        timeoutRef.current = setTimeout(
          () => setMinLoading(false),
          minInterval - dt
        )
      } else {
        setMinLoading(false)
      }
    }
    timestampRef.current = Date.now()
  }, [loading])

  return {
    userInfo,
    fileList: fileListRes?.list,
    loading: minLoading
  }
}
