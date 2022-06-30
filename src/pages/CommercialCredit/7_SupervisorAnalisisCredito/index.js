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
import ModalReportManagment from "./ModalSupervisor/ModalManagmentReport";
import ModalCreditProposal from "./ModalSupervisor/ModalCreditProposal";
import ModalFinancialReport from "./ModalSupervisor/ModalFinancialReport";
import ModalPrevicualizarIGR from "../4_InformeGestionReforzado/FormularioIGR/previsualizarIGR";
import ModalPrevisualizarPropCred from "../5_PropuestaCredito/previsualizarPropCred";
import ModalPrevicualizarAIF from "../6_AnalisisCredito/previsualizarAIF";

import ModalEndProcess from "../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';

import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";
import PrevicualizarIGR from "../4_InformeGestionReforzado/FormularioIGR/previsualizarIGRcomponente";
import { Tab, Tabs } from "react-bootstrap";
import PrevisualizarPropCred from "../5_PropuestaCredito/previsualizarPropCredcomponente";
import PrevicualizarAIF from "../6_AnalisisCredito/previsualizarAIFcomponente";

import CheckListComponent from '../../../components/Common/CheckList';
import { AttachmentFileInputModel } from "../../../models/Common/AttachmentFileInputModel"

import ModalBitacora from "../../../components/Common/ModalBitacora";
import FinancialReportContent from "../6_AnalisisCredito/FinancialReportContent";

import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";

import { saveLogProcess } from "../../../helpers/logs_helper";
import LevelAutonomy from "../5_PropuestaCredito/Secciones/LevelAutonomy";

const SupervisorAnalisisCredito = props => {
  const history = useHistory();
  const location = useLocation()

  const { t, i18n } = useTranslation();

  const { selectedData } = location;
  const [ShowModelReportManagment, setShowModelReportManagment] = useState(false);
  const [ShowModelCreditProposal, setShowModelCreditProposal] = useState(false);
  const [ShowModelFinancialReport, setShowModelFinancialReport] = useState(false);
  const [ModalPrevisualizardata, settoogleModalPrevisualizar] = useState(false);
  const [ModalPrevisualizardataProp, settoogleModalPrevisualizarProp] = useState(false);

  const [mainDebtor, setmainDebtor] = useState(null);

  const [displayModal, setDisplayModal] = useState(false);

  const [locationData, setLocationData] = useState(null);
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());

  //Riesgo Ambiental
  const [environmentalRisk, setenvironmentalRisk] = useState(null);

  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);
  const [optionSelected, setoptionSelected] = useState(null);

  const [debtorId, setDebtorId] = useState(null);

  const [recommend, setRecommend] = useState(false);
  const [recommendTitle, setRecommendTitle] = useState('');
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
    loadEnvironmentalRisk(locationData.transactionId)
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

  function loadEnvironmentalRisk(transactionId) {
    // consultarDeudorPrincipal
    backendServices.consultEnvironmentalAspectsIGR(transactionId)
      .then((data) => {
        if (data !== undefined) {
          setenvironmentalRisk(data.environmentalAspectsDTO);
        }
      });
  }


  function toggleShowModelCreditProposal() {
    setShowModelCreditProposal(!ShowModelCreditProposal)
  }

  function toggleShowModelFinancialReport() {
    setShowModelFinancialReport(!ShowModelFinancialReport)
  }

  function toogleModalPrevisualizar() {
    settoogleModalPrevisualizar(!ModalPrevisualizardata);
    removeBodyCss()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function toogleModalPrevisualizarProp() {
    settoogleModalPrevisualizarProp(!ModalPrevisualizardataProp);
    removeBodyCss()
  }

  ////////// PARTE ES LA FINAL DEL PROCESO ///////
  //Modal Para mostrar Comentario de Fin de Proceso
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
    var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
    var infoBpmModel = new InfoBpmModel(
      locationData.infoBpmModel?.instanceId ?? locationData.instanceId,
      locationData.infoBpmModel?.transactId ?? locationData.transactionId,
      0, 0,
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
      case OPTs.PROCESS_SUPERVISORANALISISCREDITO: {
        infoBpmModel.processId = OPTs.PROCESS_SUPERVISORANALISISCREDITO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
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
      case OPTs.PROCESS_AUTONOMYCREDIT: { //camino feliz sin paralelos
        infoBpmModel.processId = OPTs.PROCESS_AUTONOMYCREDIT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        /*var values = null;
        if (locationData.creditRisk !== undefined && locationData.creditRisk === "comparalelo") {
          values = {
            "info": JSON.stringify(infoBpmModel),
            "processId": OPTs.PROCESS_AUTONOMY.toString(),
            "activityId": OPTs.ACT_NONE.toString(),
            "transactionId": locationData.transactionId,
            "requestId": locationData.requestId,
            "decision": "no",
          };
        }
        else if (locationData.environmentalRisk !== undefined && locationData.environmentalRisk === "comparalelo") {
          values = {
            "info": JSON.stringify(infoBpmModel),
            "processId": OPTs.PROCESS_AUTONOMY.toString(),
            "activityId": OPTs.ACT_NONE.toString(),
            "transactionId": locationData.transactionId,
            "requestId": locationData.requestId,
            "decision": "no",
          };
        }
        else {
          values = {
            "info": JSON.stringify(infoBpmModel),
            "processId": OPTs.PROCESS_AUTONOMY.toString(),
            "activityId": OPTs.ACT_NONE.toString(),
            "transactionId": locationData.transactionId,
            "requestId": locationData.requestId,
            "decision": "no",
          };
        }*/
        values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_AUTONOMYCREDIT.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "no",
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog2(OPTs.APPLICATION_STATUS_SUPA, t(recommendTitle));
              // saveAutoLog(null, '');
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

  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
  }

  async function saveAutoLog(APPLICATION_STATUS = null, observations = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_SUPERVISORANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_05)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    console.log({ log })
    saveLogProcess(log);
  }

  async function saveAutoLog2(APPLICATION_STATUS = null, observations = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_SUPERVISORANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_05)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations === null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    console.log({ log })
    saveLogProcess(log);
  }


  /*
  // Camino Feliz ... "dcreditoparalelo" = "sinparalelo" y "dambientalparalelo" = "sinparalelo" ... feliz
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"sinparalelo"
  };
  
  // Camino semi Feliz uno de los dos paralelos activos ... chequear (status ambiental paralelo activo no se puede avanzar) status="activo", statuscredito="activo"  ... feliz
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"no"
  };

  //Regresar por Ajustes a Analista ... 
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"si",          
    "regresar":"analista"
  };

  //Regresar por Ajustes a Ejecutivo ... 
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"si",          
    "regresar":"ejecutivo"
  };
  */

  function changeDebtor(debtorId) {
    setDebtorId(debtorId)
  }



  return (
    <React.Fragment>

      <div className="page-content">

        <Breadcrumbs title={props.t("CommercialCredit")} breadcrumbItem={props.t("CreditAnalysisSupervisor")} />

        <HorizontalSteeper processNumber={1} activeStep={3}></HorizontalSteeper>

        <Row>
          <Col md={3} style={{ textAlign: "left" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>

          </Col>
          <Col md={9} style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { setRecommend(false); onSaveProcess(OPTs.PROCESS_SUPERVISORANALISISCREDITO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { setRecommend(false); setoptionSelected(OPTs.PROCESS_ANALISISCREDITO); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToAnalyst")}</Button>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { setRecommend(false); setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button>
            <Button color="success" type="button" style={{ margin: '5px' }}
              onClick={() => { setRecommendTitle('NotRecommend'); setRecommend(true); showModalBitacora(); }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("NotRecommend")}</Button>
            <Button color="success" type="button" style={{ margin: '5px' }}
              onClick={() => { setRecommendTitle('Recommend'); setRecommend(true); showModalBitacora(); }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Recommend")}</Button>
          </Col>
        </Row>
        <Card>
          <CardHeader>
            <Row>
              <Col md={6}>
                <h4 className="card-title">{t("CreditAnalysisSupervisor")}</h4>
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
                    <PrevicualizarIGR supervisorPreview={true} />
                  </Tab>
                  <Tab className="m-4" key={2} eventKey={2} title={props.t("ConsultCreditProposal")}>
                    <PrevisualizarPropCred />
                  </Tab>
                  <Tab className="m-4" key={3} eventKey={3} title={props.t("Consultar información financiera")}>
                    <FinancialReportContent
                      changeDebtor={changeDebtor}
                      preview={true}

                    />
                  </Tab>
                  <Tab className="m-4" key={4} eventKey={4} title={props.t("CheckList")}>
                    {locationData ?
                      <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_ANLISIS, OPTs.ACT_NONE)} />
                      : null}
                  </Tab>
                </Tabs>
              </Col>
            </Row>
            {/* <Row>
              <div className="d-flex flex-row justify-content-between">
                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toogleModalPrevisualizar() }}>
                  {" "} {props.t("ConsultManagementReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toogleModalPrevisualizarProp() }}>
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
          <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_SUPERVISORANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_05)} />
          : null}

        <Row>
          <Col md={3} style={{ textAlign: "left" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>

          </Col>
          <Col md={9} style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { setRecommend(false); onSaveProcess(OPTs.PROCESS_SUPERVISORANALISISCREDITO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { setRecommend(false); setoptionSelected(OPTs.PROCESS_ANALISISCREDITO); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToAnalyst")}</Button>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { setRecommend(false); setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button>
            <Button color="success" type="button" style={{ margin: '5px' }}
              onClick={() => { setRecommendTitle('NotRecommend'); setRecommend(true); showModalBitacora(); }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("NotRecommend")}</Button>
            <Button color="success" type="button" style={{ margin: '5px' }}
              onClick={() => { setRecommendTitle('Recommend'); setRecommend(true); showModalBitacora(); }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Recommend")}</Button>
          </Col>
        </Row>

      </div>

      {locationData && displayModalBitacora ?
        <ModalBitacora
          recommend={recommend}
          recommendTitle={recommendTitle}
          logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_SUPERVISORANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_05)}
          successSaved={() => {
            onSaveProcess(optionSelected);
            recommend && onSaveProcess(OPTs.PROCESS_AUTONOMYCREDIT);

          }}
          isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
        : null}

      {/* <ModalPrevicualizarIGR isOpen={ModalPrevisualizardata} toggle={() => { toogleModalPrevisualizar() }} />
      <ModalPrevisualizarPropCred isOpen={ModalPrevisualizardataProp} toggle={() => { toogleModalPrevisualizarProp() }} /> */}
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

SupervisorAnalisisCredito.propTypes = {
  //    onSelectIdPropuesta: PropTypes.func.isRequired
  selectedIdPropuesta: PropTypes.any,
  // onClose: PropTypes.func.isRequired
}

export default (withTranslation()(SupervisorAnalisisCredito))
