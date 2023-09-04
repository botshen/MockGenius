import React, { useEffect, useState } from 'react';
import { Button, message, Table, Tag, Space } from 'antd';
import Detail from '../../components/detail';
import './saveApi.scss'
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';
import { saveStorage, readLocalStorage } from '../../utils';

export const SaveApi = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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


    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={(record) => handleEdit(record)}>Edit</a>
          <a onClick={(record) => handleDelete(record)}>Delete</a>
        </Space>
      ),
    },
  ];
  const [datalist, setDatalist] = useState([]);
  const [detailData, setdetailData] = useState({});

  const [detailVisible, setDetailVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    (async () => {
      console.log('mounted')
      let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
      let currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
      const arr = projectList.find(item => item.pathUrl === currentProject)?.rules
      console.log('arr', arr)
      if (arr.length) {
        setDatalist(arr)
      }
    })();
  }, [])

  useEffect(() => {
    (async () => {
      console.log('datalist update', datalist)

      let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
      let currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
      const data = projectList.map((item, index) => {
        if (item.pathUrl !== currentProject) {
          return item
        } else {
          return {
            ...item,
            rules: datalist
          }
        }
      })
      await saveStorage(AJAX_INTERCEPTOR_PROJECTS, data)
    })();
  }, [datalist]
  )
  const handleDelete = (record) => {
    console.log('record', record)
    messageApi.success('删除成功');
  }
  const handleEdit = (record) => {
    console.log('1111111', record)
    setdetailData(record);
    setDetailVisible(true);
  }
  const setDetailFalse = () => {
    console.log('222222')
    setDetailVisible(false);
  }
  const setDetailTrue = () => {
    console.log('333333')
    setDetailVisible(true);
  }
  const DetailSubmit = (formData) => {
    console.log('444444',)
    setDatalist([formData, ...datalist]); // 直接替换 datalist
    setDetailVisible(false);
  }
  return (
    <>
      {contextHolder}
      {
        detailVisible ?
          (<Detail data={detailData} onSubmit={DetailSubmit} onCancel={setDetailFalse} />) :
          <div className='home-wrapper'>
            <Button type="primary" onClick={() => {
              setDetailTrue()
            }}>添加规则</Button>
            <Table
              size="small"

              columns={columns}
              dataSource={datalist} />
          </div>
      }


    </>
  );
}

