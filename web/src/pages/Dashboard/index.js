import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import './style.css';
import AppBar from '../../components/AppBar';
import imgLogin from '../../assets/login.png';

export default function Dashboard() {
    const history = useHistory();


    return (
        <div>
            <AppBar />
            <div className="dashboard-container" >
                <img src={imgLogin} alt="Login" />
            </div>
        </div>
    );
}
