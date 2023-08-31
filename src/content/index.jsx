console.log('env:', import.meta.env.MODE)
const isProduction = import.meta.env.MODE === 'production'
const AJAX_INTERCEPTOR_PROJECTS = 'ajaxInterceptor_projects';
const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'ajaxInterceptor_current_project';
const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
const INJECT_ELEMENT_ID = 'api-mock-12138'
const keys = [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT]

const executeScript = (data) => {
    const code = JSON.stringify(data)
    const inputElem = document.getElementById(
        INJECT_ELEMENT_ID
    )
    if (inputElem !== null) {
        inputElem.value = code
    }
}
const setGlobalData = () => {
    chrome.storage.local.get(keys, (result) => {
        executeScript(result)
    })
}
const injectScriptToPage = () => {
    try {
        const oldInsertScript = document.querySelector('script[src*="insert.js"]');
        const oldInput = document.getElementById(INJECT_ELEMENT_ID);
        if (oldInsertScript) {
            oldInsertScript.parentNode.removeChild(oldInsertScript);
        }

        if (oldInput) {
            oldInput.parentNode.removeChild(oldInput);
        }
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
        input.setAttribute('id', INJECT_ELEMENT_ID)
        input.setAttribute('style', 'display:none')
        document.documentElement.appendChild(input)
    } catch (err) {
        console.error('err', err)
    }
}


isProduction && chrome.storage.local.get(keys, (result) => {
    const currentName = result[AJAX_INTERCEPTOR_CURRENT_PROJECT]
    console.log('currentName', currentName)
    const projectList = result[AJAX_INTERCEPTOR_PROJECTS] || []
    console.log('projectList', projectList)
    const { origin } = location
    console.log('origin', origin)
    const currentProject =
        projectList.find((item) => item.name === currentName) || ({})
    if (origin === currentProject.pathUrl) {
        console.log('121', 121)
        injectScriptToPage()
        setGlobalData()
    }
})

window.addEventListener(
    CUSTOM_EVENT_NAME,
    (event) => {
        console.log('event',event)
        
        if (chrome.runtime?.id) {
            chrome.runtime.sendMessage({
                type: "ajaxInterceptor",
                message: "content_to_background",
                data: event.detail,
            })
        }
    },
    false
)
