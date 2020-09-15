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
    const [search, setSearch] = useState([]);
    const [searchField, setSearchField] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [edress, setEdress] = useState('');
    const [phone, setPhone] = useState('');
    const [responsibleStaff, setResponsibleStaff] = useState('');
    const [dtContract, setDtContract] = useState('');
    const [dtRenovation, setDtRenovation] = useState('');
    const [renovationTerm, setRenovarionTerm] = useState('');

    const [defaultInterest, setDefaultInterest] = useState('');
    const [defaultHonorary, setDefaultHonorary] = useState('');
    const [defaultPenalty, setDefaultPenalty] = useState('');
    const [obs, setObs] = useState('');


    useEffect(() => {
        loadRegisters();
    }, []);

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
            cnpj,
            edress,
            phone,
            responsible_staff: responsibleStaff,
            dt_contract: dtContract,
            dt_renovation: dtRenovation,
            renovation_term: renovationTerm,
            default_interest: defaultInterest,
            default_honorary: defaultHonorary,
            default_penalty: defaultPenalty,
            obs,
        }

        setRegister(regTemp);

        try {
            if (isUpdating) {
                //ALTERAÇÃO
                const res = await api.put(`companies/${register.id}`, regTemp)
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //CADASTRO
                const res = await api.post('companies', regTemp);
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
            const res = await api.delete(`companies/${register.id}`);
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
            find.name.toLowerCase().indexOf(String(searchField).toLowerCase()) > -1
        )
        setSearch(tempSearch)
    }

    const clearValues = () => {
        setName('')
    }


    const setUpdating = (reg) => {
        setIsUpdating(true);
        setRegister(reg);
        setName(reg.name);
        setCnpj(reg.cnpj);
        setEdress(reg.edress);
        setPhone(reg.phone);
        setResponsibleStaff(reg.responsible_staff);
        setDtContract(reg.dt_contract);
        setDtRenovation(reg.dt_renovation);
        setRenovarionTerm(reg.renovation_term);
        setDefaultInterest(reg.default_interest);
        setDefaultHonorary(reg.default_honorary);
        setDefaultPenalty(reg.default_penalty)
        setObs(reg.obs);
        setShow(true);
    }

    const hide = async (reg) => {
        setShow(false);
        setRegister({});
        setName('');
        setName('');
        setCnpj('');
        setEdress('');
        setPhone('');
        setResponsibleStaff('');
        setDtContract('');
        setDtRenovation('');
        setRenovarionTerm('');
        setDefaultInterest('');
        setDefaultHonorary('');
        setDefaultPenalty('');
        setObs('');
        setIsUpdating(false);
    }

    const setNew = () => {
        setIsUpdating(false);
        clearValues();
        setShow(true);
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
                        <th>Observação</th>
                        <th>Opções</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.name}</td>
                            <td>{reg.obs}</td>
                            <td><button onClick={() => setUpdating(reg)}>ABRIR</button></td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={hide}>
                <Modal.Header>
                    <Modal.Title>Cadastro de Credor</Modal.Title>
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

                    <label> CNPJ </label>
                    <input
                        type="text"
                        placeholder="CNPJ"
                        value={cnpj}
                        onChange={e => setCnpj(e.target.value)} />

                    <label> Endereço </label>
                    <input
                        type="text"
                        placeholder="Endereço"
                        value={edress}
                        onChange={e => setEdress(e.target.value)} />

                    <label> Telefone </label>
                    <input
                        type="text"
                        placeholder="Telefone"
                        value={phone}
                        onChange={e => setPhone(e.target.value)} />

                    <label> Pessoa responsável </label>
                    <input
                        type="text"
                        placeholder="Endereço"
                        value={responsibleStaff}
                        onChange={e => setResponsibleStaff(e.target.value)} />


                    <label> Data do contrato </label>
                    <input
                        type="text"
                        placeholder="Data do contrato"
                        value={dtContract}
                        onChange={e => setDtContract(e.target.value)} />

                    <label> Data de renovação </label>
                    <input
                        type="text"
                        placeholder="Data de renovação"
                        value={dtRenovation}
                        onChange={e => setDtRenovation(e.target.value)} />


                    <label> Prazo de renovação </label>
                    <input
                        type="text"
                        placeholder="Prazo de renovação"
                        value={renovationTerm}
                        onChange={e => setRenovarionTerm(e.target.value)} />

                    <label> % Juros </label>
                    <input
                        type="number"
                        placeholder="Juros"
                        value={defaultInterest}
                        onChange={e => setDefaultInterest(e.target.value)} />

                    <label> % Honorário </label>
                    <input
                        type="number"
                        placeholder="Honorário padrão"
                        value={defaultHonorary}
                        onChange={e => setDefaultHonorary(e.target.value)} />

                    <label> % Multa </label>
                    <input
                        type="number"
                        placeholder="Honorário padrão"
                        value={defaultPenalty}
                        onChange={e => setDefaultPenalty(e.target.value)} />

                    <label> Obs </label>
                    <input
                        type="text"
                        placeholder="Observação"
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

export default connect(state => ({ state }))(Companie);