import React, { useEffect } from 'react';
import '../style.css';
import './style.css';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import LabResultBody from './labResultBody';
import { server } from '../../../config/server';

export const LabResult = () => {
    const user = useSelector(state => state.usersSelect);
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchHealthData = () => {
            axios.get(server.serverURL + "v1/patient-lab-data/" + user.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.token
                }
            }).then(({ data }) => {
                setData(data);
            }).catch(error => {

            })
        };
        fetchHealthData();
    }, []);
    return (
        <div className="card-section">
            <h1 className="card-title">Lab Results</h1>
            <LabResultBody data={data} title={"lab"}/>
        </div >
    )
}
