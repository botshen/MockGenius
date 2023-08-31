console.log('insert.js loaded')
import { proxy } from "ajax-hook";
import Url from 'url-parse'
import { parse, stringify } from 'flatted';

const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
const INJECT_ELEMENT_ID = 'api-mock-12138'

function mockCore(url, method) {


  // 看下插件设置的数据结构
  const targetUrl = new Url(url)
  const str = targetUrl.pathname
  const currentProject = getCurrentProject()
  return new Promise((resolve, reject) => {
    // 进入 mock 的逻辑判断
    if (currentProject.switchOn) {
      const rules = currentProject.rules || []
      const currentRule = rules.find((item) => {
        const re = pathToRegexp(item.path) // 匹配规则
        const match1 = re.exec(str)

        return item.method === method && match1 && item.switchOn
      })

      if (currentRule) {
        setTimeout(() => {
          resolve({
            response: currentRule.response,
            path: currentRule.path,
            status: currentRule.status,
          })
        }, currentRule.delay || 0)

        return
      }
    }
    reject()
  })
}
const sendMsg = (msg, isMock = false) => {

  const jsonString = parse(stringify(msg));
  const result = {
    ...jsonString,
    isMock
  }
  const event = new CustomEvent(CUSTOM_EVENT_NAME, {
    detail: result,
  })
  window.dispatchEvent(event)
}
function handMockResult({ res, request, config }) {
  const { response, path: rulePath, status } = res
  const result = {
    config,
    status,
    headers: [],
    response: stringify(response),
  }
  const payload = {
    request,
    response: {
      status: result.status,
      headers: result.headers,
      url: config.url,
      responseTxt: stringify(response),
      isMock: true,
      rulePath,
    },
  }
  return { result, payload }
}
function getCurrentProject() {
  const inputElem = document.getElementById(
    INJECT_ELEMENT_ID
  )
  if (!inputElem) {
    return {};
  }
  const configStr = inputElem.value
  try {
    const config = JSON.parse(configStr);
    const { ajaxInterceptor_current_project, ajaxInterceptor_projects } = config
    const currentProject =
      ajaxInterceptor_projects?.find(
        (item) => item.name === ajaxInterceptor_current_project
      ) || ({})
    return currentProject;
  } catch (e) {
    return {};
  }
}
proxy({
  onRequest: (config, handler) => {
    if (getCurrentProject().isRealRequest) {
      handler.next(config)
    } else {
      // TODO: url 对象里面的信息非常有用啊
      const url = new Url(config.url)

      const request = {
        url: url.href,
        method: config.method,
        headers: config.headers,
        type: 'xhr',
      }
      mockCore(url.href, config.method)
        .then((res) => {
          const { payload, result } = handMockResult({ res, request, config })
          console.log('payload',payload)
          sendMsg(payload, true)
          if (getCurrentProject().isTerminalLogOpen) {
            logTerminalMockMessage(config, result, request)

          }

          handler.resolve(result)
        })
        .catch(() => {
          handler.next(config)
        })
    }

  },
  onResponse: (response, handler) => {
    const { statusText, status, config, headers, response: res } = response
    const url = new Url(config.url)
    mockCore(url.href, config.method)
      .then((res) => {
        const request = {
          url: url.href,
          method: config.method,
          headers: config.headers,
          type: 'xhr',
        }
        const { payload, result } = handMockResult({ res, request, config })
        sendMsg(payload, true)
        if (getCurrentProject().isTerminalLogOpen) {
          logTerminalMockMessage(config, result, request)
        }
        handler.resolve(result)
      })
      .catch(() => {
        const url = new Url(config.url)
        const payload = {
          request: {
            method: config.method,
            url: url.href,
            headers: config.headers,
            type: 'xhr',
          },
          response: {
            status: status,
            statusText,
            url: config.url,
            headers: headers,
            responseTxt: res,
            isMock: false,
            rulePath: '',
          },
        }
        sendMsg(payload)
        handler.resolve(response)
      })

  },
})
