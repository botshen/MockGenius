import { XhrRequestConfig } from 'ajax-hook';
import Url from 'url-parse'
import { AJAX_KEYS, INJECT_ELEMENT_ID, SCRIPT_JS } from '../../const';


export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';


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
  const scriptExists = document.querySelector(SCRIPT_JS);
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
  const script = document.querySelector(SCRIPT_JS);
  if (script) {
    script.remove();
  }
  const input = document.getElementById(INJECT_ELEMENT_ID)
  if (input) {
    input.remove();
  }
}

