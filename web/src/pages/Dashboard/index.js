import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import './style.css';
import AppBar from '../../components/AppBar';
import imgLogin from '../../assets/login.png';

function Dashboard(props) {
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

export default connect(state => ({ state }))(Dashboard);