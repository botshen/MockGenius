import React, { useState } from "react";
import { Button, Input, Form, Switch, InputNumber, Select, Drawer, Space, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Response } from "./Response";
import { Headers } from "./Headers";

type Props = {
  onCancel: () => void;
  onSubmit: (formValues: any, mode: string) => void;
  data: any;
  mode: string;
}
const { TextArea } = Input;

export const Detail: React.FC<Props> = ({ onCancel, onSubmit, data, mode }) => {
  const [content, setContent] = useState(data.Response)
  const [comments, setComments] = useState(data.comments)
  const [form] = Form.useForm();
  const [headersList, setHeadersList] = useState<[string, string][]>(data.responseHeaders && Object.entries(data.responseHeaders));

  const updateHeadersList = (headers: [string, string][]) => {
    setHeadersList(headers);
  }
  const updateResponseContent = (content: any) => {
    setContent(content);
  }
  const handleCommentsChange = (e: any) => {
    console.log('%c [ e.target.value ]-30', 'font-size:13px; background:pink; color:#bf2c9f;', e.target.value)
    setComments(() => e.target.value)
  }
  const [items] = useState<TabsProps['items']>([
    {
      label: 'Response Body',
      key: 'body',
      children:
        <Response jsonData={content} updateResponseContent={updateResponseContent} />
    },
    {
      label: 'Response Headers',
      key: 'headers',
      children:
        <Headers updateHeadersList={updateHeadersList} headersList={headersList} />,
    },
    {
      label: 'Comments',
      key: 'Comments',
      children:
        <TextArea rows={4} defaultValue={comments} onChange={(e) => handleCommentsChange(e)} />,
    }
  ]);

  const onClose = () => {
    onCancel();
  };

  const onFinish = () => {
    form
      .validateFields()
      .then(() => {
        const formValues = {
          ...form.getFieldsValue(),
          comments,
          Response: content.text ? JSON.parse(content.text) : content.json,
          responseHeaders: headersList && headersList.length && Object.fromEntries(headersList),
        };
        console.log('%c [ formValues ]-64', 'font-size:13px; background:pink; color:#bf2c9f;', formValues)
        onSubmit(formValues, mode);
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });

  };
  const onFinishFailed = (errorInfo: any) => {
  };
  const handleChange = (value: any) => {
  };
  const onChange = (key: string) => {
  };
  return (
    <Drawer
      title={mode === 'add' ? '新增规则' : '编辑规则'}
      placement={'right'}
      width={800}
      onClose={onClose}
      open={true}
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
            method: data?.method ?? 'POST',
            pathRule: data?.pathRule ?? '',
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="switchOn"
            name="switchOn"
            valuePropName="checked"

          >
            <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
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
                },
                {
                  value: '500',
                  label: '500',
                },
                {
                  value: '502',
                  label: '502',
                },
                {
                  value: '504',
                  label: '504',
                },
                {
                  value: '301',
                  label: '301',
                }
              ]}
            />
          </Form.Item>
          <Tabs
            onChange={onChange}
            size="small"
            items={items}
          />


        </Form>
      </div>
    </Drawer>
  );
}
