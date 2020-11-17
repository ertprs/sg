import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Tabs, Tab, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import CurrencyInput from 'react-currency-input-field';
import Downshift from 'downshift'
import './style.css';
import { floatValueToStr, strValueToFloat, verifyCpfAndCnpj } from '../../helpers/myFormat';
import { TestaCPF } from '../../helpers/general';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import * as callbackActions from '../../store/actions/callback';
import AppBar from '../../components/AppBar';
import Billet from '../Billet';



function Attendance(props) {
    const history = useHistory();
    const header = { headers: { hash: props.state.user.hash, user_id: props.state.user.id } };
    const [grandMaximumDiscount, setGrandMaximumDiscount] = useState(0);

    const [show, setShow] = useState(false);
    const [search, setSearch] = useState([]);
    const [searchField, setSearchField] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    //ATTEDANCE FIELDS
    const [clients, setClients] = useState([]);
    const [aClient, setAClient] = useState('');
    const [aClientName, setAClientName] = useState('');
    const [aUser, setAUser] = useState(localStorage.getItem('@sg/user/id'));
    const [aUserName, setAUserName] = useState(localStorage.getItem('@sg/user/name'));
    const [aDtBegin, setADtBegin] = useState('');
    const [aDtEnd, setADtEnd] = useState('');
    const [aDescription, setADescription] = useState('');
    const [aStatus, setAStatus] = useState('Não Negociado')
    const [aNegotiatedValue, setANegotiatedValue] = useState('');
    const [aGrandValue, setAGrandValue] = useState('');
    const [aCreatedAt, setACreatedAt] = useState('');
    const [aUpdatedAt, setAUpdatedAt] = useState('');
    const [aLastUser, setALastUser] = useState('');
    const [aObs, setAObs] = useState('');


    //CLIENT FIELDS
    const [cliClient, setCliClient] = useState({});
    const [cliId, setCliId] = useState('');
    const [cliCode, setCliCode] = useState('');
    const [cliPhoneAdditional, setCliPhoneAdditional] = useState('');
    const [cliEmailAdditional, setCliEmailAdditional] = useState('');
    const [cliEdressAdditional, setCliEdressAdditional] = useState('');
    const [cliName, setCliName] = useState('');
    const [cliCellphone, setCliCellphone] = useState('');
    const [cliPhone, setCliPhone] = useState('');
    const [cliCompanie, setCliCompanie] = useState('');
    const [cliCompanieName, setCliCompanieName] = useState('');
    const [cliEmail, setCliEmail] = useState('');
    const [cliAttendance, setCliAttendance] = useState('');
    const [cliDocumentType, setCliDocumentType] = useState('CPF');
    const [cliDocument, setCliDocument] = useState('');
    const [cliEdress, setCliEdress] = useState('');
    const [cliObs, setCliObs] = useState('');

    //COLLECTS FIELDS
    const [cCollect, setCCollect] = useState({});
    const [cCollects, setCCollects] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [cCode, setCCode] = useState('');
    const [cClient, setCClient] = useState('');
    const [cClientName, setCClientName] = useState('');
    const [cStatus, setCStatus] = useState('Aberto');
    const [cCompanie, setCCompanie] = useState('');
    const [cCompanieName, setCCompanieName] = useState('');
    const [cAccount, setCAccount] = useState('');
    const [cDocument, setCDocument] = useState('');
    const [cDtMaturity, setCDtMaturity] = useState('');
    const [cDays, setCDays] = useState(0);
    const [cValue, setCValue] = useState(0);
    const [cAmount, setCAmount] = useState(0);
    const [cPenalty, setCPenalty] = useState(0);
    const [cInterest, setCInterest] = useState(0);
    const [cUpdatedDebt, setCUpdatedDebt] = useState(0);
    const [cHonorary, setCHonorary] = useState(0);
    const [cMaximumDiscount, setCMaximumDiscount] = useState(0);
    const [cNegotiatedValue, setCNegotiatedValue] = useState(0);
    const [cObs, setCObs] = useState('');


    useEffect(() => {
        loadRegisters();
    }, []);

    const handleSubmit = async () => {

        props.dispatch(loadingActions.setLoading(true));

        setADtEnd(moment().format('L LT'))
        const regTemp = {
            client: aClient,
            dt_begin: aDtBegin,
            dt_end: moment().format('L LT'),
            user: aUser,
            description: aDescription,
            negotiated_value: aNegotiatedValue,
            grand_value: aGrandValue,
            status: aStatus,
            obs: aObs
        }
        setRegister(regTemp);
        try {
            await updateClient();
            if (isUpdating) {
                //ALTERAÇÃO
                const res = await api.put(`attendances/${register.id}`, regTemp, header)
                setRegister({});
                clearValues();
                loadRegisters();
                setIsUpdating(false);
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //VALIDAÇÕES
                if (cliDocument && verifyCpfAndCnpj(cliDocument)) {
                    props.dispatch(loadingActions.setLoading(false));
                    props.dispatch(toastActions.setToast(true, 'success', 'O CPF/CNPJ do cliente é inválido.'));
                    return
                }

                if (verifyCpfAndCnpj(cliDocument)) {
                    props.dispatch(loadingActions.setLoading(false));
                    props.dispatch(toastActions.setToast(true, 'success', 'O CPF/CNPJ do cliente é inválido.'));
                    return
                }

                if (aObs.length < 10) {
                    props.dispatch(loadingActions.setLoading(false));
                    props.dispatch(toastActions.setToast(true, 'success', 'O campo OBSERVAÇÃO é obrigatório.'));
                    return
                }
                if (aStatus === 'Negociado') {
                    if (grandMaximumDiscount === 0) {
                        if (strValueToFloat(aNegotiatedValue) < aGrandValue) {
                            props.dispatch(loadingActions.setLoading(false));
                            props.dispatch(toastActions.setToast(true, 'success', 'O VALOR NEGOCIADO deve ser o mesmo que o DÉBITO TOTAL!'));
                            return 0
                        }
                    } else {
                        if (strValueToFloat(aNegotiatedValue) < grandMaximumDiscount) {
                            props.dispatch(loadingActions.setLoading(false));
                            props.dispatch(toastActions.setToast(true, 'success', 'O VALOR NEGOCIADO não pode ser menor que o DESCONTO MÁXIMO!'));
                            return 0
                        }
                    }
                    if (verifyCpfAndCnpj(cliDocument)) {
                        props.dispatch(loadingActions.setLoading(false));
                        props.dispatch(toastActions.setToast(true, 'success', 'O CPF/CNPJ do cliente é inválido.'));
                        return
                    }
                } else {
                    setANegotiatedValue('0')
                }

                //CADASTRO
                const res = await api.post('attendances', regTemp, header);

                if (aStatus === 'Negociado')
                    await closeCollectsByClient(aClient, res.data[0]);

                setRegister({});
                clearValues();
                loadRegisters();
                setIsUpdating(false);
                props.dispatch(toastActions.setToast(true, 'success', 'Registro cadastrado!'));

                if (aStatus === 'Negociado')
                    history.push({
                        pathname: 'billet',
                        state: { attendance: res.data[0] }
                    })

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
            const res = await api.delete(`attendances/${register.id}`, header);
            setIsUpdating(false);
            setRegister({});
            clearValues();
            loadRegisters();
            setShow(false)
            props.dispatch(toastActions.setToast(true, 'success', 'Registro deletado!'));
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
        props.dispatch(loadingActions.setLoading(false));
    }


    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('attendances', header);
            setRegisters(res.data);
            setSearch(res.data)
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
            props.dispatch(loadingActions.setLoading(false));
        }
    }

    const handleSearch = async () => {
        var tempSearch = [];
        tempSearch = registers.filter(find =>
            find.client_name.toLowerCase().indexOf(String(searchField).toLowerCase()) > -1
        )
        setSearch(tempSearch)
    }


    const getCollectsByAttendanceId = async attendanceId => {
        try {
            const res = await api.get('/collects/find-by-attendance/' + attendanceId, header);
            var tempGrandMaximumDiscount = 0;
            var tempAGrandValue = 0;
            res.data.map(collect => {
                tempGrandMaximumDiscount = tempGrandMaximumDiscount + strValueToFloat(collect.maximum_discount)
                tempAGrandValue = tempAGrandValue + strValueToFloat(collect.updated_debt);
            })
            setGrandMaximumDiscount(tempGrandMaximumDiscount);
            if (tempAGrandValue > 0)
                setAGrandValue(floatValueToStr(tempAGrandValue));

            setCCollects(res.data)
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }

    const getCollectsByClientId = async cliId => {
        try {
            const res = await api.get('/collects/find-by-client/' + cliId, header);
            var tempGrandMaximumDiscount = 0;
            var tempAGrandValue = 0;
            res.data.map(collect => {
                tempGrandMaximumDiscount = tempGrandMaximumDiscount + strValueToFloat(collect.maximum_discount)
                tempAGrandValue = tempAGrandValue + strValueToFloat(collect.updated_debt);
            })
            setGrandMaximumDiscount(tempGrandMaximumDiscount);
            if (tempAGrandValue > 0)
                setAGrandValue(floatValueToStr(tempAGrandValue));

            setCCollects(res.data)
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }


    const clearValues = () => {
        //CLEAR ATTENDENCE
        setAClient('');
        setAClientName('');
        setAUser(localStorage.getItem('@sg/user/id'));
        setAUserName(localStorage.getItem('@sg/user/name'))
        setADescription('');
        setAStatus('Não Negociado');
        setADtBegin(moment().format('L LT'));
        setADtEnd('');
        setANegotiatedValue('');
        setAGrandValue('');
        setAObs('');

        //CLEAR CLIENTE
        setCliClient({});
        setCliId('');
        setCliName('');
        setCliCompanie('');
        setCliCompanieName('');
        setCliCellphone('');
        setCliPhoneAdditional('');
        setCliPhone('');
        setCliEmail('');
        setCliEmailAdditional('');
        setCliEdress('');
        setCliAttendance('');
        setCliEdressAdditional('');
        setCliDocumentType('CPF')
        setCliDocument('');
        setCliObs('');
    }

    const setClientValues = async (client) => {
        setCliClient(client);
        setCliId(client.id);
        setCliName(client.name);
        setCliCompanie(client.companie);
        setCliCompanieName(client.companie_name);
        setCliCellphone(client.cellphone);
        setCliPhoneAdditional(client.phone_additional);
        setCliPhone(client.phone);
        setCliEmail(client.email);
        setCliEmailAdditional(client.email_additional);
        setCliEdress(client.edress);
        setCliAttendance(client.attendance);
        setCliEdressAdditional(client.edress_additional);
        setCliDocumentType(client.document_type ? client.document_type : 'CPF')
        setCliDocument(client.document);
        setCliObs(client.obs);
        await getCollectsByClientId(client.id)
    }


    const setUpdating = async (reg) => {
        setIsUpdating(true);
        setRegister(reg);
        setAClient(reg.client);
        setAClientName(reg.client_name);
        setAUser(reg.user);
        setADescription(reg.description);
        setAStatus(reg.status)
        setAObs(reg.obs);
        setADtBegin(reg.dt_begin);
        setANegotiatedValue(reg.negotiated_value)
        setAGrandValue(reg.grand_value)
        setADtEnd(reg.dt_end);

        //LOAD CLIENT
        if (reg.client) {
            const res = await api.get(`clients/find-by-id/${reg.client}`, header);
            setAClientName(res.data.name)
            setClientValues(res.data)
            // GET COLLECTS
            await getCollectsByAttendanceId(reg.id)
        }

        setShow(true);
    }


    const hide = async (reg) => {
        setShow(false);
        setRegister({});
        clearValues();
        setIsUpdating(false);
    }

    const setNew = () => {
        setIsUpdating(false);
        clearValues();
        setShow(true);
    }


    const updateClient = async () => {
        try {
            const regTemp = {
                code: cliCode,
                name: cliName,
                cellphone: cliCellphone,
                phone: cliPhone,
                companie: cliCompanie,
                edress_additional: cliEdressAdditional,
                email_additional: cliEmailAdditional,
                phone_additional: cliPhoneAdditional,
                email: cliEmail,
                edress: cliEdress,
                document_type: cliDocumentType,
                document: cliDocument,
                obs: cliObs
            }
            const res = await api.put(`clients/${cliId}`, regTemp, header)
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }



    const closeCollectsByClient = async (clientId, attendanceId) => {
        const res = await api.get(`collects/close-by-client/${clientId}/${attendanceId}`, header);
    }

    return (
        <div className="attendance-container">
            <AppBar />
            <div className="filters">
                <label> Devedor: </label>
                <input
                    className="field-search"
                    value={searchField}
                    onChange={e => setSearchField(e.target.value)}
                    type="text"
                    onKeyPress={handleSearch} />
            </div>

            <MDBTable responsive hover bordered className="table">
                <MDBTableHead>
                    <tr>
                        <th>Código</th>
                        <th>Início</th>
                        <th>Fim</th>
                        <th>Usuário</th>
                        <th>Cliente</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                        <th>Valor negociado</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr key={reg.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setUpdating(reg)}>
                            <td>{reg.id}</td>
                            <td>{reg.dt_begin}</td>
                            <td>{reg.dt_end}</td>
                            <td>{reg.user + ' - ' + reg.user_name}</td>
                            <td>{reg.client + ' - ' + reg.client_name}</td>
                            <td>{'R$ ' + strValueToFloat(reg.grand_value).toLocaleString()}</td>
                            <td>{reg.status}</td>
                            <td>{'R$ ' + strValueToFloat(reg.negotiated_value).toLocaleString()}</td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => console.log('Cant close')}>
                <Modal.Header>
                    <Modal.Title> Atendimento </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="attendance" id="uncontrolled-tab-example">
                        <Tab eventKey="attendance" title="Atendimento">
                            {
                                register.id ?
                                    <div>
                                        <br />
                                        <label> Código </label>
                                        <label> {': ' + register.id} </label>
                                        <br />
                                    </div>
                                    : ''
                            }
                            <label> Usuário </label>
                            <div className="inline">
                                <input
                                    style={{ width: 80, marginRight: 5 }}
                                    type="text"
                                    placeholder="Cód."
                                    value={aUser}
                                    readOnly />
                                <input
                                    type="text"
                                    readOnly
                                    value={aUserName} />
                                <br />
                            </div>

                            <label> Dt. Início </label>
                            <input
                                type="text"
                                placeholder="Dt. Início"
                                readOnly
                                value={aDtBegin} />
                            <label> Dt. Fim </label>
                            <input
                                type="text"
                                placeholder="Dt. Início"
                                readOnly
                                value={aDtEnd} />

                            <label> Observações </label>
                            <textarea
                                placeholder="Descreva como foi o atendimento"
                                onChange={e => setAObs(e.target.value)}>
                                {aObs}
                            </textarea>
                            {register.created_at ?
                                <div>
                                    <p> Criado em {register.created_at} {!register.updated_at ? ' por ' + register.last_user + ' - ' + register.last_user_name : ''} </p>
                                    <p>{register.updated_at ? 'Ultima alteração feita em ' + register.updated_at + ' por ' + register.last_user + ' - ' + register.last_user_name : 'Registro ainda não foi alterado.'}</p>
                                </div>
                                : <></>
                            }
                        </Tab>

                        <Tab eventKey="client" title="Cliente">
                            <label> Devedor </label>
                            <Downshift inputValue={aClientName} inputValue={aClientName} onChange={selection => {
                                setAClient(selection.id)
                                setAClientName(selection.name)
                                setClientValues(selection)
                            }}
                                itemToString={item => (item ? item.name : '')}>
                                {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, getRootProps }) => (
                                    <div>
                                        <div {...getRootProps({}, { suppressRefError: true })} className="inline">
                                            <input value={aClient} type="number" readOnly style={{ width: 80, marginRight: 5 }} />
                                            <input
                                                type="text"
                                                placeholder="Pesquisa"
                                                readOnly={isUpdating}
                                                value={aClientName}
                                                onChangeCapture={async e => {
                                                    setAClientName(e.target.value)
                                                    if (!e.target.value || e.target.value.length < 3) return;
                                                    const { data } = await api.get(`clients/find-by-name/${e.target.value}`, header);
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


                            <label> Credor </label>
                            <div className="inline">
                                <input
                                    style={{ width: 80, marginRight: 5 }}
                                    type="text"
                                    placeholder="Credor"
                                    value={cliCompanie}
                                    readOnly />
                                <input
                                    type="text"
                                    readOnly
                                    value={cliCompanieName} />
                                <br />
                            </div>

                            <label> Código </label>
                            <input
                                type="text"
                                placeholder="Código"
                                readOnly
                                value={cliCode} />

                            <label> Nome </label>
                            <input
                                type="text"
                                readOnly
                                placeholder="Nome"
                                value={cliName} />

                            <label> Celular </label>
                            <CurrencyFormat
                                format="## (##) #####-####"
                                placeholder="Celular"
                                readOnly
                                value={cliCellphone ? cliCellphone : ''} />

                            <label> Telefone </label>
                            <CurrencyFormat
                                format="## (##) #########"
                                placeholder="Telefone"
                                readOnly
                                value={cliPhone ? cliPhone : ''} />

                            <label> Telefone adicional </label>
                            <CurrencyFormat
                                format="## (##) #########"
                                placeholder="Telefone"
                                value={cliPhoneAdditional ? cliPhoneAdditional : ''}
                                onValueChange={e => setCliPhoneAdditional(e.value)}
                                readOnly={isUpdating} />

                            <label> Email </label>
                            <input
                                type="text"
                                placeholder="Email"
                                readOnly
                                value={cliEmail} />

                            <label> Email adicional </label>
                            <input
                                type="text"
                                placeholder="Email adicional"
                                value={cliEmailAdditional}
                                onChange={e => setCliEmailAdditional(e.target.value)}
                                readOnly={isUpdating} />

                            <div className="inline">
                                <div style={{ marginRight: 5 }}>
                                    <label> Tipo de Cliente </label>
                                    <select
                                        disabled={isUpdating}
                                        className="select-search"
                                        onChange={e => setCliDocumentType(e.target.value)}>
                                        <option value="CPF" selected={cliDocumentType === 'CPF' ? true : false}>CPF</option>
                                        <option value="CNPJ" selected={cliDocumentType === 'CNPJ' ? true : false}>CNPJ</option>
                                    </select>
                                </div>
                                <div>
                                    <label> {cliDocumentType} </label>
                                    <CurrencyFormat
                                        format={cliDocumentType === 'CPF' ? "###.###.###-##" : "###.###.###/###-##"}
                                        placeholder={cliDocumentType}
                                        value={cliDocument ? cliDocument : ''}
                                        onValueChange={e => setCliDocument(e.value)}
                                        readOnly={isUpdating} />
                                </div>
                            </div>

                            <label>  Endereço </label>
                            <input
                                type="text"
                                placeholder="Endereço"
                                readOnly
                                value={cliEdress} />

                            <label>  Endereço adicional </label>
                            <input
                                type="text"
                                placeholder="Endereço"
                                value={cliEdressAdditional}
                                onChange={e => setCliEdressAdditional(e.target.value)}
                                readOnly={isUpdating} />

                            <label>  Observações </label>
                            <input
                                type="text"
                                placeholder="Observações do cliente"
                                readOnly
                                value={cliObs} />
                        </Tab>

                        <Tab eventKey="collect" title="Cobranças">
                            <MDBTable responsive hover bordered className="table">
                                <MDBTableHead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Status</th>
                                        <th>Dt. Venc.</th>
                                        <th>Vlr. Originário</th>
                                        <th>Débito Atualizado</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {cCollects.map(collect => (
                                        <tr key={collect.id}>
                                            <td>{collect.id}</td>
                                            <td>{collect.status}</td>
                                            <td>{collect.dt_maturity}</td>
                                            <td>{collect.value}</td>
                                            <td>{'R$ ' + strValueToFloat(collect.updated_debt).toLocaleString()} </td>
                                        </tr>
                                    ))}
                                </MDBTableBody>
                            </MDBTable>


                            <div className="negotiation">
                                <div className="inline">
                                    <div style={{ marginRight: 5 }}>
                                        <label> Débito Total </label>
                                        <CurrencyInput
                                            prefix="R$ "
                                            placeholder="Débito total"
                                            decimalSeparator=","
                                            groupSeparator="."
                                            value={aGrandValue}
                                            readOnly />
                                    </div>
                                    <div>
                                        <label> Desconto Máximo Total </label>
                                        <CurrencyInput
                                            prefix="R$ "
                                            placeholder="Desconto Máximo"
                                            decimalSeparator=","
                                            groupSeparator="."
                                            precision="2"
                                            value={floatValueToStr(grandMaximumDiscount)}
                                            readOnly />
                                    </div>
                                </div>
                                <div className="inline">
                                    <div>
                                        <label> Status </label>
                                        <select
                                            className="select-search"
                                            onChange={e => setAStatus(e.target.value)}
                                            disabled={isUpdating}>
                                            <option value="Não Negociado" selected={aStatus === 'Não Negociado' ? true : false}>Não Negociado</option>
                                            <option value="Negociado" selected={aStatus === 'Negociado' ? true : false}>Negociado</option>
                                        </select>
                                    </div>
                                    <div style={{ marginLeft: 5 }}>
                                        <label> R$ Valor Negociado </label>
                                        <CurrencyInput
                                            prefix="R$ "
                                            placeholder="Valor Negociado"
                                            decimalSeparator=","
                                            groupSeparator="."
                                            precision="2"
                                            value={aNegotiatedValue ? aNegotiatedValue : ''}
                                            onChange={e => setANegotiatedValue(e)}
                                            readOnly={((isUpdating) || (aStatus !== 'Negociado'))} />
                                    </div>
                                </div>

                            </div>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <div className="modal-footer-container">
                    <button onClick={handleSubmit}> Salvar </button>
                    {isUpdating ? <button onClick={handleDelete} style={{ backgroundColor: '#ff6666' }} > Apagar </button> : <></>}
                    <button onClick={hide} style={{ backgroundColor: '#668cff' }} > Fechar </button>
                </div>
            </Modal>


            <div className="fab-container">
                <button onClick={setNew}> + </button>
            </div>
        </div>
    );
}

export default connect(state => ({ state }))(Attendance);