import React, { useState } from 'react';
import { Avatar, List, Button, Checkbox, Input, Form, Switch, InputNumber, Select } from 'antd';
import Detail from '../../components/detail';



const Account = () => {
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
                                pagination={{
                                    position: 'bottom',
                                    align: 'center',
                                }}
                                dataSource={datalist}
                                renderItem={(item, index) => (
                                    <List.Item>
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
                        </div>

                    )

            }
        </>
    );
};
export default Account;
