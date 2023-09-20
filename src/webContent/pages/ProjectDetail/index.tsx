import { ApiLog, ProjectList } from "../ApiLog"
import { Switch, Divider, Layout, Dropdown, theme, Button } from 'antd';
import { SettingOutlined, SmileOutlined } from '@ant-design/icons';
import { SaveApi } from "../SaveApi"
import './projectDetail.scss'
import React, { useEffect, useRef, useState } from "react";
import { getOrCreateLocalStorageValues, saveStorage } from "../../utils";

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
    const saveApi = useRef();

    const [defaultChecked, setDefaultChecked] = useState(true)
    const [detailVisible, setDetailVisible] = useState(false)
    useEffect(() => {
        getOrCreateLocalStorageValues({
            mockPluginSwitchOn: true,
        }, function (values) {
            const checked = values.mockPluginSwitchOn
            setDefaultChecked(checked)
            if (checked) {
                chrome.action.setIcon({ path: '/images/app.png' });
            } else {
                chrome.action.setIcon({ path: '/images/gray.png' });
            }
        })
    }, [])

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const globalSwitchChange = async (checked: boolean) => {
        setDefaultChecked(checked => !checked)
        await saveStorage('mockPluginSwitchOn', checked)
        if (checked) {
            chrome.action.setIcon({ path: '/images/app.png' });
        } else {
            chrome.action.setIcon({ path: '/images/gray.png' });
        }
    }

    const apiLogSubmit = (projectList: ProjectList) => {
        // @ts-ignore
        saveApi.current?.setTabData(projectList)
    }

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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <img className="logo-mock" src="/images/mocking.png" alt=""
                        />
                        MockGenius
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px',

                    }}>
                        <Switch
                            checked={defaultChecked}
                            onChange={globalSwitchChange}
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                        />


                        <Dropdown
                            menu={{
                                items,
                            }}
                            placement="bottomLeft"
                            trigger={['click']}

                        >
                            <Button icon={<SettingOutlined />} type="primary">设置</Button>

                        </Dropdown>
                    </div>

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
                                <ApiLog apiLogSubmit={apiLogSubmit}></ApiLog>
                                <Divider type="vertical" className="divier" />
                                <SaveApi ref={saveApi} ></SaveApi>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>

        </>
    )
}

