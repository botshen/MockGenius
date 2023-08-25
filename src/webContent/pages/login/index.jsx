import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, List, Button } from 'antd';
import imgLogo from './logo.png'
import './login.scss'
import DetailModal from './detailModal';

function Login() {
    // 路由跳转钩子
    const navigate = useNavigate()
    const [detailModalVisible, setdetailModalVisible] = useState(false)
    const [apiList, setApiList] = useState([
        {
            title: 'http://127.0.0.1 ',
        },
        {
            title: 'http://192.168.0.1 ',
        },
        {
            title: 'http://127.0.0.1 ',
        },
        {
            title: 'http://192.168.0.1 ',
        },
        {
            title: 'http://127.0.0.1 ',
        },
        {
            title: 'http://192.168.0.1 ',
        }

    ])

    // 登录
    const onLogin = () => {
        navigate('/account')
    }
    const DetailModalClose = () => {
        setdetailModalVisible(false)
    }
    const handleDelete = (index) => {
        // 移除 apiList 的指定一项
        return () => {
            const newApiList = [...apiList]
            newApiList.splice(index, 1)
            setApiList(newApiList)
        }
    }
    return (
        <>
            {
                detailModalVisible && <DetailModal onClose={DetailModalClose} />
            }
            <div className="login-wrapper">
                <img onClick={() => { setdetailModalVisible(true) }} src={imgLogo} alt="" className="logo" />
                <List
                    itemLayout="horizontal"
                    dataSource={apiList}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={
                                [<Button type="text" onClick={() => { setdetailModalVisible(true) }}>edit</Button>,
                                <Button danger type="text" onClick={handleDelete(index)} >
                                    delete
                                </Button>
                                ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                                title={<span onClick={onLogin} >{item.title}</span>}
                                description="你好"
                            />
                        </List.Item>
                    )}
                />
            </div>
        </>

    )
}

export default Login
