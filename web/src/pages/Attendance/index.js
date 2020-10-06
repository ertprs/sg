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
import myFormat from '../../helpers/myFormat';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import * as callbackActions from '../../store/actions/callback';
import AppBar from '../../components/AppBar';


function Attendance(props) {
    const history = useHistory();
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
    const [aNegotiatedValue, setANegotiatedValue] = useState('');
    const [aGrandValue, setAGrandValue] = useState('');
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
        //VALIDAÇÕES
        if (aObs.length < 10) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'O campo OBSERVAÇÃO é obrigatório.'));
            return
        }
        if (aNegotiatedValue < grandMaximumDiscount) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'O VALOR NEGOCIADO não pode ser maior que o DESCONTO MÁXIMO!'));
            return 0
        }

        setADtEnd(moment().format('L LT'))
        const regTemp = {
            client: aClient,
            dt_begin: aDtBegin,
            dt_end: moment().format('L LT'),
            user: aUser,
            description: aDescription,
            negotiated_value: aNegotiatedValue,
            grand_value: aGrandValue,
            obs: aObs
        }
        setRegister(regTemp);
        try {
            if (isUpdating) {
                //ALTERAÇÃO
                const res = await api.put(`attendances/${register.id}`, regTemp)
                await updateClient();
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //CADASTRO
                const res = await api.post('attendances', regTemp);
                await updateClient();
                await closeCollectsByClient(aClient);
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
            const res = await api.delete(`attendances/${register.id}`);
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
            const res = await api.get('attendances');
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
            find.client.toLowerCase().indexOf(String(searchField).toLowerCase()) > -1
        )
        setSearch(tempSearch)
    }


    const getCollectsByClientId = async cliId => {
        try {
            const res = await api.get('/collects/find-by-client/' + cliId)
            var tempGrandMaximumDiscount = 0;
            var tempAGrandValue = 0;
            res.data.map(collect => {
                tempGrandMaximumDiscount = tempGrandMaximumDiscount + myFormat.strValueToFloat(collect.maximum_discount)
                tempAGrandValue = tempAGrandValue + myFormat.strValueToFloat(collect.updated_debt);
            })
            setGrandMaximumDiscount(tempGrandMaximumDiscount);
            if (tempAGrandValue > 0)
                setAGrandValue(tempAGrandValue);
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
        setADtBegin(moment().format('L LT'))
        setADtEnd('')
        setANegotiatedValue('')
        setAGrandValue('')
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
        setCliEdressAdditional('');
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
        setCliEdressAdditional(client.edress_additional);
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
        setAObs(reg.obs);
        setADtBegin(reg.dt_begin);
        setANegotiatedValue(reg.negotiated_value)
        setAGrandValue(reg.grand_value)
        setADtEnd(reg.dt_end);

        //LOAD CLIENT
        if (reg.client) {
            const res = await api.get(`clients/find-by-id/${reg.client}`);
            setAClientName(res.data.name)
            setClientValues(res.data)
            // GET COLLECTS
            await getCollectsByClientId(res.data.id)
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
                document: cliDocument,
                obs: cliObs
            }
            const res = await api.put(`clients/${cliId}`, regTemp)
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }



    const closeCollectsByClient = async (clientId) => {
        const res = await api.get(`collects/close-by-client/${clientId}`);
    }

    return (
        <div className="attendance-container">
            <AppBar />
            <div className="filters">
                <label> Cliente: </label>
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
                            <td>{myFormat.strValueToFloat(reg.grand_value).toLocaleString()}</td>
                            <td>{myFormat.strValueToFloat(reg.negotiated_value).toLocaleString()}</td>
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
                                                    const { data } = await api.get(`clients/find-by-name/${e.target.value}`);
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
                                onValueChange={e => setCliPhoneAdditional(e.value)} />

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
                                onChange={e => setCliEmailAdditional(e.target.value)} />

                            <label> CPF </label>
                            <CurrencyFormat
                                format="###.###.###-##"
                                placeholder="CPF"
                                value={cliDocument ? cliDocument : ''}
                                onValueChange={e => setCliDocument(e.value)} />

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
                                onChange={e => setCliEdressAdditional(e.target.value)} />

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
                                        <th>Dias em Atraso</th>
                                        <th>Débito Atualizado</th>
                                        <th>Desconto Máximo</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {cCollects.map(collect => (
                                        <tr key={collect.id}>
                                            <td>{collect.id}</td>
                                            <td>{collect.status}</td>
                                            <td>{collect.days}</td>
                                            <td>{collect.updated_debt?myFormat.strValueToFloat(collect.updated_debt).toLocaleString():0} </td>
                                            <td>{collect.maximum_discount?myFormat.strValueToFloat(collect.maximum_discount).toLocaleString():0}</td>
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
                                            value={aGrandValue ? aGrandValue : ''}
                                            readOnly />
                                    </div>
                                    <div>
                                        <label> Desconto Máximo Total </label>
                                        <CurrencyInput
                                            prefix="R$ "
                                            placeholder="Desconto Máximo"
                                            decimalSeparator=","
                                            groupSeparator="."
                                            value={grandMaximumDiscount ? grandMaximumDiscount : ''}
                                            readOnly />
                                    </div>
                                </div>
                                <div>
                                    <label> R$ Valor Negociado </label>
                                    <CurrencyInput
                                        prefix="R$ "
                                        placeholder="Valor Negociado"
                                        decimalSeparator=","
                                        groupSeparator="."
                                        value={aNegotiatedValue ? aNegotiatedValue : ''}
                                        onChange={e => setANegotiatedValue(e)} 
                                        readOnly={isUpdating} />
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