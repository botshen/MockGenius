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
        const data = {
            url: event.detail.config.url,
        }
        if (chrome.runtime?.id) {
            chrome.runtime.sendMessage({
                type: "ajaxInterceptor",
                message: "content_to_background",
                data,
            })
        }
    },
    false
)
