import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import '@/common/styles/frame.styl';
import { WebContent } from './webContent/index';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.render(
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }} >
      <WebContent />
    </ConfigProvider>,
    rootElement
  );
} else {
  console.error("Element with ID 'root' not found in the HTML.");
}
