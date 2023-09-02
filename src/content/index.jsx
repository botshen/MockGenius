import Url from "url-parse";

console.log('env:', import.meta.env.MODE)
const AJAX_INTERCEPTOR_PROJECTS = 'ajaxInterceptor_projects';
const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'ajaxInterceptor_current_project';
const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
const INJECT_ELEMENT_ID = 'api-mock-12138'
const keys = [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT]

const executeScript = (data) => {
  const code = JSON.stringify(data)
  const inputElem = document.getElementById(
    INJECT_ELEMENT_ID
  )
  if (inputElem !== null) {
    inputElem.value = code
  }
}
const setGlobalData = () => {
  chrome.storage.local.get(keys, (result) => {
    executeScript(result)
  })
}
const injectScriptToPage = () => {
  try {
    const oldInsertScript = document.querySelector('script[src*="insert.js"]');
    const oldInput = document.getElementById(INJECT_ELEMENT_ID);
    if (oldInsertScript) {
      oldInsertScript.parentNode.removeChild(oldInsertScript);
    }

    if (oldInput) {
      oldInput.parentNode.removeChild(oldInput);
    }
    let insertScript = document.createElement('script')
    if (import.meta.env.MODE === 'development') {
      insertScript.setAttribute('type', 'module');
      insertScript.src = '../../public/insert.js'
    } else {
      insertScript.setAttribute('type', 'module')
      insertScript.src = window.chrome.runtime.getURL('insert.js')
    }
    document.body.appendChild(insertScript)
    const input = document.createElement('input')
    input.setAttribute('id', INJECT_ELEMENT_ID)
    input.setAttribute('style', 'display:none')
    document.documentElement.appendChild(input)
  } catch (err) {
    console.error('err', err)
  }
}


chrome.storage.local.get(keys, (result) => {
  const currentName = result[AJAX_INTERCEPTOR_CURRENT_PROJECT]
  const {origin} = location;
  if (origin === currentName) {
    injectScriptToPage()
  }
})

window.addEventListener(
  CUSTOM_EVENT_NAME,
  async (event) => {
    if (chrome.runtime?.id) {
      await chrome.runtime.sendMessage({
        type: "ajaxInterceptor",
        message: "content_to_background",
        data: event.detail,
      })
    }
  },
  false
)

function isInsertScriptAndInputExist() {
  console.log(document);

  const oldInsertScript = document && document.querySelector('script[src*="insert.js"]');
  const oldInput = document && document.getElementById('api-mock-12138');
  return oldInsertScript && oldInput;
}


// 获取匹配特定地址的选项卡信息
function getMatchingTabs(tabs, url) {
  const matchingTabs = [];
  for (const tab of tabs) {
    if (tab.url.startsWith(url)) {
      matchingTabs.push(tab);
    }
  }
  return matchingTabs;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(121333, request);
  if (request.action === "refreshTabToContent") {
    console.log('request', request)
    const {pathUrl} = request.data
    const {origin} = location;
    if (origin === pathUrl) {
      injectScriptToPage()
    }
  }
});
