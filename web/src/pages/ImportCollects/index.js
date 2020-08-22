import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import * as XLSX from 'xlsx';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { connect } from 'react-redux';
import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import AppBar from '../../components/AppBar';

function ImportCollects(props) {
    const history = useHistory();
    const sheetFile = React.useRef()
    const [importedArray, setImportedArray] = useState([])

    const configStrTelephone = tel => {
        var telFormated = tel + '';
        telFormated = telFormated.toString();
        telFormated = telFormated.replace(/[^\d]+/g, '');
        return telFormated;
    }

    const importToDatabase = async () => {
        importedArray.filter(async client => {
            try {
                props.dispatch(loadingActions.setLoading(true));
                const res = await api.post('collects', {
                    name: client.__EMPTY,
                    cellphone: client.__EMPTY_1,
                    phone: client.__EMPTY_2
                });
                props.dispatch(loadingActions.setLoading(false));
            } catch (error) {
                console.log(error)
            }
        });

    }

    const upload = async sheet => {
        var f = sheet.current.files[0]
        var reader = new FileReader();
        reader.readAsArrayBuffer(f);
        reader.onload = async (e) => {
            props.dispatch(loadingActions.setLoading(true));
            var data = new Uint8Array(reader.result);
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
            var xlsxJSON = await (XLSX.utils.sheet_to_json(worksheet, { raw: true }));
            var tempArray = [];
            var count = 0;
            xlsxJSON.filter(json => {
                if (json.__rowNum__ > 10) {
                    count = count + 1;
                    json.__EMPTY_1 = configStrTelephone(json.__EMPTY_1);
                    json.__EMPTY_2 = configStrTelephone(json.__EMPTY_2);
                    tempArray.push(json)
                }
            });
            console.log(tempArray.length);
            console.log(count)
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
                        className="select-client">
                        <option value="chimba">Posto Chimba</option>
                    </select>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Carregar arquivo
                    </label>
                    <input id="file-upload" type="file" ref={sheetFile} onChange={() => upload(sheetFile)} />
                    <button
                        disabled={(!importedArray.length > 0)}
                        className="import-button"
                        onClick={importToDatabase} >
                        Importar
                    </button>
                </div>
                <MDBTable responsive hover bordered>
                    <MDBTableHead>
                        <tr>
                            <th>Nome</th>
                            <th>Celular</th>
                            <th>Fixo</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {importedArray.map(collect => (
                            <tr key={collect.__rowNum__}>
                                <td>{collect.__EMPTY}</td>
                                <td>{collect.__EMPTY_1}</td>
                                <td>{collect.__EMPTY_2}</td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </div>
        </div >
    );
}

export default connect(state => ({ state }))(ImportCollects);