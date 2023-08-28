import { RouterProvider } from 'react-router-dom'
import { globalRouters } from '@/webContent/router'
 
function Popup() {
    return <RouterProvider router={globalRouters} />
}

export default Popup
