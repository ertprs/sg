import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './style.css';

export default function AppBar() {
    const history = useHistory();

    return (
        <Navbar expand="lg" className="navbar" >
            <Navbar.Brand id="basic-nav-dropdown" onClick={() => history.push('dashboard')}>Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavDropdown title="Cadastro" id="basic-nav-dropdown">
                        <NavDropdown.Item id="color-item" onClick={() => history.push('client')} > Clientes </NavDropdown.Item>
                        <NavDropdown.Item id="color-item" onClick={() => history.push('collect')} > Cobranças </NavDropdown.Item>
                        <NavDropdown.Item id="color-item" onClick={() => history.push('companie')} >Empresas </NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Importação" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => history.push('import-collects')}>Importar cobranças</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <Nav.Link id="basic-nav-dropdown" onClick={() => history.push('/')}>Sair</Nav.Link>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar.Collapse>
        </Navbar>
    );
}
