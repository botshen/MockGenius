console.log('insert.js loaded')
import { proxy } from "ajax-hook";
import Url from 'url-parse'
import { parse, stringify, toJSON, fromJSON } from 'flatted';

const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
const INJECT_ELEMENT_ID = 'ajaxInterceptor'

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

  console.log('msg', msg)
  const jsonString = parse(stringify(msg));
  console.log('msgjsonString', jsonString)
  const result = {
    ...jsonString,
    isMock
  }
  const event = new CustomEvent('request', {
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
    response: JSON.stringify(response),
  }
  const payload = {
    request,
    response: {
      status: result.status,
      headers: result.headers,
      url: config.url,
      responseTxt: JSON.stringify(response),
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
    console.log('config11111111', config)
    if (getCurrentProject().isRealRequest) {
      handler.next(config)
    } else {
      console.log('1213000', 1213000)
      // TODO: url 对象里面的信息非常有用啊
      const url = new Url(config.url)



      // handler.resolve(result)

      sendMsg({
        type: 'request',
        config
      }, false)
      handler.next(config)

    }
  },
  //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
  onError: (err, handler) => {
    handler.next(err)
  },
  //请求成功后进入
  onResponse: (response, handler) => {
    console.log('response', response)
    handler.next(response)
  }
})
