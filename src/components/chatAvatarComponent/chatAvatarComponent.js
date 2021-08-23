import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_USER, SET_PATIENT_SELECTED, GET_PATIENT_PERSONAL_DATA, GET_PATIENTS_LIST, 
    GET_PATIENT_MEDICATION_DATA, ADD_NEW_PATIENT, GET_PATIENT_HEALTH_DATA, GET_ASSIGNED_DATA, GET_USER_CHAT } from '../../store/actionNames';
import './style.css';
import { BsSearch, BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { sharedColors } from '../../theme/sharedColor';
import jwt from 'jwt-simple';
import axios from 'axios';
import { server } from '../../config/server';
import date from 'date-and-time';

export const ChatAvatarsContainer = ({getChannelName}) => {
    const dispatch = useDispatch();
    const config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.token
        }
    }
    // State variables
    const [arrowDirection, setArrowDirection] = useState(true);
    const patientList = useSelector(state => state.patientsList);
    const [usersData, setUsersData] = useState();
    let check_user_name = "";

    // Style for the highlighted text.
    const specialColorFont = {
        color: sharedColors.primaryFontColor,
    }
    const showAvatar = useRef();

    // Set usersData to data from server
    useEffect(() => {
        axios.get(server.serverURL + 'v1/chat-patients', config)
        .then(res => {
            var data = res.data;
            // console.log(data);
            setUsersData(data.data.results);
        });
    }, [patientList]);

    const setChatToken = (data) => {
        let channelName = localStorage.userId + "/" + data["id"];
        channelName = channelName.replace(/ /g, "");
        let chatUserInfo = {
            send: localStorage.userId,
            sender: localStorage.userName,
            s_phone_number: localStorage.phone_number,
            sendImage: localStorage.userImage,
            receive: data["id"],
            receiver: data["patient_name"],
            r_phone_number: data["phone_number"],
            receiveImage: data["userimage"],
            channelName: channelName,
            date: data["DOB"],
            userInfo: data
        }
        getChannelName(jwt.encode(chatUserInfo, "xxx"));
    }

    const setHighlightedUser = (userItem) => {
        setChatToken(usersData[userItem])
        let virtualArray = [];
        for (let i = 0; i < usersData.length; i++) {
            if (i !== userItem) virtualArray.push({ ...usersData[i], selected: false });
            if (i === userItem) virtualArray.push({ ...usersData[i], selected: true })
        }
        setUsersData(virtualArray);
        dispatch({ type: GET_USER_CHAT, payLoad: usersData[userItem] });
        dispatch({ type: GET_PATIENT_MEDICATION_DATA, payLoad: usersData[userItem].id });
        dispatch({ type: GET_ASSIGNED_DATA, payLoad: usersData[userItem].id });
    }

    const handleSearch = (e) => {
        if(e != "") {
            var filteredUsers = usersData.filter(user => user.patient_name.toLowerCase().includes(e));
            setUsersData(filteredUsers);
        } else {
            setUsersData(patientList);
        }
    }
    
    return (
        <div className="avatars">
            <div className="avatar-main-section" ref={showAvatar}>
                <div className="avatars-title-container">
                    <h1 className="avatars-title-text">Chat<span style={specialColorFont}>.</span></h1>
                </div>
                <div className="search-bar">
                    <BsSearch size="18px" color={sharedColors.primaryFontColor} className="search-icon" />
                    <input type="text" onChange={(e) => handleSearch(e.target.value)} placeholder="Search" className="search-input" />
                </div>
                <div className="users-avatar" id="avatar-scrollbar">
                    {usersData && usersData.map((user, i) => {
                        let userNameSpan = "";
                        if(check_user_name != user.patient_name.slice(0, 1).toUpperCase()) {
                            userNameSpan = (
                                <div>
                                    { user.patient_name.slice(0, 1).toUpperCase() }
                                </div>
                            )
                            check_user_name = user.patient_name.slice(0, 1).toUpperCase();
                        }
                        return (
                            <div key={i}>
                                {/* { userNameSpan } */}
                                <div onClick={() => setHighlightedUser(i)} className={user.selected == false ? "user-avatar" : "user-avatar-selected"}>
                                    <img className="avatar-image" src={user.userimage} />
                                    <div className="user-info">
                                        <p className="user-name-text">{user.patient_name}</p>
                                        <p className="user-chats-text">{user.recent_chat}</p>
                                    </div>
                                    <div className="chat-info-part">
                                        <p className={user.selected == false ? "chat-date" : "chat-date-selected"}>{date.format(new Date(user.chat_date), 'MMM DD')}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    )}
                </div>
            </div>
        </div>
    )
}
