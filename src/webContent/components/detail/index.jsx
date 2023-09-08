import { useEffect, useState } from "react";
import { Button, Input, Form, Switch, InputNumber, Select, Drawer,Space } from 'antd';
import SvelteJSONEditor from '../json/index'

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
export default function Detail({ onCancel, onSubmit, data }) {
  const [readOnly, setReadOnly] = useState(false);
  const [content, setContent] = useState({
    json: {
      // greeting: "Hello World",
      // color: "#ff3e00",
      // ok: true,
      // values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    },
    text: undefined
  });
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');
  const showDrawer = () => {
      setOpen(true);
  };
  const onChange = (e) => {
      setPlacement(e.target.value);
  };
  const onClose = () => {
      setOpen(false);
  };
 
  useEffect(() => {
    if (data && data.Response) {
      setContent({
        json: data.Response,
        text: undefined
      })
    }

  }, [])
  const onFinish = (formData) => {
    const form = {
      ...formData,
      Response: content.text ? JSON.parse(content.text) : content.json
    }
    onSubmit(form)
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <Drawer
      title="Drawer with extra actions"
      placement={placement}
      width={800}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onClose}>
            OK
          </Button>
        </Space>
      }
    >
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
          initialValues={{
            code: data?.code ?? '200',
            switchOn: data?.switchOn ?? true,
            delay: data?.delay ?? '0',
            method: data?.method ?? 'get',
            pathRule: data?.pathRule ?? '',
            name: data?.name ?? data?.pathRule,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

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
            name="method"
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
          >
            <InputNumber addonAfter="ms" />

          </Form.Item>


          <Form.Item
            label="code"
            name="code"
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
          <Form.Item
            {...tailLayout}
          >
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              Submit
            </Button>
            <Button onClick={onCancel} type="primary">
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Drawer>

  );
}
