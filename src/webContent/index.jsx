import { RouterProvider } from 'react-router-dom'
import { globalRouters } from '@/webContent/router'
 
function WebContent() {
    return <RouterProvider router={globalRouters} />
}

export default WebContent
