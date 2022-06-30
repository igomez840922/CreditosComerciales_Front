import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import ReactApexChart from "react-apexcharts"

const series= [ {
    name: 'Series 1', data: [80, 50, 30, 40, 100, 20],
}
,
{
    name: 'Series 2', data: [20, 30, 40, 80, 20, 80],
}
,
{
    name: 'Series 3', data: [44, 76, 78, 13, 43, 10],
}
]

const options= {
    chart: {
        dropShadow: {
            enabled: true, blur: 1, left: 1, top: 1
        }
        ,
        toolbar: {
            show: !1
        }
        ,
    }
    ,
    stroke: {
        width: 0
    }
    ,
    fill: {
        opacity: 0.4
    }
    ,
    markers: {
        size: 0
    }
    ,
    colors: ['#3b5de7',
    '#5fd195',
    '#eeb902'],
    xaxis: {
        categories: ['2014', '2015', '2016', '2017', '2018', '2019']
    }
  }

const YearlySale = () => {
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <CardTitle className="h4 mb-4">Yearly sales</CardTitle>

                    <ReactApexChart
                        options={options}
                        series={series}
                        type="radar"
                        height="250"
                        className="apex-charts"
                    />

                </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default YearlySale;