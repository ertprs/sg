import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import * as callbackActions from '../../store/actions/callback';
import AppBar from '../../components/AppBar';


function Client(props) {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchField, setSearchField] = useState('');
    const [search, setSearch] = useState([]);
    const [selectFilterField, setSelectFilterField] = useState('client_document')

    //FIELDS
    const [code, setCode] = useState('');
    const [client, setClient] = useState('');
    const [clientName, setClientName] = useState('');
    const [status, setStatus] = useState('Aberto');
    const [companie, setCompanie] = useState('');
    const [companieName, setCompanieName] = useState('');
    const [account, setAccount] = useState('');
    const [document, setDocument] = useState('');
    const [dtMaturity, setDtMaturity] = useState('');
    const [days, setDays] = useState(0);
    const [value, setValue] = useState(0);
    const [amount, setAmount] = useState(0);
    const [penalty, setPenalty] = useState(0);
    const [interest, setInterest] = useState(0);
    const [updatedDebt, setUpdatedDebt] = useState(0);
    const [honorary, setHonorary] = useState(0);
    const [maximumDiscount, setMaximumDiscount] = useState(0);
    const [negotiatedValue, setNegotiatedValue] = useState(0);
    const [obs, setObs] = useState('');


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
            document,
            dt_maturity: dtMaturity,
            value,
            amount,
            account,
            days,
            companie,
            penalty,
            interest,
            updated_debt: updatedDebt,
            honorary,
            maximum_discount: maximumDiscount,
            negotiated_value: negotiatedValue,
            obs: obs
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
        if (selectFilterField === 'id')
            tempSearch = await registers.filter(find =>
                String(find.id).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'code')
            tempSearch = registers.filter(find =>
                String(find.code).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'client_name')
            tempSearch = registers.filter(find =>
                String(find.client_name).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'client_document')
            tempSearch = registers.filter(find =>
                String(find.client_document).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)
        setSearch(tempSearch)
    }

    const setUpdating = async (reg) => {
        let resCompanieName = await api.get(`companies/find-by-id/${reg.companie}`);
        if (resCompanieName.data)
            resCompanieName = resCompanieName.data.name
        else
            resCompanieName = '';


        let resClientName = await api.get(`clients/find-by-id/${reg.client}`);
        if (resClientName.data)
            resClientName = resClientName.data.name
        else
            resClientName = '';


        
        setIsUpdating(true);
        setRegister(reg);
        setClient(reg.client);
        setClientName(resClientName);
        setCode(reg.code)
        setStatus(reg.status);
        setDays(reg.days);
        setCompanie(reg.companie)
        setCompanieName(resCompanieName)
        setPenalty(reg.penalty)
        setInterest(reg.interest)
        setUpdatedDebt(reg.updated_debt)
        setDocument(reg.document)
        setHonorary(reg.honorary)
        setAccount(reg.account)
        setDtMaturity(reg.dt_maturity)
        setMaximumDiscount(reg.maximum_discount)
        setNegotiatedValue(reg.negotiated_value)
        setValue(reg.value);
        setAmount(reg.amount);
        setObs(reg.obs)

        setShow(true)
    }

    const clearValues = () => {
        setClient('')
        setCode('')
        setStatus('Aberto')
        setDocument('');
        setDtMaturity('');
        setAccount('');
        setCompanie('')
        setPenalty('')
        setInterest('')
        setUpdatedDebt('')
        setHonorary('')
        setMaximumDiscount('')
        setNegotiatedValue('')
        setObs('')
        setDays(0);
        setValue(0);
        setAmount(0);
        loadRegisters();
    }

    const setNew = () => {
        setIsUpdating(false);
        clearValues();
        setShow(true);
    }

    return (
        <div className="collect-container">
            <AppBar />
            <div className="filters">
                <select
                    className="select-search"
                    onChange={e => setSelectFilterField(e.target.value)}>
                    <option value="id">Código</option>
                    <option value="code" selected>Código no cliente</option>
                    <option value="client_name" selected>Nome do cliente</option>
                    <option value="client_document" selected>Documento do cliente</option>
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
                        <th>Dt. Venc. </th>
                        <th>Total </th>
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
                            <td>{reg.dt_maturity}</td>
                            <td>{reg.amount}</td>
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

                    <br />

                    <label> Client </label>
                    <div className="field-other-table">
                        <input
                            type="text"
                            placeholder="Cód."
                            value={client}
                            onChange={async e => {
                                setClient(e.target.value)
                                if (!e.target.value) {
                                    setClientName('')
                                    return
                                }
                                const res = await api.get(`clients/find-by-id/${e.target.value}`)
                                if (res.data)
                                    setClientName(res.data.name)
                                else
                                setClientName('')
                            }} />
                        <input
                            type="text"
                            readOnly
                            value={clientName} />
                        <button onClick={() => props.dispatch(callbackActions.setCallback(true, 'clients', companie))}> Consultar </button>
                        <br />
                    </div>


                    <label> Código </label>
                    <input
                        type="text"
                        placeholder="Código do cliente na empresa"
                        value={code}
                        onChange={e => setCode(e.target.value)} />


                    <label> Dt. Vencimento </label>
                    <input
                        type="text"
                        placeholder="Data de vencimento"
                        value={dtMaturity}
                        onChange={e => setDtMaturity(e.target.value)} />


                    <label> Status </label>
                    <select
                        className="select-search"
                        onChange={e => setStatus(e.target.value)}>
                        <option value="Aberto" selected={status === 'Aberto' ? true : false}>Aberto</option>
                        <option value="Fechado" selected={status === 'Fechado' ? true : false}>Fechado</option>
                    </select>

                    <label> Documento </label>
                    <input
                        type="text"
                        placeholder="Documento"
                        value={document}
                        onChange={e => setDocument(e.target.value)} />

                    <label> Valor </label>
                    <input
                        type="text"
                        placeholder="Valor"
                        value={value}
                        onChange={e => setValue(e.target.value)} />

                    <label> Montante </label>
                    <input
                        type="text"
                        placeholder="Montante"
                        value={amount}
                        onChange={e => setAmount(e.target.value)} />

                    <label> Conta </label>
                    <input
                        type="text"
                        placeholder="Conta"
                        value={account}
                        onChange={e => setAccount(e.target.value)} />

                    <label> Dias </label>
                    <input
                        type="number"
                        placeholder="Dias"
                        value={days}
                        onChange={e => setDays(e.target.value)} />

                    <label> Empresa </label>
                    <div className="field-other-table">
                        <input
                            type="text"
                            placeholder="Cód."
                            value={companie}
                            onChange={async e => {
                                setCompanie(e.target.value)
                                if (!e.target.value) {
                                    setCompanieName('')
                                    return
                                }
                                const res = await api.get(`companies/find-by-id/${e.target.value}`)
                                if (res.data)
                                    setCompanieName(res.data.name)
                                else
                                    setCompanieName('')
                            }} />
                        <input
                            type="text"
                            readOnly
                            value={companieName} />
                        <button onClick={() => props.dispatch(callbackActions.setCallback(true, 'companies', companie))}> Consultar </button>
                        <br />
                    </div>

                    <label> Multa </label>
                    <input
                        type="text"
                        placeholder="Multa"
                        value={penalty}
                        onChange={e => setPenalty(e.target.value)} />

                    <label> Juros </label>
                    <input
                        type="text"
                        placeholder="Jutos"
                        value={interest}
                        onChange={e => setInterest(e.target.value)} />

                    <label> Débito atualizado </label>
                    <input
                        type="text"
                        placeholder="Débito atualizado"
                        value={updatedDebt}
                        onChange={e => setUpdatedDebt(e.target.value)} />

                    <label> Honorário </label>
                    <input
                        type="text"
                        placeholder="Honarário"
                        value={honorary}
                        onChange={e => setHonorary(e.target.value)} />

                    <label> Disconto máximo </label>
                    <input
                        type="text"
                        placeholder="Desconto máximo"
                        value={maximumDiscount}
                        onChange={e => setMaximumDiscount(e.target.value)} />

                    <label> Valor negociado </label>
                    <input
                        type="text"
                        placeholder="Desconto negociado"
                        value={negotiatedValue}
                        onChange={e => setNegotiatedValue(e.target.value)} />

                    <label> Observação </label>
                    <input
                        type="text"
                        placeholder="Observações"
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
                <button onClick={() => setNew()}> + </button>
            </div>
        </div>
    );
}

export default connect(state => ({ state }))(Client);