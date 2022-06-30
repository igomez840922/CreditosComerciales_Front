import React from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import ReactApexChart from "react-apexcharts"

const series = [{
    name: "Series A",
    data: [24, 66, 42, 88, 62, 24, 45, 12, 36, 10]
}
]

const options = {
    chart: {
        sparkline: {
            enabled: !0
        }
        ,
        toolbar: {
            show: !1
        }
        ,
    }
    ,
    dataLabels: {
        enabled: !1
    }
    ,
    stroke: {
        curve: 'smooth', width: 3
    }
    ,
    colors: ['#3b5de7'],
}

const Breadcrumb = props => {
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h4 className="card-title mb-4">Sales Report</h4>
                    <Row>
                        <Col sm={7}>
                            <div>
                                <p className="mb-2">01 Jan - 31 Jan, 2020</p>
                                <h4>$ 27, 253</h4>

                                <p className="mt-4 mb-0"><span className="badge badge-soft-success me-2"> 0.6%
                                                    <i className="mdi mdi-arrow-up"></i> </span> From previous period
                                            </p>
                            </div>
                        </Col>
                        <Col sm={4}>
                            <div className="mt-4 mt-sm-0">
                                <ReactApexChart
                                    options={options}
                                    series={series}
                                    type="line"
                                    height="100"
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
export default Breadcrumb
