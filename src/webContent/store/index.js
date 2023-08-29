import { create } from 'zustand'

export const useDomainStore = create((set) => ({
  domain: '',
  currentProject: {
    name: '',
    pathUrl: '',
  },
  setDomain: (domainText) => set({ domain: domainText }),
  setCurrentProject: (project) => set({ currentProject: project }),

}))
