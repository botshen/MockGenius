import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom'
import { globalRouters } from '@/webContent/router'
import Url from "url-parse";
import { useDomainStore } from './store';
import { readLocalStorage } from './utils';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT } from './const';


function WebContent() {
    const { addApiLogList } = useDomainStore()
    const isMockText = (isMock) => {
        if (isMock) {
            return 'Mock'
        } else {
            return '穿透'
        }
    }
    useEffect(() => {
        (async () => {
            try {
                let currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
                console.log('currentProject',currentProject)
                if (!currentProject) {
                    return
                }
                chrome.runtime.onMessage.addListener(event => {
                    console.log('event-WebContent', event)
                    const domainPath = event.data.request.url
                    const domainUrl = new Url(domainPath)
                    console.log('domainUrl', domainUrl)
                    if (domainUrl.origin === currentProject) {
                        if (event.type === "ajaxInterceptor") {
                            const data = event.data;
                            const targetUrl = new Url(data.request.url)
                            const result = {
                                pathRule: targetUrl.pathname,
                                status: data.response.status,
                                mock: isMockText(data.isMock),
                                type: data.request.type,
                                method: data.request.method,
                                Response: data.response.responseTxt
                            }
                            addApiLogList(result);
                        }
                    }



                })
            } catch (error) {
                console.log('error', error)
            }

        })();
    }, [])
    return <RouterProvider router={globalRouters} />
}

export default WebContent
