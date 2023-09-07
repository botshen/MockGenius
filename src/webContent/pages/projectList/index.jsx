import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Button, message } from 'antd';
import imgLogo from './logo.png'
import './ProjectList.scss'
import DetailModal from './detailModal';
import { saveStorage } from '../../utils';
import { useDomainStore } from '../../store';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';


export const ProjectList = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();

  const { setDomain, setCurrentProject, domain } = useDomainStore()
  const [detailModalVisible, setdetailModalVisible] = useState(false)
  const [projectFormData, setProjectFormData] = useState({})
  const [apiList, setApiList] = useState([])
  const [detailModalMode, setDetailModalMode] = useState('add')
  useEffect(() => {
    chrome.storage.local.get(
      [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT],
      result => {
        setApiList(result[AJAX_INTERCEPTOR_PROJECTS])
        setDomain(result[AJAX_INTERCEPTOR_CURRENT_PROJECT])
      }
    )

  }, [])

  const onLogin = async (item) => {
    setDomain(item.pathUrl)
    await saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, item.pathUrl)
    setCurrentProject(item)
    navigate('/projectDetail')
  }
  const onClose = () => {
    setdetailModalVisible(false)
    setProjectFormData({})
  }
  const DetailModalClose = async (formData) => {
    console.log('formData', formData)
    if (detailModalMode === 'edit') {
      if (apiList.some(item => item.pathUrl === formData.pathUrl && item.pathUrl !== projectFormData.pathUrl)) {
        messageApi.error('pathRule重复');
        return
      } else {
        const newApiList = [...apiList]
        const editIndex = newApiList.findIndex(item => item.pathUrl === formData.pathUrl)
        newApiList.splice(editIndex, 1, formData)
        setApiList(newApiList)
        setdetailModalVisible(false)
        return
      }
    } else if (detailModalMode === 'add') {
      console.log('apiList', apiList)
      console.log('formData', formData)
      if (apiList.some(item => item.pathUrl === formData.pathUrl)) {
        messageApi.error('pathRule重复');
        return
      } else {
        const result = {
          ...formData,
          switchOn: true,
        }
        setProjectFormData({})
        setApiList((prevApiList) => [...prevApiList, result]);
        setdetailModalVisible(false)
      }

    }

  }
  useEffect(() => {
    (async () => {
      await saveStorage(AJAX_INTERCEPTOR_PROJECTS, apiList);
    })();
  }, [apiList]);
  const handleDelete = (index) => {
    return async () => {
      const deleteName = apiList.find((item, i) => i === index)
      const newApiList = [...apiList]
      newApiList.splice(index, 1)
      setApiList(newApiList)
      await saveStorage(AJAX_INTERCEPTOR_PROJECTS, newApiList)
      if (newApiList && newApiList.length === 0) {
        await saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, null)
        setDomain('')
      }
    }
  }
  const handleEdit = (item) => {
    setProjectFormData(item)
    setDetailModalMode('edit')
    setdetailModalVisible(true)
  }
  return (
    <>
      {contextHolder}
      {
        detailModalVisible &&
        <DetailModal
          mode={detailModalMode}
          formData={projectFormData}
          onClose={onClose}
          saveProject={DetailModalClose} />
      }
      <div className="login-wrapper">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>currentUrl: {domain}</span>
          <img onClick={() => {
            setDetailModalMode('add')
            setProjectFormData({})

            setdetailModalVisible(true)
          }} src={imgLogo} alt="" className="logo" />

        </div>
        <List
          itemLayout="horizontal"
          dataSource={apiList}
          renderItem={(item, index) => (
            <List.Item
              actions={
                [<Button type="text" onClick={() => {
                  handleEdit(item)
                }}>edit</Button>,
                <Button danger type="text" onClick={handleDelete(index)}>
                  delete
                </Button>
                ]}
            >
              <List.Item.Meta
                title={<span onClick={() => {
                  onLogin(item)
                }}>{item.name}</span>}
                description={item.pathRule}
              />
            </List.Item>
          )}
        />
      </div>
    </>

  )
}

