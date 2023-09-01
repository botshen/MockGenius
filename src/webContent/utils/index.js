// 数据的保持
export const saveStorage = async (key, value) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({[key]: value}, (result) => {
      resolve(result)
    })
  })
}
export const getStorageItem = (key) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key])
    })
  })
}
export const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
        resolve(result[key]);
      }
    });
  });
};
