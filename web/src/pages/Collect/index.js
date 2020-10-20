import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { AiOutlineSearch } from 'react-icons/ai';
import CurrencyFormat from 'react-currency-format';
import CurrencyInput from 'react-currency-input-field';
import Downshift from 'downshift';
import moment from 'moment';

import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import * as callbackActions from '../../store/actions/callback';
import AppBar from '../../components/AppBar';
import { strValueToFloat, floatValueToStr } from '../../helpers/myFormat';


function Client(props) {
    const history = useHistory();
    const header = { headers: { hash: props.state.user.hash } };

    const [show, setShow] = useState(false);
    const [registers, setRegisters] = useState([]);
    const [isClosed, setIsClosed] = useState(false);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchField, setSearchField] = useState('');
    const [search, setSearch] = useState([]);
    const [selectFilterField, setSelectFilterField] = useState('client_name')

    //FIELDS
    const [client, setClient] = useState('');
    const [clientName, setClientName] = useState('');
    const [clients, setClients] = useState([]);

    const [status, setStatus] = useState('Aberto');
    const [companie, setCompanie] = useState('');
    const [companieName, setCompanieName] = useState('');
    const [companies, setCompanies] = useState([]);
    const [account, setAccount] = useState('');
    const [document, setDocument] = useState('');
    const [dtMaturity, setDtMaturity] = useState('');
    const [days, setDays] = useState('');
    const [value, setValue] = useState('');
    const [updatedDebt, setUpdatedDebt] = useState('');
    const [defaultHonorary, setDefaultHonorary] = useState('');
    const [defaultInterest, setDefaultInterest] = useState('');
    const [interestCalculed, setInterestCalculed] = useState('');
    const [maximumDiscount, setMaximumDiscount] = useState('');
    const [negotiatedValue, setNegotiatedValue] = useState('');
    const [defaultPenalty, setDefaultPenalty] = useState('');
    const [penaltyCalculed, setPenaltyCalculed] = useState('');
    const [honoraryCalculed, setHonoraryCalculed] = useState('');
    const [honoraryPer, setHonoraryPer] = useState('');
    const [obs, setObs] = useState('');


    useEffect(() => {
        loadRegisters();
    }, []);

    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('collects', header)
            await setRegisters(res.data);
            await setSearch(res.data);
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }

    const handleSubmit = async () => {
        props.dispatch(loadingActions.setLoading(true));
        calculate();

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
                const res = await api.put(`collects/${register.id}`, regTemp, header)
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //CADASTRO
                const res = await api.post('collects', regTemp, header);
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
            const res = await api.delete(`collects/${register.id}`, header);
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
        setRegister(reg);
        setClient(reg.client);
        setClientName(reg.client_name);
        setStatus(reg.status);
        setDays(reg.days);
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
        setObs(reg.obs);

        const res = await api.get(`companies/find-by-id/${reg.companie}`, header)
        if (res.data) {
            setCompanieName(res.data.name)
            setDefaultInterest(res.data.default_interest)
            setHonoraryPer(res.data.default_honorary)
            setDefaultPenalty(res.data.default_penalty)
        }

        setIsUpdating(true);
        setShow(true)
    }

    const clearValues = () => {
        setClient('')
        setClientName('')
        setStatus('Aberto')
        setDocument('');
        setDtMaturity('');
        setAccount('');
        setCompanie('')
        setCompanieName('')
        setUpdatedDebt('')
        setDefaultHonorary('')
        setDefaultInterest('')
        setMaximumDiscount('')
        setNegotiatedValue('')
        setHonoraryPer('');
        setObs('')
        setDays('');
        setValue('');
        setDefaultPenalty('')
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
        const interest = await parseFloat((((strValueToFloat(defaultInterest) / 100) * strValueToFloat(value)) * strValueToFloat(days))).toFixed(2);
        setInterestCalculed(floatValueToStr(interest))

        //PENALTY (MULTA)
        const penalty = await parseFloat(((strValueToFloat(defaultPenalty) / 100) * strValueToFloat(value))).toFixed(2);
        setPenaltyCalculed(floatValueToStr(penalty))

        //HONORARY (HONORÁRIOS)
        const honorary = await parseFloat(((strValueToFloat(value) + strValueToFloat(penaltyCalculed) + strValueToFloat(interestCalculed)) * (strValueToFloat(honoraryPer) / 100))).toFixed(2);
        setHonoraryCalculed(floatValueToStr(honorary))

        const debit = await parseFloat(((strValueToFloat(interestCalculed) + strValueToFloat(penaltyCalculed) + strValueToFloat(honoraryCalculed) + strValueToFloat(value)))).toFixed(2);
        setUpdatedDebt(floatValueToStr(debit))
    }

    const updateAllDebits = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('collects/recalc', header);
            await loadRegisters();
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Todos os débitos foram atualizados.'));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
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
                <button onClick={updateAllDebits}> Atualizar todos os débitos </button>
            </div>

            <MDBTable responsive hover bordered>
                <MDBTableHead>
                    <tr>
                        <th>Código</th>
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Dt. Venc. </th>
                        <th>Vlr. Originário </th>
                        <th>Dias em Atraso</th>
                        <th>Débito Atualizado</th>
                        <th>Credor</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr
                            style={{ cursor: 'pointer' }}
                            onClick={async () => { await setUpdating(reg) }}
                            key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.client + ' - ' + reg.client_name}</td>
                            <td>{reg.status}</td>
                            <td>{reg.dt_maturity}</td>
                            <td>{'R$ ' + reg.value ? strValueToFloat(reg.value).toLocaleString() : 0}</td>
                            <td>{reg.days}</td>
                            <td>{'R$ ' + reg.updated_debt ? strValueToFloat(reg.updated_debt).toLocaleString() : 0}</td>
                            <td>{reg.companie + ' - ' + reg.companie_name}</td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => console.log('Cant close')}>
                <Modal.Header>
                    <Modal.Title>Cadastro de Débito</Modal.Title>
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
                    <Downshift inputValue={companieName} onChange={selection => {
                        setCompanies([])
                        setCompanie(selection.id)
                        setCompanieName(selection.name)
                        setDefaultInterest(selection.default_interest)
                        setHonoraryPer(selection.default_honorary)
                        setDefaultPenalty(selection.default_penalty)
                    }}
                        itemToString={item => (item ? item.name : '')}>
                        {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, getRootProps }) => (
                            <div>
                                <div {...getRootProps({}, { suppressRefError: true })} className="inline">
                                    <input value={companie} type="number" readOnly style={{ width: 80, marginRight: 5 }} />
                                    <input
                                        type="text"
                                        placeholder="Pesquisa"
                                        value={companieName}
                                        onChangeCapture={async e => {
                                            setCompanieName(e.target.value)
                                            if (!e.target.value || e.target.value.length < 3) return;
                                            const { data } = await api.get(`companies/find-by-name/${String(e.target.value).normalize("NFD")}`, header);
                                            setCompanies(data);
                                        }}
                                        {...getInputProps()} />
                                </div>
                                <ul {...getMenuProps({})}>
                                    {isOpen ? companies
                                        .filter(item => !inputValue || item.name.toLowerCase().includes(inputValue.toLowerCase()))
                                        .map((item) => (
                                            <li
                                                className="search-field-results"
                                                {...getItemProps({ key: item.id, item })}>
                                                {`${item.id} - ${item.name}`}
                                            </li>))
                                        : null}
                                </ul>
                            </div>
                        )}
                    </Downshift>


                    <label> Devedor </label>
                    <Downshift inputValue={clientName} onChange={selection => {
                        setClient(selection.id)
                        setClientName(selection.name)
                        setClients([])
                    }}
                        itemToString={item => (item ? item.name : '')}>
                        {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, getRootProps }) => (
                            <div>
                                <div {...getRootProps({}, { suppressRefError: true })} className="inline">
                                    <input value={client} type="number" readOnly style={{ width: 80, marginRight: 5 }} />
                                    <input
                                        type="text"
                                        placeholder="Pesquisa"
                                        value={clientName}
                                        onChangeCapture={async e => {
                                            setClientName(e.target.value)
                                            if (!e.target.value || e.target.value.length < 3) return;
                                            const { data } = await api.get(`clients/find-by-name/${String(e.target.value).normalize("NFD")}`, header);
                                            setClients(data);
                                        }}
                                        {...getInputProps()} />
                                </div>
                                <ul {...getMenuProps({})}>
                                    {isOpen ? clients
                                        .filter(item => !inputValue || item.name.toLowerCase().includes(inputValue.toLowerCase()))
                                        .map((item) => (
                                            <li
                                                className="search-field-results"
                                                {...getItemProps({ key: item.id, item })}>
                                                {`${item.id} - ${item.name}`}
                                            </li>))
                                        : null}
                                </ul>
                            </div>
                        )}
                    </Downshift>

                    <div className="inline">
                        <div style={{ marginRight: 10 }}>
                            <label> Dt. Vencimento </label>
                            <CurrencyFormat
                                format="##/##/####"
                                placeholder="Data de vencimento"
                                value={dtMaturity ? dtMaturity : ''}
                                onValueChange={e => setDtMaturity(e.formattedValue)}
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
                        onChange={e => setDocument(e.target.value)}
                        onBlur={calculate} />

                    <label> Modalidade de Faturamento </label>
                    <input
                        type="text"
                        placeholder="Conta"
                        value={account}
                        onChange={e => setAccount(e.target.value)}
                        onBlur={calculate} />


                    <label> R$ Valor Originário </label>
                    <CurrencyInput
                        prefix="R$ "
                        placeholder="Valor Originário"
                        decimalSeparator=","
                        groupSeparator="."
                        value={value ? value : ''}
                        onChange={e => setValue(e)}
                        onBlur={calculate} />

                    <label> R$ Multa </label>
                    <CurrencyInput
                        prefix="R$ "
                        placeholder="Multa"
                        decimalSeparator=","
                        groupSeparator="."
                        value={penaltyCalculed ? penaltyCalculed : ''}
                        onChange={e => setPenaltyCalculed(e)}
                        readOnly />

                    <label> R$ Juros </label>
                    <CurrencyInput
                        prefix="R$ "
                        placeholder="Juros"
                        decimalSeparator=","
                        groupSeparator="."
                        value={interestCalculed ? interestCalculed : ''}
                        onChange={e => setInterestCalculed(e)}
                        readOnly />

                    <div className="inline">
                        <div style={{ width: 200, marginRight: 5 }}>
                            <label> % Honorários </label>
                            <CurrencyInput
                                prefix="% "
                                placeholder="Honorários"
                                decimalSeparator=","
                                groupSeparator="."
                                value={honoraryPer ? honoraryPer : ''}
                                onChange={e => setHonoraryPer(e)}
                                onBlur={calculate} />
                        </div>
                        <div>

                            <label> R$ Honorários </label>
                            <CurrencyInput
                                prefix="R$ "
                                placeholder="Honorários "
                                decimalSeparator=","
                                groupSeparator="."
                                value={honoraryCalculed ? honoraryCalculed : ''}
                                onChange={e => setHonoraryCalculed(e)}
                                readOnly />
                        </div>

                    </div>

                    <label> R$ Débito Atualizado </label>
                    <div className="inline">
                        <CurrencyInput
                            prefix="R$ "
                            placeholder="Débito Atualizado"
                            decimalSeparator=","
                            groupSeparator="."
                            value={updatedDebt ? updatedDebt : ''}
                            onChange={e => setUpdatedDebt(e)}
                            readOnly />
                        <button
                            disabled={status === 'Liquidado'}
                            style={{ marginLeft: 5, width: 'auto' }}
                            onClick={calculate}> Atualizar </button>

                    </div>

                    <label> R$ Desconto Máximo </label>
                    <CurrencyInput
                        prefix="R$ "
                        placeholder="Desconto Máximo"
                        decimalSeparator=","
                        groupSeparator="."
                        value={maximumDiscount ? maximumDiscount : ''}
                        onChange={e => setMaximumDiscount(e)} />

                    <label> R$ Valor Negociado </label>
                    <CurrencyInput
                        prefix="R$ "
                        placeholder="Valor Negociado"
                        decimalSeparator=","
                        groupSeparator="."
                        value={negotiatedValue}
                        onChange={e => setNegotiatedValue(e)}
                        readOnly
                        onBlur={() => {
                            if (parseFloat(negotiatedValue ? negotiatedValue : '0') < parseFloat(maximumDiscount ? maximumDiscount : '0')) {
                                setNegotiatedValue('')
                            }
                        }} />

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