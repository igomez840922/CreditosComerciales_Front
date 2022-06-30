import React, { useEffect, useState } from "react"
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../../helpers/url_helper"
import * as OPTs from "../../../helpers/options_helper";
import { useTranslation, withTranslation } from "react-i18next"

import PropTypes from 'prop-types';
import { Link } from "react-router-dom"

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Row,
  Col,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import SweetAlert from "react-bootstrap-sweetalert";

import ModalPrevicualizarAIF from "../6_AnalisisCredito/previsualizarAIF";
import ModalPrevisualizarPropCred from "../5_PropuestaCredito/previsualizarPropCred";
import ModalPrevicualizarIGR from "../4_InformeGestionReforzado/FormularioIGR/previsualizarIGR";

import ModalEndProcess from "../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";
import { Tab, Tabs } from "react-bootstrap";
import PrevicualizarIGR from "../4_InformeGestionReforzado/FormularioIGR/previsualizarIGRcomponente";
import PrevisualizarPropCred from "../5_PropuestaCredito/previsualizarPropCredcomponente";
import PrevicualizarAIF from "../6_AnalisisCredito/previsualizarAIFcomponente";

import CheckListComponent from '../../../components/Common/CheckList';
import { AttachmentFileInputModel } from "../../../models/Common/AttachmentFileInputModel"

import ModalBitacora from "../../../components/Common/ModalBitacora";
import FinancialReportContent from "../6_AnalisisCredito/FinancialReportContent";

import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";
import { saveLogProcess } from "../../../helpers/logs_helper";
import ModalRiesgoCredito from "../6_AnalisisCredito/ModalRiesgoCredito";
import ModalPreviewHistorical from "../../Dashboard/modal/ModalPreviewHistorical";
import FormConclusiones from "../17_RiesgoCredito/riesgoCredito/Conclusiones";
import LevelAutonomy from "../5_PropuestaCredito/Secciones/LevelAutonomy";
import { LevelAutonomyClass } from "../5_PropuestaCredito/Secciones/LevelAutonomy.model";

const AutonomiaCredito = props => {
  const history = useHistory();
  const location = useLocation()

  const { t, i18n } = useTranslation();

  const [ShowModelReportManagment, setShowModelReportManagment] = useState(false);
  const [ShowModelCreditProposal, setShowModelCreditProposal] = useState(false);
  const [ShowModelFinancialReport, setShowModelFinancialReport] = useState(false);

  const [mainDebtor, setmainDebtor] = useState(null);

  const [displayModal, setDisplayModal] = useState(false);

  const [locationData, setLocationData] = useState(null);
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());
  const [openModalRiesgo, setopenModalRiesgo] = useState(false);
  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);
  const [optionSelected, setoptionSelected] = useState(null);

  //On Mounting (componentDidMount)
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

    console.log("fetchData", locationData);
    //chequear si la tarea no ha sido iniciada
    bpmServices.checkAndStartTask(locationData)
      .then((iniresult) => {
        if (iniresult === false) {
          history.push(url.URL_DASHBOARD);
        }
      })

    loadUserProspect(locationData.transactionId)
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


  function toggleShowModelReportManagment() {
    setShowModelReportManagment(!ShowModelReportManagment)
  }

  function toggleShowModelCreditProposal() {
    setShowModelCreditProposal(!ShowModelCreditProposal)
  }

  function toggleShowModelFinancialReport() {
    setShowModelFinancialReport(!ShowModelFinancialReport)
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
  async function saveJBPMProcess(option, data = null) {
    var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
    var infoBpmModel = new InfoBpmModel(
      locationData.infoBpmModel?.instanceId ?? locationData.instanceId,
      locationData.infoBpmModel?.transactId ?? locationData.transactionId,
      0, 0,
      maindebtor?.personId
    );
    infoBpmModel.priority = data == null ? 0 : data.value
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
      case OPTs.PROCESS_REFUSED: { //Rechasado
        infoBpmModel.processId = OPTs.PROCESS_REFUSED;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_INFORMEGESTION.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "rechazado"
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
      case OPTs.PROCESS_AUTONOMYCREDIT: {
        infoBpmModel.processId = OPTs.PROCESS_AUTONOMYCREDIT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_AUTONOMYCREDIT.toString(),
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

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_INFORMEGESTION.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "ajuste",
          "ajuste": "ejecutivo"
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
      case OPTs.PROCESS_ANALISISCREDITO: {
        infoBpmModel.processId = OPTs.PROCESS_ANALISISCREDITO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_ANALISISCREDITO.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "ajuste",
          "ajuste": "analista"
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog(OPTs.APPLICATION_STATUS_DEVA, "");
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR              
              showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
            }
          });
        break;
      }
      case OPTs.PROCESS_LEGACYEXPENSE: {
        let autonomy = new LevelAutonomyClass();
        autonomy = await autonomy.getLevelAutonomy();
         
        infoBpmModel.processId = autonomy.banca==undefined||autonomy.banca==null||autonomy.banca==""?OPTs.PROCESS_LEGACYEXPENSE.toString():OPTs.PROCESS_AUTONOMY.toString();
        infoBpmModel.activityId = OPTs.ACT_NONE;
        console.log("PROCESS_LEGACYEXPENSE", infoBpmModel)

             var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": autonomy.banca==undefined||autonomy.banca==null||autonomy.banca==""?OPTs.PROCESS_LEGACYEXPENSE.toString():OPTs.PROCESS_AUTONOMY.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision":autonomy.banca==undefined||autonomy.banca==null||autonomy.banca==""?"aprobado":"banca"
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
      case OPTs.PROCESS_CREDITRISK: {
        infoBpmModel.processId = OPTs.PROCESS_CREDITRISK;
        infoBpmModel.activityId = OPTs.ACT_NONE;
        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_CREDITRISK.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "riesgocredito"
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
      /*case OPTs.PROCESS_ACEPTACIONCLIENTE: {
        infoBpmModel.processId = OPTs.PROCESS_ACEPTACIONCLIENTE;
        infoBpmModel.activityId = OPTs.ACT_NONE;
        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_ACEPTACIONCLIENTE.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "aprobado"
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
      }*/
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
  function askRiskOpinion(data) {
    setopenModalRiesgo(false)
    saveJBPMProcess(OPTs.PROCESS_LEGACYEXPENSE, data)
  }
  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
  }
  function abrirModalRiesgoCheck() {
    setopenModalRiesgo(true);
  }
  async function saveAutoLog(APPLICATION_STATUS = null, observations = null, values = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_SUPERVISORANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_05)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";

    log.autonomyCredit = values?.autonomyCredit ?? "";
    log.decAutonomyCredit = values?.decAutonomyCredit ?? "";
    saveLogProcess(log);
  }

  /*
 Leer Variable llamada Cargo ... para cargar la Autonomia de Credito

// Camino Feliz ... 
var values = {
 "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
 "activityId": OPTs.ACT_NONE.toString(),
 "transactionId": locationData.transactionId,
 "requestId":locationData.requestId,
 "decision":"aprobado"
};
 
//Regresar por Ajustes a Analista ... 
var values = {
 "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
 "activityId": OPTs.ACT_NONE.toString(),
 "transactionId": locationData.transactionId,
 "requestId":locationData.requestId,
 "decision":"devolver",          
 "regresar":"analista"
};

//Regresar por Ajustes a Ejecutivo ... 
var values = {
 "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
 "activityId": OPTs.ACT_NONE.toString(),
 "transactionId": locationData.transactionId,
 "requestId":locationData.requestId,
 "decision":"devolver",          
 "regresar":"ejecutivo"
};

//Terminar Proceso ... 
var values = {
 "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
 "activityId": OPTs.ACT_NONE.toString(),
 "transactionId": locationData.transactionId,
 "requestId":locationData.requestId,
 "decision":"rechazado"
};
*/


  return (
    <React.Fragment>

      <div className="page-content">

        <Breadcrumbs title={props.t("CommercialCredit")} breadcrumbItem={props.t("Autonomía de Crédito")} />

        <HorizontalSteeper processNumber={1} activeStep={4}></HorizontalSteeper>

        <Row>
          <Col md={3} style={{ textAlign: "left" }}>
            {/* <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button> */}
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_REFUSED); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("Refused")}</Button>

          </Col>
          <Col md={9} style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_AUTONOMYCREDIT) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { setoptionSelected(OPTs.PROCESS_ANALISISCREDITO); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToAnalyst")}</Button>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button>
            <Button color="success" type="button" style={{ margin: '5px' }}
              onClick={() => { saveJBPMProcess(OPTs.PROCESS_CREDITRISK) }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("AskRiskOpinion")}</Button>
            <Button color="success" type="button"
              onClick={() => {
                saveJBPMProcess(OPTs.PROCESS_LEGACYEXPENSE)
              }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
          </Col>
        </Row>


        <Card>

          <CardHeader>
            <Row>
              <Col md={6}>
                <h4 className="card-title">{t("CreditAutonomy")}</h4>
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
              <Col md={12} className="d-flex flex-column flex-sm-row justify-content-between">
                <LevelAutonomy />
              </Col>
            </Row>
          </CardHeader>

          <CardBody>
            <Row>
              <Col md="12">
                <Tabs defaultActiveKey="1" id="uncontrolled-tab-example" className="mb-3">
                  <Tab className="m-4" key={1} eventKey={1} title={props.t("ConsultManagementReport")}>
                    <PrevicualizarIGR />
                  </Tab>
                  <Tab className="m-4" key={2} eventKey={2} title={props.t("ConsultCreditProposal")}>
                    <PrevisualizarPropCred />
                  </Tab>
                  <Tab className="m-4" key={3} eventKey={3} title={props.t("ConsultFinancialReport")}>
                    <FinancialReportContent
                      preview={true}
                    />
                  </Tab>
                  <Tab className="m-4" key={4} eventKey={4} title={props.t("Consult Environmental Risk")}>
                    {locationData && <ModalPreviewHistorical autonomyBank={true} title="Previsualización" page={true} isOpen={true} toggle={""} transactId={locationData.transactionId} instanceId={locationData.instanceId} closingPreview={false} />}
                  </Tab>
                  <Tab className="m-4" key={5} eventKey={5} title={props.t("Consult Environmental Credit")}>
                    {locationData && <FormConclusiones locationData={locationData} validacion={true} />}
                  </Tab>
                  <Tab className="m-4" key={6} eventKey={6} title={props.t("CheckList")}>
                    {locationData ?
                      <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_AUTONOMIA, OPTs.ACT_NONE)} />
                      : null}
                  </Tab>
                </Tabs>
              </Col>
            </Row>
            {/* <Row>
              <div className="d-flex flex-row justify-content-between">
                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelReportManagment() }}>
                  {" "} {props.t("ConsultManagementReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelCreditProposal() }}>
                  {" "} {props.t("ConsultCreditProposal")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelFinancialReport() }}>
                  {" "} {props.t("ConsultFinancialReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>
              </div>
            </Row> */}

          </CardBody>

          <CardFooter>
          </CardFooter>
        </Card>


        {locationData ?
          <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_AUTONOMYCREDIT, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_06)} />
          : null}

        <Row>
          <Col md={3} style={{ textAlign: "left" }}>
            {/* <Button color="danger" type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button> */}
            <Button color="danger" style={{ margin: '5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_REFUSED); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("Refused")}</Button>

          </Col>
          <Col md={9} style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_AUTONOMYCREDIT) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { setoptionSelected(OPTs.PROCESS_ANALISISCREDITO); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToAnalyst")}</Button>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button>
            <Button color="success" type="button" style={{ margin: '5px' }}
              onClick={() => { saveJBPMProcess(OPTs.PROCESS_CREDITRISK) }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("AskRiskOpinion")}</Button>
            <Button color="success" type="button"
              onClick={() => {
                saveJBPMProcess(OPTs.PROCESS_LEGACYEXPENSE)
              }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
          </Col>
        </Row>

      </div>

      {locationData && displayModalBitacora ?
        <ModalBitacora logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_AUTONOMYCREDIT, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_06)}
          successSaved={() => { onSaveProcess(optionSelected); }}
          isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
        : null}
      <ModalRiesgoCredito askRiskOpinion={askRiskOpinion} titulo={"Asignación de prioridad"} isOpen={openModalRiesgo} toggle={() => { setopenModalRiesgo(false) }} />

      {/* <ModalPrevicualizarIGR isOpen={ShowModelReportManagment} toggle={() => { toggleShowModelReportManagment() }} />
      <ModalPrevisualizarPropCred isOpen={ShowModelCreditProposal} toggle={() => { toggleShowModelCreditProposal() }} /> */}
      {/* <ModalPrevicualizarAIF isOpen={ShowModelFinancialReport} toggle={() => { toggleShowModelFinancialReport() }} /> */}
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
    </React.Fragment>
  )
}
AutonomiaCredito.propTypes = {
  //    onSelectIdPropuesta: PropTypes.func.isRequired
  selectedIdPropuesta: PropTypes.any,
  onClose: PropTypes.func.isRequired
}

export default (withTranslation()(AutonomiaCredito))
