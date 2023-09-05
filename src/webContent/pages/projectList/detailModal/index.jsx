import React, {useEffect} from 'react';
import {Modal, Form, Input} from 'antd';


const DetailModal = ({onClose, saveProject, formData, mode}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    onClose()
  };
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
 
  return (
    <>
      <Modal
        title={mode === 'edit' ? '编辑项目' : '新增项目'}
        open={true}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              saveProject(values)
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={handleCancel}
        okButtonProps={{htmlType: 'submit', form: 'editForm'}}
      >
        <Form
          form={form}
          name="basic"
          // labelCol={{
          //   span: 8,
          // }}
          // wrapperCol={{
          //   span: 16,
          // }}
          // style={{
          //   maxWidth: 600,
          // }}
          initialValues={formData}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="项目名称"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="项目域名"
            name="pathUrl"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DetailModal;