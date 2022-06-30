import React from "react"
import { Card, CardBody, Col } from "reactstrap"
import ReactApexChart from "react-apexcharts"
import { Link } from "react-router-dom"

const series = [{
    name: 'Series A', type: 'column', data: [23, 11, 53, 27, 13, 19, 22, 37, 21, 44, 22, 30]
}
    ,
{
    name: 'Series B', type: 'area', data: [36, 47, 33, 41, 22, 37, 43, 21, 41, 56, 27, 43]
}
    ,
{
    name: 'Series C', type: 'line', data: [46, 57, 43, 51, 32, 47, 53, 31, 51, 66, 37, 53]
}
]

const options= {
    chart: {
        stacked: !1,
        toolbar: {
            show: !1
        }
        ,
    }
    ,
    stroke: {
        width: [0, 2, 2], curve: 'smooth', dashArray: [0, 0, 4]
    }
    ,
    plotOptions: {
        bar: {
            columnWidth: '15%', endingShape: 'rounded'
        }
    }
    ,
    fill: {
        opacity: [0.85,
        0.25,
        1],
        gradient: {
            inverseColors: !1, shade: 'light', type: "vertical", opacityFrom: 0.85, opacityTo: 0.55, stops: [0, 100, 100, 100]
        }
    }
    ,
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    }
    ,
    colors: ['#3b5de7',
    '#eeb902',
    '#5fd195'],
    markers: {
        size: 0
    }
    ,
  }

const Breadcrumb = props => {
    return (
        <React.Fragment>
            <Col lg={6}>
                <Card>
                    <CardBody>
                        <div className="float-end">
                            <ul className="nav nav-pills">
                                <li className="nav-item">
                                    <Link className="nav-link" to="#">Week</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="#">Month</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="#">Year</Link>
                                </li>
                            </ul>
                        </div>
                        <h4 className="card-title mb-4">Email Sent</h4>
                        <ReactApexChart
                            options={options}
                            series={series}
                            type="line"
                            height="275"
                            className="apex-charts"
                        />

                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    )
}


export default Breadcrumb
