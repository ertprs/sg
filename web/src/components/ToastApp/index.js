import React from 'react';
import { Toast } from 'react-bootstrap';
import { connect } from 'react-redux';
import './style.css';
import * as toastActions from '../../store/actions/toast';

function ToastApp(props) {
    return (
        <div className="toast-container">
            <Toast 
                autohide
                delay="5000"
                className="toast"
                show={props.state.toast.visible} 
                onClose={() => props.dispatch(toastActions.setToast(false, '', ''))} >
                <Toast.Header>
                    <strong className="mr-auto">SG</strong>
                </Toast.Header>
                <Toast.Body>{props.state.toast.message}</Toast.Body>
            </Toast>
        </div>
    );
}
export default connect(state => ({ state }))(ToastApp);