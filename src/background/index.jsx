/*global chrome*/
import Url from 'url-parse'
import {readLocalStorage} from "../webContent/utils/index.js";

console.log('background running')
let ftdWindow = null
let screenWith = null
let screenHeight = null
const AJAX_INTERCEPTOR_PROJECTS = 'ajaxInterceptor_projects';
const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'ajaxInterceptor_current_project';
const defaultProjectProduct = {
  name: '将军令',
  pathUrl: 'http://localhost:9528',
  color: '#04B34C',
  switchOn: true,
  isRealRequest: false,
  isTerminalLogOpen: false,
}
// manifest.json的Permissions配置需添加declarativeContent权限
chrome.runtime.onInstalled.addListener(async function () {
  console.log('onInstalled')
  const currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
  // if(currentProject===)
  console.log(currentProject, 1200000);
  // 默认先禁止Page Action。如果不加这一句，则无法生效下面的规则
  // chrome.action.disable()
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
  //     // 设置规则
  //     let rule = {
  //         // 运行插件运行的页面URL规则
  //         conditions: [
  //             new chrome.declarativeContent.PageStateMatcher({
  //                 pageUrl: {
  //                     // 适配所有域名以“www.”开头的网页
  //                     // hostPrefix: 'www.'
  //                     // 适配所有域名以“.antgroup.com”结尾的网页
  //                     // hostSuffix: '.antgroup.com',
  //                     // 适配域名为“ant-design.antgroup.com”的网页
  //                     hostEquals: 'ant-design.antgroup.com',
  //                     // 适配https协议的网页
  //                     // schemes: ['https'],
  //                 },
  //             }),
  //         ],
  //         actions: [new chrome.declarativeContent.ShowAction()],
  //     }
  //     // 整合所有规则
  //     const rules = [rule]
  //     // 执行规则
  //     chrome.declarativeContent.onPageChanged.addRules(rules)
  // })
  chrome.storage.local.set({
    [AJAX_INTERCEPTOR_PROJECTS]: [defaultProjectProduct],
    [AJAX_INTERCEPTOR_CURRENT_PROJECT]: defaultProjectProduct.pathUrl,
  }, function () {
    console.log('生产环境')
    chrome.storage.local.get([AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT], result => {
      console.log('chrome.storage.local', result)
    })
  })
})
chrome.windows.onRemoved.addListener(async (windowId) => {
  if (ftdWindow && ftdWindow.id === windowId) {
    await chrome.action.setBadgeText({text: ''});
    ftdWindow = null;
  }
});

chrome.system.display.getInfo(function (displays) {
  if (displays && displays.length > 0) {
    const screenInfo = displays[0];
    screenWith = screenInfo.bounds.width;
    screenHeight = screenInfo.bounds.height;
  }
});

function injectScriptToPage() {
  try {
    // 创建新的 script 元素
    let newInsertScript = document.createElement('script');
    newInsertScript.setAttribute('type', 'text/javascript');
    newInsertScript.src = chrome.runtime.getURL('insert.js'); // 新的脚本文件

    // 创建新的 input 元素
    const newInput = document.createElement('input');
    newInput.setAttribute('id', 'api-mock-12138');
    newInput.setAttribute('style', 'display:none');

    // 找到要替换的旧的 script 元素和 input 元素
    const oldInsertScript = document.querySelector('script[src*="insert.js"]');
    const oldInput = document.getElementById('api-mock-12138');

    // 如果找到旧的 script 元素和 input 元素，进行替换
    // 如果找到旧的 script 元素和 input 元素，先删除它们
    if (oldInsertScript) {
      oldInsertScript.parentNode.removeChild(oldInsertScript);
    }

    if (oldInput) {
      oldInput.parentNode.removeChild(oldInput);
    }


    document.body.appendChild(newInsertScript);
    document.documentElement.appendChild(newInput);

  } catch (err) {
    console.error('err', err);
  }
}

function isInsertScriptAndInputExist() {
  const oldInsertScript = document.querySelector('script[src*="insert.js"]');
  const oldInput = document.getElementById('api-mock-12138');
  return oldInsertScript && oldInput;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "refreshTab" && isInsertScriptAndInputExist()) {
    chrome.tabs.query({}, async function (tabs) {
      const targetUrl = new Url(request.data.pathUrl.pathUrl)
      const matchingTabs = getMatchingTabs(tabs, targetUrl.origin);
      if (matchingTabs.length > 0) {
        const matchingTabId = matchingTabs[0].id;
        // 插入js之后会报错，暂时注释掉
        await chrome.scripting.executeScript({
          target: {tabId: matchingTabId}, function: injectScriptToPage
        });
        // 刷新页面注入拦截脚本
        // await chrome.tabs.reload(matchingTabId);
      } else {
        console.log("No matching tab found.");
      }
    });
  }
});

// 获取匹配特定地址的选项卡信息
function getMatchingTabs(tabs, url) {
  const matchingTabs = [];
  for (const tab of tabs) {
    if (tab.url.startsWith(url)) {
      matchingTabs.push(tab);
    }
  }
  return matchingTabs;
}


// 点击 icon 事件
chrome.action.onClicked.addListener(() => {
  if (ftdWindow && ftdWindow.id) {
    console.log('The window exists!')
    const info = {
      focused: true,
    }
    chrome.windows.update(ftdWindow.id, info, (w) => {
      if (!w) {
        ftdWindow = null
      }
    })
  } else {
    chrome.storage.local.get(['windowSize'], function (result) {
      let width = 800
      let height = 600
      /// 从storage中获取窗口大小

      if (result.windowSize) {
        width = parseInt(result.windowSize.width)
        height = parseInt(result.windowSize.height)
      }
      const left = parseInt((screenWith - width) / 2)
      const top = parseInt((screenHeight - height) / 2)

      chrome.windows.create({
        url: chrome.runtime.getURL('index.html'), type: 'popup', left, top, width, height,
      }, function (window) {
        ftdWindow = window
      })
    })
  }


});


