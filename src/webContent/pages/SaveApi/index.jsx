import React, { useEffect, useState } from 'react';
import { Button, message, Table, Tag, Space, Popconfirm, Tabs } from 'antd';
import Detail from '../../components/detail';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

import './saveApi.scss'
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';
import { saveStorage, readLocalStorage } from '../../utils';

export const SaveApi = ({ onAddRule }) => {
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
  const [items, setItems] = useState([])
  const [defaultActiveKey, setDefaultActiveKey] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
  //       let currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
  //       if (!projectList) {
  //         // 设置初始
  //         const defaultProjectProduct = {
  //           pathUrl: 'localhost:3000',
  //           rules: []
  //         }
  //         await saveStorage(AJAX_INTERCEPTOR_PROJECTS, [defaultProjectProduct])
  //         await saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, defaultProjectProduct.pathUrl)
  //       }
  //       console.log('projectList', projectList)
  //       setItems(projectList.map((item, index) => {
  //         return {
  //           key: item.pathUrl,
  //           label: item.pathUrl,
  //           children: <Table
  //             columns={columns}
  //             dataSource={item.rules} />,
  //         }
  //       }))
  //       setDefaultActiveKey(currentProject)
  //     } catch (error) {
  //       // Handle the exception here
  //       console.error('An error occurred:', error);
  //     }
  //   })();
  // }, []);
  useEffect(() => {
    chrome.storage.local.get([AJAX_INTERCEPTOR_PROJECTS]).then((result) => {
      console.log("Value currently is " + result);
    });

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
  const remove = (targetKey) => {
    let newActiveKey = defaultActiveKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setDefaultActiveKey(newActiveKey);
  };
  const onEdit = (targetKey) => {
    remove(targetKey);
  }
  const handleDelete = (record) => {
    const newDatalist = [...datalist]
    const deleteIndex = newDatalist.findIndex(item => item.pathRule === record.pathRule)
    newDatalist.splice(deleteIndex, 1)
    setDatalist(newDatalist)
    messageApi.success('删除成功');
  }
  const handleEdit = (record) => {
    console.log('recordyes', record)
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
    console.log('formData', formData)
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
  const handleAddRule = () => {
    // setdetailData({})
    // setDetailTrue()
    onAddRule({
      mode: 'add'
    })
  }
  // const items = [
  //   {
  //     key: '1',
  //     label: 'localhost:3000',
  //     children: <Table
  //       columns={columns}
  //       dataSource={datalist} />,
  //   },
  //   {
  //     key: '2',
  //     label: 'localhost:3001',
  //     children: <Table
  //       columns={columns}
  //       dataSource={datalist} />,
  //   },
  //   {
  //     key: '3',
  //     label: 'localhost:3002',
  //     children: <Table
  //       columns={columns}
  //       dataSource={datalist} />,
  //   },
  // ];
  return (
    <>
      {contextHolder}
      {
        detailVisible ?
          (<Detail data={detailData} onSubmit={DetailSubmit} onCancel={setDetailFalse} />) :
          <div className='home-wrapper'>
            <div className="saved-api">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '20px',
              }}
              >
                <Button type="primary" icon={<PlusOutlined />}  >
                  添加地址
                </Button>
                <Button type="primary" icon={<EditOutlined />}  >
                  编辑地址
                </Button>
                <Button type="primary" onClick={handleAddRule} icon={<PlusOutlined />}>
                  添加规则
                </Button>
              </div>

            </div>
            <Tabs
              defaultActiveKey={defaultActiveKey}
              type="editable-card"
              items={items}
              hideAdd
              onEdit={onEdit}
            />
          </div>
      }


    </>
  );
}

