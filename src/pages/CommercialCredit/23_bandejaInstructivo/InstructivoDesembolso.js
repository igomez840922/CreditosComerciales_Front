import React, { useEffect, useState } from "react"
import { Link, useHistory, useLocation } from "react-router-dom"
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { useTranslation } from 'react-i18next'
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import * as OPTs from "../../../helpers/options_helper"
import * as url from "../../../helpers/url_helper"
import { Tabs, Tab } from 'react-bootstrap';
import {
    CardTitle, Button,
    Card, CardBody, Label, Col, Table
} from "reactstrap"
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import InstructivoNuevo from "./Desembolso/Instructivo/index.js"
import PantallaBusqueda from "../../CommercialCredit/14_AdminDesembolso/Colateral/CreacionLinea/Formulario"
import ModalWatchProces from "../../Dashboard/ModalWacthProcess";
import { translationHelpers } from '../../../helpers';
import LoadingOverlay from "react-loading-overlay";
import { BackendServices, BpmServices } from "../../../services";
//import ActiveDirectoryService from "../../services/ActiveDirectory";
import moment from "moment";
import Select from "react-select";
import { Row } from "react-bootstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";

const InstructivoDesembolsoNew = () => {

    const { t, i18n } = useTranslation();
    const history = useHistory();
    const location = useLocation()

    const [locationData, setLocationData] = useState(null);
    //Servicios
    const [backendServices, setbackendServices] = useState(new BackendServices());
    const [bpmServices, setbpmServices] = useState(new BpmServices());
    //const [coreServices, setcoreServices] = useState(new CoreServices());

    const [mainDebtor, setmainDebtor] = useState(null);

    const [tr] = translationHelpers('commercial_credit', 'translation');

    let COLUMNS_HEADERS = [
        { text: <strong>{t("Procedure")}</strong>, dataField: 'transactId', sort: true },
        { text: <strong>{t("Creation Date")}</strong>, dataField: 'creationDate', sort: true },
        { text: <strong>{t("Process")}</strong>, dataField: 'bpmProcessDescription', sort: true },
        { text: <strong>{t("Activity")}</strong>, dataField: 'bpmActivityDescription', sort: true },
        { text: <strong>{t("Fecha de Actividad")}</strong>, dataField: 'activityDate', sort: true },
        { text: <strong>{t("IdType")}</strong>, dataField: 'idType', sort: true },
        { text: <strong>{t("IdNumber")}</strong>, dataField: 'clientDocId', sort: true },
        { text: <strong>{t("Responsible")}</strong>, dataField: 'responsible', sort: true },
        { text: <strong>{t("Names")}</strong>, dataField: 'names', sort: true },
        { text: <strong>{t("Surnames")}</strong>, dataField: 'surnames', sort: true },
        { text: <strong>{t("Status")}</strong>, dataField: 'stateDescription', sort: true },
        { text: "", dataField: 'action' },
    ];

    const [dataBody, setDataBody] = useState([]);
    const [ShowDisplayModal, setShowDisplayModal] = useState(false);
    const [ShowDisplayModalPreview, setShowDisplayModalPreview] = useState(false);
    const [processInstanceId, setProcessInstanceId] = useState(null);
    const [isActiveLoading, setIsActiveLoading] = useState(false);

    const [IdentificationTypeList, setIdentificationTypeList] = useState([]);
    const [IdentificationTypeSelected, setIdentificationTypeSelected] = useState("");
    const [idTypeValidate, setIdTypeValidate] = useState(false);
    const [formRef, setFormRef] = useState(false);
    const [transactId, setTransactId] = useState(undefined);
    const [instanceId, setInstanceId] = useState(undefined);

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
                fetchData(location.data);
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                setLocationData(result);
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
        loadIdentificationTypes();
        // Read Api Service data
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

    /**
     * *Busca las coincidencias para históricos
     * @param {object} event
     * @param {object} errors
     * @param {object} values
     * @return {void}
     */
    function searchHistorical(event, errors, values) {

        event.preventDefault();
        if (errors.length > 0) {
            return;
        }

        setIsActiveLoading(true);
        values.idType = IdentificationTypeSelected?.value ?? '';

        backendServices.getHistoricalSearches(values.transactId, values.idType, values.clientDocId).then(response => {
            console.log("getHistoricalSearches", response);

            if (response.status == 200) {
                setDataBody(
                    response.result.summaryProcess.map(($$, index) => {
                        $$.creationDate = formatDate($$.creationDate);
                        $$.activityDate = formatDate($$.activityDate);
                        $$.names = `${$$.name} ${$$.secondName}`;
                        $$.surnames = `${$$.lastName} ${$$.secondLastName}`;
                        $$.action = (
                            <>
                                <Link key={index} onClick={(e) => { setInstanceId($$.instanceId); setTransactId($$.transactId); toggleModalWatchPreview(); }}>
                                    <i className="mdi mdi-file-eye-outline mdi-24px"></i>
                                </Link>
                                <Link key={index} onClick={(e) => { setProcessInstanceId($$.instanceId); toggleModalWatchProcess(); }}>
                                    <i className="mdi mdi-eye mdi-24px"></i>
                                </Link>
                            </>
                        )
                        return $$;
                    }));
            } else {

            }

            setIsActiveLoading(false);
        }).catch(err => {
            setIsActiveLoading(false);
            console.log(err);
        })
    }

    /**
     * *Obtiene catálogo de tipo de identificación
     * @param {}
     * @return {void}
     */
    function loadIdentificationTypes() {
        backendServices.consultarCatalogoTipoIdentificacion().then((data) => {
            if (data !== null && data !== undefined) {
                let json = [{ label: t("None"), value: "" }];
                for (let i = 0; i < data.length; i++) {
                    json.push({ label: t(data[i]["description"]), value: data[i]["id"] })
                }
                setIdentificationTypeList(json)
            }
        }).catch((error) => {
            console.log(error)
        });
    }


    function formatDate(date) {
        return moment(date).format("DD/MM/YYYY HH:mm:ss");
    }

    function toggleModalWatchProcess() {
        setShowDisplayModal(!ShowDisplayModal)
    }

    function toggleModalWatchPreview() {
        setShowDisplayModalPreview(!ShowDisplayModalPreview)
    }

    function clearForm() {
        setIdentificationTypeSelected("");
        setIdTypeValidate(false);
        setIsActiveLoading(false);
        setDataBody([]);
        formRef.reset();
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs title={t("Dashboard")} breadcrumbItem={t("DisbursementInstructions")} />

                <HorizontalSteeper processNumber={3} activeStep={0}></HorizontalSteeper>

                <Row>
          <Col md={4} style={{ textAlign: "left" }}>
            {/*<Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { onSaveProcess(OPTs.PROCESS_CANCELPROCESS) }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>*/}
            <Button color="primary" style={{ margin: '5px' }} type="button" onClick={() => {
                                    history.push({
                                        pathname: '/Dashboard',
                                        data: {},
                                    });
                                }} ><i className="mdi mdi-backspace-outline mid-12px"></i> {t("Retornar a la Bandeja")}</Button>
          </Col>
          <Col md={8} style={{ textAlign: "right" }}>
           
           </Col>
        </Row>


                <Card>
                    <CardBody>
                    <Row>
                            <Col md={6}>
                                <h4 className="card-title">{t("CommercialCredit")}</h4>
                                <div>
                                    <p className="card-title-desc m-0">{t("DisbursementInstructions")}</p>
                                </div>
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
                        <Row>
                            <div className="d-flex flex-row justify-content-between">
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

                                {/* <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelFinancialReport() }}>
                  {" "} {props.t("ConsultFinancialReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button> */}
                                <Link
                                    style={{ margin: '5px', border: "1px", backgroundColor: "#1C8464", color: "#fff" }}
                                    className="btn"
                                    color="success"
                                    type="button"
                                    to={{
                                        pathname: '/creditocomercial/previsualizarAIF/' + btoa(locationData?.transactionId),
                                    }}
                                    target="_blank"
                                >{" "} {t("ConsultFinancialReport")} <i className="mdi mdi-eye mdi-12px"></i></Link>

                            </div>
                        </Row>
                    </CardBody>
                    <CardBody>
                        <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>

                            {/* <SearchBar className="custome-search-field float-end" delay={1000} placeholder={t("Search")} {...props.searchProps} /> */}
                            <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-3">
                                <Tab className="m-4" key={0} eventKey={0} title="Línea de créditos">
                                    <PantallaBusqueda />
                                </Tab>
                                <Tab className="m-4" key={1} eventKey={1} title="Instructivo de desembolso">
                                    <InstructivoNuevo firmarcontrato={true} adminDesembolso={false} ejecutarDesembolso={false} />
                                </Tab>
                            </Tabs>
                        </LoadingOverlay>
                    </CardBody>
                </Card>

            </div>
            {processInstanceId && (<ModalWatchProces isOpen={ShowDisplayModal} toggle={() => { toggleModalWatchProcess() }} processInstanceId={processInstanceId} t={tr} />)}
        </React.Fragment >
    );
}

export default InstructivoDesembolsoNew
