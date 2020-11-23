import React, { useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'

import './style.css';
import { strValueToFloat, floatValueToStr } from '../../../helpers/myFormat';
import AppBar from '../../../components/AppBar';
import api from '../../../services/api';
import * as loadingActions from '../../../store/actions/loading';
import * as toastActions from '../../../store/actions/toast';

function Sale(props) {
    const history = useHistory();
    const header = { headers: { hash: props.state.user.hash, user_id: props.state.user.id } };

    const [dtBegin, setDtBegin] = useState(moment().format('L'))
    const [dtEnd, setDtEnd] = useState(moment().format('L'))
    const [search, setSearch] = useState([])
    const [status, setStatus] = useState('TODAS')
    const refPrint = useRef();

    const [total, setTotal] = useState(0);
    const [qt, setQt] = useState(0);

    const handleSearch = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('billets', header)
            if (res.data.error) {
                props.dispatch(loadingActions.setLoading(false));
                props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + res.data.error));
                return 0;
            }
            var tempArray = []
            var tempTotal = 0;
            var tempQt = 0;
            setTotal(0);

            for (let i = 0; i < res.data.length; i++) {
                if ((moment(dtBegin, "DD/MM/YYYY") <= moment(res.data[i].dt_generation, "DD/MM/YYYY")) && (moment(dtEnd, "DD/MM/YYYY") >= moment(res.data[i].dt_generation, "DD/MM/YYYY"))) {

                    if ((status !== 'TODAS') && (status !== res.data[i].status))
                        continue


                    var tempObject = {
                        id: res.data[i].id,
                        client: res.data[i].client + ' - ' + res.data[i].client_name,
                        billet_total: 'R$ ' + strValueToFloat(res.data[i].billet_total).toLocaleString(),
                        dt_generation: res.data[i].dt_generation,
                        status: res.data[i].status,
                    }
                    tempArray.push(tempObject)
                    tempQt = tempQt + 1;
                    tempTotal = tempTotal + strValueToFloat(tempObject.billet_total);
                }
            }
            setQt(tempQt)
            setTotal(tempTotal);
            setSearch(tempArray);
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }

    }

    const handlePrint = () => {
        const printArea = refPrint.current;
        const doc = new jsPDF('portrait', 'pt', 'a4');
        doc.setFontSize(18)
        doc.text(220, 35, 'Relatorio de Boletos')
        doc.setFontSize(10)
        doc.text(240, 55, 'De ' + dtBegin + ' a ' + dtEnd)
        doc.autoTable({
            margin: {
                left: 25,
                right: 25,
                top: 75
            },
            columnStyles: {
                dt_generation: { cellWidth: 70 },
                client: { cellWidth: 180 },
                billet_total: { cellWidth: 80 },
                status: { cellWidth: 200 },
            },
            columns: [
                { header: 'Data', dataKey: 'dt_generation' },
                { header: 'Cliente', dataKey: 'client' },
                { header: 'Total', dataKey: 'billet_total' },
                { header: 'Status', dataKey: 'status' },
            ],
            body: search,
        })
        doc.text(25, doc.autoTable.previous.finalY + 30, qt + ' boletos, totalizando ' + 'R$ ' + floatValueToStr(total))
        doc.text(25, doc.autoTable.previous.finalY + 45, 'Documento imporesso em: ' + moment().format('L LT'))
        doc.autoPrint();
        doc.output('dataurlnewwindow');
    }


    return (
        <div className="sale-report-container">
            <AppBar />
            <div className="filters-container">

                <div className="filter-fields">
                    <label> Período </label>
                    <div className="inline">
                        <CurrencyFormat
                            format={'##/##/####'}
                            placeholder="Periodo"
                            value={dtBegin ? dtBegin : ''}
                            onValueChange={e => setDtBegin(e.formattedValue)} />
                        <label> á </label>
                        <CurrencyFormat
                            format={'##/##/####'}
                            placeholder="Periodo"
                            value={dtEnd ? dtEnd : ''}
                            onValueChange={e => setDtEnd(e.formattedValue)} />
                        <div />
                    </div>
                </div>

                <div className="filter-fields">
                    <label> Status </label>
                    <select
                        className="select-search"
                        onChange={e => setStatus(e.target.value)}>
                        <option value="TODAS" selected>Todas</option>
                        <option value="Recebida">Recebida</option>
                        <option value="Vencida">Vencida</option>
                        <option value="Estornada">Estornada</option>
                        <option value="Aguardando pagamento">Aguardando pagamento</option>
                    </select>
                </div>

                <button onClick={handleSearch}> Consulta </button>
            </div>

            <hr />

            <div className="print-container">
                <div />

                <button
                    onClick={handlePrint}>
                    Imprimir
                </button>
            </div>


            <div ref={refPrint}>
                <MDBTable responsive hover bordered>
                    <MDBTableHead>
                        <tr>
                            <th>Código</th>
                            <th>Data</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {search.map(reg => (
                            <tr className="tr-crud" key={reg.id}>
                                <td>{reg.id}</td>
                                <td>{reg.dt_generation}</td>
                                <td>{reg.client + ' - ' + reg.client_name}</td>
                                <td>{reg.billet_total}</td>
                                <td>{reg.status}</td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
                <h7> {qt} boletos, totalizando {'R$ ' + floatValueToStr(total)} </h7>
            </div>
        </div >
    )
}

export default connect(state => ({ state }))(Sale);