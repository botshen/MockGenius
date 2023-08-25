import React, { useState } from 'react';
import { Avatar, List, Button, Checkbox, Input, Form, Switch, InputNumber, Select } from 'antd';
import Detail from '../../components/detail';



const Account = () => {
    const datalist = [
        {
            title: '/dev-api/vue-admin-template/user/33',
        },
        {
            title: '/dev-api/vue-admin-template/user/inf222o',
        },
        {
            title: '/dev-api/vue-admin-template/user/info1111',
        },
        {
            title: '/dev-api/vue-admin-template/user/in444fo',
        },
    ];
    const [detail, setDetail] = useState(false);
    console.log('detail', detail)
    const handleTitleClick = () => {
        console.log('title clicked!');
        setDetail(true);
        console.log('detail', detail)
    }
    const setDetailFalse = () => {
        setDetail(false);
    }
    return (
        <>
            {
                detail ?
                    (<Detail onCancel={setDetailFalse} />)
                    :
                    (
                        <div>
                            <List className='account-wrapper'

                                dataSource={datalist}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                                            }
                                            title={<span onClick={handleTitleClick} >{item.title}</span>}
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
