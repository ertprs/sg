import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import AppBar from '../../components/AppBar';


function Companie(props) {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [search, setSearch] = useState([]);
    const [searchField, setSearchField] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);


    useEffect(() => {
        loadRegisters();
    }, []);

    const handleSubmit = async () => {
        props.dispatch(loadingActions.setLoading(true));
        if (!name) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Preencha os campos obrigatórios!'));
            return 0
        }
        const regTemp = {
            name
        }
        setRegister(regTemp);
        try {
            if (isUpdating) {
                const res = await api.put(`companies/${register.id}`, regTemp)
                setIsUpdating(false);
                setRegister({});
                setName('')
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                const res = await api.post('companies', regTemp)
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro cadastrado!'));
            }
            setShow(false)
        } catch (error) {
            console.log(error)
        }
        props.dispatch(loadingActions.setLoading(false));
    }


    const handleDelete = async () => {
        props.dispatch(loadingActions.setLoading(true));
        try {
            const res = await api.delete(`companies/${register.id}`);
            setIsUpdating(false);
                setRegister({});
                setName('')
                loadRegisters();
                setShow(false)
            props.dispatch(toastActions.setToast(true, 'success', 'Registro deletado!'));
        } catch (error) {
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro'));
        }
        props.dispatch(loadingActions.setLoading(false));
    }

    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('companies')
            setRegisters(res.data);
            setSearch(res.data)
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = async () => {
        var tempSearch = [];
        tempSearch = registers.filter(find =>
            find.name.toLowerCase().indexOf(searchField + ''.toLowerCase()) > -1
        )
        setSearch(tempSearch)
    }


    const setUpdating = (reg) => {
        setIsUpdating(true);
        setRegister(reg);
        setName(reg.name);
        setShow(true);
    }

    const hide = async (reg) => {
        setShow(false);
        setRegister({});
        setName('');
        setIsUpdating(false);
    }

    return (
        <div className="companie-container">
            <AppBar />
            <div className="filters">
                <label> Nome: </label>
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
                        <th>Nome</th>
                        <th>Opções</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.name}</td>
                            <td><button onClick={() => setUpdating(reg)}>ABRIR</button></td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={hide}>
                <Modal.Header>
                    <Modal.Title>Cadastro de empresas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label> Nome </label>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleSubmit}> Salvar </button>
                    <button onClick={handleDelete}> Apagar </button>

                </Modal.Footer>
            </Modal>


            <div className="fab-container">
                <button onClick={() => setShow(true)}> + </button>
            </div>
        </div>
    );
}

export default connect(state => ({ state }))(Companie);