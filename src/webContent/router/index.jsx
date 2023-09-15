import { createHashRouter, Navigate } from 'react-router-dom'
import { Entry } from '../pages/entry'
import { ProjectDetail } from '../pages/ProjectDetail'

// 全局路由
export const globalRouters = createHashRouter([
    {
        path: '/',
        element: (
            <Entry />
        ),
        children: [
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
