import React, { useEffect, useState } from 'react';
import { Avatar, List, Button, Checkbox, Input, Form, Switch, InputNumber, Select } from 'antd';
import Detail from '../../components/detail';
import { apiReqs } from '../../../api';



const Account = () => {
    
    const [list, setList] = useState([]); // [result, ...this.list
    const [detail, setDetail] = useState(false);
    // useEffect(() => {
    //     chrome.runtime.onMessage.addListener(event => {
    //         console.log('event',event)
    //         try {
    //             if (event.type === 'ajaxInterceptor') {
    //                 const result = event.detail
    //                  setList([...list, result])
    //             }
    //         } catch (e) {
    //             console.warn('sddddddddddd', e, event)
    //         }
    //     })
    // }, []
    // )
    const handleTitleClick = () => {
        console.log('title clicked!');
        setDetail(true);
    }
    const setDetailFalse = () => {
        setDetail(false);
    }

    const test = () => {
        apiReqs.testMock();
    }
    return (
        <>
            {
                detail ?
                    (<Detail onCancel={setDetailFalse} />)
                    :
                    (
                        <div>
                            <Button type="primary" onClick={test}>Primary Button</Button>
                            <List className='account-wrapper'

                                dataSource={list}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            // avatar={
                                            //     <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                                            // }
                                            title={<span style={{ cursor: 'pointer' }} onClick={handleTitleClick} >{item.title}</span>}
                                            description="地址的中文描述"
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>

                    )

            }
        </>
    );
};
export default Account;
