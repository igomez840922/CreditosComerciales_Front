import React, { useEffect, useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
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


const PrevicualizarAIF = (props) => {
    const location = useLocation();
    const [locationData, setLocationData] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));
    const [backendServices, setbackendServices] = useState(new BackendServices());
    const [t, c, tr] = translationHelpers('translation', 'common', 'translation');
    const [Opinion, setOpinion] = useState(null);
    const [Recomendation, setRecomendation] = useState(null);
    const { isOpen, toggle } = props;
    const [isActiveLoading, setIsActiveLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                //location.data.transactionId = 0;
                //checkAndCreateProcedure(location.data);
                history.push(url.URL_DASHBOARD);
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                setLocationData(location.data);
                fetchFinancialReport(location.data);
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                setLocationData(result);
                fetchFinancialReport(result);
            }
        }
    }, []);

    async function fetchFinancialReport(locationData) {
        setIsActiveLoading(true);
        Promise.allSettled([
            LoadOpinion(locationData),
            LoadRecomendacion(locationData),
        ]).then(() => {
            setIsActiveLoading(false);
        }).catch(err => {
            setIsActiveLoading(false);
        });
    }

    function LoadOpinion(locationData) {
        return new Promise(function (resolve, reject) {

            backendServices.consultarDetalleOpinionRiesgoCredito(locationData.transactionId).then(resp => {
                let data = resp[0];
                (data != null || data != undefined) && setOpinion(data);
                resolve();
            }).catch(err => {
                resolve();
            });
        })
    }

    function LoadRecomendacion(locationData) {
        return new Promise(function (resolve, reject) {
            backendServices.consultarConclusionesRecomendacionesAnalisisFinanciero(locationData.transactionId).then(resp => {
                let data = resp[0];
                (data != null || data != undefined) && setRecomendation(data);
                resolve();
            }).catch(err => {
                resolve();
            });
        })
    }

    return (
       
            <>
                <Card className="m-0">

                    <CardBody>
                        {/* <FinancialReportComp
                    customerNumberT24={customerNumberT24}
                    debtorId={debtorId}

                    client={financialSummary.client}
                    financialStatus={financialSummary.financialStatus}
                    balances={financialSummary.balances}
                    debts={financialSummary.debts}
                    history={financialSummary.history}
                    preview={true}
                />

                <Col className="m-4">
                    <FinancialInformation preview={true} />
                </Col>
                <Col className="m-4">
                    <ExchangeRisk preview={true} />
                </Col>

                <Col className="m-4">
                    <Workload preview={true} />
                </Col>

                <Col className="m-4">
                    <Projections preview={true} />
                </Col>

                <Col className="m-4">
                    <Background items={background.items}
                        facilities={background.facilities}
                        restructuring={background.restructuring}
                        guarantees={background.guarantees}
                        preview={true}
                    />
                </Col>
                <Col className="m-4">
                    <Guarantees preview={true} />
                </Col> */}
                        <FinancialReportContent
                            preview={true}
                        />

                        <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>

                            <Col className="mt-4">
                                <FormCreditRisk preview={true} Opinion={Opinion?.opinion} hasChangeCategory={()=> {}} />
                            </Col>


                            <Col className="mt-4">
                                <FormRecommendations preview={true} strengths={Recomendation?.strengths} weakness={Recomendation?.weakness} conclusion={Recomendation?.conclusion} />
                            </Col>
                        </LoadingOverlay>

                        {/* <Row>
                    <Col lg="12" style={{ textAlign: "right" }}>
                        <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.toggle}>
                            <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{c("Cancel")}
                        </Button>
                    </Col>
                </Row> */}
                    </CardBody>
                </Card>

            </>
    );
};


export default PrevicualizarAIF;
