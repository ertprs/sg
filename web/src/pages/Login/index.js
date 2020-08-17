import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import './style.css';
import api from '../../services/api';
import imgLogin from '../../assets/login.png';


export default function Login() {
    const history = useHistory();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();



    const handleLogin = async e => {
        e.preventDefault();
        const res = await api.post('users/login', {
            username: username,
            password: password
        });

        if (!res.data)
            console.log('Usuario e ou senha invalidos.')
        else
            history.push('dashboard');
    }

    return (
        <div>
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
                <input type="submit" />
            </form>
        </div>
    );
}
