import React, { useEffect, useState } from 'react';
import './style.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LabResultBody from './labResult/labResultBody';
import { server } from '../../config/server';
import { getHealthGlucoseData_FromCorePhp, getOtherHealthData_FromCorePhp, getPatientHealthDataAPI } from '../../api/axiosAPIs';
const enumMood = {
    "1": "very sad",
    "2": "sad",
    "3": "neutral",
    "4": "happy",
    "5": "very happy",
}
export const HealthDataComponent = (props) => {
    const { userInfo } = props;
    const [data, setData] = useState(null);
    const [gluecoseData, setGluecoseData] = useState({});
    const [otherHealthData, setOtherHealthData] = useState({});
    const [selectedTest, setSelectedTest] = useState("");
    useEffect(() => {
        // console.log(userInfo);
        if (userInfo != undefined || userInfo != null) {
            var now = new Date();
            var to = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1}-${now.getDate() < 10 ? "0" + now.getDate() : now.getDate()}`;
            var days = 365;
            var before = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
            var from = `${before.getFullYear()}-${before.getMonth() + 1 < 10 ? "0" + (before.getMonth() + 1) : before.getMonth() + 1}-${before.getDate() < 10 ? "0" + before.getDate() : before.getDate()}`;
            // console.log(from, to);
            const fetchHealthData = () => {
                axios.get(server.serverURL + "v1/healthkit-history?patient_id=" + userInfo.id, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.token
                    }
                }).then(({ data }) => {
                    console.log(data.data)
                    setData(data);
                    setSelectedTest(Object.keys(data.data)[0]);
                }).catch(error => {
    
                })
            };
            fetchHealthData();
            getHealthGlucoseData_FromCorePhp(userInfo.id, from, to, res => {
                // setGluecoseData([...res.history]);
                makeHealthData(res.history);
            });

            var to = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1}-${now.getDate() < 10 ? "0" + now.getDate() : now.getDate()}`;
            var days = 14;
            var before = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
            var from = `${before.getFullYear()}-${before.getMonth() + 1 < 10 ? "0" + (before.getMonth() + 1) : before.getMonth() + 1}-${before.getDate() < 10 ? "0" + before.getDate() : before.getDate()}`;
            getOtherHealthData_FromCorePhp(userInfo.id, from, to, res => {
                setOtherHealthData(res);
                // makeHealthData(res.history);
            });
        }
    }, [userInfo]);

    const makeHealthData = (historyList) => {
        var data = {};
        for (var i = 0; i < historyList.length; i++) {
            var history = historyList[i];

            origin = data[history.date];
            if (origin == undefined) {
                origin = {}
            }

            origin = {
                ...origin,
                date: history.date,
            }
            if (history.timing < 3) {
                origin = { ...origin, beforeDeal: history.measurement }
            } else {
                origin = { ...origin, afterDeal: history.measurement }
            }
            data[history.date] = { ...origin };

        }
        setGluecoseData(data);
    }

    if (data && selectedTest) {
        return (
            console.log(data, selectedTest, data.data[selectedTest].last_updated),
            <div className="card-section">
                <h1 className="card-title">Health Data</h1>
                {/* <LabResultBody data={data}  title={"health"}/> */}
                <div>
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <div className="lab-result-category-container">
                                {
    
                                    Object.keys(data.data).map((cat, index) => {
                                        return (<div
                                            key={`lab_result_${index}`}
                                            className="lab-result-category-button"
                                            onClick={() => setSelectedTest(cat)}
                                            style={{ background: selectedTest == cat ? "#f1effd" : "#F7F7FA" }}
                                        >
                                            <h4 className="round_head task_template_btn">
                                                {data.data[cat].title} <span className="round_arrow-add-task">&gt;</span>
                                            </h4>
                                        </div>)
                                    })
                                }
                            </div>
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="lab-result-description-section">
                                <div className="lab-result-description-card">
                                    <div className="title-section">
                                        <p className="title-text">{data.data[selectedTest].title}</p>
                                        <p className="title-date-text">{data.data[selectedTest].last_updated}</p>
                                    </div>
                                    {
                                        data.data[selectedTest].details.map((detail, index) => {
                                            if (index === 0) {
                                                return (
                                                    <div key={`${data.data[selectedTest].title}_${index}`}
                                                        className="description-row"
                                                    >
                                                        {
                                                            Object.entries(detail).map((visible, visIndex) => {
                                                                return (
                                                                    <div style={{width: "33%"}}>
                                                                        <p className="description-row-title">{visible[0]}</p>
                                                                        <p className="description-row-info">
                                                                            <span>{visible[1]}</span>
                                                                        </p>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    );
                                            } else {
                                                return (
                                                    <div key={`${data.data[selectedTest].title}_${index}`}
                                                        className="description-row"
                                                    >
                                                        {
                                                            Object.entries(detail).map((visible, visIndex) => {
                                                                return (
                                                                    <div style={{width: "33%"}}>
                                                                        <p className="description-row-info">
                                                                            <span>{visible[1]}</span>
                                                                        </p>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    );
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    } else {
        return (
            console.log(data),
            <div className="card-section">
                <h1 className="card-title">Health Data</h1>
                <div className="lab-result-description-section">
                    <div className="lab-result-description-card">
                        <div className="title-section">
                            <p className="title-text">
                                No Health Data
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    // return (
    //     <div className="card-section">
    //         <h1 className="card-title">Health Data</h1>

    //         <div className="row">
    //             <div className="description-card col-6">
    //                 <div className="title-section" >
    //                     <p className="title-text">Blood Glucose</p>
    //                 </div>
    //                 <div className="description-row">
    //                     <p className="description-row-title col-4">{ }</p>
    //                     <p className="col-4" style={{ textAlign: 'center' }}><span style={{ color: "#6A5DE7" }}>Before Meal</span></p>
    //                     <p className="col-4" style={{ textAlign: 'center' }}><span style={{ color: "#7EE2EC" }}>After Meal</span></p>
    //                 </div>
    //                 {Object.keys(gluecoseData).map((_key) =>
    //                     <div key={_key} className="description-row">
    //                         <p className="description-row-title col-4">{_key}</p>
    //                         <p className="description-row-info col-4" style={{ textAlign: 'center' }} style={{ textAlign: 'center' }}><span>{gluecoseData[_key].beforeDeal == undefined ? "" : gluecoseData[_key].beforeDeal}</span></p>
    //                         <p className="description-row-info col-4" style={{ textAlign: 'center' }} style={{ textAlign: 'center' }}><span>{gluecoseData[_key].afterDeal == undefined ? "" : gluecoseData[_key].afterDeal}</span></p>
    //                     </div>
    //                 )}
    //             </div>
    //             <div className="record-data-container col-6">
    //                 <div className="description-card">
    //                     <div className="title-section">
    //                         <p className="title-text">Blood Pressure</p>
    //                     </div>
    //                     {
    //                         otherHealthData.pressureList == undefined || otherHealthData.pressureList.length == 0
    //                             ?
    //                             <div className="description-row">
    //                                 No Blood Pressure Data
    //                             </div>
    //                             :
    //                             <div className="">
    //                                 <div className="description-row">
    //                                     <p className="description-row-title col-5">{ }</p>
    //                                     <p className="col-7" style={{ textAlign: 'center' }}><span style={{ color: "#7EE2EC" }}>Pressure</span></p>
    //                                 </div>
    //                                 {
    //                                     otherHealthData.pressureList.map((item, i) =>
    //                                         <div key={`bloodPressure_${i}`} className="description-row">
    //                                             <p className="description-row-title col-5">{item.date_posted}</p>
    //                                             <p className="description-row-info col-7" style={{ textAlign: 'center' }}><span>{item.systolic}&nbsp;/&nbsp;{item.diastolic}</span></p>
    //                                         </div>
    //                                     )
    //                                 }
    //                             </div>
    //                     }
    //                 </div>
    //                 <div className="description-card">
    //                     <div className="title-section">
    //                         <p className="title-text">Blood Oxygen</p>
    //                     </div>
    //                     {
    //                         otherHealthData.oxygenList == undefined || otherHealthData.oxygenList.length == 0
    //                             ?
    //                             <div className="description-row">
    //                                 No Oxygen Data
    //                             </div>
    //                             :
    //                             <div className="">
    //                                 <div className="description-row">
    //                                     <p className="description-row-title col-5">{ }</p>
    //                                     <p className="col-7" style={{ textAlign: 'center' }}><span style={{ color: "#7EE2EC" }}>Oxygen</span></p>
    //                                 </div>
    //                                 {
    //                                     otherHealthData.oxygenList.map((item, i) =>
    //                                         <div key={`bloodOxygen_${i}`} className="description-row">
    //                                             <p className="description-row-title col-5">{item.date_posted}</p>
    //                                             <p className="description-row-info col-7" style={{ textAlign: 'center' }}><span>{item.oxygen_value}</span></p>
    //                                         </div>
    //                                     )
    //                                 }
    //                             </div>
    //                     }
    //                 </div>

    //                 <div className="description-card">
    //                     <div className="title-section">
    //                         <p className="title-text">Weight</p>
    //                     </div>
    //                     {
    //                         otherHealthData.weightList == undefined || otherHealthData.weightList.length == 0
    //                             ?
    //                             <div className="description-row">
    //                                 No Weight Data
    //                             </div>
    //                             :
    //                             <div className="">
    //                                 <div className="description-row">
    //                                     <p className="description-row-title col-5">{ }</p>
    //                                     <p className="col-7" style={{ textAlign: 'center' }}><span style={{ color: "#7EE2EC" }}>Weight</span></p>
    //                                 </div>
    //                                 {
    //                                     otherHealthData.weightList.map((item, i) =>
    //                                         <div key={`Weight_${i}`} className="description-row">
    //                                             <p className="description-row-title col-5">{item.date_posted}</p>
    //                                             <p className="description-row-info col-7" style={{ textAlign: 'center' }}><span>{item.weight}</span></p>
    //                                         </div>
    //                                     )
    //                                 }
    //                             </div>
    //                     }
    //                 </div>

    //                 <div className="description-card">
    //                     <div className="title-section">
    //                         <p className="title-text">Mood</p>
    //                     </div>
    //                     {
    //                         otherHealthData.moodList == undefined || otherHealthData.moodList.length == 0
    //                             ?
    //                             <div className="description-row">
    //                                 No Mood Data
    //                             </div>
    //                             :
    //                             <div className="">
    //                                 <div className="description-row">
    //                                     <p className="description-row-title col-5">{ }</p>
    //                                     <p className="col-7" style={{ textAlign: 'center' }}><span style={{ color: "#7EE2EC" }}>Mood</span></p>
    //                                 </div>
    //                                 {
    //                                     otherHealthData.moodList.map((item, i) =>
    //                                         <div key={`Mood_${i}`} className="description-row">
    //                                             <p className="description-row-title col-5">{item.date_posted}</p>
    //                                             <p className="description-row-info col-7" style={{ textAlign: 'center' }}><span>{enumMood[item.feeling_type + ""]}</span></p>
    //                                         </div>
    //                                     )
    //                                 }
    //                             </div>
    //                     }
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
}