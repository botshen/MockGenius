import { create } from 'zustand'

interface Log {
  pathRule: string;
  status: string;
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
  apiLogList: Log[],
  clearLogList: () => void
  addApiLogList: (apiLog: Log) => void
}

export const useLogStore = create<Domain>((set) => ({
  apiLogList: [],
  clearLogList: () => set({ apiLogList: [] }),
  addApiLogList: (apiLog) => {
    set({ apiLogList: [apiLog, ...useLogStore.getState().apiLogList] })
  }
}))
