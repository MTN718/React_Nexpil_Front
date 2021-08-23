import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './style.css';
import { BsFillPlusCircleFill } from "react-icons/bs";
import AssignedTask from '../userDataComponent/assignedTask/assignedTask';

const virtualMedication = ["Calcitrol", "Ciprofloaxacin", "Glipizide", "Metformin", "Simvastatin"];

export const ChatUserInfo = () => {
    const userInfo = useSelector(state => state.chatUserSelect);
    const medication = useSelector(state => state.medication);
    const [chatMedication, setChatMedication] = useState([]);
    const userAssigedData = useSelector(state => state.assignedData);

   /*  console.log("userAggi", userAssigedData); */

    useEffect(() => {
        getMedicationData(medication);
    }, [medication]);


    useEffect(() => {
        getMedicationData(medication);
        // console.log("userInfo", userInfo);
    }, [userInfo]);

    const getMedicationData = (data) => {
        let array = [];
        if (data.length != 0) {
            for (let index = 0; index < 4; index++) {
                const element = data[index];
                element ? array.push(element["title"]) : array.push("");
            }
            setChatMedication(array);
        } else {
            setChatMedication([]);
        }
    }

    return (
        <div className="chat-user-info-main-section" style={{ overflow: "hidden" }}>
            <div className="chat-user-info-row">
                <p className="chat-user-info-row-title">Age:</p>
                <p className="chat-user-info-row-description">{(userInfo ? userInfo.age : "")}</p>
            </div>
            <div className="chat-user-info-row">
                <p className="chat-user-info-row-title">D.O.B:</p>
                <p className="chat-user-info-row-description">{userInfo ? userInfo.DOB : ""}</p>
            </div>
            <div className="chat-user-info-row">
                <p className="chat-user-info-row-title">Allergies:</p>
                <p className="chat-user-info-row-description">{userInfo ? userInfo.allergies : ""}</p>
            </div>
            <div className="chat-user-info-row">
                <p className="chat-user-info-row-title">Medication:</p>
                <div className="chat-user-info-row-description">
                    <div className="medication-row">
                        {chatMedication && chatMedication.map((item, i) =>
                            <p key={i} className="medication-row-text">{item}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="chat-user-info-asigned-row">
                <p className="chat-user-info-row-title">Assigned Tasks:</p>
                {/* <BsFillPlusCircleFill size="20px" color="#4939E3" /> */}
                <div>
                    <AssignedTask
                        setCreatedGroupId={() => { }}
                        isFromChat={true}
                        userInfo={userInfo}
                    />
                </div>
            </div>
            {/* {userAssigedData.map((item, i) =>
                <div key={i} className="chat-patient-page-existing-task-style">
                    <p className="chat-patient-page-existing-task-title-style">{item.name}</p>
                </div>
            )} */}
        </div>
    )
}
