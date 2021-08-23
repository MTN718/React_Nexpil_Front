import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    GET_USER, SET_PATIENT_SELECTED, GET_PATIENT_PERSONAL_DATA, GET_PATIENTS_LIST, GET_PATIENT_TASK_DATA,
    GET_PATIENT_MEDICATION_DATA, ADD_NEW_PATIENT, GET_PATIENT_HEALTH_DATA, GET_ASSIGNED_DATA
} from '../../store/actionNames';
import './style.css';
import { BsSearch, BsFillPlusCircleFill, BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { sharedColors } from '../../theme/sharedColor';
import { useHistory } from "react-router-dom";
import VizSensor from 'react-visibility-sensor';
import { Fade } from '@material-ui/core';

export const AvatarsContainer = ({ setMainSection, setSectionTitle }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [active, setActive] = useState(false);
    // State variables
    const [arrowDirection, setArrowDirection] = useState(true);
    const patientList = useSelector(state => state.patientsList);
    const userRole = useSelector(state => state.userRole);
    const [usersData, setUsersData] = useState();
    let check_user_name = "";

    // Style for the highlighted text.
    const specialColorFont = {
        color: sharedColors.primaryFontColor,
    }
    const showAvatar = useRef();

    // Set usersData to data from server
    useEffect(() => {
        setUsersData(patientList);
    }, [patientList]);

    // select user
    const setHighlightedUser = (userItem) => {
        let virtualArray = [];
        for (let i = 0; i < usersData.length; i++) {
            if (i !== userItem) virtualArray.push({ ...usersData[i], selected: false });
            if (i === userItem) virtualArray.push({ ...usersData[i], selected: true })
        }
        setUsersData(virtualArray);

        if (setMainSection) setMainSection("userData");

        dispatch({ type: GET_USER, payLoad: patientList[userItem] });
        dispatch({ type: SET_PATIENT_SELECTED, payLoad: usersData[userItem] });

        dispatch({ type: GET_PATIENT_PERSONAL_DATA, payLoad: usersData[userItem].id });
        dispatch({ type: GET_PATIENT_MEDICATION_DATA, payLoad: usersData[userItem].id });
        dispatch({ type: GET_PATIENT_HEALTH_DATA, payLoad: usersData[userItem].id });
        dispatch({ type: GET_ASSIGNED_DATA, payLoad: usersData[userItem].id });
        dispatch({ type: GET_PATIENT_TASK_DATA, payLoad: usersData[userItem].id });
        dispatch({ type: ADD_NEW_PATIENT, payLoad: false });

        const width = window.innerWidth;
        if (width <= 890) {
            showAvatar.current.className = showAvatar.current.className === "avatar-main-section" ? "avatar-main-section-showed" : "avatar-main-section";
            setArrowDirection(true);
        }
    }

    // Show patients list when mobile responsive
    const toggleAvatar = () => {
        showAvatar.current.className = showAvatar.current.className === "avatar-main-section" ? "avatar-main-section-showed" : "avatar-main-section";
        setArrowDirection(!arrowDirection);
    }

    const handleSearch = (e) => {
        if (e != "") {
            var filteredUsers = usersData.filter(user => user.patient_name.toLowerCase().includes(e));
            setUsersData(filteredUsers);
        } else {
            setUsersData(patientList);
        }
    }

    const newPatient = () => {
        dispatch({ type: ADD_NEW_PATIENT, payLoad: true });
    };

    return (
        <div className="avatars">
            <div className="show-avatars" onClick={() => toggleAvatar()}>
                {arrowDirection ? <BsChevronCompactDown color="white" /> : <BsChevronCompactUp color="white" />}
            </div>
            <div className="avatar-main-section" ref={showAvatar}>
                <div className="avatars-title-container">
                    <h1 className="avatars-title-text">
                        {setSectionTitle}
                        <span style={specialColorFont}>.</span></h1>
                    <BsFillPlusCircleFill onClick={() => { newPatient() }} color={sharedColors.primaryButtonsColor} className="avatars-title-add-button" />
                </div>
                <div className="search-bar">
                    <BsSearch size="18px" color={sharedColors.primaryFontColor} className="search-icon" />
                    <input onChange={(e) => handleSearch(e.target.value)} type="text" placeholder="Search" className="search-input" />
                </div>
                <div className="users-avatar" id="avatar-scrollbar">
                    {usersData && usersData.map((user, i) => {
                        let userNameSpan = "";
                        if (check_user_name != user.patient_name.slice(0, 1).toUpperCase()) {
                            userNameSpan = (
                                <div>
                                    { user.patient_name.slice(0, 1).toUpperCase()}
                                </div>
                            )
                            check_user_name = user.patient_name.slice(0, 1).toUpperCase();
                        }
                        return (
                            <Avatar key={i} setHighlightedUser={() => setHighlightedUser(i)} user={user} userNameSpan={userNameSpan} />
                        );
                    }
                    )}
                </div>
            </div>
        </div>
    )
}

export const Avatar = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const domRef = React.useRef();
    const [isVisible, setVisible] = React.useState(false);
    useEffect(() => {
        const options = {
            root: document.querySelector('#avatar-scrollbar'),
            rootMargin: '-70px',
            // threshold: [0.98, 0.99, 1]
        }
        const observer = new IntersectionObserver(entries => {
            setVisible(entries[0].isIntersecting);
            if (!entries[0].isIntersecting) {
                setVisible(false);
            }
        }, options);

        observer.observe(domRef.current);

        return () => observer.unobserve(domRef.current);
    }, []);
    const { user, userNameSpan } = props;

    return (
        <div ref={domRef} id="avatar-item">
            {userNameSpan}
            <div onClick={() => props.setHighlightedUser()}
                // className={isVisible ? 'is-visible' : ''}
                className={`${isVisible ? 'is-visible' : 'is-invisible'} ${user.selected == false ? "user-avatar" : "user-avatar-selected"}`}
            >
                <img className="avatar-image" src={user.userimage} />
                <div className="user-info">
                    <p className="user-name-text">{user.patient_name}</p>
                    <p className="user-chats-text">{user.DOB}</p>
                </div>
                {/* <div className="chat-info-part">
                                            <p className={user.selected == false ? "chat-date" : "chat-date-selected"}>Jul 29</p>
                                        </div> */}
            </div>
        </div>
    );
}