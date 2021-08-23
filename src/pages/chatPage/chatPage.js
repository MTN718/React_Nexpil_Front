import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import { AvatarsContainer, ChatAvatarsContainer, SideBar } from '../../components';
import { ChatWindow } from '../../components';
import { ChatUserInfo } from '../../components';
import { GET_PATIENTS_LIST, SET_CHAT_CHANNEL } from '../../store/actionNames/homePageActions';
import VideoChat from '../../components/chatWindow/VideoChat';
import { useHistory } from 'react-router';

export const ChatPage = () => {
    const dispatch = useDispatch();
    const settedPatient = useSelector(state => state.setPatientChat);
    const [videoCallStatus, setVideoCallStatus] = useState(0);
    const [channelName, setChannelName] = useState("");
    const [videoToken, setVideoToken] = useState("");
    const [chatLoad, setChatLoad] = useState(false);
    const history = useHistory();
    const [chatInfo, setChatInfo] = useState("");

    const createNewRoom = (token, channel) => {
        /*   console.log(token, channel, "token n channel") */
        if (token && channel) {
            setChannelName(channel);
            setVideoToken(token);
            setVideoCallStatus(1);
        } else {
            alert("you didn't choose the user");
        }
    }

    useEffect(() => {
        dispatch({ type: 'GET_USER_CHAT', payLoad: {} });
        dispatch({ type: 'GET_PATIENT_MEDICATION_DATA', payLoad: "" });
        dispatch({ type: 'GET_ASSIGNED_DATA', payLoad: "" });
        checkUserToken();
    }, []);

    const checkUserToken = () => {
        var token = localStorage.getItem("token");
        if (!token) {
            history.push("/login");
        } else {
            let pathName = window.location.pathname;
            setChatInfo(pathName.split("/")[2]);
        }
    }

    const loadingSuccess = () => {
        setChatLoad(true);
    }

    const getChannelName = (e) => {
        setChatInfo(e);
        history.push("/chat/" + e);
    }

    let render = (
        <div className="chat-page-container">
            <SideBar select={"chat"} />
            <div className="main-section">
                <ChatAvatarsContainer getChannelName={getChannelName} />
                <div className="chat-section-part">
                    <div className="chat-page-section">
                        <div className="chatting-section">
                            <ChatWindow chatInfo={chatInfo} setVideoCall={createNewRoom} />
                        </div>
                    </div>
                    <div className="chatting-user-info-section" style={{ display: "block", overflow: "auto" }}>
                        <ChatUserInfo />
                    </div>
                </div>
            </div>
        </div>
    );

    if (videoCallStatus === 1) {
        render = (
            <VideoChat roomName={channelName} token={videoToken} chatInfo={chatInfo} />
        );
    }
    return render;
}

