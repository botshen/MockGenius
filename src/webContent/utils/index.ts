import { XhrRequestConfig } from 'ajax-hook';
import Url from 'url-parse'

type KeyValueMap = {
  [key: string]: string | string[] | boolean | any;
}
type CallbackType = (updatedValues: KeyValueMap) => void;
export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';

export const saveStorage = async <T>(key: string, value: T): Promise<void> => {
  return new Promise<void>((resolve) => {
    const dataToStore = { [key]: value };
    chrome.storage.local.set(dataToStore, () => {
      resolve();
    });
  });
}
export const readLocalStorage = async (key: string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
        resolve(result[key]);
      }
    });
  });
};
// 如果找不到就创建一个
export function getOrCreateLocalStorageValues(keyValueMap: KeyValueMap, callback: CallbackType) {
  // 尝试从chrome.storage.local中获取指定键的值
  chrome.storage.local.get(Object.keys(keyValueMap), function (result) {
    if (chrome.runtime.lastError) {
      // 发生错误
      console.error(chrome.runtime.lastError);
      callback(keyValueMap); // 返回初始值映射对象
    } else {
      const updatedValues: KeyValueMap = {};

      // 遍历键值映射对象，检查每个键的值是否存在
      for (var key in keyValueMap) {
        if (key in result) {
          // 如果存在，将其添加到更新后的值映射对象中
          updatedValues[key] = result[key];
        } else {
          // 如果不存在，将初始值设置到chrome.storage.local中
          updatedValues[key] = keyValueMap[key];
          const data: KeyValueMap = {};
          data[key] = keyValueMap[key];
          chrome.storage.local.set(data, function () {
            if (chrome.runtime.lastError) {
              // 发生错误
              console.error(chrome.runtime.lastError);
            }
          });
        }
      }

      // 返回所有键的最新值映射对象
      callback(updatedValues);
    }
  });
}



export function logTerminalMockMessage(
  config: XhrRequestConfig,
  result: { response: string; },
  request: { url: string; method: Methods; }) {
  const targetUrl = new Url(request.url)
  const str = targetUrl.pathname
  const css = 'font-size:13px; background:pink; color:#bf2c9f;'
  console.log(
    `%c [ URL ] %c${str} %c [ METHOD ] %c${request.method}`,
    css, // 样式1，用于 'URL:'
    '', // 默认样式，用于 'str'
    css, // 样式1，用于 'URL:'
    '', // 默认样式，用于 'str'
  );
  if (JSON.parse(config.body)) {
    console.log('%c [ request-body ] ', css, JSON.parse(config.body))
  }
  if (result.response && result.response !== "") {
    console.log('%c [ response ] ', css, result.response)
  } else if (result.response === "") {
    console.log('%c [ response ] ', css, '空字符串')
  }
}

