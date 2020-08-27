import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import AppBar from '../../components/AppBar';


function Client(props) {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState([]);
    const [searchField, setSearchField] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});

    useEffect(() => {
        loadRegisters();
    }, []);

    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('clients')
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
            find.name.toLowerCase().indexOf(searchField+''.toLowerCase()) > -1
        )
        setSearch(tempSearch)
    }

    const open = async (cli) => {
        setShow(true)
        setRegister(cli)
    }

    return (
        <div className="client-container">
            <AppBar />
            <div className="filters">
                <label> Busca por nome </label>
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
                            <td>{reg.cellphone}</td>
                            <td>{reg.phone}</td>
                            <td>{reg.companie + ' - ' + reg.companie_name}</td>
                            <td><button onClick={() => open(reg)}>ABRIR</button></td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>Cadastro de empresas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label> {register.name} </label>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => setShow(false)}> Ok </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default connect(state => ({ state }))(Client);