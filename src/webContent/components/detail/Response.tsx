import React, { useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio, Input } from 'antd';
import SvelteJSONEditor from '../json';
type Props = {

}
const { TextArea } = Input;

export const Response: React.FC<Props> = () => {
  const [content, setContent] = useState({
    json: {},
    text: undefined
  });
  const [type, setType] = useState('JSON');

  const plainOptions = ['JSON', 'Text'];
  const onTypeChange = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio1 checked', value);
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
        type === 'Text' && <TextArea rows={4} />
      }
    </>
  );
}
