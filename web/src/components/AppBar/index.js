import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Form } from 'react-bootstrap';
import './style.css';

export default function AppBar() {
    const history = useHistory();

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand>Painel de controle</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavDropdown title="Cadastro" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => history.push('client')} >Cliente</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Importação" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => history.push('import-client')}>Planilha</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <Nav.Link onClick={() => history.push('/')}>Sair</Nav.Link>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar.Collapse>
        </Navbar>
    );
}
