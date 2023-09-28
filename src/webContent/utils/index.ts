import { XhrRequestConfig } from 'ajax-hook';
import Url from 'url-parse'
import { AJAX_KEYS, INJECT_ELEMENT_ID, SCRIPT_INJECT } from '../../const';

type KeyValueMap = {
  [key: string]: string | string[] | boolean | any;
}
type CallbackType = (updatedValues: KeyValueMap) => void;
export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';

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
// // 如果找不到就创建一个
// export function getOrCreateLocalStorageValues(keyValueMap: KeyValueMap, callback: CallbackType) {
//   // 尝试从chrome.storage.local中获取指定键的值
//   chrome.storage.local.get(Object.keys(keyValueMap), function (result) {
//     if (chrome.runtime.lastError) {
//       // 发生错误
//       console.error(chrome.runtime.lastError);
//       callback(keyValueMap); // 返回初始值映射对象
//     } else {
//       const updatedValues: KeyValueMap = {};

//       // 遍历键值映射对象，检查每个键的值是否存在
//       for (var key in keyValueMap) {
//         if (key in result) {
//           // 如果存在，将其添加到更新后的值映射对象中
//           updatedValues[key] = result[key];
//         } else {
//           // 如果不存在，将初始值设置到chrome.storage.local中
//           updatedValues[key] = keyValueMap[key];
//           const data: KeyValueMap = {};
//           data[key] = keyValueMap[key];
//           chrome.storage.local.set(data, function () {
//             if (chrome.runtime.lastError) {
//               // 发生错误
//               console.error(chrome.runtime.lastError);
//             }
//           });
//         }
//       }

//       // 返回所有键的最新值映射对象
//       callback(updatedValues);
//     }
//   });
// }
export function getOrCreateLocalStorageValues(keyValueMap: KeyValueMap): Promise<KeyValueMap> {
  return new Promise((resolve, reject) => {
    // 尝试从chrome.storage.local中获取指定键的值
    chrome.storage.local.get(Object.keys(keyValueMap), function (result) {
      if (chrome.runtime.lastError) {
        // 发生错误
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        const updatedValues: KeyValueMap = {};

        // 创建一个 Promise 数组，用于保存所有的 chrome.storage.local.set 操作
        const setPromises = [];

        // 遍历键值映射对象，检查每个键的值是否存在
        for (var key in keyValueMap) {
          if (key in result) {
            // 如果存在，将其添加到更新后的值映射对象中
            updatedValues[key] = result[key];
          } else {
            // 如果不存在，将初始值设置到chrome.storage.local中，并创建一个 Promise
            updatedValues[key] = keyValueMap[key];
            const data: KeyValueMap = {};
            data[key] = keyValueMap[key];
            const setPromise = new Promise<void>((resolve, reject) => {
              chrome.storage.local.set(data, function () {
                if (chrome.runtime.lastError) {
                  // 发生错误
                  console.error(chrome.runtime.lastError);
                  reject(chrome.runtime.lastError);
                } else {
                  resolve();
                }
              });
            });
            setPromises.push(setPromise);
          }
        }

        // 使用 Promise.all 来等待所有的 chrome.storage.local.set 操作完成
        Promise.all(setPromises)
          .then(() => {
            // 所有设置操作都成功完成，返回最新的值映射对象
            resolve(updatedValues);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  });
}




export function logTerminalMockMessage(
  config: XhrRequestConfig,
  result: { response: string; },
  request: any) {
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

function parseReadableStream(readableStream: ReadableStream<Uint8Array>): Promise<string> {
  const textDecoder = new TextDecoder('utf-8');

  return new Promise((resolve: (value: string) => void, reject: (reason?: any) => void) => {
    const chunks: string[] = [];

    const reader = readableStream.getReader();

    function readChunk() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            resolve(chunks.join(''));
            return;
          }

          // 解码并存储数据块
          const decodedText = textDecoder.decode(value);
          chunks.push(decodedText);

          // 继续读取下一个数据块
          readChunk();
        })
        .catch(reject);
    }

    // 开始读取数据
    readChunk();
  });
}

export function logFetch(request: any, response: any) {
  parseReadableStream(request.body).then((res) => {
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
    if (JSON.parse(res)) {
      console.log('%c [ request-body ] ', css, JSON.parse(res))
    }
    if (response) {
      response.json().then((data: any) => {
        if (data === '') {
          console.log('%c [ response ] ', css, '空字符串')
        } else {
          console.log('%c [ response ] ', css, data)
        }
      })
    }
  })
}

export function checkAndInjectScript() {
  const executeScript = (data: any) => {
    const code = JSON.stringify(data)

    const inputElem = document.getElementById(
      INJECT_ELEMENT_ID
    )
    if (inputElem !== null) {
      (inputElem as HTMLInputElement).value = code;
    }
  }
  const setGlobalData = () => {
    chrome.storage.local.get(AJAX_KEYS, (result) => {
      executeScript(result)
    })
  }
  const scriptExists = document.querySelector(SCRIPT_INJECT);
  if (!scriptExists) {
    const script = document.createElement('script')
    script.setAttribute('type', 'module')
    script.setAttribute('src', chrome.runtime.getURL('insert.js'))
    document.documentElement.appendChild(script)
  }
  const existingInput = document.getElementById(INJECT_ELEMENT_ID);
  if (existingInput) {
    // 如果已存在具有指定ID的元素，替换它
    const newInput = document.createElement('input');
    newInput.setAttribute('id', INJECT_ELEMENT_ID);
    newInput.setAttribute('style', 'display:none');
    existingInput.parentNode?.replaceChild(newInput, existingInput);
  } else {
    // 如果不存在具有指定ID的元素，添加新元素
    const input = document.createElement('input');
    input.setAttribute('id', INJECT_ELEMENT_ID);
    input.setAttribute('style', 'display:none');
    document.documentElement.appendChild(input);
  }
  setGlobalData()

}
export function removeInjectScript() {
  const script = document.querySelector(SCRIPT_INJECT);
  if (script) {
    script.remove();
  }
  const input = document.getElementById(INJECT_ELEMENT_ID)
  if (input) {
    input.remove();
  }
}

