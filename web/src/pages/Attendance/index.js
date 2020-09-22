import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Tabs, Tab, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import moment from 'moment';
import Downshift from 'downshift'
import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import * as callbackActions from '../../store/actions/callback';
import AppBar from '../../components/AppBar';


function Attendance(props) {
    const history = useHistory();
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
    const [aObs, setAObs] = useState('');


    //CLIENT FIELDS
    const [cliClient, setCliClient] = useState({});
    const [cliId, setCliId] = useState('');
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
        if (!aClient) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Preencha os campos obrigatórios!'));
            return 0
        }
        setADtEnd(moment().format('DD/mm/yyyy HH:MM'))
        //CRIA OBJETO PARAR CADASTRAR/ALTERAR
        const regTemp = {
            client: aClient,
            dt_begin: aDtBegin,
            dt_end: moment().format('DD/mm/yyyy HH:MM'),
            user: aUser,
            description: aDescription,
            obs: aObs
        }
        setRegister(regTemp);
        try {
            if (isUpdating) {
                //ALTERAÇÃO
                const res = await api.put(`attendances/${register.id}`, regTemp)
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //CADASTRO
                const res = await api.post('attendances', regTemp);
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
            setCCollects(res.data)
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }


    const clearValues = () => {
        setAClient('');
        setAUser(localStorage.getItem('@sg/user/id'));
        setAUserName(localStorage.getItem('@sg/user/name'))
        setADescription('');
        setADtBegin(moment().format('DD/mm/yyyy HH:MM'))
        setADtEnd('')
        setAObs('');
    }

    const setClientValues = (client) => {
        setCliClient(client);
        setCliId(client.id);
        setCliName(client.name);
        setCliCompanie(client.companie);
        setCliCompanieName(client.companie_name);
        setCliCellphone(client.cellphone);
        setCliPhone(client.phone);
        setCliEmail(client.email);
        setCliEdress(client.edress);
        setCliDocument(client.document);
        setCliObs(client.obs);
    }


    const setUpdating = async (reg) => {
        setIsUpdating(true);
        setRegister(reg);
        setAClient(reg.client);
        setAUser(reg.user);
        setADescription(reg.description);
        setAObs(reg.obs);
        setShow(true);

        //LOAD CLIENT
        if (reg.client) {
            const res = await api.get(`clients/find-by-id/${reg.client}`);
            setClientValues(res.data);
            setCliClient(res.data);
            setAClientName(res.data.name);
            getCollectsByClientId(res.data.id)
        }
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
                        <th>Opções</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.dt_begin}</td>
                            <td>{reg.dt_end}</td>
                            <td>{reg.user + ' - ' + reg.user_name}</td>
                            <td>{reg.client + ' - ' + reg.client_name}</td>
                            <td><button onClick={() => setUpdating(reg)}>ABRIR</button></td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} >
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
                            <label> Cliente </label>
                            <Downshift onChange={selection => {
                                setAClient(selection.id)
                                setClientValues(selection)
                            }}
                                itemToString={item => (item ? item.name : '')}>
                                {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, getRootProps }) => (
                                    <div>
                                        <div {...getRootProps({}, { suppressRefError: true })} className="inline">
                                            <input value={aClient} type="number" readOnly style={{ width: 80, marginRight: 5 }} />
                                            <input
                                                type="text"
                                                value={aClientName}
                                                placeholder="Pesquisa"
                                                onChangeCapture={async e => {
                                                    if (!e.target.value) return
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
                                    style={{width: 80, marginRight: 5}}
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

                            <label> Nome </label>
                            <input
                                type="text"
                                readOnly
                                placeholder="Nome"
                                value={cliName} />

                            <label> Celular </label>
                            <input
                                type="text"
                                placeholder="Celular"
                                readOnly
                                value={cliCellphone} />

                            <label> Telefone </label>
                            <input
                                type="text"
                                placeholder="Telefone"
                                readOnly
                                value={cliPhone} />

                            <label> Email </label>
                            <input
                                type="text"
                                placeholder="Email"
                                readOnly
                                value={cliEmail} />

                            <label> Documento (CPF/CNPJ) </label>
                            <input
                                type="text"
                                placeholder="CPF OU CNPJ"
                                readOnly
                                value={cliDocument} />

                            <label>  Endereço </label>
                            <input
                                type="text"
                                placeholder="Endereço"
                                readOnly
                                value={cliEdress} />

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
                                        <th>Valor</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {cCollects.map(collect => (
                                        <tr key={collect.id}>
                                            <td>{collect.id}</td>
                                            <td>{collect.value}</td>
                                        </tr>
                                    ))}
                                </MDBTableBody>
                            </MDBTable>

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