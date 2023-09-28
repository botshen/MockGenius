import { create } from 'zustand'
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS, defaultProjectProduct } from '../../const';
import { MockGeniusProject } from '../../content';
type KeyValueMap = {
  [key: string]: string | string[] | boolean | any;
}
interface Local {
  currentProject: string | unknown,
  projectList: Array<MockGeniusProject>,
  setCurrentProject: (currentProject: string) => void,
  setProjectList: (projectList: any) => void,
}
function getOrCreateLocalStorageValues(keyValueMap: KeyValueMap): Promise<KeyValueMap> {
  return new Promise((resolve, reject) => {
    // 尝试从chrome.storage.local中获取指定键的值
    chrome.storage.local.get(Object.keys(keyValueMap), function (result) {
      if (chrome.runtime.lastError) {
        // 发生错误
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        const updatedValues: KeyValueMap = {};

        // 创建一个 Promise 数组，用于保存所有的 chrome.storage.local.set 操作
        const setPromises = [];

        // 遍历键值映射对象，检查每个键的值是否存在
        for (var key in keyValueMap) {
          if (key in result) {
            // 如果存在，将其添加到更新后的值映射对象中
            updatedValues[key] = result[key];
          } else {
            // 如果不存在，将初始值设置到chrome.storage.local中，并创建一个 Promise
            updatedValues[key] = keyValueMap[key];
            const data: KeyValueMap = {};
            data[key] = keyValueMap[key];
            const setPromise = new Promise<void>((resolve, reject) => {
              chrome.storage.local.set(data, function () {
                if (chrome.runtime.lastError) {
                  // 发生错误
                  console.error(chrome.runtime.lastError);
                  reject(chrome.runtime.lastError);
                } else {
                  resolve();
                }
              });
            });
            setPromises.push(setPromise);
          }
        }

        // 使用 Promise.all 来等待所有的 chrome.storage.local.set 操作完成
        Promise.all(setPromises)
          .then(() => {
            // 所有设置操作都成功完成，返回最新的值映射对象
            resolve(updatedValues);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  });
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
