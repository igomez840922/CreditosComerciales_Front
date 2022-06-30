import React, { useEffect, useState, useRef } from "react"
import { useLocation, useHistory, Link } from 'react-router-dom'
import * as url from "../../../helpers/url_helper"
import * as OPTs from "../../../helpers/options_helper"
import {
  Row,
  Col,
  Button,
  Card,
  CardBody, CardHeader, CardFooter
} from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import SweetAlert from "react-bootstrap-sweetalert"
import LoadingOverlay from "react-loading-overlay"
import { BackendServices, CoreServices, BpmServices, } from "../../../services";

import { useTranslation, withTranslation } from "react-i18next"
import Analisis from "./riesgoCredito/Analisis"
import FormConclusiones from "./riesgoCredito/Conclusiones"
import ShortLongTermDebts from "../../../components/Common/ShortLongTermDebts";
import Guarantees from "../../../components/InformeFinanciero/background/Guarantees";
import AccountMovementsHistory from "../../../components/Common/AccountMovementsHistory";

import { CorporateExposure, CorporateExposureClient } from "../../../components/PropuestaCreditoComercial"

import ModalReportingServices from '../../../components/InformeFinanciero/ModalReportingServices';

import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";
import ModalPrevicualizarAIF from "../6_AnalisisCredito/previsualizarAIF"
import ModalPrevicualizarIGR from "../4_InformeGestionReforzado/FormularioIGR/previsualizarIGR"
import ModalPrevisualizarPropCred from "../5_PropuestaCredito/previsualizarPropCred";

import { saveLogProcess } from "../../../helpers/logs_helper";

import CheckListComponent from '../../../components/Common/CheckList';
import { AttachmentFileInputModel } from "../../../models/Common/AttachmentFileInputModel"
import ExposicionCorportativa from "../5_PropuestaCredito/Secciones/ExposicionCorporativa"
import ExposicionCorporativaClientes from "../5_PropuestaCredito/Secciones/ExposicionCorporativaCliente"
import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';

const RiesgoCreditoDetalle = (props) => {

  const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina
  const history = useHistory();
  const location = useLocation();
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");

  const [estado, setestado] = useState(false)
  const [context, setContext] = useState({});

  const [locationData, setLocationData] = useState(null);
  const [modelo, setmodelo] = useState({
    dataAspectosAmbientales: {
      transactId: 0,
      riskPreClassification: null,
      sustainableCreditRating: "2",
      riskClassificationConfirmation: null,
      natureLocationProject: false,
      physicalResettlement: false,
      environmentalPermits: false,
      newProject: false,
      tipo: false,
      workersContractors: false
    },
    datosGenerales: {
      codigoTipoIdentificacion: null,
      numeroCliente: null,
      primerNombre: null,
      segundoNombre: null,
      primerApellido: null,
      segundoApellido: null,
      numeroIdentificacion: null,
      transactId: 0,
      economicGroup: {
        code: "",
        name: ""
      },
      economicActivity: {
        code: "",
        name: ""
      },
      subeconomicActivity: {
        code: "",
        name: ""
      },
      bank: {
        code: "",
        name: ""
      },
    }
  });

  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  //const [coreServices, setcoreServices] = useState(new CoreServices());

  const { t, i18n } = useTranslation();

  // Component Refs
  const formConclusionesRef = useRef();

  const [mainDebtor, setmainDebtor] = useState(null);


  const [displayModalReportingServices, setDisplayModalReportingServices] = useState(false);

  const [ShowModelReportManagment, setShowModelReportManagment] = useState(false);
  const [ShowModelCreditProposal, setShowModelCreditProposal] = useState(false);
  const [ShowModelFinancialReport, setShowModelFinancialReport] = useState(false);

  React.useEffect(() => {
    console.log("useEffect", location.data);
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

    backendServices.consultPrincipalDebtor(locationData.transactionId).then(resp => {
      setmainDebtor(resp)
    })
  }

  function toggleReportingServices() {
    setDisplayModalReportingServices(!displayModalReportingServices);
  }


  function handleSave() {
    /* ---------------------------------------------------------------------------------------------- */
    /*                   Aqui se debe de realizar la decision o continuar el proceso                  */
    /* ---------------------------------------------------------------------------------------------- */
    formConclusionesRef.current.submit();
    history.push(url.URL_DASHBOARD);
  }
  function handleClose() {
    /* ---------------------------------------------------------------------------------------------- */
    /*           Verificar si toca culminar el proceso o solo salir a la bandeja de entrada           */
    /* ---------------------------------------------------------------------------------------------- */
    history.push(url.URL_DASHBOARD);
  }

  function submitData(tipo = false) {
    formConclusionesRef.current.submit();
    /*setTimeout(() => {      
      if (!formConclusionesRef.current.getFormValidation()) {
        setIsActiveLoading(true);         
        seterror_dlg(false)
        return false;
      }
    }, 2500);*/
    if (tipo) {
      saveJBPMProcess(OPTs.OPT_SALVAFULL)
    }
  }

  async function saveJBPMProcess(option,data = null) {

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
        bpmServices.abortProcess(locationData.instanceId)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog(OPTs.APPLICATION_STATUS_CANC, "");
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("TheProcessCouldNotFinish"));
              seterror_dlg(false);
            }
          });
        break;
      }
      case OPTs.OPT_SALVAPARCIAL: {
        infoBpmModel.processId = OPTs.PROCESS_PROPUESTACREDITO;
        infoBpmModel.activityId = OPTs.ACT_NONE;
        var values = {
          "info": JSON.stringify(infoBpmModel),
           "processId": OPTs.PROCESS_PROPUESTACREDITO.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          //"decision":"no"          
        };
        bpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            if (data !== undefined) {
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("ErrorSaveMessage"));
              seterror_dlg(false);
            }
          });
        break;
      }
      case OPTs.OPT_SALVAFULL: { //Enviar a Analisis de Credito
        infoBpmModel.processId = OPTs.PROCESS_AUTONOMYCREDIT;
        infoBpmModel.activityId = OPTs.ACT_NONE;
        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_AUTONOMYCREDIT.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "status": "completo",
          "id": locationData.instanceId
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog();
              history.push(url.URL_DASHBOARD);
            }
            else {
              seterror_msg(t("ErrorSaveMessage"));
              seterror_dlg(false);
            }
          });
        break;
      }
    }
  }


  function toggleShowModelCreditProposal() {
    setShowModelCreditProposal(!ShowModelCreditProposal)
    removeBodyCss()
  }
  function toogleModalPrevisualizarIGR() {
    setShowModelReportManagment(!ShowModelReportManagment);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function toggleShowModelFinancialReport() {
    setShowModelFinancialReport(!ShowModelFinancialReport)
  }

  async function saveAutoLog(APPLICATION_STATUS = null, observations = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_CREDITRISK, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_08)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = t("ActivityHasBeenFinishedSuccessfully")
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = "LISTO";
    saveLogProcess(log);
  }

  return (

    <React.Fragment>
      {locationData !== null && locationData !== undefined ?

        <div className="page-content">

          <Breadcrumbs title={t("Commercial Credit")} breadcrumbItem={t("CreditRisk")} />
          <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>

            <Row className="my-2">
              <Col xl="12 text-end">
                <Button id="btnClose" color="danger" type="button" style={{ margin: '5px' }} onClick={handleClose}>
                  <i className="mdi mdi mdi-cancel mid-12px"></i>
                  {" "} {t("Close")}
                </Button>
                <Button id="btnSubmit" color="primary" type="button" style={{ margin: '5px' }}
                  onClick={() => { submitData(true); }}>
                  <i className="mdi mdi-content-save mdi-12px"></i>
                  {" "}{t("Continue")}
                </Button>

              </Col>
            </Row>

            <Card>

              <CardHeader>
                <Row>
                  <Col md={6}>
                    <h4 className="card-title">{t("CreditRisk")}</h4>
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

                <Row className="my-2">
                  <Col xl="12 text-end">
                    <Button id="btnSubmit" color="success" type="button" style={{ margin: '5px' }}
                      onClick={toggleReportingServices}>
                      {t("Reporting Services")}
                    </Button>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div className="d-flex flex-row justify-content-between mb-4">
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
                      {/* <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelFinancialReport() }}>
                        {" "} {t("ConsultFinancialReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button> */}
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
                  </Col>
                </Row>

                {mainDebtor && locationData ? //clientDocId
                  <>
                    <ExposicionCorportativa transactId={locationData.transactionId} title={t("CorporateExhibition")} customerNumberT24={mainDebtor?.customerNumberT24} />

                    <ExposicionCorporativaClientes title={t("CorporateExhibitionClient")} customerNumberT24={mainDebtor?.customerNumberT24} />


                    <Guarantees customerNumberT24={mainDebtor.customerNumberT24} preview={true} />

                    <AccountMovementsHistory transactionId={locationData?.transactionId ?? 0} customerNumberT24={mainDebtor.customerNumberT24} />
                  </>
                  : null}

                <FormConclusiones ref={formConclusionesRef} locationData={locationData} onSaveSuccess={() => { saveJBPMProcess(OPTs.OPT_SALVAFULL) }} />

              </CardBody>

              {locationData ?
                <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_CREDITO, OPTs.ACT_NONE)} />
                : null}

              <CardFooter>


              </CardFooter>
              {/*<CardBody>
                  <Row>
                    <Col xl="12">
                      <Analisis locationData={locationData}/>
                    </Col>
                  </Row>
      </CardBody>*/}
            </Card>

          </LoadingOverlay>

          {locationData ?
            <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_CREDITRISK, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_08)} />
            : null}

          <Row className="my-2">
            <Col xl="12 text-end">
              <Button id="btnClose" color="danger" type="button" style={{ margin: '5px' }} onClick={handleClose}>
                <i className="mdi mdi mdi-cancel mid-12px"></i>
                {" "} {t("Close")}
              </Button>
              <Button id="btnSubmit" color="primary" type="button" style={{ margin: '5px' }}
                onClick={() => { submitData(); }}>
                <i className="mdi mdi-content-save mdi-12px"></i>
                {" "}{t("Continue")}
              </Button>

            </Col>
          </Row>


          {/* <ModalPrevicualizarAIF isOpen={ShowModelFinancialReport} toggle={() => { toggleShowModelFinancialReport() }} /> */}
          {/* <ModalPrevicualizarIGR isOpen={ShowModelReportManagment} toggle={() => { toogleModalPrevisualizarIGR() }} />
          <ModalPrevisualizarPropCred isOpen={ShowModelCreditProposal} toggle={() => { toggleShowModelCreditProposal() }} /> */}



          {successSave_dlg ? (
            <SweetAlert
              success
              title={t("SuccessDialog")}
              confirmButtonText={t("Confirm")}
              cancelButtonText={t("Cancel")}
              onConfirm={() => {
                setsuccessSave_dlg(false)
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
        </div>
        : null}

      {displayModalReportingServices ?
        <ModalReportingServices isOpen={displayModalReportingServices} toggle={toggleReportingServices} />
        : null}
    </React.Fragment>
  );

}


export default (withTranslation()(RiesgoCreditoDetalle));
