import React, { useState } from 'react';
import Detail from '../../components/detail';
import { Table, Tag, message } from 'antd';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';
import { useDomainStore } from '../../store';
import { readLocalStorage } from "../../utils/index.js";
import './apiLog.scss'

export const ApiLog = ({ apiLogSubmit }) => {
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
  const { apiLogList } = useDomainStore()
  const [messageApi, contextHolder] = message.useMessage();
  const [detailVisible, setdetailVisible] = useState(false);
  const [detailData, setdetailData] = useState({});



  const setDetailFalse = () => {
    setdetailVisible(false);
  }
  const handleDetailSubmit = async (formData) => {
    let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
    let currentProjectUrl = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
    const currentProject = projectList.find(item => item.pathUrl === currentProjectUrl)

    let currentResult = []
    // 如果currentProject.rules里面没有pathUrl，就新增
    if (!currentProject.rules.find(item => item.pathRule === formData.pathRule)) {
      //currentResult等于新的数组，数据不可变
      currentResult = [formData, ...currentProject.rules]
    } else {

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
    await chrome.storage.local.set({ [AJAX_INTERCEPTOR_PROJECTS]: newProjectList });
    apiLogSubmit(newProjectList)
    setdetailVisible(false);
  }

  return (
    <>
      {contextHolder}
      <div className='log-wrapper'>
        <div className="mock-page-title">拦截日志：</div>
        <Table
          onRow={(record) => {
            return {
              onClick: () => {
                setdetailData(record);
                setdetailVisible(true);
              },

            };
          }}
          columns={columns}
          dataSource={apiLogList}
        />
      </div>
      {
        detailVisible &&
        <Detail
          data={detailData}
          onSubmit={handleDetailSubmit}
          onCancel={setDetailFalse} />
      }
    </>
  );
};
