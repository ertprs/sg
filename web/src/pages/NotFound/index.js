import React from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import './style.css';

function NotFound(props) {
    const history = useHistory();
    const header = { headers: { hash: props.state.user.hash }};

    return (
        <div className="not-found-container">
           <h1> Acesso restrito </h1>
           <button onClick={()=> history.push('/')}> Voltar </button>
           
        </div>
    );
}

export default connect(state => ({ state }))(NotFound);
