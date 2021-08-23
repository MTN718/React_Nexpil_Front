import React, {useState, useEffect } from 'react';
import './style.css';
import { SideBar } from '../../components';
import { Setting } from '../../components/settingComponent'
export const SettingPage = () => {
    const form = React.useRef();
    return (
        <div className="intro-setting-container">
            <SideBar select={"setting"} />
            <div className="main-section">
                <Setting />
            </div>
        </div>
    )
}
