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
    const navigate = useNavigate()
    const { setDomain, setCurrentProject, domain } = useDomainStore()
    const [detailModalVisible, setdetailModalVisible] = useState(false)
    const [projectFormData, setProjectFormData] = useState({})
    const [apiList, setApiList] = useState([
    ])
    useEffect(() => {
        chrome.storage.local.get(
            [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT],
            result => {
                console.log('result[AJAX_INTERCEPTOR_PROJECTS]', result[AJAX_INTERCEPTOR_PROJECTS])
                setApiList(result[AJAX_INTERCEPTOR_PROJECTS])
                setDomain(result[AJAX_INTERCEPTOR_CURRENT_PROJECT])
            }
        )
    }, [])
    // const getStorageItem = (key) => {
    //     return new Promise((resolve) => {
    //         chrome.storage.local.get(key, (result) => {
    //             resolve(result[key])
    //         })
    //     })
    // }

    // useEffect(() => {
    //     const setStrong = async () => {
    //         saveStorage(AJAX_INTERCEPTOR_PROJECTS, [...apiList])
    //         const curretnUrl = await getStorageItem(AJAX_INTERCEPTOR_CURRENT_PROJECT)
    //         console.log('curretnUrl', curretnUrl)
    //         console.log('apiList', apiList)
    //         if (apiList.length === 0) {
    //             console.log('1213', 1213)
    //             await saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, null)
    //         } else {
    //             await saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, curretnUrl)

    //         }
    //     }
    //     setStrong()

    // }, [apiList]);
    const onLogin = (item) => {
        setDomain(item.pathUrl)
        saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, item.name)
        setCurrentProject(item)

        navigate('/account')
    }
    const onClose = () => {
        setdetailModalVisible(false)
        setProjectFormData({})
    }
    const DetailModalClose = async (formData) => {
        setProjectFormData({})
        setApiList((prevApiList) => [...prevApiList, formData]);
        setdetailModalVisible(false)
    }
    useEffect(() => {
        saveStorage(AJAX_INTERCEPTOR_PROJECTS, apiList);
    }, [apiList]);
    const handleDelete = (index) => {
        return () => {
            // 获取index对应的name
            const deleteName = apiList.find((item, i) => i === index)
            console.log('deleteName.name', deleteName.name)
            const newApiList = [...apiList]
            newApiList.splice(index, 1)
            setApiList(newApiList)
            saveStorage(AJAX_INTERCEPTOR_PROJECTS, newApiList)

            if (newApiList.length === 0) {
                saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, null)
                setDomain('')
            }
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>url: {domain}</span>
                    <img onClick={() => { setdetailModalVisible(true) }} src={imgLogo} alt="" className="logo" />
                </div>
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
