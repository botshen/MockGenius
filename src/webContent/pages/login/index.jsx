import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Button } from 'antd';
import imgLogo from './logo.png'
import './login.scss'
import DetailModal from './detailModal';
import { saveStorage } from '../../utils';
import { useDomainStore } from '../../store';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';


function Login() {
    // 路由跳转钩子
    const navigate = useNavigate()
    const { setDomain } = useDomainStore()

    const [detailModalVisible, setdetailModalVisible] = useState(false)
    const [projectFormData, setProjectFormData] = useState({})
    const [apiList, setApiList] = useState([

    ])
    useEffect(() => {
        console.log('mounted')
        chrome.storage.local.get(
            [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT],
            result => {
                console.log('result', result)
                setApiList(result[AJAX_INTERCEPTOR_PROJECTS] || [])
            }
        )
    }, [])
    useEffect(() => {
        console.log('apiList has changed:', apiList);
        saveStorage(AJAX_INTERCEPTOR_PROJECTS, [...apiList])
    }, [apiList]);
    // 登录
    const onLogin = (item) => {
        setDomain(item.pathUrl)
        saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, item.name)
        navigate('/account')
    }
    const onClose = () => {
        setdetailModalVisible(false)
        setProjectFormData({})
    }
    const DetailModalClose = (formData) => {
        setProjectFormData({})
        console.log('formData', formData)
        setApiList(pre => [...pre, formData])
        setdetailModalVisible(false)
    }
    const handleDelete = (index) => {
        return () => {
            const newApiList = [...apiList]
            newApiList.splice(index, 1)
            setApiList(newApiList)
        }
    }
    const handleEdit = (item) => {
        console.log('item', item)
        setProjectFormData(item)
        console.log('projectFormData', projectFormData)
        setdetailModalVisible(true)
    }
    return (
        <>
            {
                detailModalVisible && <DetailModal formData={projectFormData} onClose={onClose} saveProject={DetailModalClose} />
            }
            <div className="login-wrapper">
                <img onClick={() => { setdetailModalVisible(true) }} src={imgLogo} alt="" className="logo" />
                <List
                    itemLayout="horizontal"
                    dataSource={apiList}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={
                                [<Button type="text" onClick={() => { handleEdit(item) }}>edit</Button>,
                                <Button danger type="text" onClick={handleDelete(index)} >
                                    delete
                                </Button>
                                ]}
                        >
                            <List.Item.Meta
                                title={<span onClick={() => { onLogin(item) }} >{item.name}</span>}
                                description={item.pathRule}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </>

    )
}

export default Login
