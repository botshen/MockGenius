import React, { useEffect, useState } from 'react';
import Detail from '../../components/detail';
import { Table, Tag, message, FloatButton } from 'antd';
import { MinusCircleFilled } from '@ant-design/icons';

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
  const { apiLogList, setApiLogList } = useDomainStore()
  const [messageApi, contextHolder] = message.useMessage();
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
      // 不是一个项目的请求不展示
      const currentLog = apiLogList.filter(item => {
        return item.origin === currentProject
      })
      setApiLogList(currentLog)
    })();
  }, []
  )
  const handleClearLog = () => {
    setApiLogList([])
  }
  const setDetailFalse = () => {
    setdetailVisible(false);
  }
  const handleDetailSubmit = async (formData) => {
    let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
    let currentProjectUrl = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
    console.log('currentProjectUrl', currentProjectUrl)
    console.log('projectList', projectList)
    const currentProject = projectList.find(item => item.pathUrl === currentProjectUrl)

    console.log('currentProject', currentProject)
    let currentResult = []
    // 如果currentProject.rules里面没有pathUrl，就新增
    if (!currentProject.rules.find(item => item.pathRule === formData.pathRule)) {
      console.log('121',121)
      //currentResult等于新的数组，数据不可变
      currentResult = [formData, ...currentProject.rules]
    } else {
      console.log('1222221',12221)

      currentResult = currentProject.rules.map(item => {
        if (item.pathRule === formData.pathRule) {
          return {
            ...item,
            ...formData
          }
        } else {
          return item
        }
      })
    }

    console.log('currentResult', currentResult)
    const newProjectList = projectList.map(item => {
      if (item.pathUrl === currentProjectUrl) {
        return {
          ...item,
          rules: currentResult
        }
      } else {
        return item
      }
    })
    console.log('newProjectList', newProjectList)
    await chrome.storage.local.set({ [AJAX_INTERCEPTOR_PROJECTS]: newProjectList });
    setdetailVisible(false);
  }



  return (
    <>
      {/* <FloatButton onClick={handleClearLog} icon={<MinusCircleFilled />} type="default" /> */}
      {contextHolder}
      {
        detailVisible ?
          (<Detail data={detailData} onSubmit={handleDetailSubmit} onCancel={setDetailFalse} />)
          :
          (
            <div className='log-wrapper'>
              <Table
                 rowClassName={(record, index) => {
                  if (index === 0) {
                    return 'even-row';
                  }
                }}
                pagination={false}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      setdetailData(record);
                      setdetailVisible(true);
                    },

                  };
                }}
                columns={columns}
                dataSource={apiLogList} />
            </div>

          )

      }
    </>
  );
};
