import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import './nav.scss'
import { useDomainStore } from '../../store/useDomainStore'
import React, { useEffect } from 'react'
type Props = {
    location: any;

}
export const Nav: React.FC<Props> = (props) => {
    const { setDomain, domain } = useDomainStore() as any

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


