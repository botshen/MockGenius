import { ApiLog } from "../ApiLog"
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer } = Layout;
import { SaveApi } from "../SaveApi"
import './projectDetail.scss'
import Detail from "../../components/detail";

export const ProjectDetail = () => {
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
                    }}
                >
                    localhost:8080
                </Header>
                <Content
                    style={{
                        padding: '0 50px',
                    }}
                >

                    <div
                        className="site-layout-content"
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        <div className="ProjectDetail-wrapper">
                            <SaveApi onAddRule={handleAddRule}></SaveApi>
                            <ApiLog></ApiLog>

                        </div>
                    </div>
                </Content>

            </Layout>
            <Detail></Detail>
        </>


    )
}

