console.log('insert.js loaded')
import { proxy } from "ajax-hook";
import Url from 'url-parse'
import { parse, stringify } from 'flatted';
import { pathToRegexp } from 'path-to-regexp'

const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
const INJECT_ELEMENT_ID = 'api-mock-12138'

function mockCore(url, method) {
  console.log('method',method)
  // 看下插件设置的数据结构
  const targetUrl = new Url(url)
  console.log(targetUrl, 21232133132);
  const str = targetUrl.pathname
  const currentProject = getCurrentProject()
  console.log(currentProject, 321321);
  return new Promise((resolve, reject) => {
    // 进入 mock 的逻辑判断
    console.log('currentProject332323232', currentProject)
    if (currentProject.switchOn) {
      const rules = currentProject.rules || []
      const currentRule = rules.find((item) => {
        // console.log('item', item)
        // console.log('pathToRegexp', pathToRegexp)
        // const re = pathToRegexp(item.pathRule) // 匹配规则
        // console.log('re', re)
        // const match1 = re.exec(str)
        // console.log('match1', match1)

        return item.method === method && item.switchOn
      })
      console.log(currentRule, 32321332);

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
  const result = {
    ...msg,
    isMock
  }
  const event = new CustomEvent(CUSTOM_EVENT_NAME, { detail: result })
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
  console.log('inputElem', inputElem)
  if (!inputElem) {
    return {};
  }
  const configStr = inputElem.value
  console.log('configStr', configStr, '32')
  try {
    const config = JSON.parse(configStr);
    console.log('config', config)
    const { ajaxInterceptor_current_project, ajaxInterceptor_projects } = config
    return ajaxInterceptor_projects?.find(
      (item) => item.pathUrl === ajaxInterceptor_current_project
    ) || ({});
  } catch (e) {
    return {};
  }
}

function logTerminalMockMessage(config, result, request) {
  console.log(`%cURL:${request.url} METHOD:${request.method}`, 'color: red')
  if (JSON.parse(config.body)) {
    console.log('%c请求:', 'color: red;', JSON.parse(config.body))
  }
  if (JSON.parse(result.response)) {
    console.log('%c响应:', 'color: red;', JSON.parse(result.response))
  }
}

proxy({
  onRequest: (config, handler) => {
    if (getCurrentProject().isRealRequest) {
      console.log('isRealRequest');
      handler.next(config)
    } else {
      console.log('isNotRealRequest');
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
          sendMsg(payload, true)
          if (getCurrentProject().isTerminalLogOpen) {
            logTerminalMockMessage(config, result, request)
          }
          handler.resolve(result)
        })
        .catch(() => {
          console.log('catch');
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
