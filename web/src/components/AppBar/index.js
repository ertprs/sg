import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './style.css';
import * as userActions from '../../store/actions/user';

function AppBar(props) {
    const history = useHistory();

    return (
        <Navbar expand="lg" className="navbar" >
            <Navbar.Brand id="basic-nav-dropdown" onClick={() => history.push('/')}>Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {props.state.user.userType > 0 ?
                        <NavDropdown title="Cadastro" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => history.push('attendance')} > Atendimentos </NavDropdown.Item>
                            {props.state.user.userType >= 2 ?
                                <>
                                    <NavDropdown.Item onClick={() => history.push('client')} > Devedores </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => history.push('collect')} > Débitos </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => history.push('companie')} > Credores </NavDropdown.Item>
                                </>
                                : <></>
                            }
                        </NavDropdown>
                        : <></>
                    }
                    {props.state.user.userType >= 2 ?
                        <NavDropdown title="Importação" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => history.push('import-collects')}>Importar Cobranças</NavDropdown.Item>
                        </NavDropdown>
                        : <></>
                    }
                    {props.state.user.userType >= 2 ?
                        <NavDropdown title="Boletos" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => history.push('billet')}>Boletos</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => history.push('report-billet')}>Relatório de Boletos</NavDropdown.Item>
                        </NavDropdown>
                        : <></>
                    }
                    {props.state.user.userType >= 2 ?
                        <NavDropdown title="Controle de Usuários" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => history.push('user')}>Cadastro de Usuário </NavDropdown.Item>
                        </NavDropdown>
                        : <></>
                    }
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text style={{ color: '#fff' }}> {'Usuário Atual: ' + props.state.user.name} </Navbar.Text>
                    <Navbar.Text>
                        <Nav.Link id="basic-nav-dropdown" onClick={() => {
                            props.dispatch(userActions.setUser(0, '', -1, ''));
                            localStorage.setItem('@sg/user/name', '')
                            localStorage.setItem('@sg/user/user_type', -1)
                            localStorage.setItem('@sg/user/hash', '')
                            localStorage.setItem('@sg/user/id', 0)
                            history.push('/')
                        }}>Sair</Nav.Link>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default connect(state => ({ state }))(AppBar);