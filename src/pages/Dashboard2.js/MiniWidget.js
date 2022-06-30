import React from 'react';
import { Card, CardBody, Row, Progress } from 'reactstrap';

const MiniWidget = () => {
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <Row className="align-items-center">
                        <div className="col-8">
                            <p className="mb-2">Online</p>
                            <h4 className="mb-0">3,524</h4>
                        </div>
                        <div className="col-4">
                            <div className="text-end">
                                <div>
                                    2.06 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                                </div>
                                <div className="mt-3">
                                    <Progress
                                        value="62"
                                        color="primary"
                                        className="bg-transparent progress-sm"
                                        size="sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </Row>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Row className="align-items-center">
                        <div className="col-8">
                            <p className="mb-2">Offline</p>
                            <h4 className="mb-0">5,362</h4>
                        </div>
                        <div className="col-4">
                            <div className="text-end">
                                <div>
                                    3.12 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                                </div>
                                <div className="mt-3">
                                    <Progress
                                        value="78"
                                        color="warning"
                                        className="bg-transparent progress-sm"
                                        size="sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </Row>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Row className="align-items-center">
                        <div className="col-8">
                            <p className="mb-2">Marketing</p>
                            <h4 className="mb-0">6,245</h4>
                        </div>
                        <div className="col-4">
                            <div className="text-end">
                                <div>
                                    2.12 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                                </div>
                                <div className="mt-3">
                                    <Progress
                                        value="75"
                                        color="success"
                                        className="bg-transparent progress-sm"
                                        size="sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default MiniWidget;