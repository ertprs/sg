import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import './style.css';
import * as loadingActions from '../../store/actions/loading';
import api from '../../services/api';
import imgLogin from '../../assets/login.png';

function Login(props) {
    const history = useHistory();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();



    const handleLogin = async e => {
        e.preventDefault();
        props.dispatch(loadingActions.setLoading(true));
        const res = await api.post('users/login', {
            username: username,
            password: password
        });

        if (!res.data)
            console.log('Usuario e ou senha invalidos.')
        else
            history.push('dashboard');

            props.dispatch(loadingActions.setLoading(false));
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <img src={imgLogin} alt="Login" />
                <label htmlFor="fname">Usuario</label>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)} />
                <label htmlFor="lname">Senha</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)} />

                <button type="submit"> Login </button>

            </form>
        </div>
    );
}

export default connect(state => ({ state }))(Login);