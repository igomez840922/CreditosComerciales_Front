/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import PropTypes from 'prop-types'
import { useLocation, useHistory } from "react-router-dom";
import { Link } from "react-router-dom"
import * as url from "../../../../helpers/url_helper"
import * as OPTs from "../../../../helpers/options_helper";

import {
    Card, CardHeader,
    CardBody,
    Row,
    Col,
    Button,
    CardFooter,
    Alert,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../../components/Common/Breadcrumb"

//i18n
import { useTranslation, withTranslation } from "react-i18next"

import { BpmServices } from "../../../../services";
import SweetAlert from "react-bootstrap-sweetalert";

import { BackendServices, CoreServices } from "../../../../services";
import React, { useEffect, useState } from "react"

import ModalEndProcess from "../../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../components/LogProcess/index";

import HorizontalSteeper from "../../../../components/Common/HorizontalSteeper";
import { saveLogProcess } from "../../../../helpers/logs_helper";

import ModalBitacora from '../../../../components/Common/ModalBitacora';
import { Tab, Tabs } from 'react-bootstrap';
import LoadingOverlay from 'react-loading-overlay';

import DataGeneral from './DataGeneral'

const FideicomisoGarantias = props => {

    const { t, i18n } = useTranslation();
    const history = useHistory();
    const location = useLocation()
    const [displayModalCloseOptions, setDisplayModalCloseOptions] = useState(false);
    const [displayModalAdvanceOptions, setDisplayModalAdvanceOptions] = useState(false);

    const [locationData, setLocationData] = useState(null);
    //Servicios
    const backendServices = new BackendServices();
    const bpmServices = new BpmServices();
    const coreServices = new CoreServices();

    const [mainDebtor, setMainDebtor] = useState(null);

    const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
    const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

    const [optionSelected, setoptionSelected] = useState(null);
    const [displayModalBinnacle, setdisplayModalBinnacle] = useState(false);

    const [isActiveLoading, setIsActiveLoading] = useState(true);
    const [facility, setFacility] = useState(null);
    const [facilities, setFacilities] = useState(null);
    const [facilityId, setFacilityId] = useState(null);
    const [proposalType, setProposalType] = useState(null);
    const [tabsFacility, setTabsFacility] = useState(null);
    const [guaranteesType, setGuaranteesType] = useState(null);
    const [msgDataND, setmsgDataND] = useState({ show: false, msg: "", isError: false });


    //On Mounting (componentDidMount)
    React.useEffect(() => {
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
                dataSession = result;
            }
        }
        locationData && fetchData(dataSession);
    }, [!locationData]);


    React.useEffect(() => {
        // facilityId &&();
    }, [facilityId]);


    //Caraga Inicial de datos
    function fetchData(locationData) {

        //chequear si la tarea no ha sido iniciada
        bpmServices.checkAndStartTask(locationData)
            .then((iniresult) => {
                if (iniresult === false) {
                    history.push(url.URL_DASHBOARD);
                }
            })

        loadUserProspect(locationData.transactionId)
        // Read Api Service data
    }

    function loadUserProspect(transactionId) {
        // consultarDeudorPrincipal
        backendServices.consultPrincipalDebtor(transactionId)
            .then((data) => {
                if (data !== undefined) {
                    setMainDebtor(data);
                }
            });
    }

    async function guardarDatos() {
        let form = document.getElementById('frmDataFiduciary');
        form.requestSubmit();
    }

    ////////// PARTE ES LA FINAL DEL PROCESO ///////
    //Modal Para mostrar Comentario de Fin de Proceso
    function showModalEndProcess(show = true) {
        setdisplayModalEndProcess(show);
    }
    //salvar comentario de end process
    function onSaveEndProcess(values) {
        onSaveProcess(OPTs.PROCESS_CANCELPROCESS);
    }
    function onSaveProcess(option) {

        switch (option) {
            case OPTs.PROCESS_CANCELPROCESS: {
                break;
            }
            default:
                break;
        }
        saveJBPMProcess(option);
    }
    async function saveJBPMProcess(option) {

        var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
        var infoBpmModel = new InfoBpmModel(
            locationData.infoBpmModel?.instanceId ?? locationData.instanceId,
            locationData.infoBpmModel?.transactId ?? locationData.transactionId,
            0, 0,
            mainDebtor?.personId
        );
        infoBpmModel.personName = mainDebtor !== undefined ? (mainDebtor.typePerson === "2" ? mainDebtor.name : (mainDebtor.name + " " + mainDebtor.name2 + " " + mainDebtor.lastName + " " + mainDebtor.lastName2)) : "";
        var values = {};
        switch (option) {
            case OPTs.PROCESS_CANCELPROCESS: {
                bpmServices.abortProcess(infoBpmModel.instanceId)
                    .then((data) => {
                        if (data !== undefined) {
                            saveAutoLog(OPTs.APPLICATION_STATUS_CANC, "");
                            history.push(url.URL_DASHBOARD);
                        }
                        else {
                            showMessage({ msg: t("TheProcessCouldNotFinish"), error: true, show: true });
                        }
                    });
                break;
            }
            case OPTs.PROCESS_DATOSFIDEICOMISO: {
                infoBpmModel.processId = OPTs.PROCESS_DATOSFIDEICOMISO;
                infoBpmModel.activityId = OPTs.ACT_NONE;

                values = {
                    "info": JSON.stringify(infoBpmModel),
                    "processId": OPTs.PROCESS_DATOSFIDEICOMISO.toString(),
                    "activityId": OPTs.ACT_NONE.toString(),
                    "transactionId": locationData.transactionId.toString(),
                };
                bpmServices.updatevariables(locationData.instanceId, values)
                    .then((data) => {
                        if (data !== undefined) {
                            showMessage({ msg: t("Datahasbeensavedsuccessfully"), error: false, show: true });
                            history.push(url.URL_DASHBOARD);
                        }
                        else {
                            showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
                        }
                    });
                break;
            }
            case OPTs.PROCESS_INFORMEGESTION: {
                infoBpmModel.processId = OPTs.PROCESS_INFORMEGESTION;
                infoBpmModel.activityId = OPTs.ACT_NONE;

                values = {
                    "info": JSON.stringify(infoBpmModel),
                    "processId": OPTs.PROCESS_INFORMEGESTION.toString(),
                    "activityId": OPTs.ACT_NONE.toString(),
                    "transactionId": locationData.transactionId,
                    "requestId": locationData.requestId,
                    "decision": "si"
                };
                bpmServices.completedStatusTask(locationData.taskId, values)
                    .then((data) => {
                        if (data !== undefined) {

                            saveAutoLog(OPTs.APPLICATION_STATUS_DEVB, "");
                            history.push(url.URL_DASHBOARD);
                        }
                        else {
                            //Mensaje ERROR              
                            showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
                        }
                    });
                break;
            }
            case OPTs.PROCESS_DOCUMENTACIONLEGAL: {
                infoBpmModel.processId = OPTs.PROCESS_DOCUMENTACIONLEGAL;
                infoBpmModel.activityId = OPTs.ACT_NONE;

                values = {
                    "info": JSON.stringify(infoBpmModel),
                    "processId": OPTs.PROCESS_DOCUMENTACIONLEGAL.toString(),
                    "activityId": OPTs.ACT_NONE.toString(),
                    "transactionId": locationData.transactionId,
                    "requestId": locationData.requestId,
                    "decision": "noajuste"
                };
                bpmServices.completedStatusTask(locationData.taskId, values)
                    .then((data) => {
                        if (data !== undefined) {
                            saveAutoLog();
                            history.push(url.URL_DASHBOARD);
                        }
                        else {
                            //Mensaje ERROR              
                            showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
                        }
                    });
                break;
            }
            default:
                break;
        }
    }
    function showMessage(data = null) {
        if (data !== null) {
            setmessageDlg(data)
        }
        else {
            setmessageDlg({ msg: "", show: false, error: false })
        }
    }

    async function saveAutoLog(APPLICATION_STATUS = null, observations = null) {
        var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
        var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ASIGNARNUMFIDEICOMISO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_10)
        log.clientId = mainDebtor?.personId ?? log.clientId;
        log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
        log.requestId = APPLICATION_STATUS?.id ?? 0;
        log.statusDescription = APPLICATION_STATUS?.name ?? "";
        saveLogProcess(log);
    }

    function showModalBinnacle(show = true) {
        setdisplayModalBinnacle(show);
    }

    function handleSelect(e) {
        let data = facilities.at(e);
        setFacility(data);
        setFacilityId(data.facilityId)
    }

    return (
        <React.Fragment>
            <div className="page-content">

                <Breadcrumbs title={props.t("CommercialCredit")} breadcrumbItem={`${props.t("TrustServices")} ${t("Guarantee")}`} />

                <HorizontalSteeper processNumber={2} activeStep={1}></HorizontalSteeper>

                <Row>
                    <Col md={4} style={{ textAlign: "left" }}>
                        <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("NotRecommend")}</Button>

                    </Col>
                    <Col md={8} style={{ textAlign: "right" }}>
                        {/* <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_INFORMEGESTION) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button> */}
                        <Button color="success" type="button"
                            onClick={() => { guardarDatos() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Recommend")}
                        </Button>
                    </Col>
                </Row>


                <Card>
                    <CardHeader>
                        <Row>
                            <Col md={6}>
                                <h4 className="card-title">{t("TrustServices")} {t("Guarantee")}</h4>
                                <p className="card-title-desc">{t("This form is official and must be filled out correctly")}</p>
                            </Col>
                            <Col md={6}>
                                <Row>
                                    <Col sm={12} style={{ textAlign: "right" }}>
                                        <h5 className="card-title title-header">{mainDebtor != null ? (mainDebtor.typePerson === "1" ? (mainDebtor.name + " " + mainDebtor.name2 + " " + mainDebtor.lastName + " " + mainDebtor.lastName2) : (mainDebtor.name)) : ""} </h5>
                                    </Col>
                                    <Col sm={12} style={{ textAlign: "right" }}>
                                        <h5 className="card-title" style={{ textAlign: "right" }}>{t("Tramit")}:{" "}#{locationData?.transactionId}</h5>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardHeader>

                    <CardBody>

                        <Row>
                            <Col>
                                <div className="d-flex flex-row justify-content-between">
                                    {/* <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toogleModalPrevisualizarIGR() }}>
                    {" "} {t("ConsultManagementReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                  <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelCreditProposal() }}>
                    {" "} {t("ConsultCreditProposal")} <i className="mdi mdi-eye-outline mid-12px"></i></Button> */}
                                    <Link
                                        style={{ margin: '5px', border: "1px", backgroundColor: "#1C8464", color: "#fff" }}
                                        className="btn"
                                        color="success"
                                        type="button"
                                        to={{
                                            pathname: '/creditocomercial/previsualizarIGR/' + btoa(locationData?.transactionId),
                                        }}
                                        target="_blank"
                                    >{" "} {t("ConsultManagementReport")} <i className="mdi mdi-eye mdi-12px"></i></Link>
                                    <Link
                                        style={{ margin: '5px', border: "1px", backgroundColor: "#1C8464", color: "#fff" }}
                                        className="btn"
                                        color="success"
                                        type="button"
                                        to={{
                                            pathname: '/creditocomercial/previsualizarPropCred/' + btoa(locationData?.transactionId),
                                        }}
                                        target="_blank"
                                    >{" "} {t("ConsultCreditProposal")} <i className="mdi mdi-eye mdi-12px"></i></Link>
                                </div>
                            </Col>
                        </Row>

                    </CardBody>

                    <DataGeneral />

                    <CardFooter>
                    </CardFooter>

                </Card>


                {locationData ?
                    <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_DATOSFIDEICOMISO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_10)} />
                    : null}

                <Row>
                    <Col md={4} style={{ textAlign: "left" }}>
                        <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("NotRecommend")}</Button>

                    </Col>
                    <Col md={8} style={{ textAlign: "right" }}>
                        {/* <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_INFORMEGESTION) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button> */}
                        <Button color="success" type="button"
                            onClick={() => { guardarDatos() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Recommend")}
                        </Button>
                    </Col>
                </Row>

                <ModalEndProcess onSaveEndProcess={onSaveEndProcess} isOpen={displayModalEndProcess} toggle={() => { showModalEndProcess(false) }} />

                {
                    messageDlg && messageDlg.show ? (
                        <SweetAlert
                            type={messageDlg.error ? "error" : "success"}
                            title={messageDlg.error ? t("Error") : t("Message")}
                            confirmButtonText={t("Confirm")}
                            cancelButtonText={t("Cancel")}
                            onConfirm={() => { showMessage(); }}>
                            {messageDlg.msg}
                        </SweetAlert>
                    ) : null
                }
            </div>


            {locationData && displayModalBinnacle ?
                <ModalBitacora logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_04)}
                    successSaved={() => { onSaveProcess(optionSelected); }}
                    isOpen={displayModalBinnacle} toggle={() => { showModalBinnacle(false) }} />
                : null}
        </React.Fragment>
    )
}

FideicomisoGarantias.propTypes = {
    selectedId: PropTypes.any,
}

export default (withTranslation()(FideicomisoGarantias))
