import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import '@/common/styles/frame.styl';
import { WebContent } from './webContent/index';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <WebContent />
    </ConfigProvider>,
    rootElement
  );
} else {
  console.error("Element with ID 'root' not found in the HTML.");
}
