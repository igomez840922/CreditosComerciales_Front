/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import * as url from "../../../../../helpers/url_helper"
import * as OPTs from "../../../../../helpers/options_helper";

import { Link } from "react-router-dom"

import {
  Card, CardHeader,
  CardBody,
  Col,
  Button,
  CardFooter,
  Row,
  Alert,
} from "reactstrap"
import { Tabs, Tab } from 'react-bootstrap';

//Import Breadcrumb
import Breadcrumbs from "../../../../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"

import DatosGenerales from "./DatosGenerales"
import ModalCreacionLinea from "./modalCreacionLinea"
import DatosGeneralesBL from "./DatosGenerales2"
import SweetAlert from "react-bootstrap-sweetalert"

import { BackendServices, CoreServices, BpmServices } from "../../../../../services";

import { AvForm, AvField } from "availity-reactstrap-validation"
import { useTranslation } from "react-i18next"
import LoadingOverlay from "react-loading-overlay"

import ModalEndProcess from "../../../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../../components/LogProcess/index";
import ModalPrevicualizarIGR from "../../../4_InformeGestionReforzado/FormularioIGR/previsualizarIGR";
import ModalPrevisualizarPropCred from "../../../5_PropuestaCredito/previsualizarPropCred";
import ModalPrevicualizarAIF from "../../../6_AnalisisCredito/previsualizarAIF";


import HorizontalSteeper from "../../../../../components/Common/HorizontalSteeper";
import { LineUtil } from "leaflet";

import { saveLogProcess } from "../../../../../helpers/logs_helper";


import CheckListComponent from '../../../../../components/Common/CheckList';
import { AttachmentFileInputModel } from "../../../../../models/Common/AttachmentFileInputModel"
import ModalBitacora from "../../../../../components/Common/ModalBitacora";
import Horarios from "./horarios";
import CreditLine from "./CreditLine";

//Chequear pq hay que hacer dos pantallas para mostrar instructivo

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
const S_seccions = {
  "backgroundColor": "#eee",
  "color": '#187055',
  "padding": '2px',
  "borderRadius": '2px',
  "fontSize": '18px',
  "display": 'flex',
  "justifyContent": 'center',
};
const PantallaBusqueda = props => {
  const { t, i18n } = useTranslation();

  const history = useHistory();
  const location = useLocation()

  const [instructiveType, setinstructiveType] = useState(null);
  const [facilityId, setfacilityId] = useState(null);
  const [tabsFacility, settabsFacility] = useState(null);
  const [Facility, setFacility] = useState(null);
  const [datosUsuario, setdatosUsuario] = useState(null);
  const [isActiveLoading, setIsActiveLoading] = useState(true);
  const [facilityType, setfacilityType] = useState(null);
  const [ShowModelCreditProposal, setShowModelCreditProposal] = useState(false);
  const [ShowModelFinancialReport, setShowModelFinancialReport] = useState(false);
  const [ModalPrevisualizardata, settoogleModalPrevisualizar] = useState(false);
  const [ModalPrevisualizardataProp, settoogleModalPrevisualizarProp] = useState(false);
  ///////
  const [locationData, setLocationData] = useState(null);
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  //const [coreServices, setcoreServices] = useState(new CoreServices());

  const [mainDebtor, setmainDebtor] = useState(null);
  const [DeshabilitarSelect, setDeshabilitarSelect] = useState(false);

  const [showModalCreacionLinea, setshowModalCreacionLinea] = useState(false);
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });
  const [msgDataND, setmsgDataND] = useState({ show: false, msg: "", isError: false });

  const [optionSelected, setoptionSelected] = useState(null);
  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);

  const [disbursementInstructionNumber, setDisbursementInstructionNumber] = useState(undefined)
  const [modalCreacionLinea, setmodalCreacionLinea] = useState(false);
  const[ejecutarDesembolso,setejecutarDesembolso] = useState(props!==undefined && props.ejecutarDesembolso!==undefined?props.ejecutarDesembolso:true)

  //On Mounting (componentDidMount)
  React.useEffect(() => {

    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
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
    if (locationData.processId == "450") {
      setDeshabilitarSelect(true)
    }
    setTimeout(() => {
      if (locationData.processId == "450") {
        document.querySelectorAll('input').forEach(function (item) {
          item.setAttribute("disabled", "disabled");
        });
        document.querySelectorAll('textarea').forEach(function (item) {
          item.setAttribute("disabled", "disabled");
        });
      }
    }, 2000);
    //chequear si la tarea no ha sido iniciada
    bpmServices.checkAndStartTask(locationData)
      .then((iniresult) => {
        if (iniresult === false) {
          history.push(url.URL_DASHBOARD);
        }
      })

    loadUserProspect(locationData.transactionId)
    // Read Api Service data
    loadData(locationData)
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


  function loadData(data) {
    setIsActiveLoading(true);
    Promise.allSettled([
      backendServices.consultPrincipalDebtor(data.transactionId),
      backendServices.consultGeneralDataPropCred(data.transactionId),
      backendServices.retrieveFacilityType()
    ]).then(data => {
      const [{ value: PrincipalDebtor }, { value: GeneralDataPropCred }, { value: FacilityType }] = data;

      setdatosUsuario(PrincipalDebtor)

      backendServices.consultarFacilidades(GeneralDataPropCred[0].requestId).then(resp => {
        resp = resp.filter($$ => $$.debtor != '  ' && $$.facilityTypeId != " ").filter($$ => $$.proposalTypeId !== "MEN");
        if (resp.length > 0) {
          setFacility(resp);
          setinstructiveType(resp[0].debtor)
          setfacilityId(resp[0].facilityId)
          setfacilityType(resp[0]);
          settabsFacility(resp.map((items, index) => (
            <Tab className="m-0" key={index} eventKey={index} title={FacilityType.find($$ => $$.id === items.facilityTypeId).description}></Tab>
          )));
        }
        setIsActiveLoading(false)
      }).catch(err => {
        console.log(err);
        setIsActiveLoading(false)
      });

    }).catch(err => {
      setIsActiveLoading(false)
    })
  }

  function handleSelect(e) {
    let data = Facility.at(e);
    setfacilityType(data);
    setinstructiveType(data.debtor)
    setfacilityId(data.facilityId)
  }

  async function onSaveData(option, values = null) {
    return new Promise(async (resolve, reject) => {

      if (!disbursementInstructionNumber || disbursementInstructionNumber === ' ') {
        backendServices.saveDisbursementInstructiveByFacility(values).then(resp => {
          resolve();
          if (resp.status.statusCode == 200) {
            setDisbursementInstructionNumber(resp.disbursementInstructionNumber)
            //setsuccessSave_dlg(true)
          } else {
            showMessage({ msg: t("ErrorSaveMessage"), show: true, error: true })
          }
          return;
        }).catch(err => {
          resolve();
          showMessage({ msg: t("ErrorSaveMessage"), show: true, error: true })
        });
      } else {
        backendServices.updateDisbursementInstructiveByFacility({ ...values, status: true }).then(resp => {
          resolve();
          if (resp.statusCode == 200) {
            //setsuccessSave_dlg(true)
          } else {
            showMessage({ msg: t("ErrorSaveMessage"), show: true, error: true })
          }
          return;
        }).catch(err => {
          resolve();
          showMessage({ msg: t("ErrorSaveMessage"), show: true, error: true })
        });
      }
    })
  }

  ////////////////////
  async function checkToContinue() {

    //await guardarDatos();
    var lInstructives = await backendServices.getDisbursementInstructive(locationData.transactionId)
    if (lInstructives !== undefined && lInstructives.length > 0) {
      var propuestaDG = await backendServices.consultGeneralDataPropCred(locationData.transactionId)
      if (propuestaDG !== undefined && propuestaDG.length > 0) {
        var lfacilities = await backendServices.consultarFacilidades(propuestaDG[0].requestId);
        lfacilities = lfacilities.filter($$ => $$.debtor != '  ' && $$.facilityTypeId != " ").filter($$ => $$.proposalTypeId !== "MEN");
        if (lfacilities !== undefined && lfacilities.length > 0) {
          if (lfacilities.length <= lInstructives.length) {

            saveJBPMProcess(OPTs.PROCESS_GUARANTEE);
            return;
          }
        }
      }
    }

    showMessage({ msg: t("Debe Guardar todos los desembolsos antes de continuar"), show: true, error: true })

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

    var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
    var infoBpmModel = new InfoBpmModel(locationData.instanceId, locationData.transactionId,
      OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT, OPTs.ACT_NONE,
      maindebtor?.personId
    );
    infoBpmModel.personName = maindebtor !== undefined ? (maindebtor.typePerson == "2" ? maindebtor.name : (maindebtor.name + " " + maindebtor.name2 + " " + maindebtor.lastName + " " + maindebtor.lastName2)) : "";

    console.log("saveJBPMProcess", option);

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
      case OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT: {
        infoBpmModel.processId = OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT.toString(),
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
      case OPTs.PROCESS_GUARANTEE: {
        infoBpmModel.processId = OPTs.PROCESS_GUARANTEE;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_GUARANTEE.toString(),
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
      case OPTs.PROCESS_SIGNCONTRACT: {
        infoBpmModel.processId = OPTs.PROCESS_SIGNCONTRACT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_SIGNCONTRACT.toString(),
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
  function toogleModalPrevisualizarProp() {
    settoogleModalPrevisualizarProp(!ModalPrevisualizardataProp);
    removeBodyCss()
  }
  function toggleShowModelFinancialReport() {
    setShowModelFinancialReport(!ShowModelFinancialReport)
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function toogleModalPrevisualizar() {
    settoogleModalPrevisualizar(!ModalPrevisualizardata);
    removeBodyCss()
  }

  async function saveAutoLog(APPLICATION_STATUS = null, observations = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_15)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }
  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
  }



  return (
    <React.Fragment>
      {ejecutarDesembolso===false ? null :
        <>
          <style scoped jsx>{`
      .nav-item{

          margin-top: 1px;

        }
    `}</style>
        </>
      }
      <div className={ejecutarDesembolso===false ? "" : "page-content"}>

      {ejecutarDesembolso===false ? null :
          <>
            <Breadcrumbs title={t("CommercialCredit")} breadcrumbItem={t("DisbursementInstructions")} />
            {locationData != null ?
              <HorizontalSteeper processNumber={3} activeStep={1}></HorizontalSteeper>
              : null}
            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={4} style={{ textAlign: "left" }}>
                {locationData != null ?
                  <>
                    <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { onSaveProcess(OPTs.PROCESS_CANCELPROCESS) }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
                    <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_SIGNCONTRACT); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>
                  </>
                  : null}
              </Col>
              <Col md={8} style={{ textAlign: "right", marginTop: "10px" }}>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(Number(OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT)) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                {/* <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_SIGNCONTRACT) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button> */}
                <Button color="success" type="button"
                  onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
              </Col>
            </Row>
          </>
        }
        <Card>

        {/*LINEAS DE DESEMBOLSDOD */}
        {props.adminDesembolso===false?
         <React.Fragment>
         <CardHeader>
           <Row>
             <Col md={6}>
               <h4 className="card-title">{t("Líneas de Créditos")}</h4>
             </Col>
             {ejecutarDesembolso===false ? null :
               <>
                 <Col md={6}>
                   <Row>
                     <Col sm={12} style={{ textAlign: "right" }}>
                       <h5 className="card-title title-header">{mainDebtor != null ? (mainDebtor.typePerson === "1" ? (mainDebtor.name + " " + mainDebtor.name2 + " " + mainDebtor.lastName + " " + mainDebtor.lastName2) : (mainDebtor.name)) : ""} </h5>
                     </Col>
                     <Col sm={12} style={{ textAlign: "right" }}>
                    </Col>
                   </Row>
                 </Col>
               </>
             }
           </Row>
         </CardHeader>
         <CardBody>           
           <CreditLine />
         </CardBody>

         </React.Fragment>
         :null         
        }
        

          <CardHeader>
            <Row>
              <Col md={6}>
                <h4 className="card-title">{t("DisbursementInstructions")}</h4>
                <p className="card-title-desc">{t("This form is official and must be filled out correctly")}</p>
              </Col>
              {ejecutarDesembolso===false ? null :
                <>
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
                </>
              }
            </Row>
          </CardHeader>

          <CardBody>
          {ejecutarDesembolso===false ? null :
            <Row>
              <Col md="12">
                <Row>
                  <div className="d-flex flex-row justify-content-between mb-4">
                    {/* <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toogleModalPrevisualizar() }}>
                      {" "} {props.t("ConsultManagementReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                    <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toogleModalPrevisualizarProp() }}>
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

                    {/* <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelFinancialReport() }}>
                      {" "} {props.t("ConsultFinancialReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button> */}
                  </div>
                </Row>
              </Col>
            </Row>
          }
          
            <Row>
              <Col md="12">
                <span className="mb-3" style={S_seccions}>{t("Instructivos")}</span>
              </Col>
            </Row>

            {tabsFacility != null ?
              <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-4" onSelect={(e) => { handleSelect(e) }}>
                {tabsFacility}
              </Tabs>
              : <Alert show="true" variant="warning" dismissible="true" onClose={() => { setmsgDataND({ show: false, msg: "", isError: false }) }}>
                {t("No facilities")}
              </Alert>}

            {facilityType &&
              <DatosGenerales
                firmarcontrato={props!==undefined && props.firmarcontrato!==undefined?props.firmarcontrato:false}
                adminDesembolso={props!==undefined && props.adminDesembolso!==undefined?props.adminDesembolso:false}
                ejecutarDesembolso={props!==undefined && ejecutarDesembolso!==undefined?ejecutarDesembolso:false}
                facilityId={facilityId}
                facilityType={facilityType}
                DeshabilitarSelect={DeshabilitarSelect}
                instructiveType={instructiveType}
                onSaveProcess={onSaveData}
                disbursementInstructionNumber={disbursementInstructionNumber}
                setDisbursementInstructionNumber={setDisbursementInstructionNumber}
              />}

            

          </CardBody>

        </Card>

        {ejecutarDesembolso===false ? null :
          <>
            {locationData ?
              <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_DESEMBOLSO, OPTs.ACT_NONE)} />
              : null}
          </>
        }

        {ejecutarDesembolso===false ? null:
          <>
            {locationData ?
              <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_14)} />
              : null}

            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={4} style={{ textAlign: "left" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { onSaveProcess(OPTs.PROCESS_CANCELPROCESS) }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
                <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_SIGNCONTRACT); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>
              </Col>
              <Col md={8} style={{ textAlign: "right", marginTop: "10px" }}>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(Number(OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT)) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                {/* <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_SIGNCONTRACT) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button> */}
                <Button color="success" type="button"
                  onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
              </Col>
            </Row>
          </>
        }
        <ModalEndProcess onSaveEndProcess={onSaveEndProcess} isOpen={displayModalEndProcess} toggle={() => { showModalEndProcess(false) }} />
        {/* <ModalPrevicualizarIGR isOpen={ModalPrevisualizardata} toggle={() => { toogleModalPrevisualizar() }} />
        <ModalPrevisualizarPropCred isOpen={ModalPrevisualizardataProp} toggle={() => { toogleModalPrevisualizarProp() }} /> */}
        {/* <ModalPrevicualizarAIF isOpen={ShowModelFinancialReport} toggle={() => { toggleShowModelFinancialReport() }} /> */}
        {
          messageDlg && messageDlg.show ? (
            <SweetAlert
              type={messageDlg.error ? "error" : "success"}
              confirmButtonText={t("Confirm")}
              cancelButtonText={t("Cancel")}
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

    </React.Fragment >
  )
}

PantallaBusqueda.propTypes = {
  // selectedId: PropTypes.any,
  // onClose: PropTypes.func.isRequired
}

export default (withTranslation()(PantallaBusqueda))
