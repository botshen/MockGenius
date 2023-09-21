import { Input, Row, Col, Button } from 'antd';
import React, { useState } from 'react';
import { CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import './Header.scss';
type Props = {
  headersList: any;
}

export const Headers: React.FC<Props> = ({ headersList }) => {
  const [editedHeaders, setEditedHeaders] = useState(headersList);

  const handleInputChange = (key: string, value: string, index: number) => {
    setEditedHeaders((prevHeaders: any) => {
      const updatedHeaders = [...prevHeaders];
      updatedHeaders[index] = [key, value];
      return updatedHeaders;
    });
  }

  return (
    <>
      {
        editedHeaders?.map(([key, value]: [string, string], index: number) => {
          return (
            <Row gutter={[16, 16]} style={{ marginBottom: '10px' }}>
              <Col span={11}>
                <Input
                  value={key}
                  onChange={(e) => handleInputChange(e.target.value, value, index)}
                />
              </Col>
              <Col span={11}>
                <Input
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value, index)}
                />
              </Col>
              <Col span={1}   >
                <Button icon={<CloseOutlined />} type="text" danger />
              </Col>
            </Row>
          )
        })
      }
      <Button icon={<PlusSquareOutlined />}>
        Add header
      </Button>
    </>
  );
}
