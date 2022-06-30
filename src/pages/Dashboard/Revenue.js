import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { VectorMap } from "react-jvectormap"

const map = React.createRef(null)

const Overview = () => {
    
    return (
        <React.Fragment>
            <Col lg={6}>
                <Card>
                    <CardBody>
                        <h4 className="card-title mb-4">Revenue by location</h4>

                        <Row>
                            <Col sm={6}>
                                <div id="usa-vectormap" style={{ height: '230px' }}>
                                    <VectorMap
                                        map='us_aea'
                                        backgroundColor="transparent"
                                        ref={map}
                                        handleWindowResize={true}
                                        containerStyle={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        regionStyle={{
                                            initial: {
                                                fill: '#556ee6'
                                            },
                                        }}
                                        markerStyle={{
                                            initial: {
                                                r: 9,
                                                fill: '#556ee6',
                                                fillOpacity: 0.9,
                                                stroke: '#fff',
                                                strokeWidth: 7,
                                                strokeOpacity: 0.4
                                            },
                                            hover: {
                                                stroke: '#fff',
                                                fillOpacity: 1,
                                                strokeWidth: 1.5
                                            }
                                        }}
                                        containerClassName="map"
                                    />
                                </div>
                            </Col>

                            <Col sm={5} className="ms-auto">
                                <div className="mt-4 mt-sm-0">
                                    <p>Last month Revenue</p>

                                    <div className="d-flex align-items-start py-3">
                                        <div className="flex-1">
                                            <p className="mb-2">California</p>
                                            <h5 className="mb-0">$ 2,256</h5>
                                        </div>
                                        <div className="ms-auto">
                                            2.52 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start py-3 border-top">
                                        <div className="flex-1">
                                            <p className="mb-2">Nevada</p>
                                            <h5 className="mb-0">$ 1,853</h5>
                                        </div>
                                        <div className="ms-auto">
                                            1.26 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    )
}

export default Overview;