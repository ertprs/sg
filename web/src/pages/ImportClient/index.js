import React, { useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import * as XLSX from 'xlsx';
import { Spinner } from 'react-bootstrap';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import api from '../../services/api';
import './style.css';
import AppBar from '../../components/AppBar';

export default function ImportClient() {
    const history = useHistory();
    const sheetFile = React.useRef()
    const [importedArray, setImportedArray] = useState([])
    const [btnIsLoading, setBtnIsLoading] = useState(false)

    const configStrTelephone = tel => {
        var telFormated = tel + '';
        telFormated = telFormated.toString();
        telFormated = telFormated.replace(/[^\d]+/g, '');
        return telFormated;
    }

    const importToDatabase = async () => {
        setBtnIsLoading(true);
        importedArray.filter(async client => {
            try {
                const res = await api.post('clients', {
                    name: client.__EMPTY,
                    cellphone: client.__EMPTY_1,
                    phone: client.__EMPTY_2
                });
            } catch (error) {
                console.log(error)
            }
        });
        setBtnIsLoading(false);
    }

    const upload = async sheet => {
        setBtnIsLoading(true)
        var f = sheet.current.files[0]
        var reader = new FileReader();
        reader.readAsArrayBuffer(f);
        reader.onload = (e) => {
            var data = new Uint8Array(reader.result);
            var wb = XLSX.read(data, { type: "array" });
            data = new Uint8Array(data);
            var arr = [];
            for (var i = 0; i !== data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
            }
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" })
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var xlsxJSON = (XLSX.utils.sheet_to_json(worksheet, { raw: true }));
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
            setBtnIsLoading(false)
        }
    }

    return (
        <div>
            <AppBar />
            <div className="import-client-container">
                <div className="form">
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Carregar arquivo
                    </label>
                    <input id="file-upload" type="file" ref={sheetFile} onChange={() => upload(sheetFile)} />
                    <div className="buttons-container">
                        <button
                            disabled={(!importedArray.length > 0)}
                            className="import-button"
                            onClick={importToDatabase} >
                            Importar
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                hidden={!btnIsLoading} />
                        </button>
                    </div>
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
                        {importedArray.map(client => (
                            <tr key={client.__rowNum__}>
                                <td>{client.__EMPTY}</td>
                                <td>{client.__EMPTY_1}</td>
                                <td>{client.__EMPTY_2}</td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </div>
        </div >
    );
}
