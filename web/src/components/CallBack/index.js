import React, { useState } from 'react';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { Modal } from 'react-bootstrap';
import './style.css';

import api from '../../services/api';

import * as loadingActions from '../../store/actions/loading';
import * as callBackActions from '../../store/actions/callback';
import * as toastActions from '../../store/actions/toast';

function CallBack(props) {
    const [registers, setRegisters] = useState([]);

    const handleSearch = async (name) => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get(props.state.callback.table + '/find-by-name/' + name)
            if (res.data.error) {
                props.dispatch(loadingActions.setLoading(false));
                props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + res.data.error));
                return 0;
            }
            setRegisters(res.data);
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }

    return (
        <div
            className="callback-container"
            style={props.state.callback.visible ? { height: '100%' } : { height: '0' }}>
            {props.state.callback.visible ?
                <Modal className="modal callback" show={props.state.callback.visible} onHide={() => props.dispatch(callBackActions.setCallback(false, '', ''))}>
                    <Modal.Header>
                        <Modal.Title> Consulta de registros </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="filters">
                            <input
                                className="field-search"
                                placeholder="Busca por nome"
                                onChange={e => handleSearch(e.target.value)}
                                type="text" />
                        </div>

                        <MDBTable responsive hover bordered className="table">
                            <MDBTableHead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nome</th>
                                    <th>Selecionar</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {registers.map(reg => (
                                    <tr key={reg.id}>
                                        <td>{reg.id}</td>
                                        <td>{reg.name}</td>
                                        <td><button onClick={() => props.dispatch(callBackActions.setCallback(false, '', reg.id))}> Selecionar </button> </td>
                                    </tr>
                                ))}
                            </MDBTableBody>
                        </MDBTable>
                    </Modal.Body>
                </Modal>
                : <></>}
        </div >
    );
}
export default connect(state => ({ state }))(CallBack);