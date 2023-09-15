import { create } from 'zustand'

export const useDomainStore = create((set) => ({
  domain: '',
  currentProject: {
    name: '',
    pathUrl: '',
  },
  apiLogList: [],
  setDomain: (domainText) => set({ domain: domainText }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setApiLogList: (apiLogList) => set({ apiLogList }),
  addApiLogList: (apiLog) => {
    // 增加最新的api到apiLogList的第一位，如果apiLogList的长度大于5，就删除最后一个
    const newApiLogList = [apiLog, ...useDomainStore.getState().apiLogList]
    // if (newApiLogList.length > 5) {
    //   newApiLogList.pop()
    // }
    set({ apiLogList: newApiLogList })
  

   }
}))
