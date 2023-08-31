import React, { useEffect, useState } from 'react';
import { Avatar, List, Button, Checkbox, Input, Form, Switch, InputNumber, Select } from 'antd';
import Detail from '../../components/detail';
import imgLogo from '../login/logo.png'
import './home.scss'
import { AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS } from '../../const';
import { saveStorage } from '../../utils';

const Home = () => {
    const [datalist, setDatalist] = useState([]);
    const [detailVisible, setDetailVisible] = useState(false);
    useEffect(() => {
        chrome.storage.local.get(
            [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT],
            result => {
                const currentProject = result[AJAX_INTERCEPTOR_CURRENT_PROJECT]
                const projectList = result[AJAX_INTERCEPTOR_PROJECTS] || []
                console.log('currentProject', currentProject);
                console.log('projectList', projectList);
            }
        )
    }, [])
    useEffect(() => {
        let currentProject;
        chrome.storage.local.get(
            [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT],
            result => {
                currentProject = result[AJAX_INTERCEPTOR_CURRENT_PROJECT]
                // const projectList = result[AJAX_INTERCEPTOR_PROJECTS] || []
                // console.log('currentProject', currentProject);
                // console.log('projectList', projectList);
            }
        )
        saveStorage(currentProject, datalist)

    }, [datalist])
    const handleTitleClick = () => {
        console.log('title clicked!');
        setDetailVisible(true);
    }
    const setDetailFalse = () => {
        setDetailVisible(false);
    }
    const setDetailTrue = () => {
        setDetailVisible(true);
    }
    const DetailSubmit = (formData) => {
        setDatalist(pre => [formData, ...pre])
        setDetailVisible(false);
    }
    return (
        <>
            {
                detailVisible ?
                    (<Detail onSubmit={DetailSubmit} onCancel={setDetailFalse} />) :
                    <div className='home-wrapper'>
                        <img onClick={() => { setDetailTrue(true) }} src={imgLogo} alt="" className="logo" />
                        <List className='account-wrapper'
                            pagination={{
                                position: 'bottom',
                                align: 'center',
                                pageSize: 8,
                            }}

                            size='small'
                            dataSource={datalist}
                            renderItem={(item, index) => (
                                <List.Item >
                                    <List.Item.Meta
                                        title={
                                            <span
                                                style={{ cursor: 'pointer' }}
                                                onClick={handleTitleClick} >
                                                {item.name}
                                            </span>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>


            }


        </>
    );
};
export default Home;
