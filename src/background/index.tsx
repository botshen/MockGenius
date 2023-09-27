/*global chrome*/
// @ts-nocheck
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS, defaultProjectProduct } from "../const";

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({
    [AJAX_INTERCEPTOR_PROJECTS]: [defaultProjectProduct],
    [AJAX_INTERCEPTOR_CURRENT_PROJECT]: defaultProjectProduct.pathUrl,
  }, function () {
  })
})

chrome.action.onClicked.addListener(() => {
  try {
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
  } catch (error) {

  }
});

