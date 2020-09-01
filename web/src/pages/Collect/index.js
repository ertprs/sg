import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import AppBar from '../../components/AppBar';


function Client(props) {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchField, setSearchField] = useState('');
    const [search, setSearch] = useState([]);

    const [selectFilterField, setSelectFilterField] = useState('phone')

    //FIELDS
    const [client, setClient] = useState('');
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('Aberto');
    const [dtEmission, setDtEmission] = useState('');
    const [document, setDocument] = useState('');
    const [typeMaturity, setTypeMaturity] = useState('');
    const [dtBegin, setDtBegin] = useState('');
    const [dtEnd, setDtEnd] = useState('');
    const [dtMaturity, setDtMaturity] = useState('');
    const [account, setAccount] = useState('');
    const [days, setDays] = useState(0);
    const [value, setValue] = useState(0);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        loadRegisters();
    }, []);

    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('collects')
            setRegisters(res.data);
            setSearch(res.data)
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }

    const handleSubmit = async () => {
        props.dispatch(loadingActions.setLoading(true));

        //VALIDAÇÕES
        if (!client) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Preencha os campos obrigatórios!'));
            return 0
        }

        //CRIA OBJETO PARAR CADASTRAR/ALTERAR
        const regTemp = {
            client,
            code,
            status,
            dtEmission,
            document,
            typeMaturity,
            dtBegin,
            dtEnd,
            dtMaturity,
            value,
            amount,
            account,
            days
        }
        setRegister(regTemp);

        try {
            if (isUpdating) {
                //ALTERAÇÃO
                const res = await api.put(`collects/${register.id}`, regTemp)
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //CADASTRO
                const res = await api.post('collects', regTemp);
                console.log(res)
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(loadingActions.setLoading(false));
                props.dispatch(toastActions.setToast(true, 'success', 'Registro cadastrado!'));
            }
            setShow(false)
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }

    }


    const handleDelete = async () => {
        props.dispatch(loadingActions.setLoading(true));
        try {
            const res = await api.delete(`collects/${register.id}`);
            setIsUpdating(false);
            setRegister({});
            clearValues();
            setShow(false);
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Registro deletado!'));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }


    const handleSearch = async () => {
        var tempSearch = [];
        if (selectFilterField === 'name')
            tempSearch = registers.filter(find =>
                find.client_name.toLowerCase().indexOf(String(searchField).toLowerCase()) > -1
            )
        setSearch(tempSearch)
    }

    const setUpdating = (reg) => {
        setIsUpdating(true);
        setRegister(reg);
        setClient(reg.client);
        setStatus(reg.status);
        setDtEmission(reg.dt_emission);
        setDays(reg.days);
        setShow(true);
    }

    const clearValues = () => {
        setClient('')
        setCode('')
        setStatus('Aberto')
        setDtEmission('')
        setDocument('');
        setTypeMaturity('');
        setDtBegin('');
        setDtEnd('');
        setDtMaturity('');
        setAccount('');
        setDays(0);
        setValue(0);
        setAmount(0);

        loadRegisters();
    }

    const setNew = () => {
        clearValues();
        setDtEmission(moment().format('L'));
        setShow(true);
    }


    return (
        <div className="collect-container">
            <AppBar />
            <div className="filters">
                <select
                    className="select-search"
                    onChange={e => setSelectFilterField(e.target.value)}>
                    <option value="name">Nome</option>
                    <option value="phone" selected>Telefone</option>
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
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Dt. Emissão </th>
                        <th>Dias </th>
                        <th>Empresa</th>
                        <th>Opções</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.client + ' - ' + reg.client_name}</td>
                            <td>{reg.status}</td>
                            <td>{reg.dt_emission}</td>
                            <td>{reg.days}</td>
                            <td>{reg.companie + ' - ' + reg.companie_name}</td>
                            <td><button onClick={() => setUpdating(reg)}>ABRIR</button></td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>Cadastro de cobraça</Modal.Title>
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

                    <label> Dt. emissão </label>
                    <label> {': ' + dtEmission} </label>

                    <br />

                    <label> Cliente </label>
                    <input
                        type="text"
                        placeholder="Código do cliente"
                        value={client}
                        onChange={e => setClient(e.target.value)} />

                    <label> Vencimento </label>
                    <input
                        type="text"
                        placeholder="Vencimento"
                        value={dtMaturity}
                        onChange={e => setDtMaturity(e.target.value)} />


                    <label> Status </label>
                    <select
                        className="select-search"
                        onChange={e => setStatus(e.target.value)}>
                        <option value="Aberto" selected={status === 'Aberto' ? true : false}>Aberto</option>
                        <option value="Fechado" selected={status === 'Fechado' ? true : false}>Fechado</option>
                    </select>

                </Modal.Body>
                <div className="modal-footer-container">
                    <button onClick={handleSubmit}> Salvar </button>
                    <button onClick={handleDelete} style={{ backgroundColor: '#ff6666' }} > Apagar </button>
                    <button onClick={() => setShow(false)} style={{ backgroundColor: '#668cff' }} > Fechar </button>
                </div>
            </Modal>

            <div className="fab-container">
                <button onClick={() => setNew()}> + </button>
            </div>
        </div>
    );
}

export default connect(state => ({ state }))(Client);