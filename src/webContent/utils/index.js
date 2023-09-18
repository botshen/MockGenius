export const saveStorage = async (key, value) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, (result) => {
      resolve(result)
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
const executeScript = (data) => {
  const code = JSON.stringify(data)
  const inputElem = document.getElementById(
    INJECT_ELEMENT_ID
  )
  if (inputElem !== null) {
    inputElem.value = code
  }
}
const AJAX_INTERCEPTOR_PROJECTS = 'mock_genius_projects';
const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'mockgenius_current_project';
const AJAXKeys = [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT]

export const setGlobalData = async () => {
  const result = await readLocalStorage(AJAXKeys)
  executeScript(result)

}

// 如果找不到就创建一个
export const getLocal = (key) => new Promise((resolve, reject) => {
  chrome.storage.local.get(key)
    .then(object => resolve(object[key]))
    .catch(error => reject(console.error(error)));
});
// 如果找不到就创建一个
export function getOrCreateLocalStorageValues(keyValueMap, callback) {
  // 尝试从chrome.storage.local中获取指定键的值
  chrome.storage.local.get(Object.keys(keyValueMap), function (result) {
    if (chrome.runtime.lastError) {
      // 发生错误
      console.error(chrome.runtime.lastError);
      callback(keyValueMap); // 返回初始值映射对象
    } else {
      var updatedValues = {};

      // 遍历键值映射对象，检查每个键的值是否存在
      for (var key in keyValueMap) {
        if (key in result) {
          // 如果存在，将其添加到更新后的值映射对象中
          updatedValues[key] = result[key];
        } else {
          // 如果不存在，将初始值设置到chrome.storage.local中
          updatedValues[key] = keyValueMap[key];
          var data = {};
          data[key] = keyValueMap[key];
          chrome.storage.local.set(data, function () {
            if (chrome.runtime.lastError) {
              // 发生错误
              console.error(chrome.runtime.lastError);
            }
          });
        }
      }

      // 返回所有键的最新值映射对象
      callback(updatedValues);
    }
  });
}

export const setLocal = async (object) => {
  for (let key in object) {
    const oldObject = await getLocal(key);
    const newObject = { ...oldObject, ...object[key] };
    await chrome.storage.local.set({ [key]: newObject });
  }
};
