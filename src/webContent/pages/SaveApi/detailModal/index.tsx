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
      name: 'http://localhost:5175',
      pathUrl: 'http://localhost:5175'
    }
  }

  return (
    <>
      <Modal
        title={mode === 'edit' ? 'Edit Project' : 'Add Project'}
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
          labelCol={{
            span: 4,
          }}
          initialValues={initialValues()}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            labelCol={{
              span: 4,
            }}
            rules={[
              {
                required: true,
                message: 'Please input your Project Name',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Domain"
            name="pathUrl"
            rules={[
              {
                required: true,
                message: 'Please input your Project Domain',
              },
              {
                pattern: originReg, message: `Please enter a domain name that meets the specifications,${originPlaceholder}`
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

