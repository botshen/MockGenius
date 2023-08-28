import React, { useState } from 'react';
import { Avatar, List, Button, Checkbox, Input, Form, Switch, InputNumber, Select } from 'antd';
import Detail from '../../components/detail';
import { apiReqs } from '../../../api';



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
