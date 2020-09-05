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
    const [search, setSearch] = useState([]);
    const [searchField, setSearchField] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectFilterField, setSelectFilterField] = useState('name')

    const [name, setName] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [phone, setPhone] = useState('');
    const [companie, setCompanie] = useState('');
    const [companieName, setCompanieName] = useState('');
    const [email, setEmail] = useState('');
    const [document, setDocument] = useState('');
    const [edress, setEdress] = useState('');
    const [obs, setObs] = useState('');

    useEffect(() => {
        loadRegisters();
    }, []);

    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('clients')
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
        props.dispatch(loadingActions.setLoading(true));

        //VALIDAÇÕES
        if (!name) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Preencha os campos obrigatórios!'));
            return 0
        }

        //CRIA OBJETO PARAR CADASTRAR/ALTERAR
        const regTemp = {
            name,
            cellphone,
            phone,
            companie,
            email,
            edress,
            document,
            obs
        }
        setRegister(regTemp);

        try {
            if (isUpdating) {
                //ALTERAÇÃO
                const res = await api.put(`clients/${register.id}`, regTemp)
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //CADASTRO
                const res = await api.post('clients', regTemp);
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
            const res = await api.delete(`clients/${register.id}`);
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
        if (selectFilterField === 'id')
            tempSearch = registers.filter(find =>
                String(find.id).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'name')
            tempSearch = registers.filter(find =>
                String(find.name).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'document')
            tempSearch = registers.filter(find =>
                String(find.document).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        setSearch(tempSearch)
    }

    const setUpdating = async (reg) => {
        let resCompanieName = await api.get(`companies/find-by-id/${reg.companie}`);
        if (resCompanieName.data)
            resCompanieName = resCompanieName.data.name
        else
            resCompanieName = ''
        setIsUpdating(true);
        setRegister(reg);
        setName(reg.name)
        setCellphone(reg.cellphone)
        setPhone(reg.phone)
        setCompanie(reg.companie)
        setCompanieName(resCompanieName)
        setEmail(reg.email)
        setEdress(reg.edress)
        setDocument(reg.document)
        setObs(reg.obs)
        setShow(true);
    }

    const clearValues = () => {
        setName('')
        setCellphone('')
        setPhone('')
        setCompanie('')
        setCompanieName('')
        setEdress('')
        setDocument('')
        setObs('')
        setShow(true);
    }


    const setNew = () => {
        setIsUpdating(false);
        clearValues();
        setShow(true);
    }

    return (
        <div className="client-container">
            <AppBar />
            <div className="filters">
                <select
                    className="select-search"
                    onChange={e => setSelectFilterField(e.target.value)}>
                    <option value="id">Código</option>
                    <option value="name" selected>Nome</option>
                    <option value="document" selected>Documento</option>
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
                        <th>Nome</th>
                        <th>Documento</th>
                        <th>Celular</th>
                        <th>Telefone</th>
                        <th>Empresa</th>
                        <th>Opções</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.name}</td>
                            <td>{reg.document}</td>
                            <td>{reg.cellphone}</td>
                            <td>{reg.phone}</td>
                            <td>{reg.companie + ' - ' + reg.companie_name}</td>
                            <td><button onClick={() => setUpdating(reg)}>ABRIR</button></td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title> Cadastro de Cliente </Modal.Title>
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

                    <label> Nome </label>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)} />

                    <label> Celular </label>
                    <input
                        type="text"
                        placeholder="Celular"
                        value={cellphone}
                        onChange={e => setCellphone(e.target.value)} />

                    <label> Telefone </label>
                    <input
                        type="text"
                        placeholder="Telefone"
                        value={phone}
                        onChange={e => setPhone(e.target.value)} />

                    <label> Email </label>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />


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


                    <label> Documento (CPF/CNPJ) </label>
                    <input
                        type="text"
                        placeholder="CPF OU CNPJ"
                        value={document}
                        onChange={e => setDocument(e.target.value)} />

                    <label>  Endereço </label>
                    <input
                        type="text"
                        placeholder="Endereço"
                        value={edress}
                        onChange={e => setEdress(e.target.value)} />

                    <label>  Observações </label>
                    <input
                        type="text"
                        placeholder="Observações do cliente"
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

export default connect(state => ({ state }))(Client);