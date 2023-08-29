import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './content.styl'
import MainModal from '@/content/components/mainModal'

function Content() {
    const [mainModalVisiable, setMainModalVisiable] = useState(false)
    return (
        <div className="CRX-content">
            <div
                className="content-entry"
                onClick={() => {
                    setMainModalVisiable(true)
                }}
            ></div>
            {mainModalVisiable ? (
                <MainModal
                    onClose={() => {
                        setMainModalVisiable(false)
                    }}
                />
            ) : null}
        </div>
    )
}

// // 创建id为CRX-container的div
// const app = document.createElement('div')
// app.id = 'CRX-container'
// // 将刚创建的div插入body最后
// document.body.appendChild(app)
// // 将ReactDOM插入刚创建的div
// const crxContainer = ReactDOM.createRoot(
//     document.getElementById('CRX-container')
// )
// crxContainer.render(<Content />)
console.log('env:', import.meta.env.MODE)

// 向目标页面驻入js
try {
    let insertScript = document.createElement('script')
    if (import.meta.env.MODE === 'development') {
        insertScript.setAttribute('type', 'module');
        insertScript.src = '../../public/insert.js'
    } else {
        insertScript.setAttribute('type', 'text/javascript')
        insertScript.src = window.chrome.runtime.getURL('insert.js')
    }
    document.body.appendChild(insertScript)

    const input = document.createElement('input')
    input.setAttribute('id', 'ajaxInterceptor')
    input.setAttribute('style', 'display:none')
    document.documentElement.appendChild(input)
} catch (err) {
    console.error('err', err)
}

window.addEventListener(
    'request',
    (event) => {
        console.log('content接受的request事件', event.detail)
        const data={
            url: event.detail.config.url,
        }
        chrome.runtime.sendMessage({
            type: "ajaxInterceptor",
            message: "content_to_background",
            data,
        })
    },
    false
)
