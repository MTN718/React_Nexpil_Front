import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChangeEmail } from './changeEmail';
import { ChangePassword  } from './changePassword';


import "./style.css";
 
export const Setting = () => {

    return (
        <div className="row col-12 main" style={{margin: "auto"}}>
            <div className="col-6">
                <ChangeEmail />
            </div>
            <div className="col-6">
                <ChangePassword />
            </div>
        </div>
    );
}
