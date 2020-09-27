import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import * as XLSX from 'xlsx';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { connect } from 'react-redux';
import moment, { now } from 'moment';
import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import AppBar from '../../components/AppBar';

function ImportCollects(props) {
    const history = useHistory();
    const sheetFile = React.useRef()
    const [importedArray, setImportedArray] = useState([])
    const [companies, setCompanies] = useState([]);
    const [companieId, setCompanieId] = useState(0);


    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        const res = await api.get('companies');
        console.log(res.data)
        if (res.data.length > 0) {
            setCompanies(res.data);
            setCompanieId(res.data[0].id)
        }
    }

    const configStrTelephone = tel => {
        if (!tel)
            return ''
        var telFormated = tel + '';
        telFormated = telFormated.toString();
        telFormated = telFormated.replace(/[^\d]+/g, '');
        if (telFormated.substring(0, 2) !== '55')
            telFormated = '55' + telFormated;
        return telFormated;
    }

    const insetOne = async register => {
        await api.post('collects/import-collect', {
            status: 'Aberto',
            companie: companieId,
            code: Object.values(register)[0],
            client: register.__EMPTY,
            cellphone: register.__EMPTY_1,
            phone: register.__EMPTY_2,
            account: register.__EMPTY_3,
            document: register.__EMPTY_4,
            type_maturity: register.__EMPTY_5,
            dt_emission: register.__EMPTY_6,
            dt_begin: register.__EMPTY_7,
            dt_end: register.__EMPTY_8,
            dt_maturity: register.__EMPTY_9,
            maximum_discount: register.__EMPTY_10,
            days: register.__EMPTY_11,
            value: register.__EMPTY_12,
        });
    }

    const registerOnBackend = async () => {
        props.dispatch(loadingActions.setLoading(true));

        await Promise.all(importedArray.map(reg => insetOne(reg)));

        props.dispatch(loadingActions.setLoading(false));

        props.dispatch(toastActions.setToast(true, 'success', 'Todos os registros foram importados!'));
    }

    const readFile = async sheet => {
        props.dispatch(loadingActions.setLoading(true));
        var f = sheet.current.files[0]
        var reader = await new FileReader();
        await reader.readAsArrayBuffer(f);
        reader.onload = async e => {
            var data = await new Uint8Array(reader.result);
            var wb = await XLSX.read(data, { type: "array" });
            data = new Uint8Array(data);
            var arr = [];
            for (var i = 0; i !== data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
            }
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" })
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var xlsxJSON = await (XLSX.utils.sheet_to_json(worksheet, { raw: false }));
            var tempArray = [];
            var count = 0;
            xlsxJSON.filter(json => {
                if (json.__rowNum__ > 10) {
                    count = count + 1;
                    json.__EMPTY_1 = configStrTelephone(json.__EMPTY_1);
                    json.__EMPTY_2 = configStrTelephone(json.__EMPTY_2);

                    json.__EMPTY_6 = moment(json.__EMPTY_6).format('DD/MM/YYYY')
                    json.__EMPTY_7 = moment(json.__EMPTY_7).format('DD/MM/YYYY')
                    json.__EMPTY_8 = moment(json.__EMPTY_8).format('DD/MM/YYYY')
                    json.__EMPTY_9 = moment(json.__EMPTY_9).format('DD/MM/YYYY')

                    tempArray.push(json);
                    return 
                }
            });
            setImportedArray(tempArray);
            props.dispatch(loadingActions.setLoading(false));
        }
    }

    return (
        <div>
            <AppBar />
            <div className="import-collet-container">
                <div className="form">
                    <select
                        onChange={(e) => setCompanieId(e.target.value)}
                        className="select-client">
                        {companies.map(comp => (
                            <option key={comp.id} value={comp.id}> {comp.name}</option>
                        ))}
                    </select>
                    <label htmlFor={companieId > 0 ? "file-upload" : ""} className="custom-file-upload">
                        Carregar arquivo
                    </label>
                    <input id="file-upload" type="file" ref={sheetFile} onChange={() => readFile(sheetFile)} />
                    <button
                        disabled={(!importedArray.length > 0)}
                        className="import-button"
                        onClick={registerOnBackend} >
                        Importar
                    </button>
                </div>
                <MDBTable responsive hover bordered>
                    <MDBTableHead>
                        <tr>
                            <th>Código</th>
                            <th>Cliente</th>
                            <th>Celular</th>
                            <th>Fixo</th>
                            <th>Conta</th>
                            <th>Doc.</th>
                            <th>Emissão</th>
                            <th>Vencimento</th>
                            <th>Desconto Máximo</th>
                            <th>Dias</th>
                            <th>Valor</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {importedArray.map(collect => (
                            <tr key={collect.__rowNum__}>
                                <td>{Object.values(collect)[0]}</td>
                                <td>{collect.__EMPTY}</td>
                                <td>{collect.__EMPTY_1}</td>
                                <td>{collect.__EMPTY_2}</td>
                                <td>{collect.__EMPTY_3}</td>
                                <td>{collect.__EMPTY_4}</td>                
                                <td>{collect.__EMPTY_6}</td>
                                <td>{collect.__EMPTY_9}</td>
                                <td>{collect.__EMPTY_10}</td>
                                <td>{collect.__EMPTY_11}</td>
                                <td>{collect.__EMPTY_12}</td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </div>
        </div >
    );
}

export default connect(state => ({ state }))(ImportCollects);