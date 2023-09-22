import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import '@/common/styles/frame.styl';
import { WebContent } from './webContent/index';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.render(
    <ConfigProvider theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        // Seed Token，影响范围大
        colorPrimary: '#446eb6',
        // borderRadius: 2,

        // 派生变量，影响范围小
        // colorBgContainer: '#f6ffed',
      },
    }} >
      <WebContent />
    </ConfigProvider>,
    rootElement
  );
} else {
  console.error("Element with ID 'root' not found in the HTML.");
}
