import { create } from 'zustand'
import { readLocalStorage, saveStorage } from '../utils';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';


const currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
const projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS)

export const useLocalStore = create((set) => ({
  currentProject,
  projectList,
  setCurrentProject: (currentProject: string) => {
    saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, currentProject)
    set({ currentProject })
  },
  setProjectList: (projectList: any) => {
    saveStorage(AJAX_INTERCEPTOR_PROJECTS, projectList)
    set({ projectList })
  },
}))
