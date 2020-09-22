import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { AiOutlineSearch } from 'react-icons/ai';
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';

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
    const [client, setClient] = useState('');
    const [clientName, setClientName] = useState('');
    const [dtClosure, setDtClosure] = useState('');
    const [status, setStatus] = useState('Aberto');
    const [companie, setCompanie] = useState('');
    const [companieName, setCompanieName] = useState('');
    const [account, setAccount] = useState('');
    const [document, setDocument] = useState('');
    const [dtMaturity, setDtMaturity] = useState('');
    const [days, setDays] = useState(0);
    const [value, setValue] = useState(0);
    const [updatedDebt, setUpdatedDebt] = useState(0);
    const [defaultHonorary, setDefaultHonorary] = useState(0);
    const [defaultInterest, setDefaultInterest] = useState(0);
    const [interestCalculed, setInterestCalculed] = useState(0);
    const [maximumDiscount, setMaximumDiscount] = useState(0);
    const [negotiatedValue, setNegotiatedValue] = useState(0);
    const [defaultPenalty, setDefaultPenalty] = useState(0);
    const [penaltyCalculed, setPenaltyCalculed] = useState(0);
    const [honoraryCalculed, setHonoraryCalculed] = useState(0);
    const [honoraryPer, setHonoraryPer] = useState(0);
    const [obs, setObs] = useState('');


    useEffect(() => {
        loadRegisters();
    }, []);

    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('collects')
            await setRegisters(res.data);
            await setSearch(res.data)
            await calculate()
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
            status,
            document,
            dt_maturity: dtMaturity,
            value,
            account,
            days,
            dt_closure: dtClosure,
            companie,
            updated_debt: updatedDebt,
            maximum_discount: maximumDiscount,
            negotiated_value: negotiatedValue,
            honorary_per: honoraryPer,
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

        else if (selectFilterField === 'client_name')
            tempSearch = registers.filter(find =>
                String(find.client_name).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'client_document')
            tempSearch = registers.filter(find =>
                String(find.client_document).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'client_phones')
            tempSearch = registers.filter(find =>
                String(find.client_phone + find.client_cellphone).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)


        setSearch(tempSearch)
    }

    const setUpdating = async (reg) => {
        setIsUpdating(true);
        setRegister(reg);
        setClient(reg.client);
        setClientName(reg.client_name);
        setStatus(reg.status);
        setDays(reg.days);
        setDtClosure(reg.dt_closure)
        setCompanie(reg.companie)
        setCompanieName(reg.companie_name)
        setUpdatedDebt(reg.updated_debt)
        setDocument(reg.document)
        setDefaultInterest(reg.default_interest)
        setDefaultHonorary(reg.default_honorary)
        setAccount(reg.account)
        setDtMaturity(reg.dt_maturity)
        setMaximumDiscount(reg.maximum_discount)
        setNegotiatedValue(reg.negotiated_value)
        setHonoraryPer(reg.default_honorary);
        setDefaultPenalty(reg.default_penalty)
        setValue(reg.value);
        setObs(reg.obs)

        setShow(true)
    }

    const clearValues = () => {
        setClient('')
        setClientName('')
        setStatus('Aberto')
        setDocument('');
        setDtMaturity('');
        setAccount('');
        setDtClosure('')
        setCompanie('')
        setUpdatedDebt(0)
        setDefaultHonorary(0)
        setDefaultInterest(0)
        setMaximumDiscount(0)
        setNegotiatedValue(0)
        setHonoraryPer(0);
        setObs('')
        setDays(0);
        setValue(0);
        setDefaultPenalty(0)
        loadRegisters();
    }

    const setNew = () => {
        setIsUpdating(false);
        clearValues();
        setShow(true);
    }


    const calculate = async () => {
        if (!moment(dtMaturity, "DD/MM/YYYY")._isValid)
            setDays(0)

        const calculedDays = await moment(dtMaturity, "DD/MM/YYYY").diff(moment(), 'days')

        if (calculedDays > -1)
            setDays(0)

        //DAYS
        setDays(calculedDays * -1)

        //INTEREST (JUROS)
        const interest = await (((parseFloat(defaultInterest) / 1000) * parseFloat(value)) * parseFloat(days));
        setInterestCalculed(interest);

        //PENALTY (MULTA)
        const penalty = await ((parseFloat(defaultPenalty) / 100) * parseFloat(value));
        setPenaltyCalculed(penalty);

        //HONORARY (HONORÁRIOS)
        const honorary = await ((parseFloat(value) + parseFloat(penalty) + parseFloat(interest)) * (parseFloat(honoraryPer) / 100))
        setHonoraryCalculed(honorary)

        const debit = await ((parseFloat(interest) + parseFloat(penalty) + parseFloat(honorary) + parseFloat(value)))
        setUpdatedDebt(debit)
    }


    return (
        <div className="collect-container">
            <AppBar />
            <div className="filters">
                <select
                    className="select-search"
                    onChange={e => setSelectFilterField(e.target.value)}>
                    <option value="id">Código</option>
                    <option value="client_name" selected> Nome do cliente</option>
                    <option value="client_document" > Documento do cliente</option>
                    <option value="client_phones" > Telefone do cliente</option>
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
                        <th>Valor </th>
                        <th>Credor</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr
                            style={{ cursor: 'pointer' }}
                            onClick={() => setUpdating(reg)}
                            key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.client + ' - ' + reg.client_name}</td>
                            <td>{reg.status}</td>
                            <td>{reg.dt_maturity}</td>
                            <td>{reg.value}</td>
                            <td>{reg.companie + ' - ' + reg.companie_name}</td>
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

                    <label> Credor </label>
                    <div className="inline">
                        <input
                            style={{ width: 80, marginRight: 5 }}
                            type="number"
                            placeholder="Cód."
                            value={companie}
                            onChange={async e => {
                                setCompanie(e.target.value)
                                if (!e.target.value) {
                                    setCompanieName('')
                                    setDefaultInterest('')
                                    setDefaultHonorary('')
                                    setDefaultPenalty('')
                                    setHonoraryPer('')
                                    return
                                }
                                const res = await api.get(`companies/find-by-id/${e.target.value}`)
                                if (res.data) {
                                    setCompanieName(res.data.name)
                                    setDefaultInterest(res.data.default_interest)
                                    setHonoraryPer(res.data.default_honorary)
                                    setDefaultPenalty(res.data.default_penalty)
                                }
                                else {
                                    setCompanieName('')
                                    setDefaultInterest('')
                                    setHonoraryPer('')
                                    setDefaultPenalty('')
                                }
                            }} />
                        <input
                            type="text"
                            readOnly
                            value={companieName} />
                        <button
                            style={{ width: 'auto', marginLeft: 5, padding: 10 }}
                            onClick={() => props.dispatch(callbackActions.setCallback(true, 'companies', companie))}>
                            <AiOutlineSearch size="25" />
                        </button>
                        <br />
                    </div>

                    <label> Cliente </label>
                    <div className="inline">
                        <input
                            style={{ width: 80, marginRight: 5 }}
                            type="number"
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
                        <button
                            style={{ width: 'auto', marginLeft: 5, padding: 10 }}
                            onClick={() => props.dispatch(callbackActions.setCallback(true, 'clients', companie))}>
                            <AiOutlineSearch size="25" />
                        </button>
                        <br />
                    </div>
                    <div className="inline">
                        <div style={{ marginRight: 10 }}>
                            <label> Dt. Vencimento </label>
                            <CurrencyFormat 
                                format="##/##/####"
                                placeholder="Data de vencimento"
                                value={dtMaturity?dtMaturity:''}
                                onValueChange={e => setDtMaturity(e.target.value)}
                                onBlur={calculate} />
                        </div>
                        <div>
                            <label> Dias em atraso </label>
                            <input
                                type="number"
                                placeholder="Dias"
                                value={days}
                                readOnly />
                        </div>
                    </div>

                    <label> Status </label>
                    <select
                        className="select-search"
                        onChange={e => setStatus(e.target.value)}>
                        <option value="Aberto" selected={status === 'Aberto' ? true : false}>Aberto</option>
                        <option value="Negociado" selected={status === 'Negociado' ? true : false}>Negociado</option>
                        <option value="Liquidado" selected={status === 'Liquidado' ? true : false}>Liquidado</option>
                    </select>

                    <label> Nota fiscal </label>
                    <input
                        type="text"
                        placeholder="Nota fiscal"
                        value={document}
                        onChange={e => setDocument(e.target.value)} />

                    <label> Conta </label>
                    <input
                        type="text"
                        placeholder="Conta"
                        value={account}
                        onChange={e => setAccount(e.target.value)} />

                    <label> Data de encerramento </label>
                    <CurrencyFormat 
                        format="##/##/####"
                        placeholder="Data de encerramento"
                        value={dtClosure?dtClosure:''}
                        onValueChange={e => setDtClosure(e.value)} />


                    <label> R$ Valor Originário </label>
                    <CurrencyFormat
                        readOnly={isUpdating?false:true}
                        prefix={'R$'}
                        decimalScale={2}
                        thousandSeparator={true}
                        placeholder="Valor originário"
                        value={value ? value : ''}
                        onValueChange={e => setValue(e.value)} />

                    <label> R$ Multa </label>
                    <CurrencyFormat
                        prefix={'R$'}
                        decimalScale={2}
                        thousandSeparator={true}
                        placeholder="Multa"
                        value={penaltyCalculed ? penaltyCalculed : ''}
                        readOnly />

                    <label> R$ Juros </label>
                    <CurrencyFormat
                        prefix={'R$'}
                        decimalScale={2}
                        thousandSeparator={true}
                        placeholder="Jutos"
                        value={interestCalculed ? interestCalculed : ''}
                        readOnly />

                    <label> % Honorários </label>
                    <CurrencyFormat
                        suffix={'%'}
                        thousandSeparator={true}
                        placeholder="Honarário"
                        value={honoraryPer ? honoraryPer : ''}
                        onValueChange={e => setHonoraryPer(e.value)} />

                    <label> R$ Honorários </label>
                    <CurrencyFormat
                        prefix={'R$'}
                        decimalScale={2}
                        thousandSeparator={true}
                        placeholder="Honarários"
                        value={honoraryCalculed ? honoraryCalculed : ''}
                        readOnly />

                    <label> R$ Débito atualizado </label>
                    <div className="inline">
                        <CurrencyFormat
                            prefix={'R$'}
                            decimalScale={2}
                            thousandSeparator={true}
                            placeholder="Débito atualizado"
                            value={updatedDebt ? updatedDebt : ''}
                            readOnly />
                        <button
                            style={{ marginLeft: 5, width: 'auto' }}
                            onClick={calculate}> Atualizar </button>
                    </div>
                    <label> R$ Desconto máximo </label>
                    <CurrencyFormat
                        prefix={'R$'}
                        decimalScale={2}
                        thousandSeparator={true}
                        placeholder="Desconto máximo"
                        value={maximumDiscount ? maximumDiscount : ''}
                        readOnly />

                    <label> R$ Valor negociado </label>
                    <CurrencyFormat
                        prefix={'R$'}
                        decimalScale={2}
                        thousandSeparator={true}
                        placeholder="Desconto negociado"
                        value={negotiatedValue ? negotiatedValue : ''}
                        onValueChange={e => setNegotiatedValue(e.value)} />

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