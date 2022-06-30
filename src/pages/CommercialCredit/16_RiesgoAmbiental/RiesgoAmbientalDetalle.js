import React, { useEffect, useState, useRef } from "react"
import { translationHelpers } from "../../../helpers"
import { useLocation, useHistory, Link } from 'react-router-dom'
import * as url from "../../../helpers/url_helper"
import RiesgoAmbientalContext from './RiesgoAmbientalContext'
import * as OPTs from "../../../helpers/options_helper"
import {
  Row,
  Col,
  Button,
  Card, CardHeader,
  CardBody,
  CardFooter
} from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import FormAspectosAmbientales from "./riesgoAmbiental/FormAspectosAmbientales"
import FormDetalles from "./riesgoAmbiental/FormDetalles"
import AspectosAmbientales from "../4_InformeGestionReforzado/FormularioIGR/Secciones/AspectosAmbientales"
import ServicioRiesgoAmbiental from "../../../services/RiesgoAmbiental/RiesgoAmbiental"
import SweetAlert from "react-bootstrap-sweetalert"
import LoadingOverlay from "react-loading-overlay"
import { BackendServices, CoreServices, BpmServices, } from "../../../services";

import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";

import ModalPrevisualizarPropCred from '../../../pages/CommercialCredit/5_PropuestaCredito/previsualizarPropCred';
import ModalPrevicualizarIGR from "../../../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/previsualizarIGR";
import moment from "moment"
import { saveLogProcess } from "../../../helpers/logs_helper";


import CheckListComponent from '../../../components/Common/CheckList';
import { AttachmentFileInputModel } from "../../../models/Common/AttachmentFileInputModel"

const RiesgoAmbientalDetalle = (props) => {
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
      workersContractors: false,
      legalInvestigation: ""
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

  const [n, t, c, tr] = translationHelpers('navigation', 'commercial_credit', 'common', 'translation');
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  //const [coreServices, setcoreServices] = useState(new CoreServices());

  const [mainDebtor, setmainDebtor] = useState(null);

  const [showModalCreditProposal, setshowModalCreditProposal] = useState(false);
  const [showModalIGR, setshowModalIGR] = useState(false);
  const [reputationResearch, setReputationResearch] = useState('');


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

    backendServices.consultGeneralDataIGR(locationData.transactionId).then(resp => {
      console.log("consultGeneralDataIGR", resp);
      modelo.datosGenerales.codigoTipoIdentificacion = resp.identificationType
      modelo.datosGenerales.economicGroup.code = resp.economicGroup.code;
      modelo.datosGenerales.economicGroup.name = resp.economicGroup.name;
      modelo.datosGenerales.economicActivity.code = resp.economicActivity.code;
      modelo.datosGenerales.economicActivity.name = resp.economicActivity.name;
      modelo.datosGenerales.subeconomicActivity.code = resp.subeconomicActivity.code;
      modelo.datosGenerales.subeconomicActivity.name = resp.subeconomicActivity.name;
      modelo.datosGenerales.bank.code = resp.bank.code;
      modelo.datosGenerales.bank.name = resp.bank.name;
      setmodelo(modelo);
    }).catch((error) => {

    });
    backendServices.consultEnvironmentalAspectsIGR(locationData.transactionId).then(resp => {
      if (resp !== undefined) {
        console.log(resp)
        modelo.dataAspectosAmbientales.transactId = locationData.transactionId;
        modelo.dataAspectosAmbientales.riskPreClassification = resp.environmentalAspectsDTO.riskPreClassification;
        modelo.dataAspectosAmbientales.sustainableCreditRating = resp.environmentalAspectsDTO.sustainableCreditRating;
        modelo.dataAspectosAmbientales.riskClassificationConfirmation = resp.environmentalAspectsDTO.riskClassificationConfirmation;
        modelo.dataAspectosAmbientales.natureLocationProject = resp.environmentalAspectsDTO.natureLocationProject;
        modelo.dataAspectosAmbientales.physicalResettlement = resp.environmentalAspectsDTO.physicalResettlement;
        modelo.dataAspectosAmbientales.environmentalPermits = resp.environmentalAspectsDTO.environmentalPermits;
        modelo.dataAspectosAmbientales.newProject = resp.environmentalAspectsDTO.newProject;
        modelo.dataAspectosAmbientales.workersContractors = resp.environmentalAspectsDTO.workersContractors;
        modelo.dataAspectosAmbientales.complianceDate = resp.environmentalAspectsDTO.complianceDate;
        modelo.dataAspectosAmbientales.legalInvestigation = resp.environmentalAspectsDTO.legalInvestigation;
        setestado(true)
        setmodelo(modelo);
      }
    });
  }
  // Component Refs
  const aspectosAmbientalesRef = useRef();
  const formDetallesRef = useRef();

  function handleSave() {
    /* ---------------------------------------------------------------------------------------------- */
    /*                   Aqui se debe de realizar la decision o continuar el proceso                  */
    /* ---------------------------------------------------------------------------------------------- */
    aspectosAmbientalesRef.current.submit();
    formDetallesRef.current.submit();
    history.push(url.URL_DASHBOARD);
  }
  function handleClose() {
    /* ---------------------------------------------------------------------------------------------- */
    /*           Verificar si toca culminar el proceso o solo salir a la bandeja de entrada           */
    /* ---------------------------------------------------------------------------------------------- */
    history.push(url.URL_DASHBOARD);
  }
  function submitData(status = false) {
    console.log("submitData");
    if (!formDetallesRef.current.getFormValidation()) {
      formDetallesRef.current.validateForm();
      return false;
    }
    else {
      if (!aspectosAmbientalesRef.current.getFormValidation()) {
        aspectosAmbientalesRef.current.validateForm();
        return false;
      }
      formDetallesRef.current.dataReturn.transactId = Number(locationData.transactionId);
      const datos = formDetallesRef.current.dataReturn;
      console.log(formDetallesRef.current)
      const dataDetails = {
        "transactId": Number(locationData.transactionId),
        "environmentCovenant": datos.environmentCovenant ? datos.environmentCovenant : false,
        "detail": datos.detail ? datos.detail : "",
        "compliance": datos.compliance ? datos.compliance : "",
        "term": datos.term ? datos.term : "",
        "detected": datos.detected ? datos.detected : "",
        "recommendations": datos.recommendations ? datos.recommendations : "",
        "conclusions": datos.conclusions ? datos.conclusions : "",
        "complianceDate": formDetallesRef.current.fechaSet == "" || formDetallesRef.current.fechaSet == null ? formDetallesRef.current.fechaSet : moment(formDetallesRef.current.fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? formDetallesRef.current.fechaSet : (moment(formDetallesRef.current.fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD")),
        "legalInvestigation": datos.legalInvestigation ?? '',
      }
      if (formDetallesRef.current.fechaSet == " " && dataDetails.environmentCovenant == true) {
        setIsActiveLoading(false);
        return
      }
      backendServices.saveEnvironmentalRiskInfo(dataDetails)
        .then((result) => {
          console.log("saveEnvironmentalRiskInfo", result);
          if (result != undefined) {
            backendServices.saveEnvironmentalAspectsIGR(aspectosAmbientalesRef.current.dataReturn).then(result => {
              if (result != undefined) {
                if (status == true) {
                  history.push(url.URL_DASHBOARD);
                } else {
                  saveJBPMProcess(OPTs.OPT_SALVAFULL)
                }
                //terminamos el proceso                

              } else {
                seterror_dlg(false)
              }
              setIsActiveLoading(false);
            })
          } else {
            seterror_dlg(false)
            setIsActiveLoading(false);
          }

        });
    }
  }

  function saveJBPMProcess(option) {
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
        var values = {
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
        var values = {
          "processId": OPTs.PROCESS_ANALISISCREDITO.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "status": "completo",
          "id": locationData.instanceId
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog()
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

  async function saveAutoLog(APPLICATION_STATUS = null, observations = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_EVIROMENTRISK, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_07)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = t("ActivityHasBeenFinishedSuccessfully");
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = "LISTO";
    saveLogProcess(log);
  }
  //"status": "completo",

  return (
    <React.Fragment>
      {locationData !== null && locationData !== undefined ?
        <RiesgoAmbientalContext.Provider value={context}>

          <div className="page-content">
            {/* {t("ActivityHasBeenFinishedSuccessfully")} */}
            <Breadcrumbs title={n("Commercial Credit")} breadcrumbItem={n("Environmental Risk")} />
            <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>

              <Row className="my-2">
                <Col xl="12 text-end">
                  <Button id="btnClose" color="danger" type="button" style={{ margin: '5px' }} onClick={handleClose}>
                    <i className="mdi mdi mdi-cancel mid-12px"></i>
                    {" "} {c("Close")}
                  </Button>
                  <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => {
                    submitData(); setIsActiveLoading(true); setTimeout(() => {
                      submitData(true);
                      setTimeout(() => {
                        submitData(true);
                      }, 1000);
                    }, 1000);
                  }}><i className="mdi mdi-content-save-outline mid-12px"></i> {tr("Exit")}</Button>
                  <Button id="btnSubmit" color="success" type="button" style={{ margin: '5px' }}
                    onClick={() => {
                      submitData(); setIsActiveLoading(true); setTimeout(() => {
                        submitData();
                        setTimeout(() => {
                          submitData();
                        }, 1000);
                      }, 1000);
                    }}>
                    <i className="mdi mdi-content-save mdi-12px"></i>
                    {" "}{c("Continue")}
                  </Button>

                </Col>
              </Row>

              <Card>

                <CardHeader>
                  <Row>
                    <Col md={6}>
                      <h4 className="card-title">{n("Environmental Risk")}</h4>
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
                      {/* <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { setshowModalIGR(true) }}>
                        {" "} {t("ConsultManagementReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                      <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { setshowModalCreditProposal(true) }}>
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
                  </Row>


                </CardBody>

                <CardBody>
                  <AspectosAmbientales OPTs={OPTs.PROCESS_EVIROMENTRISK} setReputationResearch={setReputationResearch} reputationResearch={reputationResearch} activeTab="18" datosGenerales={modelo.datosGenerales} locationData={locationData} dataAspectosAmbientales={modelo.dataAspectosAmbientales} ref={aspectosAmbientalesRef} onSubmit={submitData} />

                  <FormDetalles ref={formDetallesRef} locationData={locationData} />

                </CardBody>

                {locationData ?
                  <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_RIESGOAMB, OPTs.ACT_NONE)} />
                  : null}
                <CardFooter>

                </CardFooter>
              </Card>



            </LoadingOverlay>

            {locationData ?
              <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_EVIROMENTRISK, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_07)} />
              : null}

            <Row className="my-2">
              <Col xl="12 text-end">
                <Button id="btnClose" color="danger" type="button" style={{ margin: '5px' }} onClick={handleClose}>
                  <i className="mdi mdi mdi-cancel mid-12px"></i>
                  {" "} {c("Close")}
                </Button>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => {
                  submitData(); setIsActiveLoading(true); setTimeout(() => {
                    submitData(true);
                    setTimeout(() => {
                      submitData(true);
                    }, 1000);
                  }, 1000);
                }}><i className="mdi mdi-content-save-outline mid-12px"></i> {tr("Exit")}</Button>
                <Button id="btnSubmit" color="success" type="button" style={{ margin: '5px' }}
                  onClick={() => {
                    submitData(); setIsActiveLoading(true); setTimeout(() => {
                      submitData();
                      setTimeout(() => {
                        submitData();
                      }, 1000);
                    }, 1000);
                  }}>
                  <i className="mdi mdi-content-save mdi-12px"></i>
                  {" "}{c("Continue")}
                </Button>

              </Col>
            </Row>

          </div>


          {/* <ModalPrevicualizarIGR isOpen={showModalIGR} toggle={() => { setshowModalIGR(!showModalIGR) }} />
          <ModalPrevisualizarPropCred isOpen={showModalCreditProposal} toggle={() => { setshowModalCreditProposal(!showModalCreditProposal) }} /> */}

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
        </RiesgoAmbientalContext.Provider>
        : null}
    </React.Fragment>
  );
}
export default RiesgoAmbientalDetalle;
