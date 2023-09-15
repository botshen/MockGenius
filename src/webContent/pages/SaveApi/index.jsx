import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { Button, message, Table, Tag, Space, Popconfirm, Tabs } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

import './saveApi.scss'
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';
import { getOrCreateLocalStorageValues, readLocalStorage, saveStorage } from '../../utils';
import ProjectDetailModal from './detailModal';
import ApiDrawDetail from '../../components/detail';
import { useDomainStore } from '../../store';

export const SaveApi = forwardRef((props, ref) => {

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
            onConfirm={() => confirm(record, defaultActiveKey)}
            okText="是"
            cancelText="否"
          >
            <Button type="text" danger >Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const { setApiLogList } = useDomainStore()

  const [apiDetailData, setApiDetailData] = useState({});
  const [items, setItems] = useState([])
  const [defaultActiveKey, setDefaultActiveKey] = useState('');
  const [projectDetailVisible, setProjectDetailVisible] = useState(false);
  const [apiDetailVisible, setApiDetailVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [projectMode, setProjectMode] = useState('add');
  const [apiDetailMode, setApiDetailMode] = useState('add');
  const [projectFormData, setProjectFormData] = useState({})

  useEffect(() => {
    getOrCreateLocalStorageValues({
      [AJAX_INTERCEPTOR_CURRENT_PROJECT]: 'http://localhost:5173',
      [AJAX_INTERCEPTOR_PROJECTS]: [{
        pathUrl: 'http://localhost:5173',
        rules: [{
          name: 'test',
          code: '200',
          switchOn: true,
          delay: '0',
          method: 'get',
          pathRule: '/api/test',
          Response: {
            code: 200,
            data: {},
            message: 'success'
          },
        }],
        projectName: '默认项目',
        switchOn: true
      }]
    }, function (values) {
      console.log('获取或创建的值为:', values);
      console.log('values[AJAX_INTERCEPTOR_CURRENT_PROJECT]', values[AJAX_INTERCEPTOR_CURRENT_PROJECT])

      setItems(values[AJAX_INTERCEPTOR_PROJECTS].map((item, index) => {
        return {
          key: item.pathUrl,
          label: item.projectName,
          children: <Table
            columns={columns}
            dataSource={item.rules} />,
        }
      }))
      setDefaultActiveKey(() => values[AJAX_INTERCEPTOR_CURRENT_PROJECT])

    })
  }, [])

  const confirm = (record) => {
    readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT).then(value => {
      handleDelete(record, value)
    })

  };

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
    setApiLogList([])
    remove(targetKey);
  }
  const handleChangeProject = (activeKey) => {
    setApiLogList([])
    setDefaultActiveKey(activeKey)
    saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, activeKey)
  }
  const handleDelete = (record, key) => {
    setItems((prevApiList) => {
      const newlist = prevApiList.map(item => {
        if (item.key === key) {
          return {
            ...item,
            children: <Table
              columns={columns}
              dataSource={item.children.props.dataSource.filter(item => item.pathRule !== record.pathRule)}
            />,
          }
        } else {
          return item
        }
      })
      return newlist
    })
    readLocalStorage(AJAX_INTERCEPTOR_PROJECTS).then(projectList => {
      saveStorage(AJAX_INTERCEPTOR_PROJECTS, projectList.map(item => {
        if (item.pathUrl === key) {
          return {
            ...item,
            rules: item.rules.filter(item => item.pathRule !== record.pathRule)
          }
        } else {
          return item
        }
      })
      )
    })
    messageApi.success('删除成功');
  }
  const handleEdit = (record) => {
    setApiDetailData(() => record)
    setApiDetailMode('edit')
    setApiDetailVisible(true)

  }

  const handleAddProject = () => {
    setProjectMode('add')
    setProjectDetailVisible(true)
  }
  const handleEditProject = () => {
    setProjectMode('edit')
    const editProject = items.find(item => item.key === defaultActiveKey)
    setProjectFormData({
      name: editProject.label,
      pathUrl: editProject.key
    })
    setProjectDetailVisible(true)
  }
  const handleAddRule = () => {
    setApiDetailMode('add')
    setApiDetailData({
      Response:{}
    })
    setApiDetailVisible(true)
  }
  const onApiDrawDetailSubmit = async (formData, mode) => {
    if (mode === 'add') {
      const pathRule = formData.pathRule
      // 如果存在相同的pathRule，提示错误
      if (items.some(item => item.key === defaultActiveKey && item.children.props.dataSource.some(item => item.pathRule === pathRule))) {
        messageApi.error('pathRule重复');
        return
      }
      setItems((prevApiList) => {
        const newlist = prevApiList.map(item => {
          if (item.key === defaultActiveKey) {
            return {
              ...item,
              children: <Table
                columns={columns}
                dataSource={[formData, ...item.children.props.dataSource]}
              />,
            }
          } else {
            return item
          }
        })
        return newlist
      })
      let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
      saveStorage(AJAX_INTERCEPTOR_PROJECTS, projectList.map(item => {
        if (item.pathUrl === defaultActiveKey) {
          return {
            ...item,
            rules: [formData, ...item.rules]
          }
        } else {
          return item
        }
      })
      )
    } else if (mode === 'edit') {
      setItems((prevApiList) => {
        const newlist = prevApiList.map(item => {
          if (item.key === defaultActiveKey) {
            return {
              ...item,
              children: <Table
                columns={columns}
                dataSource={item.children.props.dataSource.map(item => {
                  if (item.pathRule === formData.pathRule) {
                    return formData
                  } else {
                    return item
                  }
                })}
              />,
            }
          } else {
            return item
          }
        })
        return newlist
      })
      let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
      saveStorage(AJAX_INTERCEPTOR_PROJECTS, projectList.map(item => {
        if (item.pathUrl === defaultActiveKey) {
          return {
            ...item,
            rules: item.rules.map(item => {
              if (item.pathRule === formData.pathRule) {
                return formData
              } else {
                return item
              }
            })
          }
        } else {
          return item
        }
      })
      )
    }

    setApiDetailVisible(false)
  }
  const onCancelDetail = () => {
    setApiDetailVisible(false)
  }
  const saveProject = async (formData) => {
    if (projectMode === 'edit') {
      if (items.some(item => item.key === formData.pathUrl && item.key !== projectFormData.pathUrl)) {
        messageApi.error('pathRule重复');
        return
      } else {
        const newItems = items.map(item => {
          if (item.key === projectFormData.pathUrl) {
            return {
              key: formData.pathUrl,
              label: formData.name,
              children: item.children
            }
          } else {
            return item
          }
        })
        setItems(newItems)
        setProjectDetailVisible(false)
        setDefaultActiveKey(formData.pathUrl)
        saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, formData.pathUrl)
        const projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS)
        const newProjectList = projectList.map(item => {
          if (item.pathUrl === projectFormData.pathUrl) {
            return {
              pathUrl: formData.pathUrl,
              rules: item.rules,
              projectName: formData.name
            }
          } else {
            return item
          }
        })
        saveStorage(AJAX_INTERCEPTOR_PROJECTS, newProjectList)
      }
    } else if (projectMode === 'add') {
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
        setProjectDetailVisible(false)
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
    setProjectFormData({})
    setProjectDetailVisible(false)
  }
  const setTabData = (projectList) => {
    setItems(projectList.map((item, index) => {
      return {
        key: item.pathUrl,
        label: item.projectName,
        children: <Table
          columns={columns}
          dataSource={item.rules} />,
      }
    }))
  }
  // 将方法暴露给外部，使父组件可以调用
  useImperativeHandle(ref, () => ({
    setTabData,
  }));
  return (
    <>
      {contextHolder}
      {
        projectDetailVisible &&
        <ProjectDetailModal
          mode={projectMode}
          onClose={onClose}
          formData={projectFormData}
          saveProject={saveProject}
        />
      }
      {
        apiDetailVisible &&
        <ApiDrawDetail
          onSubmit={onApiDrawDetailSubmit}
          onCancel={onCancelDetail}
          data={apiDetailData}
          mode={apiDetailMode}
        />
      }
      <div className='home-wrapper'>
        <div className="saved-api">
          <span style={{
            fontSize: '20px',
            fontWeight: 'bold',
          }}>
            {defaultActiveKey}
          </span>
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
)
