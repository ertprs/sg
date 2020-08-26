import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './style.css';
import api from '../../services/api';
import AppBar from '../../components/AppBar';
import imgLogin from '../../assets/login.png';

export default function Dashboard() {
    const history = useHistory();

    useEffect(() => {
        
    },[])


    return (
        <div>
            <AppBar />
            <div className="dashboard-container" >
                <img src={imgLogin} alt="Login" />
            </div>
        </div>
    );
}
