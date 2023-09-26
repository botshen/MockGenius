import React, { useEffect, useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio, Input } from 'antd';
import SvelteJSONEditor from '../json';
type Props = {
  jsonData: any
  updateResponseContent: (content: any) => void;
}
const { TextArea } = Input;

export const Response: React.FC<Props> = ({ jsonData, updateResponseContent }) => {
  const [content, setContent] = useState(() => {
    if (!jsonData) {
      return {
        json: undefined,
        text: '',
        textAreaValue: ''
      }
    }
    if (typeof jsonData === 'object') {
      return {
        json: jsonData,
        text: undefined,
        textAreaValue: JSON.stringify(jsonData)
      }
    } else {
      try {
        const parse = JSON.parse(jsonData)
        return {
          json: parse,
          text: undefined,
          textAreaValue: parse
        }
      } catch (error) {
        return {
          json: undefined,
          text: jsonData,
          textAreaValue: jsonData
        }
      }
    }
  });
  const [type, setType] = useState('JSON');

  useEffect(() => {
    updateResponseContent(content)
  }, [content])
  const handleTextChange = (value: string) => {
    setContent({
      text: value,
      json: undefined,
      textAreaValue: value
    })
  }
  const plainOptions = ['JSON', 'Text'];
  const onTypeChange = ({ target: { value } }: RadioChangeEvent) => {
    setType(value);
  };
  return (
    <>
      <Radio.Group style={{ marginBottom: '10px' }} options={plainOptions} onChange={onTypeChange} value={type} />
      {
        type === 'JSON' && <SvelteJSONEditor
          content={content}
          readOnly={false}
          onChange={setContent}
          mode="text"
          mainMenuBar={false}
          statusBar={false}
        />
      }
      {
        type === 'Text' &&
        <TextArea
          rows={4}
          value={content.textAreaValue}
          onChange={(e) => handleTextChange(e.target.value)} />
      }
    </>
  );
}
