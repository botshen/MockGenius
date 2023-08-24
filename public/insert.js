console.log('insert.js loaded')
import { proxy } from "ajax-hook";
const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
const result = {
  code: 0,
  msg: 'success',
  data: {
    name: 'zhangsan',
    age: 18
  }
}
proxy({
  //请求发起前进入
  onRequest: (config, handler) => {
    const event = new CustomEvent(CUSTOM_EVENT_NAME, { detail: config })
    window.dispatchEvent(event)
    console.log('config',config)
    console.log('result',result)
    handler.resolve(result)

    // handler.next(config);
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
