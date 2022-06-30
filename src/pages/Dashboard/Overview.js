import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

const Overview = () => {
    return (
        <React.Fragment>
            <Col xl={3}>
                <Card>
                    <CardBody>
                        <h4 className="card-title mb-4">Overview</h4>

                        <div>
                            <div className="pb-3 border-bottom">
                                <Row className="align-items-center">
                                    <Col xs={8}>
                                        <p className="mb-2">New Visitors</p>
                                        <h4 className="mb-0">3,524</h4>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="text-end">
                                            <div>
                                                2.06 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                                            </div>
                                            <div className="progress progress-sm mt-3">
                                                <div className="progress-bar" role="progressbar"
                                                    style={{ width: '62%' }}
                                                    aria-valuenow="62" aria-valuemin="0" aria-valuemax="100">
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="py-3 border-bottom">
                                <Row className="align-items-center">
                                    <Col xs={8}>
                                        <p className="mb-2">Product Views</p>
                                        <h4 className="mb-0">2,465</h4>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="text-end">
                                            <div>
                                                0.37 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                                            </div>
                                            <div className="progress progress-sm mt-3">
                                                <div className="progress-bar bg-warning" role="progressbar"
                                                    style={{ width: '48%' }} aria-valuenow="48" aria-valuemin="0"
                                                    aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="pt-3">
                                <Row className="align-items-center">
                                    <Col xs={8}>
                                        <p className="mb-2">Revenue</p>
                                        <h4 className="mb-0">$ 4,653</h4>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="text-end">
                                            <div>
                                                2.18 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                                            </div>
                                            <div className="progress progress-sm mt-3">
                                                <div className="progress-bar bg-success" role="progressbar"
                                                    style={{ width: '78%' }} aria-valuenow="78" aria-valuemin="0"
                                                    aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    )
}

export default Overview;