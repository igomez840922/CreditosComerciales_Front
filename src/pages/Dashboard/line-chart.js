import React from "react"
import ReactApexChart from "react-apexcharts"
import {
    Card,
    CardBody,
  } from "reactstrap"

const LineChart = () => {

    const series = [{
        name: "2018",
        type: 'line',
        data: [20, 34, 27, 59, 37, 26, 38, 25],
    },
    {
        name: "2019",
        data: [10, 24, 17, 49, 27, 16, 28, 15],
        type: 'area',
    }]

    const options = {
        chart: {
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        colors: ['#45cb85', '#3b5de7'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: '3',
            dashArray: [4, 0],
        },

        markers: {
            size: 3
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            title: {
                text: 'Month'
            }
        },

        fill: {
            type: 'solid',
            opacity: [1, 0.1],
        },

        legend: {
            position: 'top',
            horizontalAlign: 'right',
        }
    }

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h4 className="card-title mb-4">Sales Report</h4>

                    <ReactApexChart
                        options={options}
                        series={series}
                        height="260"
                        type="line"
                        className="apex-charts"
                    />
                </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default LineChart