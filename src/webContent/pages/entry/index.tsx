import React, { Outlet, useLocation } from 'react-router-dom'
import './entry.scss'

export const Entry = () => {
    // 获取当前路由location

    return (
        <div className="M-entry">
            <div className="main-container">
                <Outlet />
            </div>
        </div>
    )
}

