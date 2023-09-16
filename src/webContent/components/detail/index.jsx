import { useEffect, useState } from "react";
import { Button, Input, Form, Switch, InputNumber, Select, Drawer, Space } from 'antd';
import SvelteJSONEditor from '../json/index'

export default function Detail({ onCancel, onSubmit, data, mode }) {
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
  const [open, setOpen] = useState(true);
  const [placement, setPlacement] = useState('right');
  const [form] = Form.useForm(); // 创建一个表单实例

  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    onCancel();
  };

  useEffect(() => {
    if (data) {
      if (data.Response === '') {
        setContent({
          json: "",
          text: undefined
        })
      } else {
        setContent({
          json: data.Response,
          text: undefined
        })
      }

    }

  }, [])
  const onFinish = () => {
    form
      .validateFields()
      .then(() => {
        const formValues = {
          ...form.getFieldsValue(),
          Response: content.text ? JSON.parse(content.text) : content.json
        };
        onSubmit(formValues, mode);
      })
      .catch((errorInfo) => {
        // 表单校验失败
        // console.error('Validation failed:', errorInfo);
      });

  };
  const onFinishFailed = (errorInfo) => {
  };
  const handleChange = (value) => {
  };
  return (
    <Drawer
      title={mode === 'add' ? '新增规则' : '编辑规则'}
      placement={placement}
      width={800}
      onClose={onClose}
      open={open}
      maskClosable={false}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onFinish}  >
            OK
          </Button>
        </Space>
      }
    >
      <div className='detail-wrapper'>
        <Form
          form={form}
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
            <Input disabled={mode === 'edit'} />
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
                  value: 'GET',
                  label: 'GET',
                },
                {
                  value: 'POST',
                  label: 'POST',
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
        </Form>
      </div>
    </Drawer>
  );
}
