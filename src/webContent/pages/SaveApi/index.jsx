import React, { useEffect, useState } from 'react';
import { Button, message, Table, Tag, Space, Popconfirm, Tabs } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

import './saveApi.scss'
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';
import { getOrCreateLocalStorageValues, readLocalStorage, saveStorage } from '../../utils';
import DetailModal from './detailModal';

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
  const [items, setItems] = useState([])
  const [defaultActiveKey, setDefaultActiveKey] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [projectMode, setProjectMode] = useState('add');
  const [projectFormData, setProjectFormData] = useState({})

  useEffect(() => {
    getOrCreateLocalStorageValues({
      [AJAX_INTERCEPTOR_CURRENT_PROJECT]: 'http://localhost:3000',
      [AJAX_INTERCEPTOR_PROJECTS]: [{
        pathUrl: 'http://localhost:3000',
        rules: [],
        projectName: '默认项目'
      }]
    }, function (values) {
      console.log('获取或创建的值为:', values);

      setItems(values[AJAX_INTERCEPTOR_PROJECTS].map((item, index) => {
        return {
          key: item.pathUrl,
          label: item.projectName,
          children: <Table
            columns={columns}
            dataSource={item.rules} />,
        }
      }))
      setDefaultActiveKey(values[AJAX_INTERCEPTOR_CURRENT_PROJECT])

    })
  }, [])


  const remove = async (targetKey) => {
    const projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS)
    if (projectList.length === 1) return;
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
    saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, newActiveKey)
    const newProjectList = projectList.filter(item => item.pathUrl !== targetKey)
    saveStorage(AJAX_INTERCEPTOR_PROJECTS, newProjectList)
  };
  const onEdit = (targetKey) => {
    remove(targetKey);
  }
  const handleChangeProject = (activeKey) => {
    setDefaultActiveKey(activeKey)
    saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, activeKey)
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
  const handleAddProject = () => {
    setProjectMode('add')
    setDetailVisible(true)
  }
  const handleEditProject = () => {
    setProjectMode('edit')
    setDetailVisible(true)
  }
  const handleAddRule = () => {
    // setProjectMode('addRule')
    // setDetailVisible(true)
  }

  const saveProject = async (formData) => {
    console.log('formData', formData)
    if (projectMode === 'edit') {
      if (items.some(item => item.key === formData.pathUrl && item.key !== projectFormData.pathUrl)) {
        messageApi.error('pathRule重复');
        return
      } else {
        const newApiList = [...items]
        const editIndex = newApiList.findIndex(item => item.key === formData.pathUrl)
        newApiList.splice(editIndex, 1, formData)
        setItems(newApiList)
        setDetailVisible(false)
        return
      }
    } else if (projectMode === 'add') {
      console.log('items', items)
      console.log('formData', formData)
      if (items.some(item => item.key === formData.pathUrl)) {
        messageApi.error('pathRule重复');
        return
      } else {
        const result = {
          key: formData.pathUrl,
          label: formData.name,
          children: <Table
            columns={columns}
            dataSource={[]}
          />,
        }
        setProjectFormData({})
        setItems((prevApiList) => {
          const newlist = [...prevApiList, result]
          return newlist
        });
        setDetailVisible(false)
        setDefaultActiveKey(formData.pathUrl)
        saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, formData.pathUrl)
        const projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS)
        saveStorage(AJAX_INTERCEPTOR_PROJECTS, [...projectList, {
          pathUrl: formData.pathUrl,
          rules: [],
          projectName: formData.name
        }])
      }

    }

  }
  const onClose = () => {
    setDetailVisible(false)
  }
  return (
    <>
      {contextHolder}
      {
        detailVisible &&
        <DetailModal
          mode={projectMode}
          onClose={onClose}
          formData={projectFormData}
          saveProject={saveProject}
        />
      }
      <div className='home-wrapper'>
        <div className="saved-api">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
          }}
          >
            <Button onClick={handleAddProject} type="primary" icon={<PlusOutlined />}  >
              添加地址
            </Button>
            <Button onClick={handleEditProject} type="primary" icon={<EditOutlined />}  >
              编辑地址
            </Button>
            <Button onClick={handleAddRule} type="primary" icon={<PlusOutlined />}>
              添加规则
            </Button>
          </div>

        </div>
        <Tabs
          defaultActiveKey={defaultActiveKey}
          activeKey={defaultActiveKey}
          type="editable-card"
          items={items}
          hideAdd
          onEdit={onEdit}
          onChange={handleChangeProject}
        />
      </div>
    </>
  );
}

