import React, {useEffect, useState} from 'react';
import {Button, List, message} from 'antd';
import Detail from '../../components/detail';
import './home.scss'
import {AJAX_INTERCEPTOR_CURRENT_PROJECT, AJAX_INTERCEPTOR_PROJECTS} from '../../const';
import {saveStorage, readLocalStorage} from '../../utils';


const Home = () => {
    const [datalist, setDatalist] = useState([]);
    const [detailVisible, setDetailVisible] = useState(false);
    useEffect(() => {
      chrome.storage.local.get(
        [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT],
        result => {
          const currentProject = result[AJAX_INTERCEPTOR_CURRENT_PROJECT]
          const projectList = result[AJAX_INTERCEPTOR_PROJECTS] || []
        }
      )
    }, [])
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
      (async () => {
        let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
        let currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
        // 第一次进来的时候设置一下当前 project 的 rules
        setDatalist(projectList.find(item => item.pathUrl === currentProject)?.rules || [])
      })();
    }, [])
    useEffect(() => {
        (async () => {
          let projectList = await readLocalStorage(AJAX_INTERCEPTOR_PROJECTS);
          let currentProject = await readLocalStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT);
          const data = projectList.map((item, index) => {
            if (item.pathUrl !== currentProject) {
              return item
            } else {
              return {
                ...item,
                rules: datalist
              }
            }
          })
          console.log(data);
          await saveStorage(AJAX_INTERCEPTOR_PROJECTS, data)
        })();
      }, [datalist]
    )
    const handleTitleClick = () => {
      setDetailVisible(true);
    }
    const setDetailFalse = () => {
      setDetailVisible(false);
    }
    const setDetailTrue = () => {
      setDetailVisible(true);
    }
    const DetailSubmit = (formData) => {
      // setDatalist(pre => [formData, ...pre])
      setDatalist([formData, ...datalist]); // 直接替换 datalist

      setDetailVisible(false);
    }
    return (
      <>
        {contextHolder}
        {
          detailVisible ?
            (<Detail onSubmit={DetailSubmit} onCancel={setDetailFalse}/>) :
            <div className='home-wrapper'>
              <Button type="primary" onClick={() => {
                setDetailTrue(true)
              }}>添加规则</Button>
              <List className='account-wrapper'
                    pagination={{
                      position: 'bottom',
                      align: 'center',
                      pageSize: 8,
                    }}

                    size='small'
                    dataSource={datalist}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <span
                              style={{cursor: 'pointer'}}
                              onClick={handleTitleClick}>
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
  }
;
export default Home;
