import React from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import ReactApexChart from "react-apexcharts"
import { Link } from "react-router-dom"

const series = [{
    data: [3, 6, 4, 7, 9, 4]
}
]

const options= {
    chart: {
        toolbar: {
            show: !1
        },
    }
    ,
    plotOptions: {
        bar: {
            horizontal: !0, barHeight: '24%', endingShape: 'rounded',
        }
    }
    ,
    dataLabels: {
        enabled: !1
    }
    ,
    colors: ['#556ee6'],
    xaxis: {
        categories: ['Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun'],
        title: {
            text: 'thousands'
        }
        ,
    }
    ,
  }

const EarningChart = () => {
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <CardTitle className="h4 mb-4">Earning</CardTitle>

                    <Row>
                        <Col lg={6}>
                            <div>
                                <p>1 Jan - 31 Jan, 2020</p>
                                <p className="mb-2">Total Earning</p>
                                <h4>$ 12,362</h4>
                            </div>

                            <Row>
                                <Col sm={6}>
                                    <div className="mt-3">
                                        <p className="mb-2 text-truncate">This Month</p>
                                        <h5 className="d-inline-block align-middle mb-0">$ 9,245</h5> <span
                                            className="badge badge-soft-success">+ 1.5 %</span>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="mt-3">
                                        <p className="mb-2 text-truncate">Last Month</p>
                                        <h5>$ 8,234</h5>
                                    </div>
                                </Col>
                            </Row>
                            <div className="mt-4">
                                <Link to="#" className="btn btn-primary btn-sm">View more</Link>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div>
                                <ReactApexChart
                                    options={options}
                                    series={series}
                                    type="bar"
                                    height="250"
                                    className="apex-charts"
                                />
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default EarningChart;