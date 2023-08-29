console.log('env:', import.meta.env.MODE)
const isProduction = import.meta.env.MODE === 'production'
const AJAX_INTERCEPTOR_PROJECTS = 'ajaxInterceptor_projects';
const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'ajaxInterceptor_current_project';

const keys = [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT]

const executeScript = (data) => {
    const code = JSON.stringify(data)
    const inputElem = document.getElementById(
        'api-mock-12138'
    )
    if (inputElem !== null) {
        inputElem.value = code
    }
}
// 让 storage 的数据实时反映到页面上
const setGlobalData = () => {
    chrome.storage.local.get(keys, (result) => {
        executeScript(result)
    })
}
const injectScriptToPage = () => {
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
        input.setAttribute('id', 'api-mock-12138')
        input.setAttribute('style', 'display:none')
        document.documentElement.appendChild(input)
    } catch (err) {
        console.error('err', err)
    }
}


isProduction && chrome.storage.local.get(keys, (result) => {
    const currentName = result[AJAX_INTERCEPTOR_CURRENT_PROJECT]
    console.log('currentName',currentName)
    const projectList = result[AJAX_INTERCEPTOR_PROJECTS] || []
    console.log('projectList', projectList)
    const { origin } = location
    console.log('origin', origin)
    const currentProject =
        projectList.find((item) => item.name === currentName) || ({})
    if (origin === currentProject.pathUrl) {
        console.log('121',121)
        injectScriptToPage()
        setGlobalData()
    }
})

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
