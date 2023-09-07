import { proxy } from "ajax-hook";
import Url from 'url-parse'
import FetchInterceptor from './fetch'


const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
const INJECT_ELEMENT_ID = 'api-mock-12138'

async function mockCore(url, method) {
  const targetUrl = new Url(url)
  const str = targetUrl.pathname
  const currentProject = getCurrentProject()
  if (currentProject?.switchOn) {
    const rules = currentProject.rules || []
    const currentRule = rules.find((item) => {
      const med = item.method.toUpperCase()
      const pathRule = new Url(item.pathRule)
      const pathname = pathRule.pathname
      return med === method && item?.switchOn && str === pathname
    })
    if (currentRule) {
      await new Promise((resolve) => setTimeout(resolve, currentRule.delay || 0));
      return {
        response: currentRule.Response,
        path: currentRule.pathRule,
        status: currentRule.code,
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
  const result = {
    config,
    status,
    headers: [],
    response: response,
  }
  const payload = {
    request,
    response: {
      status: result.status,
      headers: result.headers,
      url: config.url,
      responseTxt: response,
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
    return ajaxInterceptor_projects?.find(
      (item) => item.pathUrl === ajaxInterceptor_current_project
    ) || ({});
  } catch (e) {
    return {};
  }
}

function logTerminalMockMessage(config, result, request) {
  const targetUrl = new Url(request.url)
  const str = targetUrl.pathname
  console.log(`%cURL:%c${str} METHOD:${request.method}`, 'color: red;background-color:yellow', 'color: red;background-color:yellow');

  // if (JSON.parse(config.body)) {
  //   console.log('%c请求:', 'color: red;', JSON.parse(config.body))
  // }
  if (result.response) {
    console.log('%c响应:', 'color: red;background-color:yellow', result.response)
  }
}

proxy({
  onRequest: async (config, handler) => {
    console.log('config',config)
    if (getCurrentProject().isRealRequest) {
      handler.next(config)
    } else {
      const url = new Url(config.url)
      const request = {
        url: url.href,
        method: config.method,
        headers: config.headers,
        type: 'xhr',
      }
      try {
        const res = await mockCore(url.href, config.method);
        const { payload, result } = handMockResult({ res, request, config })
        sendMsg(payload, true)
        // if (getCurrentProject().isTerminalLogOpen) {
        //   logTerminalMockMessage(config, result, request)
        // }
        logTerminalMockMessage(config, result, request)
        handler.resolve(result)
      } catch (error) {
        handler.next(config)
      }
    }
  },
  onResponse: async (response, handler) => {
    const { statusText, status, config, headers, response: res } = response
    const url = new Url(config.url)
    try {
      const res = await mockCore(url.href, config.method);
      const request = {
        url: url.href,
        method: config.method,
        headers: config.headers,
        type: 'xhr',
      }
      console.log('111111', 111111)
      const { payload, result } = handMockResult({ res, request, config })

      sendMsg(payload, true)
      // if (getCurrentProject().isTerminalLogOpen) {
      //   logTerminalMockMessage(config, result, request)
      // }
      logTerminalMockMessage(config, result, request)
      handler.resolve(result)
    } catch (error) {
      const url = new Url(config.url)
      console.log('res', res)

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
          responseTxt: JSON.parse(res),
          isMock: false,
          rulePath: '',
        },
      }

      sendMsg(payload)
      handler.resolve(response)
    }




  },
})

if (window.fetch !== undefined) {
  FetchInterceptor.register({
    onBeforeRequest(request) {
      console.log('request',request)
      return mockCore(request.url, request.method).then((res) => {
        try {
          const { path: rulePath } = res
          const text = JSON.stringify(res.response)
          const response = new Response()
          response.json = () => Promise.resolve(res.response)
          response.text = () => Promise.resolve(text)
          response.isMock = true
          response.rulePath = rulePath
          return response
        } catch (err) {
          console.error(err)
        }
      })
    },
    onRequestSuccess(
      response,
      request
    ) {
      const payload = {
        request: {
          type: 'fetch',
          method: request.method,
          url: request.url,
          headers: request.headers,
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: response.headers,
          responseTxt: '',
          isMock: false,
          rulePath: '',
        },
      }

      // TODO: 数据格式化，流是不能直接转成字符串的, 如何获取到 response 中的字符串返回
      if (response.isMock) {
        response.json().then((res) => {
          const result = {
            status: response.status,
            url: request.url,
            headers: [],
            responseTxt: JSON.stringify(res),
            isMock: true,
            rulePath: response.rulePath,
          }
          payload.response = result
          sendMsg(payload, true)
        })
      } else {
        const cloneRes = response.clone()
        cloneRes.json().then((res) => {
          const result = {
            status: response.status,
            url: request.url,
            headers: [],
            responseTxt: JSON.stringify(res),
            isMock: false,
            rulePath: '',
          }
          payload.response = result
          sendMsg(payload)
        })
      }
    },
    onRequestFailure(response, request) {
      const payload = {
        request: {
          type: 'fetch',
          method: request.method,
          url: request.url,
          headers: request.headers,
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: response.headers,
          responseTxt: '',
          isMock: false,
          rulePath: '',
        },
      }

      sendMsg(payload)
    },
  }, getCurrentProject().isRealRequest)
}
