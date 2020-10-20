import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import Downshift from 'downshift';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import CurrencyFormat from 'react-currency-format';
import CurrencyInput from 'react-currency-input-field';
import moment from 'moment';

import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import * as callbackActions from '../../store/actions/callback';

import AppBar from '../../components/AppBar';


function Billet(props) {
    const history = useHistory();
    const header = { headers: { hash: props.state.user.hash }};
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState([]);
    const [searchField, setSearchField] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectFilterField, setSelectFilterField] = useState('dt_due')

    const [companie, setCompanie] = useState('');
    const [companieName, setCompanieName] = useState('');
    const [attendance, setAttendance] = useState('');
    const [client, setClient] = useState('');
    const [clientName, setClientName] = useState('');
    const [dtGeneration, setDtGeneration] = useState('');
    const [dtDue, setDtDue] = useState('');
    const [qtParcel, setQtParcel] = useState('');
    const [parcel, setParcel] = useState('');
    const [status, setStatus] = useState('');
    const [billetTotal, setBilletTotal] = useState('');
    const [negotiatedValue, setNegotiatedValue] = useState('');
    const [obs, setObs] = useState('');

    useEffect(() => {
        loadRegisters();
    }, []);

    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('billets', header)
            if (res.data.error) {
                props.dispatch(loadingActions.setLoading(false));
                props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + res.data.error));
                return 0;
            }
            setRegisters(res.data);
            setSearch(res.data)
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }

    const handleSubmit = async () => {
        //VALIDAÇÕES
        if (!attendance || !client) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Preencha os campos obrigatórios!'));
            return 0
        }

        props.dispatch(loadingActions.setLoading(true));
        //CRIA OBJETO PARAR CADASTRAR/ALTERAR
        const regTemp = {
            companie,
            attendance,
            client,
            dt_generation: dtGeneration,
            dt_due: dtDue,
            qt_parcel: qtParcel,
            parcel,
            negotiated_value: negotiatedValue,
            billet_total: billetTotal,
            status,
            obs
        }
        setRegister(regTemp);
        try {
            if (isUpdating) {
                //ALTERAÇÃO
                const res = await api.put(`billets/${register.id}`, regTemp, header)
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //CADASTRO
                const res = await api.post('billets', regTemp, header);
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro cadastrado!'));
            }
            setShow(false)
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
        props.dispatch(loadingActions.setLoading(false));
    }


    const handleDelete = async () => {
        props.dispatch(loadingActions.setLoading(true));
        try {
            const res = await api.delete(`billets/${register.id}`, header);
            loadRegisters();
            setIsUpdating(false);
            setRegister({});
            clearValues();
            setShow(false)
            props.dispatch(toastActions.setToast(true, 'success', 'Registro deletado!'));
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
        props.dispatch(loadingActions.setLoading(false));
    }

    const handleSearch = async () => {
        var tempSearch = [];
        if (selectFilterField === 'dtDue')
            tempSearch = registers.filter(find =>
                String(find.dt_due).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)
        setSearch(tempSearch)
    }

    const setUpdating = async (reg) => {
        setIsUpdating(true);
        setRegister(reg);
        setCompanie(reg.companie);
        setCompanieName(reg.companie_name);
        setClient(reg.client)
        setClientName(reg.client_name)
        setAttendance(reg.attendance);
        setDtGeneration(reg.dt_generation);
        setDtDue(reg.dt_due);
        setQtParcel(reg.qt_parcel);
        setParcel(reg.parcel);
        setStatus(reg.status);
        setObs(reg.obs)
        setShow(true);
    }

    const clearValues = () => {
        setCompanie('');
        setCompanieName('');
        setClient('');
        setClientName('');
        setAttendance('');
        setDtGeneration(moment().format('L'));
        setDtDue('');
        setQtParcel('');
        setParcel('');
        setStatus('NÃO GERADO');
        setObs('')
        setShow(true);
    }


    const setNew = () => {
        setIsUpdating(false);
        clearValues();
        setShow(true);
    }


    const getByAttendance = async attendanceId => {
        const res = await api.get(`attendances/get-by-id/${attendanceId}`, header);
        if (!res.data)
            return;

        setCompanie(res.data.companie);
        setCompanieName(res.data.companie_name);
        setClient(res.data.client);
        setClientName(res.data.client_name);
        setNegotiatedValue(res.data.negotiated_value);
        setBilletTotal(res.data.negotiated_value);
        setQtParcel('1');
        setParcel('1');
        setStatus('NÃO GERADO');
    }

    return (
        <div className="billet-container">
            <AppBar />
            <div className="filters">
                <select
                    className="select-search"
                    onChange={e => setSelectFilterField(e.target.value)}>
                    <option value="dt_due" selected>Dt. Vencimento</option>
                </select>
                <input
                    className="field-search"
                    value={searchField}
                    onChange={e => setSearchField(e.target.value)}
                    type="text"
                    onKeyPress={handleSearch} />
            </div>

            <MDBTable responsive hover bordered>
                <MDBTableHead>
                    <tr>
                        <th>Código</th>
                        <th>Atendimento</th>
                        <th>Credor</th>
                        <th>Devedor</th>
                        <th>Dt. Vencimento</th>
                        <th>Dt. Geração</th>
                        <th>Status</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr
                            style={{ cursor: 'pointer' }}
                            onClick={() => setUpdating(reg)}
                            key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.attendance}</td>
                            <td>{reg.companie + ' - ' + reg.companie_name}</td>
                            <td>{reg.client + ' - ' + reg.client_name}</td>
                            <td>{reg.dt_due}</td>
                            <td>{reg.dt_generation}</td>
                            <td>{reg.status}</td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => console.log('Cant close')}>
                <Modal.Header>
                    <Modal.Title> Geração de Boletos </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        register.id ?
                            <div>
                                <label> Código </label>
                                <label> {': ' + register.id} </label>
                                <br />
                            </div>
                            : ''
                    }

                    <div style={{ width: 150 }} >
                        <label> Código do Atendimento </label>
                        <input
                            type="text"
                            placeholder="Codigo"
                            value={attendance}
                            onChange={e => setAttendance(e.target.value)}
                            onBlur={e => getByAttendance(e.target.value)} />
                    </div>

                    <label> Credor </label>
                    <div className="inline">
                        <input
                            style={{ width: 90, marginRight: 5 }}
                            type="text"
                            placeholder="Código"
                            value={companie}
                            readOnly />
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={companieName}
                            readOnly />
                    </div>

                    <label> Devedor </label>
                    <div className="inline">
                        <input
                            style={{ width: 90, marginRight: 5 }}
                            type="text"
                            placeholder="Código"
                            value={client}
                            readOnly />
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={clientName}
                            readOnly />
                    </div>

                    <div className="inline">

                        <div style={{ width: 150, marginRight: 5 }}>
                            <label> Dt. Geração </label>
                            <input
                                type="text"
                                placeholder="Dt. Geração"
                                value={dtGeneration}
                                readOnly />
                        </div>

                        <div style={{ width: 150 }}>
                            <label> Dt. Vencimento </label>
                            <CurrencyFormat
                                format="##/##/####"
                                placeholder="Dt. de vencimento"
                                value={dtDue ? dtDue : ''}
                                onValueChange={e => setDtDue(e.formattedValue)}
                                readOnly={isUpdating} />
                        </div>
                    </div>

                    <div className="inline">
                        <div style={{ width: 150, marginRight: 5 }}>
                            <label> Valor Negociado </label>
                            <CurrencyInput
                                prefix="R$ "
                                placeholder="Valor Negociado"
                                decimalSeparator=","
                                groupSeparator="."
                                precision="2"
                                value={negotiatedValue ? negotiatedValue : ''}
                                readOnly />
                        </div>
                        <div style={{ width: 150 }}>
                            <label> Valor da Parcela </label>
                            <CurrencyInput
                                prefix="R$ "
                                placeholder="Valor da Parcela"
                                decimalSeparator=","
                                groupSeparator="."
                                precision="2"
                                value={billetTotal ? billetTotal : ''}
                                onChange={e => setBilletTotal(e)}
                                readOnly={isUpdating} />
                        </div>
                    </div>

                    <div className="inline">
                        <div style={{ width: 150, marginRight: 5 }}>
                            <label> Qtde. Parcelas </label>
                            <input
                                type="text"
                                placeholder="Qtde. Parcelas"
                                value={qtParcel}
                                onChange={e => setQtParcel(e.target.value)}
                                readOnly={isUpdating} />
                        </div>

                        <div style={{ width: 150 }}>
                            <label> Parcela </label>
                            <input
                                type="text"
                                placeholder="Parcela"
                                value={parcel}
                                onChange={e => setParcel(e.target.value)}
                                readOnly={isUpdating} />
                        </div>
                    </div>

                    <div style={{ width: 300 }}>
                        <label> Status </label>
                        <input
                            type="text"
                            placeholder="Status"
                            value={status}
                            readOnly />
                    </div>

                    <label>  Observações </label>
                    <input
                        type="text"
                        placeholder="Observações do billete"
                        value={obs}
                        onChange={e => setObs(e.target.value)} />


                </Modal.Body>
                <div className="modal-footer-container">
                    <button onClick={handleSubmit}> Salvar </button>
                    {isUpdating ? <button onClick={handleDelete} style={{ backgroundColor: '#ff6666' }} > Apagar </button> : <></>}
                    <button onClick={() => setShow(false)} style={{ backgroundColor: '#668cff' }} > Fechar </button>
                </div>
            </Modal>

            <div className="fab-container">
                <button onClick={setNew}> + </button>
            </div>
        </div>
    );
}

export default connect(state => ({ state }))(Billet);