// @ts-nocheck

import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Button, message, Table, Tag, Space, Popconfirm, Tabs, Tooltip, Switch, notification } from 'antd';
import { PlusOutlined, EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import Url from "url-parse";
import './saveApi.scss'

import { Methods, checkAndInjectScript, getOrCreateLocalStorageValues, readLocalStorage, removeInjectScript, saveStorage } from '../../utils';
import { ProjectDetailModal } from './detailModal/index';
import { Detail } from '../../components/detail';
import { useDomainStore } from '../../store';
import { ProjectList } from '../ApiLog';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../../const';
type RecordType = {
  name: string;
  code: string;
  switchOn: boolean;
  delay: string;
  method: Methods;
  pathRule: string;
  Response: any;
}

type ItemsType = {
  key: string;
  label: string;
  children: any;
}[]
export const SaveApi = forwardRef((props, ref) => {

  const ruleSwitchChange = async (record) => {
    record = {
      ...record,
      switchOn: !record.switchOn
    }
    setItems((prevApiList) => {
      const newlist = prevApiList.map(item => {
        return {
          ...item,
          children: <Table
            columns={columns}
            size='small'
            dataSource={item.children.props.dataSource.map(item => {
              if (item.pathRule === record.pathRule) {
                return {
                  ...item,
                  switchOn: !item.switchOn
                }
              } else {
                return item
              }
            })}
          />,
        }
      })
      return newlist
    })
    let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
    const defaultActiveKey = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
    saveStorage(AJAX_INTERCEPTOR_PROJECTS, projectList.map(item => {
      if (item.pathUrl === defaultActiveKey) {
        return {
          ...item,
          rules: item.rules.map(item => {
            if (item.pathRule === record.pathRule) {

              return record
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
  const columns = [
    {
      title: 'SwitchOn',
      dataIndex: 'switchOn',
      key: 'switchOn',
      width: 90,
      render: (switchOn: boolean, record) => {
        return (
          <Switch
            checked={switchOn}
            size='small'
            onChange={() => ruleSwitchChange(record)}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
        )
      },
    },
    {
      title: 'Method',
      key: 'method',
      dataIndex: 'method',
      width: 80,
      render: (method: Methods) => {
        let color = 'geekblue';
        return (
          <Tag color={color} key={method}>
            {method.toUpperCase()}
          </Tag>
        )
      },
    },
    {
      title: 'URL',
      dataIndex: 'pathUrl',
      key: 'pathUrl',
      ellipsis: {
        showTitle: false,
      },
      render: (pathUrl, record) => (
        <Tooltip placement="topLeft"
          title={
            record.comments ? (
              <>
                pathRule: {record.pathRule} <br /><br />
                comments: {record.comments}
              </>
            ) : (
              `pathRule: ${record.pathRule}`
            )
          }
        >
          {record.pathRule}
        </Tooltip>

      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 60,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_: any, record: RecordType) => (
        <Space size="small">
          <Tooltip placement="bottom" title={'Double click to delete'}>
            <DeleteOutlined style={{ color: '#f7cbca' }} onClick={(e) => handleDelete(e, record)} />
          </Tooltip>
          <CopyOutlined style={{ color: '#abe7f0' }} onClick={() => handleCopy(record)} />
          <EditOutlined style={{ color: '#b0d7fb' }} onClick={() => handleEdit(record)} />
        </Space>
      ),
    },
  ];
  const { setApiLogList } = useDomainStore() as any
  const [defaultChecked, setDefaultChecked] = useState(true)

  const [apiDetailData, setApiDetailData] = useState({});
  const [items, setItems] = useState<ItemsType>([])
  const [defaultActiveKey, setDefaultActiveKey] = useState('');
  const [projectDetailVisible, setProjectDetailVisible] = useState(false);
  const [apiDetailVisible, setApiDetailVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [api, contextHolderNo] = notification.useNotification();

  const [projectMode, setProjectMode] = useState('add');
  const [apiDetailMode, setApiDetailMode] = useState('add');
  const [projectFormData, setProjectFormData] = useState({})
  const [previousActiveKey, setPreviousActiveKey] = useState(''); // 用于存储上一个 activeKey 的状态变量
  const openNotificationWithIcon = (type: NotificationType, currentHost) => {
    api[type]({
      message: 'Switching Successful',
      description:
        `current intercept address is: ${currentHost}`,
    });
  };
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
          method: 'POST',
          pathRule: '/api/test',
          Response: {
            code: 200,
            data: {},
            message: 'success'
          },
        }],
        projectName: 'Default Project',
        switchOn: true
      }],
      // mockPluginSwitchOn: true,
    }, function (values) {
      const checked = values[AJAX_INTERCEPTOR_PROJECTS].find(item => item.pathUrl === values[AJAX_INTERCEPTOR_CURRENT_PROJECT])?.switchOn
      setDefaultChecked(checked)
      if (checked) {
        chrome.action.setIcon({ path: '/images/app.png' });
      } else {
        chrome.action.setIcon({ path: '/images/gray.png' });
      }
      setItems(values[AJAX_INTERCEPTOR_PROJECTS].map((item: any) => {
        return {
          key: item.pathUrl,
          label: item.projectName,
          children: <Table
            columns={columns}
            size='small'
            dataSource={item.rules} />,
        }
      }))
      setDefaultActiveKey(() => values[AJAX_INTERCEPTOR_CURRENT_PROJECT])
      setPreviousActiveKey(() => values[AJAX_INTERCEPTOR_CURRENT_PROJECT])

    })
  }, [])
  useEffect(() => {
    setApiLogList([])
  }, defaultActiveKey)
  const globalSwitchChange = async (checked: boolean) => {
    setDefaultChecked(checked => !checked)
    let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
    await saveStorage(AJAX_INTERCEPTOR_PROJECTS, projectList.map(item => {
      if (item.pathUrl === defaultActiveKey) {

        return {
          ...item,
          switchOn: checked
        }
      } else {
        return item
      }
    })
    )
    if (checked) {
      chrome.action.setIcon({ path: '/images/app.png' });
    } else {
      chrome.action.setIcon({ path: '/images/gray.png' });
    }
  }
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, record: RecordType) => {
    if (e.detail < 2) {
      return;
    }
    readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT).then(value => {
      _handleDelete(record, value)
    })

  };
  const remove = async (targetKey: string) => {
    const projectList: ProjectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS) as ProjectList;
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
    setDefaultChecked(newProjectList.find(item => item.pathUrl === newActiveKey)?.switchOn)
  };
  const onEdit = (targetKey: string) => {
    setApiLogList([])
    remove(targetKey);
  }
  const getMatchingTabs = (tabs: any, url: string) => {
    const matchingTabs = [];
    for (const tab of tabs) {
      if (tab.url.startsWith(url)) {
        matchingTabs.push(tab);
      }
    }
    return matchingTabs;
  }



  const handleChangeProject = async (activeKey: string) => {
    setApiLogList([])
    setDefaultActiveKey(activeKey)
    saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, activeKey)
    chrome.tabs.query({}, function (tabs) {
      const targetUrl = new Url(activeKey)
      // 切换 tab 的时候注入
      const matchingTabs = getMatchingTabs(tabs, targetUrl.origin);
      if (matchingTabs.length > 0) {
        const matchingTabId = matchingTabs[0].id;
        if (matchingTabId) {
          chrome.scripting.executeScript({
            target: { tabId: matchingTabId },
            function: checkAndInjectScript
          });
        }
      }
      // 旧的 tab 取消注入
      const previousMatchingTabs = getMatchingTabs(tabs, new Url(previousActiveKey).origin);
      if (previousMatchingTabs.length > 0) {
        const previousMatchingTabId = previousMatchingTabs[0].id;
        if (previousMatchingTabId) {
          chrome.scripting.executeScript({
            target: { tabId: previousMatchingTabId },
            function: removeInjectScript
          });
        }
      }
    })
    setPreviousActiveKey(activeKey);
    const projectList: ProjectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS) as ProjectList;
    const switchOn = projectList.find(item => item.pathUrl === activeKey)?.switchOn
    setDefaultChecked(switchOn)
    openNotificationWithIcon('success', activeKey)
  }
  const _handleDelete = (record, key) => {
    setItems((prevApiList) => {
      const newlist = prevApiList.map(item => {
        if (item.key === key) {
          return {
            ...item,
            children: <Table

              size='small'
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
  const handleCopy = (record) => {
    setApiDetailData(() => record)
    setApiDetailMode('add')
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
      Response: {}
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

                size='small'
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

                size='small'
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
              projectName: formData.name,
              switchOn: item.switchOn
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

            size='small'
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
          projectName: formData.name,
          switchOn: true
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
          size='small'

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
      {contextHolderNo}
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
        <Detail
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
            color: '#e3e3e3'
          }}>
            {defaultActiveKey}
          </span>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
          >
            <Switch
              checked={defaultChecked}
              onChange={globalSwitchChange}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
            <Button onClick={handleAddProject} icon={<PlusOutlined />}  >
              Add Address
            </Button>
            <Button onClick={handleEditProject} icon={<EditOutlined />}  >
              Edit Address
            </Button>
            <Button onClick={handleAddRule} icon={<PlusOutlined />}>
              Add Rule
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
