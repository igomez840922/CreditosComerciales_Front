import React from 'react';
import { Card, CardBody, CardTitle, Input } from 'reactstrap';

function SocialSource() {
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="float-end">
                        <div className="input-group input-group">
                            <Input type="select" className="form-select form-select-sm">
                                <option>Jan</option>
                                <option value="1">Dec</option>
                                <option value="2">Nov</option>
                                <option value="3">Oct</option>
                            </Input>
                            <label className="input-group-text">Month</label>
                        </div>
                    </div>
                    <CardTitle className="h4 mb-4">Social source</CardTitle>

                    <div className="align-items-start d-flex">
                        <div className="flex-1">
                            <p className="mb-2">Total Social source</p>
                            <h4>$ 8,974</h4>
                            <p className="mb-0"><span className="badge badge-soft-success me-2"> 0.6% <i
                                className="mdi mdi-arrow-up"></i> </span> From previous period</p>
                        </div>
                    </div>

                    <div className="mt-3 social-source">
                        <div className="d-flex align-items-center social-source-list">
                            <div className="avatar-xs me-4">
                                <span className="avatar-title rounded-circle">
                                    <i className="mdi mdi-facebook"></i>
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="mb-1">Facebook</p>
                                <h5 className="mb-0">$ 2,352</h5>
                            </div>
                            <div className="ms-auto">
                                2.06 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                            </div>
                        </div>

                        <div className="d-flex align-items-center social-source-list">
                            <div className="avatar-xs me-4">
                                <span className="avatar-title rounded-circle bg-info">
                                    <i className="mdi mdi-twitter"></i>
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="mb-1">Twitter</p>
                                <h5 className="mb-0">$ 1,925</h5>
                            </div>
                            <div className="ms-auto">
                                1.28 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                            </div>
                        </div>

                        <div className="d-flex align-items-center social-source-list">
                            <div className="avatar-xs me-4">
                                <span className="avatar-title rounded-circle bg-pink">
                                    <i className="mdi mdi-instagram"></i>
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="mb-1">Instagram</p>
                                <h5 className="mb-0">$ 1,846</h5>
                            </div>
                            <div className="ms-auto">
                                1.04 % <i className="mdi mdi-arrow-up text-success ms-1"></i>
                            </div>
                        </div>
                    </div>

                </CardBody>
            </Card>
        </React.Fragment>
    );
}

export default SocialSource;