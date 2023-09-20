import React from 'react';
import { Modal, Form, Input } from 'antd';

type Props = {
  onClose: () => void;
  saveProject: (formValues: any) => void;
  formData: any;
  mode: string;
}
export const ProjectDetailModal: React.FC<Props> = ({ onClose, saveProject, formData, mode }) => {
  const [form] = Form.useForm();
  const originReg = /^(?=^.{3,255}$)(http(s)?:\/\/)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62}){0,}(:\d+)*$/
  const originPlaceholder = 'protocol://hostname[:port]'
  const handleCancel = () => {
    onClose()
  };
  const initialValues = () => {
    if (mode === 'edit') {
      return { ...formData }
    }
    return {
      name: '',
      pathUrl: 'http://localhost:'
    }
  }

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
            });
        }}
        onCancel={handleCancel}
        okButtonProps={{ htmlType: 'submit', form: 'editForm' }}
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
          // initialValues={{ ...formData, pathUrl: 'http://localhost:3000' }}
          initialValues={initialValues()}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="项目名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入项目名称!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="项目域名"
            name="pathUrl"
            rules={[
              {
                required: true,
                message: '请输入项目域名!',
              },
              {
                pattern: originReg, message: `请输入符合规格的域名，${originPlaceholder}`
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

