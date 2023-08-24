import React, { useState } from 'react';
import { Avatar, List, Button, Checkbox, Input, Form, Switch, InputNumber, Select } from 'antd';
import SvelteJSONEditor from '../../components/json';

const data = [
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
const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
const handleChange = (value) => {
    console.log(`selected ${value}`);
};

const Account = () => {
    const data = {
        "name": "John",
        "age": 30,
        "city": "New York"
    };
    const [detail, setDetail] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [content, setContent] = useState({
        json: {
            greeting: "Hello World",
            color: "#ff3e00",
            ok: true,
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        },
        text: undefined
    });
    const handleTitleClick = () => {
        console.log('title clicked!');
        setDetail(true);
    }
    return (
        <>
            {
                detail ?
                    <div className='detail-wrapper'>

                        <Form
                            className='form-wrapper'
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <SvelteJSONEditor
                                    content={content}
                                    readOnly={readOnly}
                                    onChange={setContent}
                                    mode="text"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Please input your password!',
                            //     },
                            // ]}
                            >
                                <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="Delay"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue="lucy"
                                    style={{
                                        width: 120,
                                    }}
                                    onChange={handleChange}
                                    options={[
                                        {
                                            value: 'jack',
                                            label: 'Jack',
                                        },
                                        {
                                            value: 'lucy',
                                            label: 'Lucy',
                                        },
                                        {
                                            value: 'Yiminghe',
                                            label: 'yiminghe',
                                        },
                                        {
                                            value: 'disabled',
                                            label: 'Disabled',
                                            disabled: true,
                                        },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Delay"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <InputNumber addonAfter="ms" defaultValue={100} />

                            </Form.Item>

                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <Form.Item
                                label="Delay"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue="lucy"
                                    style={{
                                        width: 120,
                                    }}
                                    onChange={handleChange}
                                    options={[
                                        {
                                            value: 'jack',
                                            label: 'Jack',
                                        },
                                        {
                                            value: 'lucy',
                                            label: 'Lucy',
                                        },
                                        {
                                            value: 'Yiminghe',
                                            label: 'yiminghe',
                                        },
                                        {
                                            value: 'disabled',
                                            label: 'Disabled',
                                            disabled: true,
                                        },
                                    ]}
                                />
                            </Form.Item>







                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div> :
                    <List className='account-wrapper'
                        pagination={{
                            position: 'bottom',
                            align: 'center',
                        }}
                        dataSource={data}
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
            }
        </>
    );
};
export default Account;
