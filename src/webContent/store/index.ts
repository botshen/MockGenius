import { create } from 'zustand'

export const useDomainStore = create((set) => ({
  domain: '',
  currentProject: {
    name: '',
    pathUrl: '',
  },
  apiLogList: [],
  setDomain: (domainText: string) => set({ domain: domainText }),
  setCurrentProject: (project: any) => set({ currentProject: project }),
  setApiLogList: (apiLogList: any) => set({ apiLogList }),
  addApiLogList: (apiLog: any) => {
    // @ts-ignore
    const newApiLogList = [apiLog, ...useDomainStore.getState().apiLogList]

    set({ apiLogList: newApiLogList })


  }
}))
