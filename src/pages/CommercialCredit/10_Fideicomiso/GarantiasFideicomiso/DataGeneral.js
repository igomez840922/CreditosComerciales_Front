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
    Label,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../../components/Common/Breadcrumb"

//i18n
import { useTranslation, withTranslation } from "react-i18next"

import { BpmServices } from "../../../../services";
import SweetAlert from "react-bootstrap-sweetalert";

import { BackendServices, CoreServices } from "../../../../services";
import React, { useEffect, useState } from "react"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"

import ModalEndProcess from "../../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../components/LogProcess/index";

import AttachmentFileCore from "../../../../components/Common/AttachmentFileCore";
import Currency from '../../../../helpers/currency';

import HorizontalSteeper from "../../../../components/Common/HorizontalSteeper";
import { saveLogProcess } from "../../../../helpers/logs_helper";


import { AttachmentFileInputModel } from "../../../../models/Common/AttachmentFileInputModel"
import ModalBitacora from '../../../../components/Common/ModalBitacora';
import { Tab, Tabs } from 'react-bootstrap';
import LoadingOverlay from 'react-loading-overlay';
import { uniqueId } from 'lodash';

const DataGeneral = props => {

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

    const [dataGuarantees, setDataGuarantees] = useState(null);
    const currencyData = new Currency()
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
        loadData(dataSession);
    }, [!locationData]);


    React.useEffect(() => {
        // facilityId &&();
    }, [facilityId]);

    function loadData(data) {
        console.log(data)
        setIsActiveLoading(true);
        Promise.allSettled([
            backendServices.consultGeneralDataPropCred(data.transactionId),
            backendServices.retrieveFacilityType(),
            coreServices.getTipoGarantiaCatalogo(),
            backendServices.retrieveProposalType(),
        ]).then(data => {
            const [{ value: GeneralDataPropCred }, { value: FacilityType }, { value: guaranteesType }, { value: proposalType }] = data;
            setProposalType(proposalType)
            setGuaranteesType(guaranteesType?.Records)
            backendServices.consultarFacilidades(GeneralDataPropCred[0].requestId).then(async resp => {
                for (const index in resp) {
                    let guarantees = await backendServices.consultarGarantiaPropCred(resp[index].facilityId);
                    resp[index].guaranteeFacility = guarantees?.some(guarantee => guarantee.guaranteeTypeName === '200')//200->garantía Tipo inmueble
                }
                resp = resp.filter($$ => $$.debtor !== '  ' && $$.facilityTypeId !== " ").filter(facility => facility.guaranteeFacility);

                if (resp.length > 0) {
                    setFacilities(resp);
                    setFacility(resp[0]);
                    setFacilityId(resp[0].facilityId)
                    let commission = await backendServices.consultCommissionPropCred(resp[0].facilityId).then(commission => commission?.commissions?.length > 0 ? commission?.commissions[0] : { amount: 0 });

                    setDataGuarantees(guarantees => ({ ...guarantees, commission }))
                    setTabsFacility(resp.map((items, index) => (
                        <Tab key={uniqueId() + index} className="m-0" eventKey={index} title={FacilityType.find($$ => $$.id === items.facilityTypeId).description}></Tab>
                    )));
                }
                setIsActiveLoading(false)
            }).catch(err => {
                console.log(err);
                setIsActiveLoading(false)
            });

        }).catch(err => {
            console.log(err)
            setIsActiveLoading(false)
        })
    }

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
                    "decision": "no"
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

    async function handleSelect(e) {
        let data = facilities.at(e);
        setFacility(data);
        setFacilityId(data.facilityId)
        let commission = await backendServices.consultCommissionPropCred(data.facilityId).then(commission => commission?.commissions?.length > 0 ? commission?.commissions[0] : { amount: 0 });
        setDataGuarantees(guarantees => ({ ...guarantees, commission }))
    }

    function handleSubmitGuarantee(event, errors, value) {
        event.preventDefault();
        if (errors.length > 0) {
            return;
        }
        console.log(dataGuarantees)
    }

    return (
        <React.Fragment>
            <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>

                <AvForm id="frmDataFiduciary" className="needs-validation mx-3 " onSubmit={handleSubmitGuarantee}>

                    {tabsFacility != null ?
                        <>
                            <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-4" onSelect={(e) => { handleSelect(e) }}>
                                {tabsFacility}
                            </Tabs>
                            {facilityId && <>
                                <div align="right" className="my-3">
                                    <a className="card-title" href="https://registro-publico.gob.pa/" target="_blank">{t("Public Record")}</a>
                                </div>

                                <Row className="d-flex justify-content-end">
                                    <Col lg="6">
                                        <AvGroup className="mb-3">
                                            <Label htmlFor="Amount">{t("Amount")}</Label>
                                            <AvField
                                                className="form-control"
                                                name="Amount"
                                                type="text"
                                                pattern="^[0-9,.$]*$"
                                                onKeyUp={(e) => {
                                                    let x = currencyData.getRealValue(e.target.value).replace('$', '');
                                                    e.target.value = `$${currencyData.format(x)}`;
                                                    dataGuarantees.commission.amount = x;
                                                    setDataGuarantees(dataGuarantees)
                                                }}
                                                value={`$${currencyData.format(dataGuarantees?.commission?.amount ?? 0)}`}
                                                onChange={(e) => { /*code here...*/ }}
                                                id="Amount" />
                                        </AvGroup>

                                    </Col>
                                </Row>

                            </>}
                        </>
                        : <Alert show="true" variant="warning" dismissible="true" onClose={() => { setmsgDataND({ show: false, msg: "", isError: false }) }}>
                            {t("No facilities")}
                        </Alert>}

                    <Col md={12} className="d-flex justify-content-end px-4">
                        <Button color="primary" type="button" onClick={() => { guardarDatos(); }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Save")}</Button>
                    </Col>

                    <Col className="my-5">
                        {locationData && <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_ASIGNARNUMFIDEICOMISO, OPTs.ACT_FIDEICOMISOGARANTIAS)} />}
                    </Col>

                </AvForm>

            </LoadingOverlay>
        </React.Fragment>
    )
}

DataGeneral.propTypes = {
    selectedId: PropTypes.any,
}

export default (withTranslation()(DataGeneral))
