import React, { useState } from 'react';
import { Avatar, List, Button, Checkbox, Input, Form, Switch, InputNumber, Select } from 'antd';
import Detail from '../../components/detail';
import imgLogo from '../login/logo.png'
import './home.scss'

const Home = () => {
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
    const data = {
        "name": "John",
        "age": 30,
        "city": "New York"
    };
    const [detail, setDetail] = useState(false);

    const handleTitleClick = () => {
        console.log('title clicked!');
        setDetail(true);
    }
    const setDetailFalse = () => {
        setDetail(false);
    }
    const setDetailTrue = () => {
        setDetail(true);
    }
    return (
        <>
            {
                detail ?
                    (<Detail onCancel={setDetailFalse} />) :
                    <div className='home-wrapper'>
                        <img onClick={() => { setDetailTrue(true) }} src={imgLogo} alt="" className="logo" />
                        <List className='account-wrapper'
                            pagination={{
                                position: 'bottom',
                                align: 'center',
                            }}
                            dataSource={datalist}
                            renderItem={(item, index) => (
                                <List.Item >
                                    <List.Item.Meta
                                        // avatar={
                                        //     <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                                        // }
                                        title={<span style={{ cursor: 'pointer' }} onClick={handleTitleClick} >{item.title}</span>}
                                        description="备注🙅🏻‍♀️"
                                    />
                                </List.Item>
                            )}
                        />
                    </div>


            }


        </>
    );
};
export default Home;
