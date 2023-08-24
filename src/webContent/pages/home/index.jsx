import { useEffect, useState } from 'react'
import './home.styl'

function Home() {
    const [xxx, setXxx] = useState('xxx')
    //  挂载的时候打印日志
    // useEffect(() => {
    //     console.log('home mount')

    //     chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //         console.log('request',request)
    //         try{
    //             if (request.message === "background_to_popup") {
    //                 console.log(request.data,12139)
    //                 setXxx(request.message)
    //             }
    //         }catch(err){
    //             console.warn('sddddddddddd')

    //         }
            
    //     });
    //     // 卸载的时候打印日志
    //     return () => {
    //         console.log('home unmount')
    //     }
    // }, [])
    return (
        <div className="P-home">
            <h1>{xxx}</h1>
        </div>
    )
}

export default Home
