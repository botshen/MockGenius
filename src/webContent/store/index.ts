import { create } from 'zustand'

interface Log {
  pathRule: string;
  status: number;
  mock: string;
  type: string;
  method: string;
  Response: string;
  origin: string;
  switchOn: boolean;
  requestHeaders: {
    accept: string;
    'content-type': string;
  };
  responseHeaders: {
    'content-length': string;
    'content-type': string;
  };
}
interface Domain {
  domain: string
  apiLogList: Log[],
  currentProject: {
    name: string,
    pathUrl: string,
  },
  setDomain: (domainText: string) => void
  clearLogList: () => void
  addApiLogList: (apiLog: Log) => void
}

export const useDomainStore = create<Domain>((set) => ({
  domain: '',
  currentProject: {
    name: '',
    pathUrl: '',
  },
  apiLogList: [],
  
  setDomain: domainText => set({ domain: domainText }),
  clearLogList: () => set({ apiLogList: [] }),
  addApiLogList: (apiLog) => {
    set({ apiLogList: [apiLog, ...useDomainStore.getState().apiLogList] })
  }
}))
