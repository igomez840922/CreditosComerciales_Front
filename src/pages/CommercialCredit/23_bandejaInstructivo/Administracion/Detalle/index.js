/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { Link } from "react-router-dom"
import { useTranslation, withTranslation } from "react-i18next"
import * as url from "../../../../../helpers/url_helper"
import * as OPTs from "../../../../../helpers/options_helper";

import {
  Card,
  CardBody, CardHeader,
  Col, Row,
  Button,
  CardFooter,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../../../components/Common/Breadcrumb"

import ResultadosBusqueda from "../../../12_Abogado/PantallaDetalle/ResultadosBusqueda.js"

import SweetAlert from "react-bootstrap-sweetalert"

import { BpmServices, BackendServices } from "../../../../../services";

import ModalEndProcess from "../../../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../../components/LogProcess/index";


import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';
import CheckListComponent from '../../../../../components/Common/CheckList';

import { Tab, Tabs } from "react-bootstrap";

import HorizontalSteeper from "../../../../../components/Common/HorizontalSteeper";

import { saveLogProcess } from "../../../../../helpers/logs_helper";

import ModalPrevicualizarAIF from "../../../6_AnalisisCredito/previsualizarAIF";
import ModalPrevisualizarPropCred from "../../../5_PropuestaCredito/previsualizarPropCred";
import ModalPrevicualizarIGR from "../../../4_InformeGestionReforzado/FormularioIGR/previsualizarIGR";
import ModalBitacora from "../../../../../components/Common/ModalBitacora"
import InstructivoNuevo from "../..//Desembolso/Instructivo/index.js"
import PantallaInstructivo from "../../../14_AdminDesembolso/Desembolso/Instructivo/index.js"
import PantallaBusqueda2 from "../../../14_AdminDesembolso/Colateral/CreacionLinea/Formulario"

const PantallaBusqueda = props => {

  const { t, i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation()

  const [locationData, setLocationData] = useState(null);
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  //const [coreServices, setcoreServices] = useState(new CoreServices());

  const [mainDebtor, setmainDebtor] = useState(null);

  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

  const [ModalPrevisualizardata, settoogleModalPrevisualizar] = useState(false);
  const [ShowModelCreditProposal, setShowModelCreditProposal] = useState(false);
  const [ShowModelFinancialReport, setShowModelFinancialReport] = useState(false);

  const [optionSelected, setoptionSelected] = useState(null);
  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);


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

  function toggleShowModelCreditProposal() {
    setShowModelCreditProposal(!ShowModelCreditProposal)
  }
  function toogleModalPrevisualizarIGR() {
    settoogleModalPrevisualizar(!ModalPrevisualizardata);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function toggleShowModelFinancialReport() {
    setShowModelFinancialReport(!ShowModelFinancialReport)
  }

  async function checkToContinue() {

    //await guardarDatos();

    setTimeout(async function () {

      saveJBPMProcess(OPTs.PROCESS_EXECUTEDISBURSEMENT);
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
      OPTs.PROCESS_SIGNCONTRACT, OPTs.ACT_NONE,
      maindebtor?.personId
    );
    infoBpmModel.personName = maindebtor !== undefined ? (maindebtor.typePerson == "2" ? maindebtor.name : (maindebtor.name + " " + maindebtor.name2 + " " + maindebtor.lastName + " " + maindebtor.lastName2)) : "";

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
      case OPTs.PROCESS_ADMINDISBURSEMENT: {
        infoBpmModel.processId = OPTs.PROCESS_ADMINDISBURSEMENT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_ADMINDISBURSEMENT.toString(),
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
      case OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT: {
        infoBpmModel.processId = OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "ajuste"
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
      case OPTs.PROCESS_EXECUTEDISBURSEMENT: {
        infoBpmModel.processId = OPTs.PROCESS_EXECUTEDISBURSEMENT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_EXECUTEDISBURSEMENT.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "no"
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
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ADMINDISBURSEMENT, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_14)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }


  /*
  // Camino Feliz No Require Ajustes... 
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"no"
  };
    
  //Requiere Requiere Ajustes .. regresa a Formalizacion firma de Contrato
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"si"
  };
  */

  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
  }

  return (
    <React.Fragment>

      <div className="page-content">

        <Breadcrumbs title={props.t("CommercialCredit")} breadcrumbItem={props.t("Administration")} />

        <HorizontalSteeper processNumber={3} activeStep={1}></HorizontalSteeper>        

        <Row>
          <Col md={4} style={{ textAlign: "left" }}>
            {/*<Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { onSaveProcess(OPTs.PROCESS_CANCELPROCESS) }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>*/}
            <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>
          </Col>
          <Col md={8} style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_ADMINDISBURSEMENT) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            {/* <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_SIGNCONTRACT) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button> */}
            <Button color="success" type="button"
              onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
          </Col>
        </Row>


        <Card>

          <CardHeader>
            <Row>
              <Col md={6}>
                <h4 className="card-title">{t("Administration")}</h4>
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
              <div className="d-flex flex-row justify-content-between">
                {/* <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toogleModalPrevisualizarIGR() }}>
                  {" "} {props.t("ConsultManagementReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelCreditProposal() }}>
                  {" "} {props.t("ConsultCreditProposal")} <i className="mdi mdi-eye-outline mid-12px"></i></Button> */}
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

            <Row>
              <Col md="12">
                <Tabs defaultActiveKey="1" id="uncontrolled-tab-example" className="mb-3">
                  <Tab className="m-4" key={1} eventKey={1} title={props.t("LegalDocumentation")}>
                    {<ResultadosBusqueda />}
                  </Tab>
                  <Tab className="m-4" key={2} eventKey={2} title={props.t("CheckList")}>
                    {locationData ?
                      <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_ADMINEXPEDIENTE, OPTs.ACT_NONE)} />
                      : null}
                  </Tab>
                  <Tab className="m-4" key={3} eventKey={3} title={props.t("Attachments")}>
                    {locationData ?
                      <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_SIGNCONTRACT, OPTs.ACT_NONE)} />
                      : null}
                  </Tab>
                  <Tab className="m-4" key={4} eventKey={4} title={props.t("Instructivo de Desembolso")}>
                    {locationData ?
                      <InstructivoNuevo firmarcontrato={false} adminDesembolso={true} ejecutarDesembolso={false} />
                      : null}
                  </Tab>
                  <Tab className="m-4" key={5} eventKey={5} title={props.t("Línea de crédito")}>
                    {locationData ?
                      <PantallaBusqueda2 administracion={true} />
                      : null}
                  </Tab>
                </Tabs>
              </Col>
            </Row>


          </CardBody>

          <CardFooter>
          </CardFooter>

        </Card>

        {locationData ?
          <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ADMINDISBURSEMENT, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_14)} />
          : null}
        <Row>
          <Col md={4} style={{ textAlign: "left" }}>
            {/*<Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { onSaveProcess(OPTs.PROCESS_CANCELPROCESS) }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>*/}
            <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>
          </Col>
          <Col md={8} style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_ADMINDISBURSEMENT) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            {/* <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_SIGNCONTRACT) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button> */}
            <Button color="success" type="button"
              onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
          </Col>
        </Row>

        <ModalEndProcess onSaveEndProcess={onSaveEndProcess} isOpen={displayModalEndProcess} toggle={() => { showModalEndProcess(false) }} />

        {/* <ModalPrevisualizarPropCred isOpen={ShowModelCreditProposal} toggle={() => { toggleShowModelCreditProposal() }} /> */}
        {/* <ModalPrevicualizarAIF isOpen={ShowModelFinancialReport} toggle={() => { toggleShowModelFinancialReport() }} /> */}
        {/* <ModalPrevicualizarIGR isOpen={ModalPrevisualizardata} toggle={() => { toogleModalPrevisualizarIGR() }} /> */}

        {
          messageDlg && messageDlg.show ? (
            <SweetAlert
              type={messageDlg.error ? "error" : "success"}
              title={messageDlg.error ? t("Error") : t("Message")}
              onConfirm={() => { showMessage(); }}>
              {messageDlg.msg}
            </SweetAlert>
          ) : null
        }
      </div>
      {locationData && displayModalBitacora ?
        <ModalBitacora logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_04)}
          successSaved={() => { onSaveProcess(optionSelected); }}
          isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
        : null}

    </React.Fragment>
  )
}

PantallaBusqueda.propTypes = {
  selectedId: PropTypes.any,
  onClose: PropTypes.func.isRequired
}

export default (withTranslation()(PantallaBusqueda))
