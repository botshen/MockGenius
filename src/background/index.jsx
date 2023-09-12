/*global chrome*/
import { readLocalStorage } from "../webContent/utils/index.js";

console.log('background running')
let ftdWindow = null
let ftdTab = null
let screenWith = null
let screenHeight = null
const AJAX_INTERCEPTOR_PROJECTS = 'ajaxInterceptor_projects';
const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'ajaxInterceptor_current_project';
const defaultProjectProduct = {
  projectName: 'vite-test',
  pathUrl: 'http://localhost:5173',
  switchOn: true,
  isRealRequest: false,
  isTerminalLogOpen: false,
  rules: []
}
// manifest.json的Permissions配置需添加declarativeContent权限
chrome.runtime.onInstalled.addListener(async function () {
  console.log('onInstalled')
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
    "mockPluginSwitchOn": true,
  }, function () {
    console.log('生产环境')
    chrome.storage.local.get([AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT], result => {
      console.log('chrome.storage.local', result)
    })
  })
})
chrome.windows.onRemoved.addListener(async (windowId) => {
  if (ftdWindow && ftdWindow.id === windowId) {
    await chrome.action.setBadgeText({ text: '' });
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


// 点击 icon 事件
// chrome.action.onClicked.addListener(() => {
//   if (ftdWindow && ftdWindow.id) {
//     console.log('The window exists!')
//     const info = {
//       focused: true,
//     }
//     chrome.windows.update(ftdWindow.id, info, (w) => {
//       if (!w) {
//         ftdWindow = null
//       }
//     })
//   } else {
//     chrome.storage.local.get(['windowSize'], function (result) {
//       let width = 800
//       let height = 600
//       /// 从storage中获取窗口大小

//       if (result.windowSize) {
//         width = parseInt(result.windowSize.width)
//         height = parseInt(result.windowSize.height)
//       }
//       const left = parseInt((screenWith - width) / 2)
//       const top = parseInt((screenHeight - height) / 2)

//       chrome.windows.create({
//         url: chrome.runtime.getURL('index.html'), type: 'popup', left, top, width, height,
//       }, function (window) {
//         ftdWindow = window
//       })
//     })
//   }


// });
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
      // let width = 800
      // let height = 600
      // /// 从storage中获取窗口大小

      // if (result.windowSize) {
      //   width = parseInt(result.windowSize.width)
      //   height = parseInt(result.windowSize.height)
      // }
      // const left = parseInt((screenWith - width) / 2)
      // const top = parseInt((screenHeight - height) / 2)

      // 创建一个新标签页面而不是窗口
      chrome.tabs.create({
        url: chrome.runtime.getURL('index.html'),
        active: true, // 设置标签页为活动状态
      }, function (tab) {
        // 在标签页创建后的回调函数
        ftdTab = tab;
      });
    })
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
})




