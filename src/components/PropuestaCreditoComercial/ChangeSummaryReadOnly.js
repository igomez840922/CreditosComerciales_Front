import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translationHelper } from '../../helpers';
import { AvForm, AvGroup, AvField, AvFeedback } from "availity-reactstrap-validation"
import {
    Table,
    Card,
    CardBody,
    Row,
    Col,
    Label,
} from "reactstrap"

import HeaderSections from '../Common/HeaderSections';
import { useTranslation } from "react-i18next";
import { BackendServices, CoreServices } from "../../services";

const ChangeSummaryReadOnly = (props) => {

    const { t, i18n } = useTranslation();
    const [dataReturn, setdataReturn] = useState(null);

    //Servicios
    const [backendServices, setbackendServices] = useState(new BackendServices());

    useEffect(() => {
        console.log("useEffect", props.transactionId);
        if (props.transactionId != null) {
            initializeData();
        }
    }, [props.transactionId]);

    function initializeData() {
        // consultarPropuesta de Credito
        backendServices.consultGeneralDataPropCred(props.transactionId).then((resp) => {
            if (resp !== undefined) {
                // consultarResumenCambios
                backendServices.consultarResumenCambios(resp[0].requestId).then((resp) => {
                    setdataReturn(resp)
                });
            }
        });
    }
    function handleSubmit(event, errors, values) {
        event.preventDefault();
        if (errors.length > 0) {
            return;
        }
    }
    return (

        <React.Fragment>
            <>
                <CardBody>
                    <HeaderSections title={"ChangeSummary"} t={t}></HeaderSections>
                    <p className="card-title-desc">
                    </p>
                    <AvForm id="frmResumenCambios" className="needs-validation" onSubmit={handleSubmit}>
                        <h5>{props.title}</h5>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col md="6">
                                        <Label htmlFor="increase">{t("Increase / Decrease (Exposure)")}</Label>
                                        <AvField disabled
                                            className="form-control"
                                            name="increase"
                                            type="text"
                                            value={dataReturn != null ? dataReturn?.increase : " "}
                                            id="increase"
                                        />
                                    </Col>
                                    <Col md="6">
                                        <Label>{t("Rate")}</Label>
                                        <AvField disabled
                                            className="form-control"
                                            name="rate"
                                            type="text"
                                            value={`${dataReturn != null ? dataReturn?.rate : " "}`}
                                            id="rate"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <Label>{t("Guarantee")}</Label>
                                        <AvField disabled
                                            className="form-control"
                                            name="guarantee"
                                            type="text"
                                            value={dataReturn != null ? dataReturn?.guarantee : " "}
                                            id="guarantee"
                                        />
                                    </Col>
                                    <Col md="6">
                                        <Label>{t("Guarantors / Co-signers")}</Label>
                                        <AvField disabled
                                            className="form-control"
                                            name="desbtorsGuarantors"
                                            type="text"
                                            value={dataReturn != null ? dataReturn?.desbtorsGuarantors : " "}
                                            id="desbtorsGuarantors"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <Label>{t("Deadlines")}</Label>
                                        <AvField disabled
                                            className="form-control"
                                            name="terms"
                                            type="text"
                                            value={dataReturn != null ? dataReturn?.terms : " "}
                                            id="terms"
                                        />
                                    </Col>
                                    <Col md="6">
                                        <Label>{t("Dues")}</Label>
                                        <AvField disabled
                                            className="form-control"
                                            name="fees"
                                            type="text"
                                            value={dataReturn != null ? dataReturn?.fees : " "}
                                            id="fees"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <Label>{t("Covenats")}</Label>
                                        <AvField disabled
                                            className="form-control"
                                            name="covenats"
                                            type="text"
                                            value={dataReturn != null ? dataReturn?.covenats : " "}
                                            id="covenats"
                                        />
                                    </Col>
                                    <Col md="6">
                                        <Label>{t("Other conditions")}</Label>
                                        <AvField disabled
                                            className="form-control"
                                            name="others"
                                            type="text"
                                            value={dataReturn != null ? dataReturn?.others : " "}
                                            id="others"
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </AvForm>
                </CardBody>
            </>
        </React.Fragment >

    );
};
ChangeSummaryReadOnly.propTypes = {
    transactionId: PropTypes.string,
};
export default ChangeSummaryReadOnly;
