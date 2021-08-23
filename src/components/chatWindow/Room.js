import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import { Icon, InlineIcon } from '@iconify/react';
import phoneHangUp from '@iconify/icons-icomoon-free/phone-hang-up';

const Room = ({ roomName, token, handleLogout }) => {

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (token) {
      const participantConnected = participant => {
        setParticipants(prevParticipants => [...prevParticipants, participant]);
      };

      const participantDisconnected = participant => {
        setParticipants(prevParticipants =>
          prevParticipants.filter(p => p !== participant)
        );
      };

      Video.connect(token, {
        name: roomName
      }).then(room => {
        setRoom(room);
        room.on('participantConnected', participantConnected);
        room.on('participantDisconnected', participantDisconnected);
        room.participants.forEach(participantConnected);
      });

      return () => {
        setRoom(currentRoom => {
          if (currentRoom && currentRoom.localParticipant.state === 'connected') {
            currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
              trackPublication.track.stop();
            });
            currentRoom.disconnect();
            return null;
          } else {
            return currentRoom;
          }
        });
      };
    }
  }, [roomName, token]);

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ));

  /* console.log(room, "room")
  console.log(participants, "particpants") */

  return (
    <div className="room">
      {remoteParticipants}
      <div className="remote-participants" style={{ position: "absolute", width: "30%", height: "20%", bottom: "10%", right: "10%" }}>
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
            ''
          )}
      </div>
      <div style={{ position: "absolute", right: "50%", bottom: "4%", cursor: "pointer" }} onClick={handleLogout} className="video-hang-button">
        <Icon color="white" fontSize="30px" icon={phoneHangUp} />
      </div>
    </div>
  );
};

export default Room;


