import { createHashRouter, Navigate } from 'react-router-dom'
import { ApiLog } from '../pages/ApiLog'
import { SaveApi } from '../pages/SaveApi'
import { ProjectList } from '../pages/login'
import { Entry } from '../pages/entry'

// 全局路由
export const globalRouters = createHashRouter([
    {
        path: '/projectList',
        element: <ProjectList />,
    },
    {
        path: '/',
        element: (
            <Entry />
        ),
        children: [
            {
                path: '/saveApi',
                element: <SaveApi />,
            },
            {
                path: '/apiLog',
                element: <ApiLog />,
            },
            {
                path: '/',
                element: <Navigate to="/projectList" />,
            },
            {
                path: '*',
                element: <Navigate to="/projectList" />,
            },
        ],
    },
])
