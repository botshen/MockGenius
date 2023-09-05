import React, { useEffect, useState } from 'react';
import { Button, message, Table, Tag, Space, Popconfirm } from 'antd';
import Detail from '../../components/detail';
import './saveApi.scss'
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';
import { saveStorage, readLocalStorage } from '../../utils';

export const SaveApi = () => {
  const confirm = (record) => {
    handleDelete(record)
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'SwitchOn',
      dataIndex: 'switchOn',
      key: 'switchOn',
      render: (switchOn) => {
        let color = 'green';
        let closeColor = 'red';
        if (switchOn) {
          return (
            <Tag color={color} key={switchOn}>
              开启
            </Tag>
          )
        } else {
          return (
            <Tag color={closeColor} key={switchOn}>
              关闭
            </Tag>
          )
        }

      },
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
          <Button type="text" onClick={() => handleEdit(record)} >Edit</Button>
          <Popconfirm
            title="删除警告"
            description="你确定要删除吗?"
            onConfirm={() => confirm(record)}
            okText="是"
            cancelText="否"
          >
            <Button type="text" danger >Delete</Button>
          </Popconfirm>
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
      let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
      let currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
      const arr = projectList.find(item => item.pathUrl === currentProject)?.rules
      if (arr.length) {
        setDatalist(arr)
      }
    })();
  }, [])

  useEffect(() => {
    (async () => {
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
    const newDatalist = [...datalist]
    const deleteIndex = newDatalist.findIndex(item => item.pathRule === record.pathRule)
    newDatalist.splice(deleteIndex, 1)
    setDatalist(newDatalist)
    messageApi.success('删除成功');
  }
  const handleEdit = (record) => {
    console.log('recordyes',record)
    setdetailData(record);
    setDetailVisible(true);
  }
  const setDetailFalse = () => {
    setDetailVisible(false);
  }
  const setDetailTrue = () => {
    setDetailVisible(true);
  }
  const DetailSubmit = (formData) => {
    const pathRule = formData.pathRule
    if (datalist.some(item => item.pathRule === pathRule && item.pathRule !== detailData.pathRule)) {
      messageApi.error('pathRule重复');
      return
    }
    // 区分新增和修改
    if (detailData.pathRule) {
      const newDatalist = [...datalist]
      const updateIndex = newDatalist.
        findIndex(item => item.pathRule === detailData.pathRule)
      newDatalist.splice(updateIndex, 1, formData)
      setDatalist(newDatalist)
      messageApi.success('修改成功');

    } else {
      setDatalist([formData, ...datalist]);
      messageApi.success('新增成功');

    }
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
              setdetailData({})
              setDetailTrue()
            }}>
              添加规则
            </Button>
            <Table
              size="small"
              columns={columns}
              dataSource={datalist} />
          </div>
      }


    </>
  );
}

