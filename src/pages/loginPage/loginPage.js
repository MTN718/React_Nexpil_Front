import React, {useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import { server } from "../../config/server";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { USER_ROLE_SET } from '../../store/actionNames';

export const LoginPage = () => {
    const dispatch = useDispatch();
    
    const usernameRef = React.useRef();
    const passwordRef = React.useRef();

    const history = useHistory();
    
    useEffect(() => {
        checkUserToken();
    }, []);

    const checkUserToken = () => {
        var token = localStorage.getItem("token");
        if(!token) {
            history.push("/login");
        } else if (token) {
            history.push("/");
        }
    };
    
    const FormHeader = props => (
        <h2 id="headerTitle">{props.title}</h2>
    );

    const handleEnter = (e) => {
        if(e.key == "Enter") {
            onLoginClick();
        }
    }
        
    const Form = props => {
        return (
            <div>
                <div className="login-row">
                    <label>Username</label>
                    <input onKeyDown={handleEnter} ref={usernameRef} type="text" placeholder="Enter your username"/>
                </div>
                <div className="login-row">
                    <label>Password</label>
                    <input onKeyDown={handleEnter} ref={passwordRef} type="password" placeholder="Enter your password"/>
                </div>
                <div id="button" className="login-row">
                    <button onClick={onLoginClick}>{props.title}</button>
                </div>
            </div>
        )
    }
    
    const onLoginClick = (event) => {
        if(!usernameRef.current.value || !passwordRef.current.value) {
            alert("Enter Username or Password");
            return false;
        }
        var user = {
            email: usernameRef.current.value,
            password: passwordRef.current.value
        }
        axios.post(server.serverURL + 'v1/login', user)
        .then(res => {
            var data = res.data.data;
            if(data.access_token) {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("userName", data.user_info.name);
                localStorage.setItem("userImage", data.user_info.userimage);
                localStorage.setItem("userId", data.user_info.id);
                if(localStorage.token){
                    if(data.role_id == 1) {
                        localStorage.setItem("userRole", "admin");
                        dispatch({ type: USER_ROLE_SET, payLoad: "admin" });
                    } else {
                        localStorage.setItem("userRole", "user");
                        dispatch({ type: USER_ROLE_SET, payLoad: "user" });
                    }
                    history.push("/");
                }
            } else {
                alert("This user isn't registered user");
            }
        })
    }
    
    const OtherMethods = props => {
        return (
            <div id="alternativeLogin">
                <label>Or sign in with:</label>
                <div id="iconGroup">
                <Facebook />
                <Twitter />
                <Google />
                </div>
            </div>
        );
    };
    
    const Facebook = props => (
      <a href="#" id="facebookIcon"></a>
    );
    
    const Twitter = props => (
      <a href="#" id="twitterIcon"></a>
    );
    
    const Google = props => (
      <a href="#" id="googleIcon"></a>
    );
    
    return(
        <div className="page-main-containe" id="loginform">
        <FormHeader title="Login" />
        <Form title="Login" />
        {/* <OtherMethods /> */}
      </div>
    )
}

