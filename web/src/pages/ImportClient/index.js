import React, { useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import * as XLSX from 'xlsx';
import './style.css';
import AppBar from '../../components/AppBar';

export default function ImportClient() {
    const history = useHistory();
    const sheetFile = React.useRef()


    const upload = async sheet => {

        var f = sheet.current.files[0]
        console.log(f);



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
            console.log(xlsxJSON);

        }
    }

    return (
        <div>
            <AppBar />
            <input type="file" id="input-excel" ref={sheetFile} onChange={() => console.log(sheetFile.current.files[0]) } />
            <button onClick={() => upload(sheetFile)}> Click me </button>
        </div>
    );
}
