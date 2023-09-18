import { useNavigate } from 'react-router-dom'
import { Button, Tabs } from 'antd'
import './nav.scss'
import { useDomainStore } from '../../store'
import { useEffect } from 'react'

function Nav(props) {
    const { setDomain, domain } = useDomainStore()

    useEffect(() => {
        chrome.storage.local.get(['mockgenius_current_project'], (result) => {
            setDomain(result['mockgenius_current_project'])
        })
    })


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

    const onExit = () => {
        navigate('/projectList')
    }

    return (
        <div className="M-nav">
            <span className='domain'>{domain}</span>
            
            <Button className="btn-exit" type="primary" onClick={onExit}>
                Exit
            </Button>
        </div>
    )
}

export default Nav
