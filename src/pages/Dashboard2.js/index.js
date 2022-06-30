import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import ReactApexChart from "react-apexcharts"

import Breadcrumbs from '../../components/Common/Breadcrumb';
import SalesReport from './SalesReport';
import EmailSent from './EmailSent';
import MiniWidget from './MiniWidget';
import EarningChart from './EarningChart';
import YearlySale from './YearlySale';
import ActivityComp from "./ActivityComp"
import PopularProduct from "./PopularProduct"
import SocialSource from "./SocialSource"

const series = [70]

const options = {
    plotOptions: {
        radialBar: {
            offsetY: -12,
            hollow: {
                margin: 5, size: '60%', background: 'rgba(59, 93, 231, .25)',
            }
            ,
            dataLabels: {
                name: {
                    show: false,
                }
                ,
                value: {
                    show: true, fontSize: '12px', offsetY: 5,
                }
                ,
                style: {
                    colors: ['#fff']
                }
            }
        }
        ,
    }
    ,
    colors: ['#3b5de7'],
}

const series1 = [81]

const options1 = {
    plotOptions: {
        radialBar: {
            offsetY: -12,
            hollow: {
                margin: 5, size: '60%', background: 'rgba(69, 203, 133, .25)',
            }
            ,
            dataLabels: {
                name: {
                    show: false,
                }
                ,
                value: {
                    show: true, fontSize: '12px', offsetY: 5,
                }
                ,
                style: {
                    colors: ['#fff']
                }
            }
        }
        ,
    }
    ,
    colors: ['#45CB85'],
}

const Dashboard2 = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs title="Dashboard" breadcrumbItem="Dashboard 2" />
                <Row>
                    <Col lg={6}>

                        <Row>
                            <Col md={6}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col xs={8}>
                                                <div>
                                                    <p className="text-muted fw-medium mt-1 mb-2">Orders</p>
                                                    <h4>1,368</h4>
                                                </div>
                                            </Col>

                                            <div className="col-4">
                                                <div>
                                                    <ReactApexChart
                                                        options={options}
                                                        series={series}
                                                        type="radialBar"
                                                        height="120"
                                                    />
                                                </div>
                                            </div>
                                        </Row>

                                        <p className="mb-0"><span className="badge badge-soft-success me-2"> 0.8% <i
                                            className="mdi mdi-arrow-up"></i> </span> From previous period</p>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col xs={8}>
                                                <div>
                                                    <p className="text-muted fw-medium mt-1 mb-2">Revenue</p>
                                                    <h4>$ 32,695</h4>
                                                </div>
                                            </Col>

                                            <Col xs={4}>
                                                <div>
                                                    <ReactApexChart
                                                        options={options1}
                                                        series={series1}
                                                        type="radialBar"
                                                        height="120"
                                                    />
                                                </div>
                                            </Col>
                                        </Row>

                                        <p className="mb-0"><span className="badge badge-soft-success me-2"> 0.6% <i
                                            className="mdi mdi-arrow-up"></i> </span> From previous period</p>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <SalesReport />

                    </Col>
                    <EmailSent />
                </Row>
                <Row>
                    <Col xl={3}>
                        <MiniWidget />
                    </Col>
                    <Col xl={6}>
                        <EarningChart />
                    </Col>
                    <Col xl={3}>
                        <YearlySale />
                    </Col>
                </Row>
                <Row>
                    <Col lg={4}>
                        <ActivityComp />
                    </Col>
                    <Col lg={4}>
                        <PopularProduct />
                    </Col>
                    <Col lg={4}>
                        <SocialSource />
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    )
}

export default Dashboard2;