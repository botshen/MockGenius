import { ApiLog } from "../ApiLog"
import { Switch, Divider, Space, Layout, Dropdown, theme, Button } from 'antd';
import { PlusOutlined, ClearOutlined } from '@ant-design/icons';
import { SettingOutlined, SmileOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
import { SaveApi } from "../SaveApi"
import './projectDetail.scss'
import Detail from "../../components/detail";
import { SearchOutlined } from '@ant-design/icons';


export const ProjectDetail = () => {
    const items = [
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              1st menu item
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              2nd menu item (disabled)
            </a>
          ),
          icon: <SmileOutlined />,
          disabled: true,
        },
        {
          key: '3',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
              3rd menu item (disabled)
            </a>
          ),
          disabled: true,
        },
        {
          key: '4',
          danger: true,
          label: 'a danger item',
        },
      ];
    const handleAddRule = (val) => {
        console.log(val)
        // setOpen(true)

    }
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <>
            <Layout className="layout">
                <Header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '20px',

                    }}
                >
                    <Switch defaultChecked checkedChildren="开启" unCheckedChildren="关闭" />

                    <Button type="primary" icon={<PlusOutlined />}  >
                        添加地址
                    </Button>
                    <Button danger icon={<ClearOutlined />} >一键清空</Button>
                    <Dropdown
                        menu={{
                            items,
                        }}
                        placement="bottomLeft"
                        trigger={['click']}

                    >
                               <Button icon={<SettingOutlined />} type="primary">设置</Button>

                    </Dropdown>
                </Header>
                <Content

                >

                    <div
                        className="site-layout-content"
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        <div className="ProjectDetail-wrapper">
                            <div className="mock-page-header">
                                <Button type="primary" onClick={handleAddRule} icon={<SearchOutlined />}>
                                    添加规则
                                </Button>


                            </div>
                            <div className="mock-page-content">
                                <SaveApi ></SaveApi>
                                <Divider type="vertical" className="divier" />
                                <ApiLog></ApiLog>
                            </div>


                        </div>
                    </div>
                </Content>

            </Layout>
            <Detail></Detail>
        </>


    )
}

