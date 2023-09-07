import { createHashRouter, Navigate } from 'react-router-dom'
import { ApiLog } from '../pages/ApiLog'
import { SaveApi } from '../pages/SaveApi'
import { ProjectList } from '../pages/projectList'
import { Entry } from '../pages/entry'
import { ProjectDetail } from '../pages/ProjectDetail'

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
            // {
            //     path: '/saveApi',
            //     element: <SaveApi />,
            // },
            // {
            //     path: '/apiLog',
            //     element: <ApiLog />,
            // },
            {
                path: '/projectDetail',
                element: <ProjectDetail />,
            },
            {
                path: '/',
                element: <Navigate to="/ProjectDetail" />,
            },
            {
                path: '*',
                element: <Navigate to="/ProjectDetail" />,
            },
        ],
    },
])
