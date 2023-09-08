import { ApiLog } from "../ApiLog"
import { Switch, Divider, Layout, Dropdown, theme, Button } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { SettingOutlined, SmileOutlined } from '@ant-design/icons';
import { SaveApi } from "../SaveApi"
import './projectDetail.scss'
import Detail from "../../components/detail";
import { useEffect, useState } from "react";
import { useDomainStore } from '../../store';
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from "../../const";

const { Header, Content } = Layout;

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

    ];
    const [apiList, setApiList] = useState([])
    const { setDomain, setCurrentProject, domain } = useDomainStore()

    useEffect(() => {
        chrome.storage.local.get(
            [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT],
            result => {
                setApiList(result[AJAX_INTERCEPTOR_PROJECTS])
                setDomain(result[AJAX_INTERCEPTOR_CURRENT_PROJECT])
            }
        )

    }, [])
    const handleAddRule = (val) => {
        console.log(val)

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
                        color: '#fff',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}>
                        MockGenius
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px',

                    }}> <Switch defaultChecked checkedChildren="开启" unCheckedChildren="关闭" />


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
                            <div className="mock-page-content">
                                <SaveApi ></SaveApi>
                                <Divider type="vertical" className="divier" />
                                <ApiLog></ApiLog>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
            <Detail>
            </Detail>
        </>
    )
}

