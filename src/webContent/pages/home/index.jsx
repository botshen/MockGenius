import React, { useState } from 'react';
import { Avatar, List, Button, Checkbox, Input, Form, Switch, InputNumber, Select } from 'antd';
import Detail from '../../components/detail';

const Home = () => {
    const datalist = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
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
    return (
        <>
            {
                detail ?
                    (<Detail onCancel={setDetailFalse} />) :
                    <List className='account-wrapper'
                        pagination={{
                            position: 'bottom',
                            align: 'center',
                        }}
                        dataSource={datalist}
                        renderItem={(item, index) => (
                            <List.Item >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />
                                    }
                                    title={<span onClick={handleTitleClick} >{item.title}</span>}
                                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                            </List.Item>
                        )}
                    />
            }


        </>
    );
};
export default Home;
