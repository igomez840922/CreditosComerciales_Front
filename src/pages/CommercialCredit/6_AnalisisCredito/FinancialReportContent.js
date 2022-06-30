import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from "../../../helpers"
import { Link } from "react-router-dom"
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../../helpers/url_helper"

import {
    Row,
    Col,
    Button,
    Nav,
    NavLink,
    Card,
    CardBody,
} from "reactstrap"

import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { FinancialSummary } from "../../../components/PropuestaCreditoComercial"
import {
    Background, Capex, CreditProposal, CreditPolicyReview,
    ExchangeRisk, FinancialInformation, FormCreditRisk,
    Projections, Workload, FormRecommendations, DocumentFooter
} from "../../../components/InformeFinanciero"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"

import { Tabs, Tab } from 'react-bootstrap';
import { getDateMeta } from "@fullcalendar/react"
import classnames from "classnames"
import FinancialReportComp from "./FinancialReportComp";
import LoadingOverlay from "react-loading-overlay"
import Guarantees from "../../../components/InformeFinanciero/background/Guarantees"
import DebtSL from "../../../components/PropuestaCreditoComercial/financialSummary/DebtSL"
import History from "../../../components/PropuestaCreditoComercial/financialSummary/History"
import CapexIF from "../../../components/InformeFinanciero/CapexIF"
import SweetAlert from "react-bootstrap-sweetalert"

import { useTranslation, withTranslation } from "react-i18next"

// Services
import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import ModalPrevicualizarAIF from "../../../pages/CommercialCredit/6_AnalisisCredito/previsualizarAIF";

const FinancialReportContent = (props) => {

    const [t, c, tr] = translationHelpers('translation', 'common', 'translation');

    const history = useHistory();
    const location = useLocation();

    const [proposal, setProposal] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [financialSummary, setFinancialSummary] = useState(null);
    //const [financialInformation, setFinancialInformation] = useState(null);
    const [capex, setCapex] = useState(null);
    const [background, setBackground] = useState(null);
    const [document, setDocument] = useState(null);
    const [Opinion, setOpinion] = useState(null);
    const [Recomendation, setRecomendation] = useState(null);
    const [deudor, setDeudor] = useState(null);
    const [debtorId, setDebtorId] = useState(null);
    const [DataDeudor, setDataDeudor] = useState(0);
    const [isActiveLoading, setIsActiveLoading] = useState(false);
    const [isActiveLoading2, setIsActiveLoading2] = useState(false);
    const [successSave_dlg, setsuccessSave_dlg] = useState(false);
    const [error_dlg, seterror_dlg] = useState(false);
    const [error_msg, seterror_msg] = useState("");
    const [confirm_alert, setconfirm_alert] = useState(false)
    const [mainDebtor, setmainDebtor] = useState(null);
    const [preview, setpreview] = useState(null);
    const [displayModal, setDisplayModal] = useState(false);

    const [locationData, setLocationData] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));

    //Servicios
    const [backendServices, setbackendServices] = useState(new BackendServices());
    const [bpmServices, setbpmServices] = useState(new BpmServices());
    const [coreServices, setcoreServices] = useState(new CoreServices());

    //On Mounting (componentDidMount)

    let dataSession;
    useEffect(() => {

        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                //location.data.transactionId = 0;
                //checkAndCreateProcedure(location.data);
                history.push(url.URL_DASHBOARD);
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                dataSession = location.data
                setLocationData(location.data);
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                dataSession = result
                setLocationData(result);
            }
        }

        fetchData(dataSession);

    }, []);

    //Caraga Inicial de datos
    function fetchData(dataSession) {
        //chequear si la tarea no ha sido iniciada
        bpmServices.checkAndStartTask(dataSession)
            .then((iniresult) => {
                if (iniresult === false) {
                    history.push(url.URL_DASHBOARD);
                }
            })
        loadUserProspect(dataSession.transactionId)
        fetchFinancialReport();
    }

    function loadUserProspect(transactionId) {
        // consultarDeudorPrincipal
        backendServices.consultPrincipalDebtor(transactionId)
            .then((data) => {
                if (data !== undefined) {
                    setmainDebtor(data);
                }
            });
    }

    async function fetchFinancialReport() {
        Promise.allSettled([
            LoadOpinion(),
            LoadRecomendacion(),
            drawTabs(),
        ]).then((resp) => {
            setIsActiveLoading(false);
        }).catch(err => {
            setIsActiveLoading(false);
        });
    }

    function handleNewDebt(newDebt) {

    }

    function handleNewHistoryDetail(newHistoryDetail) {

    }

    async function handleSubmit(event, errors, values) {
        event.preventDefault();
        if (errors.length > 0) {
            return;
        }


        let newOpinion = { transactId: dataSession.transactionId, opinion: values.opinion };
        let newRecommendations = {
            transactId: dataSession.transactionId,
            debtorId: debtorId,
            strengths: values.strengths,
            weakness: values.weakness,
            conclusion: values.conclusion
        }

        let errOpi = false;

        if (Opinion != undefined && Opinion != null) {
            await backendServices.actualizarDetalleOpinionRiesgoCredito(newOpinion).then(resp => {
                if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                    errOpi = true;
                } else {
                    setconfirm_alert(false)
                    setsuccessSave_dlg(true)
                }
            }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
            });
        } else {
            await backendServices.nuevoDetalleOpinionRiesgoCredito(newOpinion).then(resp => {
                if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                    errOpi = true;
                } else {
                    setconfirm_alert(false)
                    setsuccessSave_dlg(true)
                }
            }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
            });
        }
        let errConc = false;
        if (Recomendation !== undefined && Recomendation != null) {
            await backendServices.actualizarConclusionesRecomendacionesAnalisisFinanciero(newRecommendations).then(resp => {
                console.log(resp)
                if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                    errConc = true;
                } else {
                    setconfirm_alert(false)
                    setsuccessSave_dlg(true)
                }
            }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
            });
        } else {
            await backendServices.nuevoConclusionesRecomendacionesAnalisisFinanciero(newRecommendations).then(resp => {
                console.log(resp)
                if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                    errConc = true;
                } else {
                    setconfirm_alert(false)
                    setsuccessSave_dlg(true)
                }
            }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
            });
        }

        //props.onSubmit(values);
        (!errOpi && !errConc) && history.push(url.URL_DASHBOARD);

    }

    function LoadOpinion() {
        return new Promise(function (resolve, reject) {

            backendServices.consultarDetalleOpinionRiesgoCredito(dataSession.transactionId).then(resp => {
                let data = resp[0];
                (data != null || data != undefined) && setOpinion(data);
                resolve();
            }).catch(err => {
                resolve();
            });
        })
    }

    function LoadRecomendacion() {
        return new Promise(function (resolve, reject) {
            backendServices.consultarConclusionesRecomendacionesAnalisisFinanciero(dataSession.transactionId).then(resp => {
                let data = resp[0];
                (data != null || data != undefined) && setRecomendation(data);
                resolve();
            }).catch(err => {
                resolve();
            });
        })
    }

    function drawTabs() {
        return new Promise(function (resolve, reject) {
            // let resp = [{ debtorId: 1, name: 'Deudor 1' }, { debtorId: 20, name: 'Deudor 2' }, { debtorId: 32, name: 'Deudor 3' }, { debtorId: 4, name: 'Deudor 4' }];
            backendServices.consultarDeudores(dataSession.transactionId).then(resp => {
                // console.log(resp);
                resp = resp.map($$ => ({
                    ...$$,
                    debtorId: $$.personId,
                    name: $$.typePerson == 2 ? $$.name : `${$$.name} ${$$.name2} ${$$.lastName}`
                }))
                setDataDeudor(resp);
                setDebtorId(resp[0].debtorId)
                props.changeDebtor && props.changeDebtor(resp[0].debtorId)

                setDeudor(resp.map((items, index) => (
                    <Tab className="my-4" key={index} eventKey={index} title={items.name}>
                        <FinancialReportComp
                            customerNumberT24={items.customerNumberT24}
                            debtorId={items.debtorId}
                            preview={props.preview}
                        />

                    </Tab>
                )));

                resolve();

            })
        })
    }

    function handleSelect(key) {
        setDebtorId(DataDeudor[key].debtorId);
        props.changeDebtor && props.changeDebtor(DataDeudor[key].debtorId)
    }

    function toggleModal() {
        setDisplayModal(!displayModal);
    }

    return (
        <React.Fragment>
            {locationData ?
                <>
                    <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>

                        <Col>
                            <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="m-0" onSelect={(e) => { handleSelect(e) }}>
                                {deudor}
                            </Tabs>
                        </Col>

                        {/* <Col className="mt-4">
                            <FinancialInformation
                                preview={props.preview}
                            />
                        </Col>


                        <Col className="mt-4">
                            <ExchangeRisk
                                preview={props.preview}
                            />
                        </Col>

                        <Col className="mt-4">
                            <Workload
                                preview={props.preview}
                            />
                        </Col> */}

                        <Col className="mt-4">
                            <Projections
                                preview={props.preview}
                            />
                        </Col>


                        <Col className="mt-4">
                            <Background
                                preview={props.preview}
                            />
                        </Col>
                    </LoadingOverlay >

                    {props.preview && <LoadingOverlay active={isActiveLoading2} spinner text={t("WaitingPlease")}>

                        <Col className="mt-4">
                            <FormCreditRisk preview={props.preview} Opinion={Opinion?.opinion} hasChangeCategory={() => props.hasChangeCategory()} />
                        </Col>


                        {/* <Col className="mt-4">
                            <FormRecommendations preview={props.preview} strengths={Recomendation?.strengths} weakness={Recomendation?.weakness} conclusion={Recomendation?.conclusion} />
                        </Col> */}
                    </LoadingOverlay>}
                </>
                : null}
        </React.Fragment>
    )
};

FinancialReportContent.propTypes = {
    hasChangeCategory: PropTypes.func,
};

export default FinancialReportContent;
