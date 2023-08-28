console.log('insert.js loaded')
import { proxy } from "ajax-hook";
import Url from 'url-parse'

const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'

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
proxy({
  onRequest: (config, handler) => {
    // const url = new Url(config.url)
    // const request = {
    //   url: url.href,
    //   method: config.method,
    //   headers: config.headers,
    //   type: 'xhr',
    // }
    // const { payload, result } = handMockResult({ res, request, config })
    // console.log('request',request)
    // console.log('payload',payload)
    // sendMsg(payload, true)
    // handler.resolve(config)
    console.log('config',config)
    handler.next(config);
  },
  //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
  onError: (err, handler) => {
    handler.next(err)
  },
  //请求成功后进入
  onResponse: (response, handler) => {
    handler.next(response)
  }
})
