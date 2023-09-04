import { useNavigate } from 'react-router-dom'
import { Button, Tabs } from 'antd'
import './nav.scss'
import { useDomainStore } from '../../store'
 
function Nav(props) {
    const bears = useDomainStore((state) => state.domain)

    // 通过当前路由的location来匹配Tab的激活态
    const { location } = props

    // 路由跳转钩子
    const navigate = useNavigate()

    const items = [
        {
            key: '/saveApi',
            label: 'Save API',
        },
        {
            key: '/apiLog',
            label: 'API Log',
        },
    ]

    // Tab组件控制路由跳转
    const onTabChange = (key) => {
        navigate(key)
    }

    // 退出到Login页面
    const onExit = () => {
        navigate('/projectList')
    }

    return (
        <div className="M-nav">
            <span className='domain'>{bears}</span>
            <Tabs
                activeKey={location.pathname}
                items={items}
                onChange={onTabChange}
                centered
            />
            <Button className="btn-exit" type="primary" onClick={onExit}>
                Exit
            </Button>
        </div>
    )
}

export default Nav
