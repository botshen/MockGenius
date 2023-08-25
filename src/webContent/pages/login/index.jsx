import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, List, Button } from 'antd';
import imgLogo from './logo.png'
import './login.scss'

function Login() {
    // 路由跳转钩子
    const navigate = useNavigate()

    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')

    // 登录
    const onLogin = () => {
        navigate('/account')

    }
    const data = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ];
    return (
        <div className="login-wrapper">
            <img src={imgLogo} alt="" className="logo" />
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item
                        actions={
                            [<Button type="text">edit</Button>,
                            <Button danger type="text">
                                delete
                            </Button>
                            ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                            title={<span onClick={onLogin} >{item.title}</span>}
                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default Login
