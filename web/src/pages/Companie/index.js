import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import CurrencyFormat from 'react-currency-format';
import CurrencyInput from 'react-currency-input-field';
import './style.css';
import myFormat from '../../helpers/myFormat';
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
    const [defaultInterest, setDefaultInterest] = useState('');
    const [defaultHonorary, setDefaultHonorary] = useState('');
    const [defaultPenalty, setDefaultPenalty] = useState('');
    const [monthlyValue, setMonthlyValue] = useState('');
    const [payday, setPayDay] = useState('');
    const [paymentType, setPaymentType] = useState('');
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
            default_interest: defaultInterest,
            default_honorary: defaultHonorary,
            default_penalty: defaultPenalty,
            monthly_value: monthlyValue,
            payday: payday,
            payment_type: paymentType,
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
        setDefaultInterest(reg.default_interest);
        setDefaultHonorary(reg.default_honorary);
        setDefaultPenalty(reg.default_penalty);
        setMonthlyValue(reg.monthly_value);
        setPayDay(reg.payday);
        setPaymentType(reg.payment_type);

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
        setDefaultInterest('');
        setDefaultHonorary('');
        setDefaultPenalty('');
        setMonthlyValue('');
        setPayDay('');
        setPaymentType('');
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
                        <th>Razão Social</th>
                        <th>Observação</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr
                            style={{ cursor: 'pointer' }}
                            onClick={() => setUpdating(reg)}
                            key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.name}</td>
                            <td>{reg.obs}</td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => console.log('Cant close')}>
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
                    <label> Razão Social </label>
                    <input
                        type="text"
                        placeholder="Razão Social"
                        value={name}
                        onChange={e => setName(e.target.value)} />

                    <label> CNPJ </label>
                    <CurrencyFormat
                        format="###.###.###/###-##"
                        placeholder="CNPJ"
                        value={cnpj ? cnpj : ''}
                        onValueChange={e => setCnpj(e.value)} />

                    <label> Endereço </label>
                    <input
                        type="text"
                        placeholder="Endereço"
                        value={edress}
                        onChange={e => setEdress(e.target.value)} />

                    <label> Telefone </label>
                    <CurrencyFormat
                        format="## (##) #########"
                        placeholder="Telefone"
                        value={phone ? phone : ''}
                        onValueChange={e => setPhone(e.value)} />

                    <label> Pessoa Responsável </label>
                    <input
                        type="text"
                        placeholder="Endereço"
                        value={responsibleStaff}
                        onChange={e => setResponsibleStaff(e.target.value)} />


                    <label> Data de início de contrato </label>
                    <CurrencyFormat
                        format="##/##/####"
                        placeholder="Data do contrato"
                        value={dtContract ? dtContract : ''}
                        onValueChange={e => setDtContract(e.value)} />

                    <label> Prazo para renovação </label>
                    <CurrencyFormat
                        format="##/##/####"
                        placeholder="Data de renovação"
                        value={dtRenovation ? dtRenovation : ''}
                        onValueChange={e => setDtRenovation(e.value)} />

                    <label> R$ Valor da Mensalidade </label>
                    <CurrencyInput
                        placeholder="Valor da Mensalidade"
                        decimalSeparator=","
                        groupSeparator="."
                        value={monthlyValue?monthlyValue:''}
                        onChange={e => setMonthlyValue(e)}/>

                    <label> % Juros Diário </label>
                    <CurrencyInput
                        placeholder="Juros "
                        decimalsLimit={3}
                        decimalSeparator=","
                        groupSeparator="."
                        value={defaultInterest?defaultInterest:''}
                        onChange={e => setDefaultInterest(e)}/>

                    <label> % Honorários padrão </label>
                    <CurrencyInput
                        placeholder="Honorários Padrão"
                        decimalSeparator=","
                        groupSeparator="."
                        value={defaultHonorary?defaultHonorary:''}
                        onChange={e => setDefaultHonorary(e)}/>

                    <label> % Multa </label>
                    <CurrencyInput
                        placeholder="Honorários Padrão"
                        decimalSeparator=","
                        groupSeparator="."
                        value={defaultPenalty?defaultPenalty:''}
                        onChange={e => setDefaultPenalty(e)}/>

                    <label> Data de Pagamento </label>
                    <input
                        type="text"
                        placeholder="Data de Pagamento"
                        value={payday}
                        onChange={e => setPayDay(e.target.value)} />

                    <label> Modalidade de Pagamento </label>
                    <select
                        className="select-search"
                        onChange={e => setPaymentType(e.target.value)}>
                        <option value="Permuta" selected={paymentType === 'Permuta' ? true : false}>Permuta</option>
                        <option value="Sem mensalidade" selected={paymentType === 'Sem mensalidade' ? true : false}>Sem mensalidade</option>
                        <option value="Dinheiro" selected={paymentType === 'Dinheiro' ? true : false}>Dinheiro</option>
                    </select>

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