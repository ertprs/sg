import React, { useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import * as XLSX from 'xlsx';
import { Table, Form } from 'react-bootstrap';
import './style.css';
import AppBar from '../../components/AppBar';

export default function ImportClient() {
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
        console.log('importa')
    }

    const upload = async sheet => {
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
                    <input id="file-upload" type="file" ref={sheetFile} onChange={() => upload(sheetFile)}/>
                    <div className="buttons-container">
                        <button
                            disabled={(!importedArray.length > 0)}
                            className="import-button"
                            onClick={importToDatabase}
                        > Importar </button>
                    </div>
                </div>
                <Table striped bordered hover className="importTable">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Celular</th>
                            <th>Fixo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {importedArray.map(client => (
                            <tr key={client.__rowNum__}>
                                <td>{client.__EMPTY}</td>
                                <td>{client.__EMPTY_1}</td>
                                <td>{client.__EMPTY_2}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
