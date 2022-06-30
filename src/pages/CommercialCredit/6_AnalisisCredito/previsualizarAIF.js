import React, { useEffect, useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import {
    Row,
    Col,
    Button,
    Label,
    Input,
    Modal,
    Card,
    CardBody,
    CardFooter,
    InputGroup,
    CardHeader,
    Table,
} from "reactstrap"
import Switch from "react-switch";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { BackendServices } from "../../../services";
import { useLocation, useHistory } from 'react-router-dom'
import FinancialReportComp from "./FinancialReportComp";
import { translationHelpers } from "../../../helpers"
import { Background, ExchangeRisk, FinancialInformation, Projections, Workload } from "../../../components/InformeFinanciero";
import Guarantees from "../../../components/InformeFinanciero/background/Guarantees";
import { FormCreditRisk, FormRecommendations } from "../../../components/InformeFinanciero"
import LoadingOverlay from "react-loading-overlay";

import FinancialReportContent from "./FinancialReportContent";
import * as url from "../../../helpers/url_helper"


const ModalPrevicualizarAIF = (props) => {

    const location = useLocation();
    // const [locationData, setLocationData] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));
    const [locationData, setLocationData] = useState(null);
    const [backendServices, setbackendServices] = useState(new BackendServices());


    const [t, c, tr] = translationHelpers('translation', 'common', 'translation');

    const [Opinion, setOpinion] = useState(null);
    const [Recomendation, setRecomendation] = useState(null);

    const { isOpen, toggle } = props;

    const [isActiveLoading, setIsActiveLoading] = useState(false);
    const [datosUsuario, setdatosUsuario] = useState(null)
    const history = useHistory();

    useEffect(() => {

        let dataSession = {};
        console.log(location?.pathname?.split("previsualizarAIF/")[1])
        if (location?.pathname?.split("previsualizarAIF/")[1]) {
            dataSession = { transactionId: atob(location?.pathname?.split("previsualizarAIF/")[1]) };
            sessionStorage.setItem('locationData', JSON.stringify(dataSession));
        }

        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                //location.data.transactionId = 0;
                //checkAndCreateProcedure(location.data);
                history.push(url.URL_DASHBOARD);
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                setLocationData(location.data);
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                setLocationData(result);
            }
        }
        const api = new BackendServices();
        // consultarDeudorPrincipal
        api.consultPrincipalDebtor(dataSession?.transactionId).then(resp => {
            if (resp != undefined) {
                setdatosUsuario(resp);
            }
        })
    }, []);



    return (
        <>
            {locationData ?
                <React.Fragment>
                    <div className="page-content">
                        <Breadcrumbs title={t("Credit Analysis")} breadcrumbItem={t("Financial Report")} />
                        <Col md={12}>
                            <Row>
                                <Col sm={12} style={{ textAlign: "right" }}>
                                    <h5 className="card-title title-header">{datosUsuario != null ? (datosUsuario.typePerson === "1" ? (datosUsuario.name + " " + datosUsuario.name2 + " " + datosUsuario.lastName + " " + datosUsuario.lastName2) : (datosUsuario.name)) : ""} </h5>
                                </Col>
                                <Col sm={12} style={{ textAlign: "right" }}>
                                    <h5 className="card-title" style={{ textAlign: "right" }}>{t("Tramit")}:{" "}#{locationData?.transactionId}</h5>
                                </Col>
                            </Row>
                        </Col>
                        <Card className="m-0">
                            <CardBody>
                                <FinancialReportContent
                                    preview={true}
                                />
                            </CardBody>
                        </Card>

                    </div>
                </React.Fragment >
                : <React.Fragment>
                    <div className="page-content">
                        <Breadcrumbs title={t("Commercial Credit")} breadcrumbItem={t("Credit Proposal")} />
                    </div>
                </React.Fragment >}
        </>
    );
};

ModalPrevicualizarAIF.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
};

export default ModalPrevicualizarAIF;
