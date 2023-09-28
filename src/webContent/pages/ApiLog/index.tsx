import React, { useState } from 'react';
import { Detail } from '../../components/detail';
import { Button, Table, Tag, Tooltip, message } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { useLocalStore } from '../../store/useLocalStore';
import { useLogStore } from '../../store/useLogStore';
import './apiLog.scss';

type ApiLogItem = {
  pathRule: string;
  status: string;
  mock: string;
  type: string;
  method: string;
  switchOn: boolean;
};
export type ProjectList = {
  pathUrl: string;
  rules: ApiLogItem[];
  switchOn: boolean;
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
      width: '30%',
      ellipsis: {
        showTitle: false,
      },
      render: (pathRule: string) => (
        <Tooltip placement="topLeft" title={pathRule}>
          {pathRule}
        </Tooltip>
      ),
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

  const { apiLogList, clearLogList } = useLogStore();
  const { currentProject, projectList, setProjectList } = useLocalStore()
  const [messageApi, contextHolder] = message.useMessage();
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<ApiLogItem | {}>({});

  const setDetailFalse = () => {
    setDetailVisible(false);
  };

  const clearLog = () => {
    clearLogList()
  }
  const handleDetailSubmit = async (formData: ApiLogItem) => {
    const _currentProject = projectList.find((item) => item.pathUrl === currentProject);
    if (!_currentProject) {
      return messageApi.error('当前项目不存在');
    }
    let currentResult: ApiLogItem[] = [];

    if (!_currentProject.rules.find((item) => item.pathRule === formData.pathRule)) {
      currentResult = [formData, ..._currentProject.rules];
    } else {
      currentResult = _currentProject.rules.map((item) => {
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
      if (item.pathUrl === currentProject) {
        return {
          ...item,
          rules: currentResult,
        };
      } else {
        return item;
      }
    });

    setProjectList(newProjectList)
    apiLogSubmit(newProjectList);
    setDetailVisible(false);
  };

  return (
    <>
      {contextHolder}
      <div className='log-wrapper'>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '5px',
        }}>
          {/* <div className="mock-page-title">拦截日志：</div> */}
          <div className="mock-page-title">Intercept Log:</div>
          {/* <Button onClick={clearLog} danger icon={<ClearOutlined />} >清空日志</Button> */}

          <Button onClick={clearLog} danger icon={<ClearOutlined />} >Empty log</Button>

        </div>
        <Table
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
          pagination={false}
          scroll={{ y: 600 }}
        />
      </div>
      {detailVisible && (
        <Detail mode='edit' data={detailData as ApiLogItem} onSubmit={handleDetailSubmit} onCancel={setDetailFalse} />
      )}
    </>
  );
};
