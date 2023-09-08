import { ApiLog } from "../ApiLog"
import { Switch, Divider, Radio, Layout, Dropdown, theme, Button } from 'antd';
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
                        justifyContent: 'space-between',
                        gap: '20px',

                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',

                    }}>
                        <Button type="primary" icon={<PlusOutlined />}  >
                            编辑地址
                        </Button>
                        
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px',

                    }}> <Switch defaultChecked checkedChildren="开启" unCheckedChildren="关闭" />

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

                        </Dropdown></div>

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
                            {/* <div className="mock-page-header">
                                <div className="mock-page-title">全局拦截日志：</div>
                                <div className="saved-api">
                                    <div style={{ marginLeft: '10px' }} className="mock-page-title">已保存接口：</div>
                                    <div>
                                        <Button type="primary" onClick={handleAddRule} icon={<PlusOutlined />}>
                                            添加规则
                                        </Button>
                                    </div>

                                </div>
                            </div> */}
                            <div className="mock-page-content">

                                <ApiLog></ApiLog>
                                <Divider type="vertical" className="divier" />
                                <SaveApi ></SaveApi>
                            </div>


                        </div>
                    </div>
                </Content>

            </Layout>
            <Detail></Detail>
        </>


    )
}

