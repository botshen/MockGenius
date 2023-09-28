import { create } from 'zustand'
import { getOrCreateLocalStorageValues, readLocalStorage } from '../utils';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS, defaultProjectProduct } from '../../const';
import { MockGeniusProject } from '../../content';

interface Local {
  currentProject: string | unknown,
  projectList: Array<MockGeniusProject>,
  setCurrentProject: (currentProject: string) => void,
  setProjectList: (projectList: any) => void,
}

const saveStorage = async <T>(key: string, value: T): Promise<void> => {
  return new Promise<void>((resolve) => {
    const dataToStore = { [key]: value };
    chrome.storage.local.set(dataToStore, () => {
      resolve();
    });
  });
}



const values = await getOrCreateLocalStorageValues({
  [AJAX_INTERCEPTOR_CURRENT_PROJECT]: defaultProjectProduct.pathUrl,
  [AJAX_INTERCEPTOR_PROJECTS]: [defaultProjectProduct],
})
const currentProject = values[AJAX_INTERCEPTOR_CURRENT_PROJECT]
const projectList = values[AJAX_INTERCEPTOR_PROJECTS]


export const useLocalStore = create<Local>((set) => ({
  currentProject,
  projectList,

  setCurrentProject: async (currentProject: string) => {
    await saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, currentProject)
    set({ currentProject })
  },
  setProjectList: async (projectList: any) => {
    await saveStorage(AJAX_INTERCEPTOR_PROJECTS, projectList)
    set({ projectList })
  },
}))
