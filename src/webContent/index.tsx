import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom'
import Url from "url-parse";
import { useLogStore } from './store/useLogStore';
import { globalRouters } from './router';
import { useLocalStore } from './store/useLocalStore';

export const WebContent: React.FC = () => {
    const { addApiLogList } = useLogStore() as any
    const { currentProject } = useLocalStore() as any
    const isMockText = (isMock: boolean) => {
        if (isMock) {
            return 'Mock'
        } else {
            return '穿透'
        }
    }

    useEffect(() => {
        (async () => {
            try {
                chrome.runtime.onMessage.addListener(async (event) => {
                    if (!currentProject) {
                        return
                    }
                    if (event.type === "ajaxInterceptor") {
                        const data = event.data;
                        const targetUrl = new Url(data.request.url)
                        const result = {
                            pathRule: targetUrl.pathname,
                            status: data.response.status,
                            mock: isMockText(data.isMock),
                            type: data.request.type,
                            method: data.request.method,
                            Response: data.response.responseTxt,
                            origin: targetUrl.origin,
                            switchOn: data.switchOn ?? true,
                            requestHeaders: data.request.headers,
                            responseHeaders: data.response.headers,
                        }
                        addApiLogList(result);
                    }
                })
            } catch (error) {
            }

        })();
    }, [])
    return <RouterProvider router={globalRouters} />
}

