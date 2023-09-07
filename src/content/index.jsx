
const AJAX_INTERCEPTOR_PROJECTS = 'ajaxInterceptor_projects';
const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'ajaxInterceptor_current_project';
const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
const INJECT_ELEMENT_ID = 'api-mock-12138'
const keys = [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT]
console.log('inject')
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
  const { origin } = location;
  if (origin === currentName) {
    injectScriptToPage()
    setGlobalData()

  }
})

window.addEventListener(
  CUSTOM_EVENT_NAME,
  async (event) => {
    console.log('event',event)
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "refreshTabToContent") {
    const { pathUrl } = request.data
    const { origin } = location;
    if (origin === pathUrl) {
      injectScriptToPage()
      setGlobalData()

    }
  }
});

/**
 * 监听插件的操作界面，设置拦截规则，设置项目的打开关闭或者规则的开启关闭，实时通知给用户的页面
 */
chrome.storage.onChanged.addListener((changes) => {
  for (const [key] of Object.entries(changes)) {
    if (keys.find((item) => item === key)) {
      setGlobalData()
    }
  }
})
