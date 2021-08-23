import React from 'react';
import './style.css';
import { SideBar } from '../../components';
import { Calendar } from '../../components';

export const CalendarPage = () => {
    return (
        <div className="intro-page-container">
            <SideBar select={"calendar"} />
            <div className="calendar-main-section">
                <Calendar />
            </div>
        </div>
    )
}
