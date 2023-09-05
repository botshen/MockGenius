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
  addApiLogList: (apiLog) => set((state) => ({ apiLogList: [apiLog, ...state.apiLogList] })),
}))
