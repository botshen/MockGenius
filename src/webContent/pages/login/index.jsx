import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Button } from 'antd';
import imgLogo from './logo.png'
import './login.scss'
import DetailModal from './detailModal';
import { saveStorage } from '../../utils';
const AJAX_INTERCEPTOR_PROJECTS = 'ajaxInterceptor_projects';
const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'ajaxInterceptor_current_project';

function Login() {
    // 路由跳转钩子
    const navigate = useNavigate()
    const [detailModalVisible, setdetailModalVisible] = useState(false)
    const [projectFormData, setProjectFormData] = useState({})
    const [apiList, setApiList] = useState([
        {
            name: '将军令',
            pathRule: 'localhost:3000',

        },
        {
            name: '河图',
            pathRule: 'localhost:8888',
        },
    ])
    useEffect(() => {
        chrome.storage.local.get(
            [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT],
            result => {
                // this.currentProject = result[AJAX_INTERCEPTOR_CURRENT_PROJECT]
                setApiList(result[AJAX_INTERCEPTOR_PROJECTS] || [])
            }
        )
    }, [])
    // 登录
    const onLogin = () => {
        navigate('/account')
    }
    const onClose = () => {
        setdetailModalVisible(false)
        setProjectFormData({})
    }
    const DetailModalClose = (formData) => {
        setProjectFormData({})
        console.log('formData', formData)
        const editProjectName = formData.name

        const index = apiList.findIndex(item => {
            return item.name === editProjectName
        })

        if (editProjectName) {
            const updatedApiList = [...apiList]; // 克隆当前状态数组
            updatedApiList[index] = { ...apiList[index], ...formData }; // 更新特定索引的元素
            setApiList(updatedApiList); // 设置新状态
            // if (editProjectName === this.currentProject) {
            //     this.changeActiveProject(formData.name)
            // }
        } else {
            setApiList([...apiList, formData])
            this.changeActiveProject(formData.name)
        }
        setApiList(apiList)
        // this.apiList = [...apiList]
        saveStorage(AJAX_INTERCEPTOR_PROJECTS, [...apiList])
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
                                title={<span onClick={onLogin} >{item.name}</span>}
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
