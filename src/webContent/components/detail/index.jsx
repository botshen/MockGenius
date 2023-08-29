import { useState } from "react";
import { Button, Input, Form, Switch, InputNumber, Select } from 'antd';
import SvelteJSONEditor from '../json/index'
 
const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
export default function Detail({ onCancel, data }) {


  const [readOnly, setReadOnly] = useState(false);
  const [content, setContent] = useState({
    json: {
      greeting: "Hello World",
      color: "#ff3e00",
      ok: true,
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9, 12, 13, 14, 15]
    },
    text:'11'
  });
  return (
    <div className='detail-wrapper'>
      <Form
        className='form-wrapper'
        name="basic"
        labelCol={{
          span: 3,
        }}
        wrapperCol={{
          span: 24,
        }}
        // style={{
        //   maxWidth: 600,
        // }}
        initialValues={{
          code: data.status,
          switchOn: true,
          delay: 100,
          Method: data.method,
          pathRule: data.path,
          // Response: JSON.stringify(data, null, 2),
          name: data.path

        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          wrapperCol={{
            offset: 1,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
            Submit
          </Button>
          <Button onClick={onCancel} type="primary" htmlType="submit">
            Cancel
          </Button>
        </Form.Item>
        <Form.Item
          label="name"
          name="name"
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
          label="switchOn"
          name="switchOn"
          valuePropName="checked"

        >
          <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
        </Form.Item>
        <Form.Item
          label="pathRule"
          name="pathRule"
          rules={[
            {
              required: true,
              message: 'Please input your pathRule!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Response"
          name="Response"

        >
          <SvelteJSONEditor
            content={content}
            readOnly={readOnly}
            onChange={setContent}
            mode="text"
          />
        </Form.Item>



        <Form.Item
          label="Method"
          name="Method"
          rules={[
            {
              required: true,
              message: 'Please input your Method!',
            },
          ]}
        >
          <Select
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={[
              {
                value: 'get',
                label: 'get',
              },
              {
                value: 'post',
                label: 'post',
              }
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Delay"
          name="delay"
        // rules={[
        //   {
        //     required: true,
        //     message: 'Please input your delay!',
        //   },
        // ]}
        >
          <InputNumber addonAfter="ms" />

        </Form.Item>


        <Form.Item
          label="code"
          name="code"
        // rules={[
        //   {
        //     required: true,
        //     message: 'Please input your code!',
        //   },
        // ]}
        >
          <Select
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={[
              {
                value: '200',
                label: '200',
              },
              {
                value: '404',
                label: '404',
              }
            ]}
          />
        </Form.Item>








      </Form>
    </div>
  );
}
