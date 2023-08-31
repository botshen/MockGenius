import React, { useEffect, useState } from 'react';
import Detail from '../../components/detail';
import { Table, Tag } from 'antd';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';
import { useDomainStore } from '../../store';


const Account = () => {
    const columns = [
        {
            title: 'Path',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Mock',
            dataIndex: 'mock',
            key: 'mock',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Method',
            key: 'method',
            dataIndex: 'method',
            render: (method) => {
                let color = 'geekblue';
                return (
                    <Tag color={color} key={method}>
                        {method.toUpperCase()}
                    </Tag>
                )
            },


        }
    ];
    const { setCurrentProject, currentProject } = useDomainStore()

    const [list, setList] = useState(
        [
            // {
            //     path: '/api/users',
            //     status: 200,
            //     mock: '穿透',
            //     type: "xhr",
            //     method: 'get',
            // }

        ]);
    const [detailVisible, setdetailVisible] = useState(false);
    const [detailData, setdetailData] = useState({});
    useEffect(() => {
        chrome.storage.local.get(
            [AJAX_INTERCEPTOR_CURRENT_PROJECT],
            result => {
                console.log('currentProject', currentProject)
                chrome.runtime.sendMessage({ action: "refreshTab" });
            }
        )
        chrome.runtime.onMessage.addListener(event => {
            console.log('eventaccount', event)
            try {
                if (event.type === "ajaxInterceptor") {
                    const data = event.data;
                    const result = {
                        path: data.request.url,
                        status: data.response.status,
                        mock: '穿透',
                        type: data.request.type,
                        method: data.request.method,
                    }
                    setList(prevList => [result, ...prevList]);
 
                }
            } catch (e) { console.error('e', e) }
        })
    }, []
    )
    const handleTitleClick = (e) => {
        console.log('e', e)
        console.log('title clicked!');
        setdetailData({
            code: '2111100',
            switchOn: true,
            delay: 100,
            Method: 'get',
            pathRule: '/api',
            Response: '',
            name: 'api1'
        });
        setdetailVisible(true);
    }
    const setDetailFalse = () => {
        setdetailVisible(false);
    }
    return (
        <>
            {
                detailVisible ?
                    (<Detail data={detailData} onCancel={setDetailFalse} />)
                    :
                    (
                        <div>
                            <Table
                                size="small"
                                // pagination={{
                                //     position: ['none', 'none'],
                                // }}
                                onRow={(record) => {
                                    return {
                                        onClick: () => {
                                            console.log('record', record)
                                            setdetailData(record);
                                            setdetailVisible(true);
                                        },

                                    };
                                }}
                                columns={columns}
                                dataSource={list} />
                        </div>

                    )

            }
        </>
    );
};
export default Account;
