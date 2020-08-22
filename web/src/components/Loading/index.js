import React from 'react';
import { Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import './style.css';

function Loading(props) {

    return (
        <div
            className="loading-container"
            style={props.state.loading.visible ? { height: '100%' } : { height: '0' }}>
            {props.state.loading.visible ?
                <Spinner
                    animation="grow"
                    variant="success"
                    className="loading-spinner" />
                : <></>}
        </div >
    );
}
export default connect(state => ({ state }))(Loading);