import React, { useState, useEffect } from "react"
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation, withTranslation } from "react-i18next"
import * as url from "../../../helpers/url_helper"
import * as OPTs from "../../../helpers/options_helper";
import {
  Row,
  Col,
  Button,
  Card, CardHeader,
  CardBody,
  Table,
  CardFooter,
  Label
} from "reactstrap"
import LoadingOverlay from "react-loading-overlay"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import toastr from "toastr";
import "toastr/build/toastr.min.css"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"

import { BpmServices, BackendServices } from "../../../services";

// import ResultadosBusqueda from "./ResultadosBusqueda"
import ResultadosBusqueda from "../12_Abogado/PantallaDetalle/ResultadosBusqueda.js"
import PantallaInstructivo from "../14_AdminDesembolso/Desembolso/Instructivo/index.js"
import SweetAlert from "react-bootstrap-sweetalert";

import ModalEndProcess from "../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";

import AttachmentFileCore from "../../../components/Common/AttachmentFileCore";
import { AttachmentFileInputModel } from '../../../models/Common/AttachmentFileInputModel';
import CheckListComponent from '../../../components/Common/CheckList';

import { Tab, Tabs } from "react-bootstrap";

import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";
import Switch from "react-switch";

import { saveLogProcess } from "../../../helpers/logs_helper";
const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      No
    </div>
  );
};
const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      Si
    </div>
  );
};
const InboxPage = (props) => {
  toastr.options = {
    positionClass: 'toast-top-right',
    closeButton: true,
    progressBar: true,
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
    showDuration: '9599',
    hideDuration: '500995'
  }
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation()
  const [switch1, setswitch1] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina

  const [locationData, setLocationData] = useState(null);
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  //const [coreServices, setcoreServices] = useState(new CoreServices());

  const [mainDebtor, setmainDebtor] = useState(null);

  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

  const [signContractRow, setSignContractRow] = useState(false);

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
    loadSignContract(locationData.transactionId);
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

  async function saveSignContract(signContract) {
    var data = {
      "transactId": locationData.transactionId,
      "description": "",
      "date": signContractRow?.date ?? '',
      "signContract": signContract
    }

    setIsActiveLoading(true);
    !signContractRow && await backendServices.saveSignContract(data);
    signContractRow && await backendServices.updateSignContract(data);
    setIsActiveLoading(false);
    // loadSignContract(locationData.transactionId);
  }

  async function loadSignContract(transactionId) {
    var data = await backendServices.getSignContract(transactionId);
    if (data !== undefined) {
      setSignContractRow(data)
      console.log("🚀 ~ file: index.js ~ line 176 ~ loadSignContract ~ data", data)
      setswitch1(data.signContract);
    } else {
      setSignContractRow(undefined)
    }
  }

  async function checkToContinue() {
    setIsActiveLoading(true)
    //await guardarDatos();

    setTimeout(async function () {
      var data = await backendServices.getSignContract(locationData.transactionId);
      console.log("checkToContinue",data);
      if (data !== undefined) {
        saveJBPMProcess(OPTs.PROCESS_VALIDATEFILE);
      }
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
    setIsActiveLoading(false)
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
      case OPTs.PROCESS_SIGNCONTRACT: {
        infoBpmModel.processId = OPTs.PROCESS_SIGNCONTRACT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_SIGNCONTRACT.toString(),
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
            "requestId": locationData.requestId,
            "decision": switch1 ? "si" : "no"
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
        //  }
        //  else {
        //   var lInstructives = await backendServices.getDisbursementInstructive(locationData.transactionId)
        //   if (lInstructives !== undefined && lInstructives.length > 0) {
        //     var propuestaDG = await backendServices.consultGeneralDataPropCred(locationData.transactionId)
        //     if (propuestaDG !== undefined && propuestaDG.length > 0) {
        //       var lfacilities = await backendServices.consultarFacilidades(propuestaDG[0].requestId);
        //       if (lfacilities !== undefined && lfacilities.length > 0) {
        //         if (lInstructives.length <= lInstructives.length) {
        //           var values = {
        //             "info": JSON.stringify(infoBpmModel),
        //             "processId": OPTs.PROCESS_ADMINDISBURSEMENT.toString(),
        //             "activityId": OPTs.ACT_NONE.toString(),
        //             "transactionId": locationData.transactionId,
        //             "requestId": locationData.requestId,
        //             "decision": switch1 ? "si" : "no"
        //           };
        //           bpmServices.completedStatusTask(locationData.taskId, values)
        //             .then((data) => {
        //               if (data !== undefined) {
        //                 saveAutoLog();
        //                 history.push(url.URL_DASHBOARD);
        //               }
        //               else {
        //                 //Mensaje ERROR              
        //                 showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
        //               }
        //             });
        //         } else {
        //           toastr.error(t("There are still unsaved instructions"), t("Attention"));
        //         }
        //       } else {
        //         toastr.error(t("There are still unsaved instructions"), t("Attention"));
        //       }
        //     } else {
        //       toastr.error(t("There are still unsaved instructions"), t("Attention"));
        //     }
        //   } else {
        //     toastr.error(t("There are still unsaved instructions"), t("Attention"));
        //   }
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
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_LAWEYER, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_12)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }

  /*
  // Camino Feliz Firma Contrato... 
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"si"
  };
    
  //Requiere No Firma Contrato .. Termina Proceso
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"no"
  };
  */

  return (
    <React.Fragment>
      <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>
        <div className="page-content">

          <Breadcrumbs title={t("CommercialCredit")} breadcrumbItem={t("SignContract")} />

          <HorizontalSteeper processNumber={2} activeStep={4}></HorizontalSteeper>

          <Row>
            <Col md={6} style={{ textAlign: "left" }}>
              <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { onSaveProcess(OPTs.PROCESS_REFUSED) }}><i className="mdi mdi-cancel mid-12px"></i> {t("Rejected")}</Button>
            </Col>
            <Col md={6} style={{ textAlign: "right", marginTop: "10px" }}>
              <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_SIGNCONTRACT) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
              <Button color="success" type="button"
                onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
            </Col>
          </Row>
          <Card>
            <AvForm id="frmSearch" className="needs-validation" >
              <CardHeader>
                <Row>
                  <Col md={6}>
                    <h4 className="card-title">{t("SignContract")}</h4>
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
                      <Col sm={12} style={{ textAlign: "right" }}>
                        <Label className="form-check-label">{t("Firmar Contrato")}</Label>
                      </Col>
                      <AvGroup check>
                        <Col sm={12} style={{ textAlign: "right" }}>
                          {'   '}
                          <Switch name="isProjectLocatedProtectedNaturalArea"
                            uncheckedIcon={<Offsymbol />}
                            checkedIcon={<OnSymbol />}
                            onColor="#007943"
                            id="check1"
                            className="form-label"
                            onChange={(e) => {
                              // if (!switch1) {
                              // }
                              
                              saveSignContract(!switch1);
                              setswitch1(!switch1);
                            }}
                            checked={switch1}
                          />

                        </Col>
                      </AvGroup>
                    </Row>
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <Row>
                  <Col md="12">
                    <Tabs defaultActiveKey="1" id="uncontrolled-tab-example" className="mb-3">
                      <Tab className="m-4" key={1} eventKey={1} title={props.t("LegalDocumentation")}>
                        {<ResultadosBusqueda />}
                      </Tab>
                      <Tab className="m-4" key={2} eventKey={2} title={props.t("CheckList")}>
                        {locationData ?
                          <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_FORMALIZACION, OPTs.ACT_NONE)} />
                          : null}
                      </Tab>
                      <Tab className="m-4" key={3} eventKey={3} title={props.t("Attachments")}>
                        {locationData ?
                          <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_SIGNCONTRACT, OPTs.ACT_NONE)} />
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
            </AvForm>

          </Card>
         
          {locationData ?
            <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_SIGNCONTRACT, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_13)} />
            : null}

          <Row>
            <Col md={6} style={{ textAlign: "left" }}>
              <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { onSaveProcess(OPTs.PROCESS_REFUSED) }}><i className="mdi mdi-cancel mid-12px"></i> {t("Rejected")}</Button>
            </Col>
            <Col md={6} style={{ textAlign: "right", marginTop: "10px" }}>
              <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_SIGNCONTRACT) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
              <Button color="success" type="button"
                onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
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
      </LoadingOverlay>
    </React.Fragment >
  );

}


export default (withTranslation()(InboxPage));
