import React, { useState } from 'react';
import { Detail } from '../../components/detail';
import { Table, Tag, message } from 'antd';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';
import { useDomainStore } from '../../store';
import { readLocalStorage } from "../../utils";
import './apiLog.scss';

type ApiLogItem = {
  pathRule: string;
  status: string;
  mock: string;
  type: string;
  method: string;
};
export type ProjectList = {
  pathUrl: string;
  rules: ApiLogItem[];
}[]
type Props = {
  apiLogSubmit: (project: any) => void;
};

export const ApiLog: React.FC<Props> = ({ apiLogSubmit }) => {
  const columns = [
    {
      title: 'Path',
      dataIndex: 'pathRule',
      key: 'pathRule',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Mock',
      dataIndex: 'mock',
      key: 'mock',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Method',
      key: 'method',
      dataIndex: 'method',
      render: (method: string) => {
        let color = 'geekblue';
        return (
          <Tag color={color} key={method}>
            {method.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  const { apiLogList } = useDomainStore() as { apiLogList: ApiLogItem[] };
  const [messageApi, contextHolder] = message.useMessage();
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<ApiLogItem | {}>({});

  const setDetailFalse = () => {
    setDetailVisible(false);
  };

  const handleDetailSubmit = async (formData: ApiLogItem) => {
    let projectList: ProjectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS) as ProjectList;
    let currentProjectUrl = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
    const currentProject = projectList.find((item) => item.pathUrl === currentProjectUrl);
    if (!currentProject) {
      return messageApi.error('当前项目不存在');
    }
    let currentResult: ApiLogItem[] = [];

    if (!currentProject.rules.find((item) => item.pathRule === formData.pathRule)) {
      currentResult = [formData, ...currentProject.rules];
    } else {
      currentResult = currentProject.rules.map((item) => {
        if (item.pathRule === formData.pathRule) {
          return {
            ...item,
            ...formData,
          };
        } else {
          return item;
        }
      });
    }

    const newProjectList = projectList.map((item) => {
      if (item.pathUrl === currentProjectUrl) {
        return {
          ...item,
          rules: currentResult,
        };
      } else {
        return item;
      }
    });

    await chrome.storage.local.set({ [AJAX_INTERCEPTOR_PROJECTS]: newProjectList });
    apiLogSubmit(newProjectList);
    setDetailVisible(false);
  };

  return (
    <>
      {contextHolder}
      <div className='log-wrapper'>
        <div className="mock-page-title">拦截日志：</div>
        <Table
          style={{
            padding: '0 20px',
          }}
          size='small'
          onRow={(record: ApiLogItem) => {
            return {
              onClick: () => {
                setDetailData(record);
                setDetailVisible(true);
              },
            };
          }}
          columns={columns}
          dataSource={apiLogList}
        />
      </div>
      {detailVisible && (
        <Detail mode='edit' data={detailData as ApiLogItem} onSubmit={handleDetailSubmit} onCancel={setDetailFalse} />
      )}
    </>
  );
};
