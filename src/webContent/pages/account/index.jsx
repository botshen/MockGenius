import React, {useEffect, useState} from 'react';
import Detail from '../../components/detail';
import {Table, Tag} from 'antd';
import {AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS} from '../../const';
import {useDomainStore} from '../../store';
import {readLocalStorage} from "../../utils/index.js";
import Url from "url-parse";


const Account = () => {
  const columns = [
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
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
  const {setCurrentProject, currentProject} = useDomainStore()

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


  function checkAndInjectScript() {
    // 检查页面中是否存在<script src="inject.js">
    console.log('检查页面中是否存');
    const scriptExists = document.querySelector('script[src*="insert.js"]');
    console.log(scriptExists);
    if (!scriptExists) {
      console.log('inject.js 不存在');
      const script = document.createElement('script')
      script.setAttribute('type', 'module')
      console.log(script);
      script.setAttribute('src', chrome.runtime.getURL('insert.js'))
      document.documentElement.appendChild(script)

      const input = document.createElement('input')
      input.setAttribute('id', 'api-mock-12138')
      input.setAttribute('style', 'display:none')
      document.documentElement.appendChild(input)
    }
  }

  useEffect(() => {
      (async () => {
        let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
        let currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
        // 第一次进来的时候设置一下当前 project 的 rules
        console.log(currentProject);
        chrome.tabs.query({}, function (tabs) {
          console.log('tabs', tabs);
          const targetUrl = new Url(currentProject)
          const matchingTabs = getMatchingTabs(tabs, targetUrl.origin);
          if (matchingTabs.length > 0) {
            const matchingTabId = matchingTabs[0].id;
            if (matchingTabId) {
              console.log('matchingTabId', matchingTabId)
              chrome.scripting.executeScript({
                target: {tabId: matchingTabId},
                function: checkAndInjectScript
              });
            }
          } else {
            console.log("No matching tab found.");
          }

        })
        // await chrome.runtime.sendMessage({action: "refreshTab", data: {pathUrl: currentProject}});
      })();
      // chrome.storage.local.get(
      //   [AJAX_INTERCEPTOR_CURRENT_PROJECT],
      //   result => {
      //     console.log('currentProject', currentProject)
      //     // chrome.tabs.sendMessage(currentProject, {action: "getAjaxInterceptor"}, function (response) {
      //     //   console.log('response', response)
      //     // }
      //     chrome.runtime.sendMessage({action: "refreshTab", data: {pathUrl: currentProject}});
      //   }
      // )
      // chrome.runtime.onMessage.addListener(event => {
      //   try {
      //     if (event.type === "ajaxInterceptor") {
      //       const data = event.data;
      //       const result = {
      //         path: data.request.url,
      //         status: data.response.status,
      //         mock: '穿透',
      //         type: data.request.type,
      //         method: data.request.method,
      //         response: JSON.parse(data.response.responseTxt)
      //       }
      //       setList(prevList => [result, ...prevList]);
      //
      //     }
      //   } catch (e) {
      //     console.error('e', e)
      //   }
      // })
    }, []
  )
  const handleTitleClick = (e) => {
    console.log('e', e)
    console.log('title clicked!');
    setdetailData({
      code: '2111100',
      switchOn: true,
      delay: 100,
      Method: 'get',
      pathRule: '/api',
      Response: '',
      name: 'api1'
    });
    setdetailVisible(true);
  }
  const setDetailFalse = () => {
    setdetailVisible(false);
  }
  const handleDetailSubmit = (formData) => {
    console.log('formData', formData)
    // setList(pre=>[formData,...pre])
    setdetailVisible(false);

  }
  return (
    <>
      {
        detailVisible ?
          (<Detail data={detailData} onSubmit={handleDetailSubmit} onCancel={setDetailFalse}/>)
          :
          (
            <div>
              <Table
                size="small"
                onRow={(record) => {
                  return {
                    onClick: () => {
                      console.log('record', record)
                      setdetailData(record);
                      setdetailVisible(true);
                    },

                  };
                }}
                columns={columns}
                dataSource={list}/>
            </div>

          )

      }
    </>
  );
};
export default Account;
