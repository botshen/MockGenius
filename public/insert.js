console.log('insert.js loaded')
import { proxy } from "ajax-hook";
import Url from 'url-parse'
import { stringify } from 'flatted';

const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
const INJECT_ELEMENT_ID = 'api-mock-12138'

async function mockCore(url, method) {
   const targetUrl = new Url(url)
  const str = targetUrl.pathname
  const currentProject = getCurrentProject()
  console.log('currentProject',currentProject)
  if (currentProject.switchOn) {
    const rules = currentProject.rules || []
    const currentRule = rules.find((item) => {
      const med = item.method.toUpperCase()
      return med === method && item.switchOn
    })
    if (currentRule) {
      await new Promise((resolve) => setTimeout(resolve, currentRule.delay || 0));
      return {
        response: currentRule.response,
        path: currentRule.path,
        status: currentRule.status,
      };
    }
  }
  throw new Error("没有匹配的规则"); // 没有匹配的规则时，抛出错误
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
  console.log('respon22se', response)
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
  onRequest: async (config, handler) => {
    if (getCurrentProject().isRealRequest) {
      console.log('isRealRequest');
      handler.next(config)
    } else {
      console.log('isNotRealRequest');
      const url = new Url(config.url)
      const request = {
        url: url.href,
        method: config.method,
        headers: config.headers,
        type: 'xhr',
      }
      try {
        const res = await mockCore(url.href, config.method);
        // 处理匹配到规则的情况
        console.log('匹配到规则:', res);
        const { payload, result } = handMockResult({ res, request, config })
        sendMsg(payload, true)
        // if (getCurrentProject().isTerminalLogOpen) {
        //   logTerminalMockMessage(config, result, request)
        // }
        console.log('result', result)
        logTerminalMockMessage(config, result, request)
        handler.resolve(result)
      } catch (error) {
        // 处理没有匹配到规则的情况
        console.log('没有匹配到规则');
        console.log('catch');
        handler.next(config)
      }
      // mockCore(url.href, config.method)
      //   .then((res) => {
      //     const { payload, result } = handMockResult({ res, request, config })
      //     sendMsg(payload, true)
      //     // if (getCurrentProject().isTerminalLogOpen) {
      //     //   logTerminalMockMessage(config, result, request)
      //     // }
      //     console.log('result', result)
      //     logTerminalMockMessage(config, result, request)
      //     handler.resolve(result)
      //   })
      //   .catch(() => {
      //     console.log('catch');
      //     handler.next(config)
      //   })


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
