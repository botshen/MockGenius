/*global chrome*/

console.log('background running')
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
  chrome.storage.local.set({
    [AJAX_INTERCEPTOR_PROJECTS]: [defaultProjectProduct],
    [AJAX_INTERCEPTOR_CURRENT_PROJECT]: defaultProjectProduct.pathUrl,
    "mockPluginSwitchOn": true,
  }, function () {

  })
})

chrome.action.onClicked.addListener(() => {
  // 查询所有标签页，检查是否已经存在打开的 index.html
  chrome.tabs.query({ url: chrome.runtime.getURL('index.html') }, (tabs) => {
    if (tabs.length > 0) {
      // 如果已经存在打开的 index.html，激活该标签页
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      // 如果不存在打开的 index.html，创建新标签页加载它
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    }
  });
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === "toggle-extension") {
    // 在此处执行打开或关闭扩展的操作
    // 例如，可以使用 chrome.runtime.getURL 获取扩展界面的 URL，并打开一个新标签页
    // 查询所有标签页，检查是否已经存在打开的 index.html
    chrome.tabs.query({ url: chrome.runtime.getURL('index.html') }, (tabs) => {
      if (tabs.length > 0) {
        // 如果已经存在打开的 index.html，激活该标签页
        chrome.tabs.update(tabs[0].id, { active: true });
      } else {
        // 如果不存在打开的 index.html，创建新标签页加载它
        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
      }
    });
  }
});

