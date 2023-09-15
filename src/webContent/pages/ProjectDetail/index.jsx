import { ApiLog } from "../ApiLog"
import { Switch, Divider, Layout, Dropdown, theme, Button } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { SettingOutlined, SmileOutlined } from '@ant-design/icons';
import { SaveApi } from "../SaveApi"
import './projectDetail.scss'
import React, { useEffect, useRef, useState } from "react";
import { getOrCreateLocalStorageValues, readLocalStorage, saveStorage } from "../../utils";
import { useDomainStore } from "../../store";

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
    const { setApiLogList } = useDomainStore()

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
    const handleAddRule = (url) => {
        console.log(url)
        setDetailVisible(true)
    }
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const globalSwitchChange = async (checked) => {
        setDefaultChecked(checked => !checked)
        await saveStorage('mockPluginSwitchOn', checked)
        if (checked) {
            chrome.action.setIcon({ path: '/images/app.png' });
        } else {
            chrome.action.setIcon({ path: '/images/gray.png' });
        }
    }
    const onCancelDetail = () => {
        setDetailVisible(false)
    }
    const onSubmit = (form) => {
        console.log(form)
        setDetailVisible(false)
    }
    const apiLogSubmit = (projectList) => {
        console.log('projectList')
        console.log('saveApi',saveApi)
        saveApi.current.setTabData(projectList)
    }
    const clearLog = () => {
        setApiLogList([])
    }
    return (
        <>
            {/* {
                detailVisible && <Detail onSubmit={onSubmit} onCancel={onCancelDetail}></Detail>
            } */}
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


                        <Button onClick={clearLog} danger icon={<ClearOutlined />} >清空日志</Button>
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
                                <SaveApi ref={saveApi} ></SaveApi>
                                <Divider type="vertical" className="divier" />
                                <ApiLog apiLogSubmit={apiLogSubmit}></ApiLog>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>

        </>
    )
}

