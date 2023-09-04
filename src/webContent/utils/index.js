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
const AJAX_INTERCEPTOR_PROJECTS = 'ajaxInterceptor_projects';
const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'ajaxInterceptor_current_project';
const AJAXKeys = [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT]

export const setGlobalData = async () => {
  const result = await readLocalStorage(AJAXKeys)
  executeScript(result)

}
