/*global chrome*/

chrome.action.onClicked.addListener(() => {
  try {
    // 查询所有标签页，检查是否已经存在打开的 index.html
    chrome.tabs.query({ url: chrome.runtime.getURL('index.html') }, (tabs) => {
      if (tabs.length > 0) {
        // 如果已经存在打开的 index.html，激活该标签页
        const tabId = tabs[0].id;
        if (tabId !== undefined) {
          chrome.tabs.update(tabId, { active: true }, () => {});
        }
      } else {
        // 如果不存在打开的 index.html，创建新标签页加载它
        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
      }
    });
  } catch (error) {
    // 处理错误
    // console.error(error);
  }
});
