import React, { useState, useCallback, useEffect } from 'react';
import Lobby from './Lobby';
import Room from './Room';
import axios from 'axios';
import { server } from '../../config/server';
import { useHistory } from 'react-router';
import { SideBar } from '../sideBar';
import { ChatWindow } from './chatWindow';
import { DoctorNotes } from '../userDataComponent/doctorNotes/doctorNotes';

const VideoChat = ({roomName, token,chatInfo}) => {
  const [username, setUsername] = useState('');
  const history = useHistory();
  const [videoCallStatus, setVideoCallStatus] = useState(0);
  const [channelName, setChannelName] = useState("");

  const createNewRoom = () => {
    setVideoCallStatus(1);
  }

  const config = {
    headers: {
      'Authorization': 'Bearer ' + localStorage.token
    }
  }

  const handleLogout = useCallback(event => {
    history.push("/chat");
    window.location.reload();
  }, []);

  let render;
  render = (
    <div style={{width: "100%", height: "100%"}}>
      <SideBar select={"chat"} />
      <div className="main-section">
        <div style={{width: "100%", height: "100%", padding: "20px"}}>
          <div className="row video-window" style={{width: "97%", marginBottom: "30px"}}>
            <div className="col-6">
              <div className="card-section" style={{width: "100%", height: "100%"}}>
                <Room roomName={roomName} token={token} handleLogout={handleLogout} />
              </div>
            </div>
            <div className="col-6" style={{height: "100%"}}>
              <div className="card-section" style={{height: "100%", width: "100%"}}>
                <ChatWindow page={"video"} roomName={roomName} chatInfo={chatInfo} />
              </div>
            </div>
          </div>
          <div className="row col-12">
            <DoctorNotes />
          </div>
        </div>
      </div>
    </div>
  );
  return render;
};

export default VideoChat;
