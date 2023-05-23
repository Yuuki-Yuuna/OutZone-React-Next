import { createContext, useContext } from 'react'
import Uploader from './uploader'
import { baseURL, getToken } from '~/util'

class RootStore {
  uploader: Uploader

  constructor() {
    this.uploader = new Uploader({
      target: `${baseURL}/file/upload/file`,
      mergeTarget: `${baseURL}/file/upload/merge`,
      precheckTarget: `${baseURL}/file/upload/preCheck`,
      headers: () => ({ token: getToken() || '' })
    })
  }
}

const rootStore = new RootStore()
export default rootStore

export const StoreContext = createContext<RootStore | null>(null)

export const useRootStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('rootStore is null')
  }
  return context
}
