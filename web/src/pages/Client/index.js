import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Spinner, Modal, Button } from 'react-bootstrap';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import api from '../../services/api';
import './style.css';
import AppBar from '../../components/AppBar';


export default function Client() {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [clients, setClients] = useState([]);
    const [client, setClient] = useState({});

    const [searchField, setSearchField] = useState('');
    const [search, setSearch] = useState([]);
    const [selectFilterField, setSelectFilterField] = useState('phone')

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const res = await api.get('clients')
            setClients(res.data);
            setSearch(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = async () => {
        var tempSearch = [];
        if (selectFilterField === 'name')
            tempSearch = clients.filter(find =>
                find.name.toLowerCase().indexOf(searchField.toLowerCase()) > -1
            )

        if (selectFilterField === 'phone')
            tempSearch = clients.filter(find =>
                find.cellphone.toLowerCase().indexOf(searchField.toLowerCase()) > -1
            )

        setSearch(tempSearch)
    }

    const openClient = async (cli) => {
        setShow(true)
        setClient(cli)
    }


    return (
        <div className="client-container">
            <AppBar />
            <div className="filters-client">
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
                        <th>Nome</th>
                        <th>Celular</th>
                        <th>Fixo</th>
                        <th>Opções</th>

                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(cli => (
                        <tr key={cli.id}>
                            <td>{cli.id}</td>
                            <td>{cli.name}</td>
                            <td>{cli.cellphone}</td>
                            <td>{cli.phone}</td>
                            <td><button onClick={() => openClient(cli)}>ABRIR</button></td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>Cadastro de cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label> {client.name} </label>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => setShow(false)}> Ok </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
