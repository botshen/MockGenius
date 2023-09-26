import { AJAX_KEYS, AJAX_INTERCEPTOR_CURRENT_PROJECT, INJECT_ELEMENT_ID, CUSTOM_EVENT_NAME, SCRIPT_INJECT } from "../const"
interface ResponseHeaders {
  [key: string]: string;
}
interface Rule {
  Response: {
    [key: string]: object | string | number;
  };
  code: string;
  comments: string;
  delay: string;
  method: string;
  pathRule: string;
  responseHeaders: ResponseHeaders;
  switchOn: boolean;
}
interface MockGeniusProject {
  isRealRequest: boolean;
  isTerminalLogOpen: boolean;
  pathUrl: string;
  projectName: string;
  rules: Rule[];
  switchOn: boolean;
}

interface MockGeniusConfig {
  mock_genius_projects: MockGeniusProject[];
  mockgenius_current_project: string;
}
const executeScript = (data: MockGeniusConfig) => {
  const code = JSON.stringify(data)
  const inputElem = document.getElementById(
    INJECT_ELEMENT_ID
  )
  if (inputElem instanceof HTMLInputElement) { // 使用类型守卫检查元素类型
    inputElem.value = code;
  }
}
const setGlobalData = () => {
  chrome.storage.local.get(AJAX_KEYS, (result: any) => {
    executeScript(result)
  })
}

const injectScriptToPage = () => {
  try {
    const oldInsertScript = document.querySelector(SCRIPT_INJECT);
    const oldInput = document.getElementById(INJECT_ELEMENT_ID);
    if (oldInsertScript) {
      oldInsertScript.parentNode?.removeChild(oldInsertScript);
    }

    if (oldInput) {
      oldInput.parentNode?.removeChild(oldInput);
    }
    let insertScript = document.createElement('script')
    insertScript.setAttribute('type', 'module')
    insertScript.src = window.chrome.runtime.getURL('insert.js')

    document.documentElement.appendChild(insertScript)
    const input = document.createElement('input')
    input.setAttribute('id', INJECT_ELEMENT_ID)
    input.setAttribute('style', 'display:none')
    document.documentElement.appendChild(input)
  } catch (err) {
    console.error('err', err)
  }
}


chrome.storage.local.get(AJAX_KEYS, (result) => {
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
    if (chrome.runtime?.id) {
      try {
        const customEvent = event as CustomEvent
        if (customEvent.detail) {
          await chrome.runtime.sendMessage({
            type: "ajaxInterceptor",
            message: "content_to_background",
            data: customEvent.detail,
          })
        }

      } catch (error) {
        console.error('error', error)
      }
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
  const { origin } = location;
  for (const [key, change] of Object.entries(changes)) {

    const newValue = change.newValue;
    const oldValue = change.oldValue;

    // 移除之前的插入的 script 和 input
    if (oldValue === origin) {
      const oldInsertScript = document.querySelector(SCRIPT_INJECT);
      const oldInput = document.getElementById(INJECT_ELEMENT_ID);
      if (oldInsertScript) {
        oldInsertScript.parentNode?.removeChild(oldInsertScript);
      }
      if (oldInput) {
        oldInput.parentNode?.removeChild(oldInput);
      }
    } else {
      // 检查新的值，如果需要插入新的脚本和输入元素，可以在这里执行操作
      if (newValue) {
        // 如果是当前页面，就插入脚本
        if (oldValue !== origin && typeof oldValue === 'string') {
          injectScriptToPage();
        }
        setGlobalData();
      }
    }
  }
});
