import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';

import './style.css';
import api from '../../services/api';

import { getRandomColor } from '../../helpers/general';
import CurrencyInput from 'react-currency-input-field';
import AppBar from '../../components/AppBar';

function Dashboard(props) {
    const history = useHistory();
    const header = { headers: { hash: props.state.user.hash, user_id: props.state.user.id } };
    const [attendanceDataChart, setAttendanceDataChart] = useState({});
    const [attendanceMonthTotal, setAttendanceMonthTotal] = useState(0)


    const getDataAttendancesChart = async () => {
        const res = await api.get('attendances/chart-actual-month', header);
        var negotiatedValues = [];
        var dataValues = [];
        var colorsValues = [];
        var attendanceMonthTotal = 0;

        res.data.map(values => {
            negotiatedValues.push(values.negotiated_value)
            dataValues.push(values.date)
            colorsValues.push(getRandomColor())
            attendanceMonthTotal = attendanceMonthTotal + values.negotiated_value
        });

        setAttendanceMonthTotal(attendanceMonthTotal);

        setAttendanceDataChart({
            labels: dataValues,
            datasets: [{
                data: negotiatedValues,
                backgroundColor: colorsValues,
                hoverBackgroundColor: colorsValues
            }]
        });
    }


    useEffect(() => {
        getDataAttendancesChart()
    }, [])


    return (
        <div className="dashboard-container">
            <AppBar />
            <div style={{textAlign: "center", margin: "auto", marginTop: '5%', width: '90%', maxWidth: 800}}>
                <h5 style={{ textAlign: "center" }}> Atendimentos Liquidados do mês vigente </h5>
                <Doughnut data={attendanceDataChart} />
                <CurrencyInput
                    style={{ width: 200, backgroundColor: '#fff', border: 'none', textAlign: "center", fontWeight: 'bold' }}
                    prefix="R$ "
                    placeholder="Multa"
                    decimalSeparator=","
                    groupSeparator="."
                    value={attendanceMonthTotal ? attendanceMonthTotal : ''}
                    readOnly />
            </div>
        </div>
    );
}

export default connect(state => ({ state }))(Dashboard);