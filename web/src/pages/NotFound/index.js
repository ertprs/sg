import React from 'react';
import { useHistory } from "react-router-dom";
import './style.css';

export default function NotFound() {
    const history = useHistory();
    return (
        <div className="not-found-container">
           <h1> Esta página não existe </h1>
           <button onClick={()=> history.push('dashboard')}> Voltar </button>
           
        </div>
    );
}
