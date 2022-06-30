import React from 'react';
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap';

function PopularProduct() {
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <CardTitle className="h4 mb-4">Popular Products</CardTitle>
                    <div className="d-flex">
                        <h5 className="me-2"><i className="mdi mdi-cellphone-android text-primary me-2"></i>
                    Mobile -</h5>
                        <p className="mb-0">62 Product sold</p>
                    </div>
                    <div className="text-center">
                        <Row>
                            <Col sm={6}>
                                <div className="pt-4">
                                    <div className="avatar-sm mx-auto font-size-16">
                                        <span
                                            className="avatar-title bg-soft-primary text-primary rounded-circle">
                                            <i className="mdi mdi-monitor"></i>
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <h5 className="mb-1">Desktop</h5>
                                        <p className="text-truncate">45 Product sold</p>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="pt-4">
                                    <div className="avatar-sm mx-auto font-size-16">
                                        <span
                                            className="avatar-title bg-soft-primary text-primary rounded-circle">
                                            <i className="mdi mdi-laptop"></i>
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <h5 className="mb-1">Laptop</h5>
                                        <p className="text-truncate">57 Product sold</p>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="pt-4">
                                    <div className="avatar-sm mx-auto font-size-16">
                                        <span
                                            className="avatar-title bg-soft-primary text-primary rounded-circle">
                                            <i className="mdi mdi-tablet-android"></i>
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <h5 className="mb-1">Tablet</h5>
                                        <p className="text-truncate">31 Product sold</p>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="pt-4">
                                    <div className="avatar-sm mx-auto font-size-16">
                                        <span
                                            className="avatar-title bg-soft-primary text-primary rounded-circle">
                                            <i className="mdi mdi-cellphone-android"></i>
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <h5 className="mb-1">Mobile</h5>
                                        <p className="text-truncate">62 Product sold</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
}

export default PopularProduct;