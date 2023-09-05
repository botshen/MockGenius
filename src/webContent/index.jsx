import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom'
import { globalRouters } from '@/webContent/router'
import Url from "url-parse";
import { useDomainStore } from './store';


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
         chrome.runtime.onMessage.addListener(event => {
            try {
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
            } catch (e) {
                console.error('e', e)
            }
        })
    }, [])
    return <RouterProvider router={globalRouters} />
}

export default WebContent
