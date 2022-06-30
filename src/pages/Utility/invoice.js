import React from 'react';
import { CardBody, Row, Col, Card, Table } from 'reactstrap';
import { Link } from "react-router-dom"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//Import Images
import logo from "../../assets/images/logo-dark.png"
import logoLight from "../../assets/images/logo-light.png";

const invoice = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs title="Pages" breadcrumbItem="Invoice" />
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardBody>
                                <div className="invoice-title">
                                    <h4 className="float-end font-size-16">Order # 12345</h4>
                                    <div className="mb-4">
                                        <img src={logo} className="logo-dark" alt="logo dark" height="20" />
                                        <img src={logoLight} className="logo-light" alt="logo light" height="20" />
                                    </div>
                                </div>
                                <hr />
                                <Row>
                                    <div className="col-6">
                                        <address>
                                            <strong>Billed To:</strong><br />
                                                John Smith<br />
                                                    1234 Main<br />
                                                        Apt. 4B<br />
                                                            Springfield, ST 54321
                                        </address>
                                    </div>
                                    <div className="col-6 text-end">
                                        <address>
                                            <strong>Shipped To:</strong><br />
                                                                Kenny Rigdon<br />
                                                                    1234 Main<br />
                                                                        Apt. 4B<br />
                                                                            Springfield, ST 54321
                                        </address>
                                    </div>
                                </Row>
                                <Row>
                                    <div className="col-6 mt-3">
                                        <address>
                                            <strong>Payment Method:</strong><br />
                                                                                Visa ending **** 4242<br />
                                                                                    jsmith@email.com
                                        </address>
                                    </div>
                                    <div className="col-6 mt-3 text-end">
                                        <address>
                                            <strong>Order Date:</strong><br />
                                                                                        October 16, 2019<br /><br />
                                        </address>
                                    </div>
                                </Row>
                                <div className="py-2 mt-3">
                                    <h3 className="font-size-15 fw-bold">Order summary</h3>
                                </div>
                                <div className="table-responsive">
                                    <Table className="table-nowrap">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: "70px" }}>No.</th>
                                                <th>Item</th>
                                                <th className="text-end">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>01</td>
                                                <td>Qovex - Admin & Dashboard Template</td>
                                                <td className="text-end">$499.00</td>
                                            </tr>

                                            <tr>
                                                <td>02</td>
                                                <td>Qovex - Responsive Landing Template</td>
                                                <td className="text-end">$399.00</td>
                                            </tr>

                                            <tr>
                                                <td>03</td>
                                                <td>Veltrix - Admin & Dashboard Template</td>
                                                <td className="text-end">$499.00</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2" className="text-end">Sub Total</td>
                                                <td className="text-end">$1397.00</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2" className="border-0 text-end">
                                                    <strong>Shipping</strong>
                                                </td>
                                                <td className="border-0 text-end">$13.00</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2" className="border-0 text-end">
                                                    <strong>Total</strong>
                                                </td>
                                                <td className="border-0 text-end">
                                                    <h4 className="m-0">$1410.00</h4>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="d-print-none">
                                    <div className="float-end">
                                        <Link to="#"
                                            className="btn btn-success waves-effect waves-light"><i
                                                className="fa fa-print"></i></Link>{" "}
                                        <Link to="#" className="btn btn-primary w-md waves-effect waves-light">Send</Link>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
}

export default invoice;