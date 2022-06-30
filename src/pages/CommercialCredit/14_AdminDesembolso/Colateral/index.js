import React, { useState, useRef, useEffect } from "react"
import { useLocation, useHistory, Link } from 'react-router-dom'
import moment from "moment";
import classnames from "classnames"
import { CreditProposalProvider } from '../../../../components/PropuestaCreditoComercial/CreditProposalContext';
import * as url from "../../../../helpers/url_helper";
import * as OPTs from "../../../../helpers/options_helper";
import HorizontalSteeper from "../../../../components/Common/HorizontalSteeper";

import {
    Row,
    Col,
    Button,
    Card,
    CardBody, CardHeader,
    CardFooter,
    TabPane,
    Nav,
    NavLink,
    TabContent,
    Table
} from "reactstrap"
import LoadingOverlay from "react-loading-overlay";
import { Tabs, Tab } from 'react-bootstrap';
// UI Components
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import LoadingIndicator from "../../../../components/UI/LoadingIndicator";
import SuccessMessage from "../../../../components/UI/SuccessMessage";
import ModalListaDesembolso from "../Desembolso/Components/ModalViewListDesembolso";
// Services
import { BackendServices, CoreServices, BpmServices, } from "../../../../services";
import SweetAlert from "react-bootstrap-sweetalert";
import { useTranslation } from "react-i18next";
import HeaderSections from "../../../../components/Common/HeaderSections";

import ModalEndProcess from "../../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../components/LogProcess/index";
import Currency from "../../../../helpers/currency";

import { saveLogProcess } from "../../../../helpers/logs_helper";

const DesembolsoLista = (props) => {
    const currencyData = new Currency();

    const location = useLocation();
    const history = useHistory();
    const [usuarioProspecto, setusuarioProspecto] = useState(null);
    const [dataGlobal, setdataGlobal] = useState({
        requestId: null,
    });
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successSave_dlg, setsuccessSave_dlg] = useState(false);
    const [error_dlg, seterror_dlg] = useState(false);
    const [error_msg, seterror_msg] = useState("");
    const [context, setContext] = useState({});
    const [dataSet, setdataSet] = useState({});
    const [datosUsuario, setdatosUsuario] = useState(null);
    const [dataPignoracion, setdataPignoracion] = useState(null);
    const [dataRows, setdataRows] = useState(null);
    const [ModalPrevisualizardata, setModalPrevisualizardata] = useState(false);
    const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina
    // Services
    // Component Refs
    const { t, i18n } = useTranslation();
    //On Mounting (componentDidMount)
    const [dataLocation, setdataLocation] = useState(undefined);
    const [dataFacilidad, setdataFacilidad] = useState(null);
    const [dataFacilidadSet, setdataFacilidadSet] = useState(null);
    const [idFacilidad, setidFacilidad] = useState(null);
    const [dataLinea, setdataLinea] = useState(null);
    const [dataDelete, setdataDelete] = useState(null);
    const [type, settype] = useState(null);

    const [dataGarantiaMueble, setdataGarantiaMueble] = useState(null);
    const [confirm_alert, setconfirm_alert] = useState(false)
    const [dataBienUsados, setdataBienUsados] = useState(null);
    const [dataBienMueble, setdataBienMueble] = useState(null);
    const [dataOtrasGarantias, setdataOtrasGarantias] = useState(null);

    const [locationData, setLocationData] = useState(null);
    //Servicios
    const [backendServices, setbackendServices] = useState(new BackendServices());
    const [bpmServices, setbpmServices] = useState(new BpmServices());
    //const [coreServices, setcoreServices] = useState(new CoreServices());
    const [activeTab, setactiveTab] = useState(2);

    const [mainDebtor, setmainDebtor] = useState(null);

    const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
    const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

    //On Mounting (componentDidMount)
    React.useEffect(() => {
        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                //location.data.transactionId = 0;
                //checkAndCreateProcedure(location.data);
                history.push(url.URL_DASHBOARD);
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                setLocationData(location.data);
                setdataLocation(location.data);
                fetchData(location.data);
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                setLocationData(result);
                setdataLocation(result);
                fetchData(result);
            }
        }
    }, []);
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

        loadData(locationData)
    }
    function toggleTab(tab) {
        if (activeTab !== tab) {
            if (tab >= 1 && tab <= 5) {
                setactiveTab(tab)
                window.scrollTo(0, 0)
            }
        }
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

    function loadData(data1) {

        setdataBienMueble(null)
        setdataLinea(null)
        setdataBienUsados(null)
        backendServices.consultPrincipalDebtor(data1.transactionId)
            .then((data) => {
                if (data !== undefined) {
                    setusuarioProspecto(data);
                }
            });
        backendServices.consultGeneralDataPropCred(data1.transactionId)
            .then((data) => {
                console.log(data);
                dataGlobal.requestId = data[0].requestId;
                setdataGlobal(dataGlobal);
                // consultarFacilidades
                backendServices.retrieveFacilityType()
                    .then((facilidad) => {
                        backendServices.consultarFacilidades(data[0].requestId).then(resp => {
                            if (resp.length > 0) {
                                setdataFacilidadSet(resp)
                                setidFacilidad(resp[0].facilityId)
                                cargarDatosListas(data1, resp[0].facilityId, data1.transactionId)
                                console.log(facilidad.find(x => x.id === resp[0].facilityTypeId)?.description);
                                setdataFacilidad(resp.map((items, index) => (
                                    items.debtor != "  " ?
                                        <Tab onSelect={(e) => { cargarDatosGenerales(e) }} className="m-4" key={index} eventKey={index} title={facilidad.find(x => x.id === items.facilityTypeId)?.description}>

                                        </Tab> : null
                                )));
                            }
                        });
                    });
            });
    }
    function formatDate(date) {
        return !date ? '' : moment(date).format("DD/MM/YYYY");
    }
    function cargarDatosListas(data, facilidad, transactId) {
        backendServices.getCreditLine(data?.transactionId ?? 0).then(resp => {
            if (resp.length > 0 && resp != undefined) {
                setdataLinea(resp.map((data) => (
                    data.status ?
                        <tr key={data.lineId}>
                            <td data-label={t("No. Línea")}>{data.lineId}</td>
                            <td data-label={t("Moneda")}>{data.currency}</td>
                            <td data-label={t("País de Riesgo")}>{data.riskCountry}</td>
                            <td data-label={t("Provincia")}>{data.province}</td>
                            <td data-label={t("Actividad Económica")}>{data.economicActivity}</td>
                            <td data-label={t("Fecha de Propuesta")}>{data.proposalDate}</td>
                            <td data-label={t("Fecha de Aprobación")}>{data.approvalDate}</td>
                            <td data-label={t("Fecha de Vencimiento")}>{data.dueDate}</td>
                            <td data-label={t("Fecha de Límite")}>{data.limitDate}</td>
                            <td data-label={t("Frecuencia de Revisión")}>{data.additionalInfo}</td>
                            <td data-label={t("Monto")}>${currencyData.formatTable(data?.amount ?? 0)}</td>
                            <td data-label={t("Total Máximo")}>${currencyData.formatTable(data?.maxTotal ?? 0)}</td>
                            <td data-label={t("Actions")} style={{ textAlign: "right" }}>
                                <Link
                                    to={{
                                        pathname: '/creditocomercial/AdminDesembolso/MantenimientoLinea',
                                        data: { facilityId: facilidad ?? 0, transactionId: transactId ?? 0, dataGeneral: data },
                                    }}
                                >
                                    <i className="mdi mdi-border-color mdi-24px"></i>
                                </Link>
                                <Button type="button" color="link" onClick={(resp) => { setdataDelete(data); settype("LINEACREDITO"); setconfirm_alert(true) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                            </td>
                        </tr> : null)
                ));
            } else {
                setdataLinea(
                    <tr key={1}>
                        <td colSpan="12" style={{ textAlign: 'center' }}>{t("NoData")}</td>
                    </tr>);
            }
        })
        backendServices.getGuaranteeMoveableAsset(data?.transactionId ?? 0).then(resp => {
            if (resp.length > 0 && resp != undefined) {
                setdataBienMueble(resp.map((data) => (
                    data.status && data.facilityId == facilidad ?
                        <tr key={data.lineId}>
                            <td>{data.guaranteeNumber}</td>
                            <td>{data.creditId}</td>
                            <td>{data.disbursementNumber}</td>
                            <td>{data.currency}</td>
                            <td>{data.customerNumber}</td>
                            <td>${currencyData.formatTable(data?.assignAmount ?? 0)}</td>
                            <td>${currencyData.formatTable(data?.guaranteedAmount ?? 0)}</td>
                            <td>${currencyData.formatTable(data?.initialValue ?? 0)}</td>
                            <td>{data.guaranteeType}</td>
                            <td>{data.assetCode}</td>
                            <td>{data.guaranteeCurrency}</td>
                            <td style={{ textAlign: "right" }}>
                                <Link
                                    to={{
                                        pathname: '/creditocomercial/AdminDesembolso/GarantiasMuebles',
                                        data: { facilityId: facilidad ?? 0, transactionId: transactId ?? 0, dataGeneral: data },
                                    }}
                                >
                                    <i className="mdi mdi-border-color mdi-24px"></i>
                                </Link>
                                <Button type="button" color="link" onClick={(resp) => { setdataDelete(data); settype("BIENMUEBLE"); setconfirm_alert(true) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                            </td>
                        </tr> : null)
                ));
            } else {
                setdataBienMueble(
                    <tr key={1}>
                        <td colSpan="12" style={{ textAlign: 'center' }}>{t("NoData")}</td>
                    </tr>);
            }
        })
        backendServices.getOtherGuarantees(data?.transactionId ?? 0).then(resp => {
            if (resp.length > 0 && resp != undefined) {
                setdataOtrasGarantias(resp.map((data) => (
                    data.status && data.facilityId == facilidad ?
                        <tr key={data.lineId}>
                            <td>{data.guaranteeNumber}</td>
                            <td>{data.attachedNumber}</td>
                            <td>{data.loanNumber}</td>
                            <td>{data.currency}</td>
                            <td>{data.customerNumber}</td>
                            <td>${currencyData.formatTable(data?.asignedAmount ?? 0)}</td>
                            <td>${currencyData.formatTable(data?.guaranteedType ?? 0)}</td>
                            <td>${currencyData.formatTable(data?.initialValue ?? 0)}</td>
                            <td>{data.guaranteeType}</td>
                            <td>{data.ownerAsset}</td>
                            <td>{data.guaranteeCurrency}</td>
                            <td>{data.bank}</td>
                            <td>{data.agency}</td>
                            <td>{data.instrumentType}</td>
                            <td>{data.documentId}</td>
                            <td>{data.trustNumber}</td>
                            <td>{formatDate(data.issuedDate)}</td>
                            <td>{data.guaranteeIdd}</td>
                            <td>{data.guarantorName}</td>
                            <td>{data.entityName}</td>
                            <td>{data.organismCode}</td>
                            <td>{data.issuedCountry}</td>
                            <td style={{ textAlign: "right" }}>
                                <Link
                                    to={{
                                        pathname: '/creditocomercial/AdminDesembolso/OtrasGarantias',
                                        data: { facilityId: facilidad ?? 0, transactionId: transactId ?? 0, dataGeneral: data },
                                    }}
                                >
                                    <i className="mdi mdi-border-color mdi-24px"></i>
                                </Link>
                                <Button type="button" color="link" onClick={(resp) => { setdataDelete(data); settype("OTRAGARANTIA"); setconfirm_alert(true) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                            </td>
                        </tr> : null)
                ));
            } else {
                setdataOtrasGarantias(
                    <tr key={1}>
                        <td colSpan="12" style={{ textAlign: 'center' }}>{t("NoData")}</td>
                    </tr>);
            }
        })
        backendServices.getGuaranteeUsedNewEquipments(data?.transactionId ?? 0).then(resp => {
            if (resp.length > 0 && resp != undefined) {
                setdataBienUsados(resp.map((data) => (
                    data.status && data.facilityId == facilidad ?
                        <tr key={data.lineId}>
                            <td data-label={t("Numero de Adjunto")}>{data.attachedNumber}</td>
                            <td data-label={t("Numero de Prestamo")}>{data.loanNumber}</td>
                            <td data-label={t("Moneda")}>{data.currency}</td>
                            <td data-label={t("Numero de cliente")}>{data.customerNumber}</td>
                            <td data-label={t("Monto de la Garantia")}>${currencyData.formatTable(data?.guaranteeAmount ?? 0)}</td>
                            <td data-label={t("Tipos de Garantia")}>{data.guaranteeType}</td>
                            <td data-label={t("Banco")}>{data.bank}</td>
                            <td data-label={t("Agencia(Banca)")}>{data.agency}</td>
                            <td data-label={t("Codigo del Bien Mueble")}>{data.assetCode}</td>
                            <td data-label={t("Fecha de Vencimiento transacción")}>{formatDate(data.dueDate)}</td>
                            <td data-label={t("No. Fideicomiso")}>{data.trust}</td>
                            <td data-label={t("Fecha Emision Del Fideicomiso")}>{formatDate(data.trustDate)}</td>
                            <td data-label={t("Actions")} style={{ textAlign: "right" }}>
                                <Link
                                    to={{
                                        pathname: '/creditocomercial/AdminDesembolso/GarantiaEquiposNuevosyUsados',
                                        data: { facilityId: facilidad ?? 0, transactionId: transactId ?? 0, dataGeneral: data },
                                    }}
                                >
                                    <i className="mdi mdi-border-color mdi-24px"></i>
                                </Link>
                                <Button type="button" color="link" onClick={(resp) => { setdataDelete(data); settype("BIENUSADOS"); setconfirm_alert(true) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                            </td>
                        </tr> : null)
                ));
            } else {
                setdataBienUsados(
                    <tr key={1}>
                        <td colSpan="12" style={{ textAlign: 'center' }}>{t("NoData")}</td>
                    </tr>);
            }
        })
        backendServices.getPledge(data?.transactionId ?? 0).then(resp => {
            if (resp.length > 0 && resp != undefined) {
                setdataPignoracion(resp.map((data) => (
                    data.status && data.facilityId == facilidad ?
                        <tr key={data.lineId}>
                            <td>{data.guaranteeNumber}</td>
                            <td>{data.attachedNumber}</td>
                            <td>{data.loanNumber}</td>
                            <td>{data.currency}</td>
                            <td>{data.customerNumber}</td>
                            <td>${currencyData.formatTable(data?.guaranteeAmount ?? 0)}</td>
                            <td>{data.guaranteeType}</td>
                            <td>{data.bank}</td>
                            <td>{data.agency}</td>
                            <td>{data.accountNumber}</td>
                            <td>{formatDate(data.dueDate)}</td>
                            <td style={{ textAlign: "right" }}>
                                <Link
                                    to={{
                                        pathname: '/creditocomercial/AdminDesembolso/Pignoracion',
                                        data: { facilityId: facilidad ?? 0, transactionId: transactId ?? 0, dataGeneral: data },
                                    }}
                                >
                                    <i className="mdi mdi-border-color mdi-24px"></i>
                                </Link>
                                <Button type="button" color="link" onClick={(resp) => { setdataDelete(data); settype("PIGNORACION"); setconfirm_alert(true) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                            </td>
                        </tr> : null)
                ));
            } else {
                setdataPignoracion(
                    <tr key={1}>
                        <td colSpan="12" style={{ textAlign: 'center' }}>{t("NoData")}</td>
                    </tr>);
            }
        })
    }
    function updateData(data) {
    }
    function deleteData(data) {
    }
    function cargarDatosGenerales(datos) {
        console.log(datos);
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }
    function toogleModalListaDesembolso() {
        setModalPrevisualizardata(!ModalPrevisualizardata);
        removeBodyCss()
    }
    function handleSelect(key) {
        cargarDatosListas(locationData, dataFacilidadSet[key].facilityId, locationData.transactionId ?? 0)
        setidFacilidad(dataFacilidadSet[key].facilityId);
    }



    async function checkToContinue() {

        //await guardarDatos();

        setTimeout(async function () {
            /*
            if(!formIsValid){
              showMessage({ msg: t("PleaseSaveDescicionBeforeContinue"), error: true, show: true });
              return;
            }
            */
            saveJBPMProcess(OPTs.PROCESS_VALIDATEFILE);
        }, 2000)
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
        }
        saveJBPMProcess(option);
    }
    async function saveJBPMProcess(option) {

        var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
        var infoBpmModel = new InfoBpmModel(locationData.instanceId, locationData.transactionId,
            locationData.processId, OPTs.ACT_NONE,
            maindebtor?.personId
        );
        infoBpmModel.personName = maindebtor !== undefined ? (maindebtor.typePerson=="2"?maindebtor.name:(maindebtor.name + " " + maindebtor.name2 + " " + maindebtor.lastName + " " + maindebtor.lastName2)) : "";

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
            case OPTs.PROCESS_GUARANTEE: {
                infoBpmModel.processId = OPTs.PROCESS_GUARANTEE;
                infoBpmModel.activityId = OPTs.ACT_NONE;

                var values = {
                    "info": JSON.stringify(infoBpmModel),
                    "processId": OPTs.PROCESS_GUARANTEE.toString(),
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
            case OPTs.PROCESS_VALIDATEFILE: {
                infoBpmModel.processId = OPTs.PROCESS_VALIDATEFILE;
                infoBpmModel.activityId = OPTs.ACT_NONE;

                var values = {
                    "info": JSON.stringify(infoBpmModel),
                    "processId": OPTs.PROCESS_VALIDATEFILE.toString(),
                    "activityId": OPTs.ACT_NONE.toString(),
                    "transactionId": locationData.transactionId,
                    "decision": "no",
                    "requestId": locationData.requestId
                };
                bpmServices.completedStatusTask(locationData.taskId, values)
                    .then((data) => {
                        if (data !== undefined) {
                            saveAutoLog(null);
                            history.push(url.URL_DASHBOARD);
                        }
                        else {
                            //Mensaje ERROR              
                            showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
                        }
                    });
                break;
            }
            case OPTs.PROCESS_REFUSED: {
                infoBpmModel.processId = OPTs.PROCESS_REFUSED;
                infoBpmModel.activityId = OPTs.ACT_NONE;

                var values = {
                    "info": JSON.stringify(infoBpmModel),
                    "processId": OPTs.PROCESS_REFUSED.toString(),
                    "activityId": OPTs.ACT_NONE.toString(),
                    "transactionId": locationData.transactionId,
                    "requestId": locationData.requestId,
                    "decision": "no"
                };
                bpmServices.completedStatusTask(locationData.taskId, values)
                    .then((data) => {
                        if (data !== undefined) {
                            saveAutoLog(OPTs.APPLICATION_STATUS_RECH, "");
                            history.push(url.URL_DASHBOARD);
                        }
                        else {
                            //Mensaje ERROR              
                            showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
                        }
                    });
                break;
            }
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
        var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_GUARANTEE, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_16)
        log.clientId = mainDebtor?.personId ?? log.clientId;
        log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
        log.requestId = APPLICATION_STATUS?.id ?? 0;
        log.statusDescription = APPLICATION_STATUS?.name ?? "";
        saveLogProcess(log);
    }


    return (
        <React.Fragment>
            <CreditProposalProvider value={context}>
                <div className="page-content">
                    <Breadcrumbs title={t("Commercial Credit")} breadcrumbItem={t("Guarantee")} />
                    <HorizontalSteeper processNumber={3} activeStep={2}></HorizontalSteeper>
                    <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
                        <Col md={6} style={{ textAlign: "left" }}>
                            {/* <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { onSaveProcess(OPTs.PROCESS_CANCELPROCESS) }}><i className="mdi mdi-cancel mid-12px"></i> {t("AdjustRequired")}</Button> */}
                        </Col>
                        <Col md={6} style={{ textAlign: "right", marginTop: "10px" }}>
                            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_GUARANTEE) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                            <Button color="success" type="button"
                                onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
                        </Col>
                    </Row>
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col>
                                    <h4 className="card-title">{t("Guarantee")}</h4>
                                    <p className="card-title-desc">{t("This form is official and must be filled out correctly")}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <h5 className="card-title title-header">{mainDebtor != null ? (mainDebtor.typePerson === "1" ? (mainDebtor.name + " " + mainDebtor.name2 + " " + mainDebtor.lastName + " " + mainDebtor.lastName2) : (mainDebtor.name)) : ""} </h5>
                                </Col>
                                <Col sm={6}>
                                    <h5 className="card-title" style={{ textAlign: "right" }}>{t("Tramit")}:{" "}#{locationData?.transactionId}</h5>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md={3}>
                                    <Nav pills className="flex-column">
                                        {/* <NavLink className={classnames({ active: activeTab === 1 })}
                                            onClick={() => {
                                                toggleTab(1)
                                            }}>
                                            {t("Líneas de Crédito")}
                                        </NavLink> */}
                                        <NavLink className={classnames({ active: activeTab === 2 })}
                                            onClick={() => {
                                                toggleTab(2)
                                            }}>
                                            {t("Garantías Muebles Nuevos Y Usados")}
                                        </NavLink>
                                        <NavLink className={classnames({ active: activeTab === 3 })}
                                            onClick={() => {
                                                toggleTab(3)
                                            }}>
                                            {t("Garantías Bien Mueble")}
                                        </NavLink>
                                        <NavLink className={classnames({ active: activeTab === 4 })}
                                            onClick={() => {
                                                toggleTab(4)
                                            }}>
                                            {t("Otras Garantías")}
                                        </NavLink>
                                        <NavLink className={classnames({ active: activeTab === 5 })}
                                            onClick={() => {
                                                toggleTab(5)
                                            }}>
                                            {t("Garatías Pignoración")}
                                        </NavLink>
                                    </Nav>
                                </Col>
                                <Col md={9}>
                                    <TabContent activeTab={activeTab} className="body">
                                        {/* <TabPane tabId={1}>
                                            <Row>
                                                <Col md="6">
                                                    <h5 className="card-sub-title">{t("LineofCredit")}</h5>
                                                </Col>
                                                <Col md="6" style={{ textAlign: "right" }}>
                                                    <Link
                                                        to={{
                                                            pathname: '/creditocomercial/AdminDesembolso/CreacionLinea',
                                                            data: { facilityId: idFacilidad ?? 0, transactionId: locationData?.transactionId ?? 0 },
                                                        }}
                                                    >
                                                        <i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i>
                                                    </Link>

                                                </Col>
                                            </Row>
                                            <Col md="12" className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table" >
                                                    <thead>
                                                        <tr>
                                                            <th><strong>{t("Line Number or Limit")}</strong></th>
                                                            <th><strong>{t("Coin")}</strong></th>
                                                            <th><strong>{t("Risk Country")}</strong></th>
                                                            <th><strong>{t("Province")}</strong></th>
                                                            <th><strong>{t("Economic Activity")}</strong></th>
                                                            <th><strong>{t("Proposal Date")}</strong></th>
                                                            <th><strong>{t("Approval date")}</strong></th>
                                                            <th><strong>{t("DueDate")}</strong></th>
                                                            <th><strong>{t("Deadline")}</strong></th>
                                                            <th><strong>{t("Review Frequency")}</strong></th>
                                                            <th><strong>{t("Amount")}</strong></th>
                                                            <th><strong>{t("Total Maximum")}</strong></th>
                                                            <th><strong>{t("Actions")}</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataLinea}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </TabPane> */}
                                        <TabPane tabId={2}>
                                            <Row>
                                                <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-3" onSelect={(e) => { handleSelect(e) }}>
                                                    {dataFacilidad}
                                                </Tabs>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <h5 className="card-sub-title">{t("Warranties New and Used Furniture")}</h5>
                                                </Col>
                                                <Col md="6" style={{ textAlign: "right" }}>
                                                    {/* <Link
                                                        to={{
                                                            pathname: '/creditocomercial/AdminDesembolso/GarantiaEquiposNuevosyUsados',
                                                            data: { facilityId: idFacilidad ?? 0, transactionId: locationData?.transactionId ?? 0 },
                                                        }}
                                                    >
                                                        <i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i>
                                                    </Link> */}
                                                    <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                                                        history.push({
                                                            pathname: '/creditocomercial/AdminDesembolso/GarantiaEquiposNuevosyUsados',
                                                            data: { facilityId: idFacilidad ?? 0, transactionId: locationData?.transactionId ?? 0 },
                                                        });
                                                    }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                                                </Col>
                                            </Row>
                                            <Col md="12" className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table" >
                                                    <thead>
                                                        <tr>
                                                            <th><strong>{t("Attachment Number")}</strong></th>
                                                            <th><strong>{t("Loan number")}</strong></th>
                                                            <th><strong>{t("Coin")}</strong></th>
                                                            <th><strong>{t("Client number")}</strong></th>
                                                            <th><strong>{t("Guarantee Amount")}</strong></th>
                                                            <th><strong>{t("GuaranteeType")}</strong></th>
                                                            <th><strong>{t("Bank")}</strong></th>
                                                            <th><strong>{t("Agency(Banking)")}</strong></th>
                                                            <th><strong>{t("Movable Property Code")}</strong></th>
                                                            <th><strong>{t("Transaction Expiration Date")}</strong></th>
                                                            <th><strong>{t("TrustNumber")}</strong></th>
                                                            <th><strong>{t("Trust Issuance Date")}</strong></th>
                                                            <th><strong>{t("Actions")}</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataBienUsados}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </TabPane>
                                        <TabPane tabId={3}>
                                            <Row>
                                                <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-3" onSelect={(e) => { handleSelect(e) }}>
                                                    {dataFacilidad}
                                                </Tabs>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <h5 className="card-sub-title">{t("Movable property guarantee")}</h5>
                                                </Col>
                                                <Col md="6" style={{ textAlign: "right" }}>
                                                    {/* <Link
                                                        to={{
                                                            pathname: '/creditocomercial/AdminDesembolso/GarantiasMuebles',
                                                            data: { facilityId: idFacilidad ?? 0, transactionId: locationData?.transactionId ?? 0 },
                                                        }}
                                                    >
                                                        <i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i>
                                                    </Link> */}
                                                    <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                                                        history.push({
                                                            pathname: '/creditocomercial/AdminDesembolso/GarantiasMuebles',
                                                            data: { facilityId: idFacilidad ?? 0, transactionId: locationData?.transactionId ?? 0 },
                                                        });
                                                    }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                                                </Col>
                                            </Row>
                                            <Col md="12" className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table" >
                                                    <thead>
                                                        <tr>
                                                            <th><strong>{t("Warranty ID")}</strong></th>
                                                            <th><strong>{t("Credit ID")}</strong></th>
                                                            <th><strong>{t("Loan or Disbursement Number")}</strong></th>
                                                            <th><strong>{t("Coin")}</strong></th>
                                                            <th><strong>{t("Client number")}</strong></th>
                                                            <th><strong>{t("Amount Assigned in Guarantee")}</strong></th>
                                                            <th><strong>{t("Guaranteed amount")}</strong></th>
                                                            <th><strong>{t("Initial value of the Guarantee")}</strong></th>
                                                            <th><strong>{t("Warrant Type")}</strong></th>
                                                            <th><strong>{t("Movable Property Code")}</strong></th>
                                                            <th><strong>{t("Guarantee Currency")}</strong></th>
                                                            <th><strong>{t("Actions")}</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataBienMueble}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </TabPane>
                                        <TabPane tabId={4}>
                                            <Row>
                                                <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-3" onSelect={(e) => { handleSelect(e) }}>
                                                    {dataFacilidad}
                                                </Tabs>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <h5 className="card-sub-title">{t("Other Guarantees")}</h5>
                                                </Col>
                                                <Col md="6" style={{ textAlign: "right" }}>
                                                    {/* <Link
                                                        to={{
                                                            pathname: '/creditocomercial/AdminDesembolso/OtrasGarantias',
                                                            data: { facilityId: idFacilidad ?? 0, transactionId: locationData?.transactionId ?? 0 },
                                                        }}
                                                    >
                                                        <i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i>
                                                    </Link> */}
                                                    <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                                                        history.push({
                                                            pathname: '/creditocomercial/AdminDesembolso/OtrasGarantias',
                                                            data: { facilityId: idFacilidad ?? 0, transactionId: locationData?.transactionId ?? 0 },
                                                        });
                                                    }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                                                </Col>
                                            </Row>

                                            <div className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table mt-1" responsive>
                                                    <thead>
                                                        <tr>
                                                            <th><strong>{t("Warranty ID")}</strong></th>
                                                            <th><strong>{t("Credit ID")}</strong></th>
                                                            <th><strong>{t("Loan or Disbursement Number")}</strong></th>
                                                            <th><strong>{t("Currency")}</strong></th>
                                                            <th><strong>{t("Client number")}</strong></th>
                                                            <th><strong>{t("Amount Assigned in Guarantee")}</strong></th>
                                                            <th><strong>{t("Guaranteed amount")}</strong></th>
                                                            <th><strong>{t("Initial Value of the Guarantee")}</strong></th>
                                                            <th><strong>{t("Type of Guarantee")}</strong></th>
                                                            <th><strong>{t("Asset Code (Guarantee Subtype)")}</strong></th>
                                                            <th><strong>{t("Guarantee Currency")}</strong></th>
                                                            <th><strong>{t("Bank")}</strong></th>
                                                            <th><strong>{t("Agency (Banking)")}</strong></th>
                                                            <th><strong>{t("Type of Financial Instrument")}</strong></th>
                                                            <th><strong>{t("Document ID")}</strong></th>
                                                            <th><strong>{t("Trust Number")}</strong></th>
                                                            <th><strong>{t("Trust Issuance Date")}</strong></th>
                                                            <th><strong>{t("Warranty ID")}</strong></th>
                                                            <th><strong>{t("Guarantor's Name")}</strong></th>
                                                            <th><strong>{t("Appraiser")}</strong></th>
                                                            <th><strong>{t("Agency Code")}</strong></th>
                                                            <th><strong>{t("Issuing Countries")}</strong></th>
                                                            <th><strong>{t("Actions")}</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataOtrasGarantias}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </TabPane>
                                        <TabPane tabId={5}>
                                            <Row>
                                                <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-3" onSelect={(e) => { handleSelect(e) }}>
                                                    {dataFacilidad}
                                                </Tabs>
                                            </Row>
                                            <Row>

                                                <Col md="6">
                                                    <h5 className="card-sub-title">{t("Guarantees Pledge")}</h5>
                                                </Col>
                                                <Col md="6" style={{ textAlign: "right" }}>
                                                    {/* <Link
                                                        to={{
                                                            pathname: '/creditocomercial/AdminDesembolso/Pignoracion',
                                                            data: { facilityId: idFacilidad ?? 0, transactionId: locationData?.transactionId ?? 0 },
                                                        }}
                                                    >
                                                        <i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i>
                                                    </Link> */}
                                                    <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                                                        history.push({
                                                            pathname: '/creditocomercial/AdminDesembolso/Pignoracion',
                                                            data: { facilityId: idFacilidad ?? 0, transactionId: locationData?.transactionId ?? 0 },
                                                        });
                                                    }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                                                </Col>
                                            </Row>
                                            <div className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table mt-1" responsive>
                                                    <thead>
                                                        <tr>
                                                            <th><strong>{t("Warranty ID")}</strong></th>
                                                            <th><strong>{t("Attachment Number")}</strong></th>
                                                            <th><strong>{t("Loan or Disbursement Number")}</strong></th>
                                                            <th><strong>{t("Currency")}</strong></th>
                                                            <th><strong>{t("Client number")}</strong></th>
                                                            <th><strong>{t("Guarantee Amount")}</strong></th>
                                                            <th><strong>{t("Type of Guarantee")}</strong></th>
                                                            <th><strong>{t("Bank")}</strong></th>
                                                            <th><strong>{t("Agencia")}</strong></th>
                                                            <th><strong>{t("Account or Deposit No")}</strong></th>
                                                            <th><strong>{t("Expiration date")}</strong></th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataPignoracion}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </Col>
                            </Row>
                        </CardBody>

                    </Card>

                    {locationData ?
                        <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_GUARANTEE, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_15)} />
                        : null}

                    <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
                        <Col md={6} style={{ textAlign: "left" }}>
                            {/* <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { onSaveProcess(OPTs.PROCESS_CANCELPROCESS) }}><i className="mdi mdi-cancel mid-12px"></i> {t("AdjustRequired")}</Button> */}
                        </Col>
                        <Col md={6} style={{ textAlign: "right", marginTop: "10px" }}>
                            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_GUARANTEE) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                            <Button color="success" type="button"
                                onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
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

                    {successSave_dlg ? (
                        <SweetAlert
                            success
                            title={t("SuccessDialog")}
                            confirmButtonText={t("Confirm")}
                            cancelButtonText={t("Cancel")}
                            onConfirm={() => {
                                setsuccessSave_dlg(false);
                                loadData(locationData)
                            }}
                        >
                            {t("SuccessSaveMessage")}
                        </SweetAlert>
                    ) : null}
                    {error_dlg ? (
                        <SweetAlert
                            error
                            title={t("ErrorDialog")}
                            confirmButtonText={t("Confirm")}
                            cancelButtonText={t("Cancel")}
                            onConfirm={() => {
                                seterror_dlg(false)
                            }}
                        >
                            {error_msg}
                        </SweetAlert>
                    ) : null}
                    {confirm_alert ? (
                        <SweetAlert
                            title={t("Areyousure")}
                            warning
                            showCancel
                            confirmButtonText={t("Yesdeleteit")}
                            cancelButtonText={t("Cancel")}
                            confirmBtnBsStyle="success"
                            cancelBtnBsStyle="danger"
                            onConfirm={() => {
                                const apiBack = new BackendServices();
                                // eliminarClienteIGR
                                if (type == "BIENUSADOS") {
                                    apiBack.deleteGuaranteeUsedNewEquipments(dataDelete?.transactId ?? 0, dataDelete?.facilityId ?? 0, dataDelete?.guaranteeId ?? 0).then(resp => {
                                        if (resp.statusCode == "500") {
                                            setconfirm_alert(false)
                                            seterror_dlg(false)
                                        } else {
                                            setconfirm_alert(false)
                                            setsuccessSave_dlg(true)
                                        }
                                    }).catch(error => {
                                        setconfirm_alert(false)
                                        seterror_dlg(false)
                                    })
                                }
                                if (type == "LINEACREDITO") {
                                    apiBack.deleteCreditLine(dataDelete?.transactId ?? 0, dataDelete?.lineId ?? 0).then(resp => {
                                        if (resp.statusCode == "500") {
                                            setconfirm_alert(false)
                                            seterror_dlg(false)
                                        } else {
                                            setconfirm_alert(false)
                                            setsuccessSave_dlg(true)
                                        }
                                    }).catch(error => {
                                        setconfirm_alert(false)
                                        seterror_dlg(false)
                                    })
                                }
                                if (type == "BIENMUEBLE") {
                                    apiBack.deleteGuaranteeMoveableAsset(dataDelete?.transactId ?? 0, dataDelete?.facilityId ?? 0, dataDelete?.guaranteeId ?? 0).then(resp => {
                                        if (resp.statusCode == "500") {
                                            setconfirm_alert(false)
                                            seterror_dlg(false)
                                        } else {
                                            setconfirm_alert(false)
                                            setsuccessSave_dlg(true)
                                        }
                                    }).catch(error => {
                                        setconfirm_alert(false)
                                        seterror_dlg(false)
                                    })
                                }
                                if (type == "OTRAGARANTIA") {
                                    apiBack.deleteOtherGuarantees(dataDelete?.transactId ?? 0, dataDelete?.facilityId ?? 0, dataDelete?.guaranteeId ?? 0).then(resp => {
                                        if (resp.statusCode == "500") {
                                            setconfirm_alert(false)
                                            seterror_dlg(false)
                                        } else {
                                            setconfirm_alert(false)
                                            setsuccessSave_dlg(true)
                                        }
                                    }).catch(error => {
                                        setconfirm_alert(false)
                                        seterror_dlg(false)
                                    })
                                }
                                if (type == "PIGNORACION") {
                                    apiBack.deletePledge(dataDelete?.transactId ?? 0, dataDelete?.facilityId ?? 0, dataDelete?.guaranteeId ?? 0).then(resp => {
                                        if (resp.statusCode == "500") {
                                            setconfirm_alert(false)
                                            seterror_dlg(false)
                                        } else {
                                            setconfirm_alert(false)
                                            setsuccessSave_dlg(true)
                                        }
                                    }).catch(error => {
                                        setconfirm_alert(false)
                                        seterror_dlg(false)
                                    })
                                }

                            }}
                            onCancel={() => setconfirm_alert(false)}
                        >
                            {t("Youwontbeabletorevertthis")}
                        </SweetAlert>
                    ) : null}
                </div>
                {loading && (
                    <LoadingIndicator message={t("Please Wait")} />
                )}
                {showSuccess && (
                    <SuccessMessage title={t("Operation Complete")} message={t("Credit Proposal Saved")} />
                )}
            </CreditProposalProvider>
        </React.Fragment >
    );

}

export default DesembolsoLista;
