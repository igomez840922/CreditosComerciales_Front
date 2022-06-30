import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translationHelper } from '../../../../helpers';
import { AvForm, AvGroup, AvField, AvFeedback } from "availity-reactstrap-validation"
import {
    Table,
    Card,
    CardBody,
    Row,
    Col,
    Label,
} from "reactstrap"
import { useTranslation } from "react-i18next";
import { BackendServices, CoreServices } from "../../../../services";
import Currency from "../../../../helpers/currency";
import { useHistory, useLocation } from 'react-router-dom';

import * as url from "../../../../helpers/url_helper"

const ChangeSummary = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
        validateForm: () => {
            const form = document.getElementById('frmResumenCambios');
            form.requestSubmit();
        },
        getFormValidation: () => {
            return formValid;
        }, dataReturn
    }));
    const { t, i18n } = useTranslation();
    const [dataReturn, setdataReturn] = useState(null);
    const [formValid, setformValid] = useState(false);
    const [requestId, setRequestId] = useState(null);

    const currencyData = new Currency();

    const apiBack = new BackendServices();
    const location = useLocation();
    const history = useHistory();
    const [locationData, setLocationData] = useState(null);

    useEffect(() => {
        let dataSession;
        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                //location.data.transactionId = 0;
                //checkAndCreateProcedure(location.data);
                history.push(url.URL_DASHBOARD);
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                setLocationData(location.data);
                dataSession = location.data;
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                setLocationData(result);
                dataSession = result
            }
        }

        apiBack.consultGeneralDataPropCred(dataSession?.transactionId ?? 0).then(resp => {
            let requestId = resp.length === 0 ? props.dataGlobal.requestId : resp[0]?.requestId;
            initializeData(requestId)
            setRequestId(requestId)
        }).catch(err => { console.log(err) })

    }, [props.activeTab]);
    function initializeData(requestId) {
        // consultarResumenCambios
        apiBack.consultarResumenCambios(requestId).then((resp) => {
            setdataReturn(resp)
        });
    }
    function handleSubmit(event, errors, values) {
        event.preventDefault();
        if (errors.length > 0) {
            setformValid(false);
            return;
        }
        values.increase = values.increase != null || values != "" || values.increase ? values.increase : " ";
        values.rate = values.rate != null || values != "" || values.rate ? values.rate : " ";
        values.guarantee = values.guarantee != null || values != "" || values.guarantee ? values.guarantee : " ";
        values.desbtorsGuarantors = values.desbtorsGuarantors != null || values != "" || values.desbtorsGuarantors ? values.desbtorsGuarantors : " ";
        values.terms = values.terms != null || values != "" || values.terms ? values.terms : " ";
        values.fees = values.fees != null || values != "" || values.fees ? values.fees : " ";
        values.covenats = values.covenats != null || values != "" || values.covenats ? values.covenats : " ";
        values.others = values.others != null || values != "" || values.others ? values.others : " ";
        values.requestId = requestId;
        values.status = true;
        setdataReturn(values);
        setformValid(true);
    }
    return (
        <React.Fragment>
            <AvForm id="frmResumenCambios" className="needs-validation" onSubmit={handleSubmit}>
                <h5>{props.title}</h5>
                <Card>
                    <CardBody>
                        <Row>
                            <Col md="6">
                                <Label htmlFor="increase">{t("Increase / Decrease (Exposure)")}</Label>
                                <AvField
                                    className="form-control"
                                    name="increase"
                                    type="text"
                                    value={dataReturn != null ? dataReturn?.increase : " "}
                                    id="increase"
                                />
                            </Col>
                            <Col md="6">
                                <Label>{t("Rate")}</Label>
                                <AvField
                                    className="form-control"
                                    name="rate"
                                    type="text"
                                    id="rate"
                                    value={dataReturn?.rate ?? ' '} />


                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <Label>{t("Guarantee")}</Label>
                                <AvField
                                    className="form-control"
                                    name="guarantee"
                                    type="text"
                                    value={dataReturn != null ? dataReturn?.guarantee : " "}
                                    id="guarantee"
                                />
                            </Col>
                            <Col md="6">
                                <Label>{t("Guarantors / Co-signers")}</Label>
                                <AvField
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
                                <AvField
                                    className="form-control"
                                    name="terms"
                                    type="text"
                                    value={dataReturn != null ? dataReturn?.terms : " "}
                                    id="terms"
                                />
                            </Col>
                            <Col md="6">
                                <Label>{t("Dues")}</Label>
                                <AvField
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
                                <AvField
                                    className="form-control"
                                    name="covenats"
                                    type="text"
                                    value={dataReturn != null ? dataReturn?.covenats : " "}
                                    id="covenats"
                                />
                            </Col>
                            <Col md="6">
                                <Label>{t("Other conditions")}</Label>
                                <AvField
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
        </React.Fragment>
    );
});
export default ChangeSummary;
