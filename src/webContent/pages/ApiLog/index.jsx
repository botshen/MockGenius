import React, { useEffect, useState } from 'react';
import Detail from '../../components/detail';
import { Table, Tag, message } from 'antd';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';
import { useDomainStore } from '../../store';
import { readLocalStorage, setGlobalData } from "../../utils/index.js";
import Url from "url-parse";
import './apiLog.scss'

export const ApiLog = () => {
  const columns = [
    {
      title: 'Path',
      dataIndex: 'pathRule',
      key: 'pathRule',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Mock',
      dataIndex: 'mock',
      key: 'mock',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Method',
      key: 'method',
      dataIndex: 'method',
      render: (method) => {
        let color = 'geekblue';
        return (
          <Tag color={color} key={method}>
            {method.toUpperCase()}
          </Tag>
        )
      },


    }
  ];
  const { setCurrentProject, currentProject } = useDomainStore()
  const [messageApi, contextHolder] = message.useMessage();

  const [list, setList] = useState([]);
  const [detailVisible, setdetailVisible] = useState(false);
  const [detailData, setdetailData] = useState({});

  function getMatchingTabs(tabs, url) {
    const matchingTabs = [];
    for (const tab of tabs) {
      if (tab.url.startsWith(url)) {
        matchingTabs.push(tab);
      }
    }
    return matchingTabs;
  }


  async function checkAndInjectScript() {
    const scriptExists = document.querySelector('script[src*="insert.js"]');
    if (!scriptExists) {
      const script = document.createElement('script')
      script.setAttribute('type', 'module')
      script.setAttribute('src', chrome.runtime.getURL('insert.js'))
      document.documentElement.appendChild(script)
      const input = document.createElement('input')
      input.setAttribute('id', 'api-mock-12138')
      input.setAttribute('style', 'display:none')
      document.documentElement.appendChild(input)
      await setGlobalData()
    }
  }

  const isMockText = (isMock) => {
    if (isMock) {
      return 'Mock'
    } else {
      return '穿透'
    }
  }
  useEffect(() => {
    (async () => {
      let currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
      chrome.tabs.query({}, function (tabs) {
        const targetUrl = new Url(currentProject)
        const matchingTabs = getMatchingTabs(tabs, targetUrl.origin);
        if (matchingTabs.length > 0) {
          const matchingTabId = matchingTabs[0].id;
          const scriptExists = document.querySelector('script[src*="insert.js"]');
          if (matchingTabId && !scriptExists) {
            chrome.scripting.executeScript({
              target: { tabId: matchingTabId },
              function: checkAndInjectScript
            });
          }
        }
      })
    })();

    chrome.runtime.onMessage.addListener(event => {
      try {
        console.log('event-apilog', event)
        if (event.type === "ajaxInterceptor") {
          const data = event.data;
          const result = {
            pathRule: data.request.url,
            status: data.response.status,
            mock: isMockText(data.isMock),
            type: data.request.type,
            method: data.request.method,
            Response: data.response.responseTxt
          }
          setList(prevList => [result, ...prevList]);
        }
      } catch (e) {
        console.error('e', e)
      }
    })
  }, []
  )

  const setDetailFalse = () => {
    setdetailVisible(false);
  }
  const handleDetailSubmit = async (formData) => {
    let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
    let currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
    const arr = projectList.find(item => item.pathUrl === currentProject)?.rules
    let isExist = false;
    arr.forEach((item, index) => {
      if (item.pathRule === formData.pathRule) {
        arr[index] = formData
        isExist = true;
      }
    })
    if (!isExist) {
      arr.unshift(formData)
    }
    await chrome.storage.local.set({ [AJAX_INTERCEPTOR_PROJECTS]: projectList });
    if (isExist) {
      messageApi.success('修改成功');
    } else {
      messageApi.success('新增成功');
    }
    setdetailVisible(false);
  }
  return (
    <>
      {contextHolder}
      {
        detailVisible ?
          (<Detail data={detailData} onSubmit={handleDetailSubmit} onCancel={setDetailFalse} />)
          :
          (
            <div>
              <Table
                size="small"
                onRow={(record) => {
                  return {
                    onClick: () => {
                      setdetailData(record);
                      setdetailVisible(true);
                    },

                  };
                }}
                columns={columns}
                dataSource={list} />
            </div>

          )

      }
    </>
  );
};
