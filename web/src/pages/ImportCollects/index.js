import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import * as XLSX from 'xlsx';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { connect } from 'react-redux';
import moment, { now } from 'moment';
import './style.css';
import api from '../../services/api';
import { strValueToFloat, floatValueToStr, configSheetStr } from '../../helpers/myFormat';
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
        const data = {
            status: 'Aberto',
            companie: companieId,
            client: register.NOME_CLIENTE,
            cellphone: register.FONE_1 ? register.FONE_1 : register.FONE_2,
            phone: register.FONE_2 ? register.FONE_2 : register.FONE_3,
            dt_maturity: register.DT_VENC,
            maximum_discount: register.DESC_MAX,
            value: register.VLR_ORIGINARIO,
        }
        api.post('collects/import-collect', data);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const registerOnBackend = async () => {
        props.dispatch(loadingActions.setLoading(true));
        
        for (var reg of importedArray) {
            await sleep(100).then(() => {
                insetOne(reg)
            });
        }
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
            for (var json of xlsxJSON) {
                json.FONE_1 = await configStrTelephone(json.FONE_1);
                json.FONE_2 = await configStrTelephone(json.FONE_1);
                json.FONE_3 = await configStrTelephone(json.FONE_1);
                json.DT_VENC = await moment(json.DT_VENC).format('DD/MM/YYYY')
                json.VLR_ORIGINARIO = await configSheetStr(json.VLR_ORIGINARIO)
                json.DESC_MAX = await configSheetStr(json.DESC_MAX)
                tempArray.push(json);
            }
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
                            <th>Cliente</th>
                            <th>Telefone 1</th>
                            <th>Telefone 2</th>
                            <th>Telefone 3</th>
                            <th>Dt. Venc.</th>
                            <th>Vlr. Originário</th>
                            <th>Desconto Max.</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {importedArray.map(collect => (
                            <tr key={collect.__rowNum__}>
                                <td>{collect.NOME_CLIENTE}</td>
                                <td>{collect.FONE_1}</td>
                                <td>{collect.FONE_2}</td>
                                <td>{collect.FONE_3}</td>
                                <td>{collect.DT_VENC}</td>
                                <td>{collect.VLR_ORIGINARIO}</td>
                                <td>{collect.DESC_MAX}</td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </div>
        </div >
    );
}

export default connect(state => ({ state }))(ImportCollects);