import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import './style.css';
import * as loadingActions from '../../store/actions/loading';
import * as userActions from '../../store/actions/user';
import * as toastActions from '../../store/actions/toast';
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
        props.dispatch(toastActions.setToast(true, 'success', 'Usuario ou senha incorretos.'));
        else {
            props.dispatch(userActions.setUser(res.data.id, res.data.name, res.data.user_type, res.data.hash));
            localStorage.setItem('@sg/user/id', res.data.id);
            localStorage.setItem('@sg/user/name', res.data.name);
            localStorage.setItem('@sg/user/user_type', res.data.user_type);
            localStorage.setItem('@sg/user/hash', res.data.hash);
            history.push('/');
        }

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