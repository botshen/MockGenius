import { Input, Row, Col, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import './Header.scss';
type Props = {
  headersList: any;
  updateHeadersList: (headersList: any) => void;
}

export const Headers: React.FC<Props> = ({ headersList, updateHeadersList }) => {
  const [editedHeaders, setEditedHeaders] = useState(headersList);
  useEffect(() => {
    updateHeadersList(editedHeaders)
  }, [editedHeaders])
  
  const handleInputChange = (key: string, value: string, index: number) => {
    setEditedHeaders((prevHeaders: any) => {
      const updatedHeaders = [...prevHeaders];
      updatedHeaders[index] = [key, value];
      return updatedHeaders;
    });
  }
  const handleAddHeader = () => {
    setEditedHeaders((prevHeaders: any) => {
      const updatedHeaders = [...prevHeaders];
      updatedHeaders.push(['', '']);
      return updatedHeaders;
    });
  }
  const handleDeleteHeader = (index: number) => {
    setEditedHeaders((prevHeaders: any) => {
      const updatedHeaders = [...prevHeaders];
      updatedHeaders.splice(index, 1);
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
                <Button onClick={() => handleDeleteHeader(index)} icon={<CloseOutlined />} type="text" danger />
              </Col>
            </Row>
          )
        })
      }
      <Button onClick={handleAddHeader} icon={<PlusSquareOutlined />}>
        Add header
      </Button>
    </>
  );
}
