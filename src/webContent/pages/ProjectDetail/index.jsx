import { ApiLog } from "../ApiLog"
import { Button, Drawer, Radio, Space } from 'antd';

import { SaveApi } from "../SaveApi"
import './projectDetail.scss'
import { useState } from "react";
import Detail from "../../components/detail";

export const ProjectDetail = () => {
    const handleAddRule = (val) => {
        console.log(val)
        // setOpen(true)
  
    }
    return (
        <div className="ProjectDetail-wrapper">
            <SaveApi onAddRule={handleAddRule}></SaveApi>
            <ApiLog></ApiLog>
            <Detail></Detail>
        </div>
    )
}

