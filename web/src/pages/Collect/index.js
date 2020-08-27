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
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});

    const [searchField, setSearchField] = useState('');
    const [search, setSearch] = useState([]);
    const [selectFilterField, setSelectFilterField] = useState('phone')

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
            console.log(error)
        }
    }

    const handleSearch = async () => {
        var tempSearch = [];
        if (selectFilterField === 'name')
            tempSearch = registers.filter(find =>
                find.client_name.toLowerCase().indexOf(searchField+''.toLowerCase()) > -1
            )

        if (selectFilterField === 'phone')
            tempSearch = registers.filter(find =>
                find.phone.indexOf(searchField) > -1
            )
        setSearch(tempSearch)
    }

    const open = async (reg) => {
        setShow(true)
        setRegister(reg)
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
                            <td><button onClick={() => open(reg)}>ABRIR</button></td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>Cadastro de cliente</Modal.Title>
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