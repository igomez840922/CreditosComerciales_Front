import React, { useState, useRef } from 'react';
import ReactApexChart from "react-apexcharts"
import {
    Card,
    CardBody,
} from "reactstrap"
import * as moment from 'moment';
import { formatCurrency, translationHelpers } from '../../helpers';
import { BackendServices } from "../../services";

const ScatterChart = (props) => {

    const [series, setseries] = useState([]);

    const [options, setoptions] = useState({
        chart: {
            height: 350,
            type: 'scatter',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: true,
                type: 'xy'
            }
        },

        colors: ['#3b5de7', '#45cb85'],
        xaxis: {
            tickAmount: 10,

        },
        legend: {
            position: 'top',
        },
        yaxis: {
            tickAmount: 7
        }
    });

    const backendServices = new BackendServices();
    const [tc, tr] = translationHelpers('commercial_credit', 'translation');


    React.useEffect(() => {
        inicialize()
    }, []);

    function inicialize() {
        backendServices.getBpmStatistics().then(resp => {

            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            let nowMonth = moment().month();
            let beforeMonth = moment().add(-1, 'months').month();

            let nowDate = resp.filter(statistics => moment(statistics.date).month() === nowMonth);
            let beforeDate = resp.filter(statistics => moment(statistics.date).month() === beforeMonth);

            nowDate = groupBy(nowDate.map(statistics => ({ ...statistics, date: moment(statistics.date).format("DD/MM/YYYY") })), 'date');
            beforeDate = groupBy(beforeDate.map(statistics => ({ ...statistics, date: moment(statistics.date).format("DD/MM/YYYY") })), 'date');


            let nowSeries = nowDate.map($date => [moment($date.at(0).date, "DD/MM/YYYY").date(), $date.length]);

            let beforeSeries = beforeDate.map($date => [moment($date.at(0).date, "DD/MM/YYYY").date(), $date.length]);

            let series = [
                {
                    name: tr(months[beforeMonth]),
                    data: beforeSeries
                },
                {
                    name: tr(months[nowMonth]),
                    data: nowSeries
                }
            ];

            setseries(series);

        }).catch(err => {
            console.log(err);
        })
    }

    /**
     * groupBy, agrupa los items de un JSON
     * @param {Array} collection 
     * @param {string} property 
     * @returns {Array}
     */
    function groupBy(collection, property) {
        var i = 0, val, index,
            values = [], result = [];
        for (; i < collection.length; i++) {
            val = collection[i][property];
            index = values.indexOf(val);
            if (index > -1)
                result[index].push(collection[i]);
            else {
                values.push(val);
                result.push([collection[i]]);
            }
        }
        return result;
    }


    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h4 className="card-title mb-4">Comportamiento en el Mes</h4>

                    <ReactApexChart
                        options={options}
                        series={series}
                        height="225"
                        type="scatter"
                        className="apex-charts"
                    />

                </CardBody>
            </Card>


        </React.Fragment>
    )
}

export default ScatterChart