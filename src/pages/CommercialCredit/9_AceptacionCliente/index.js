/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types';
import { Link } from "react-router-dom"
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../../helpers/url_helper"
import * as OPTs from "../../../helpers/options_helper";

import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Row,
  Col,
  Label,
  CardHeader, Table
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

//i18n
import { useTranslation, withTranslation } from "react-i18next"

import SweetAlert from "react-bootstrap-sweetalert";

import Switch from "react-switch";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { Select } from 'antd';

import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import ModalTermsOfConditions from "./ModalAceptacionCliente/ModalTermsOfConditions";
import ModalPrevicualizarAIF from "../6_AnalisisCredito/previsualizarAIF";
import ModalPrevisualizarPropCred from "../5_PropuestaCredito/previsualizarPropCred";
import ModalPrevicualizarIGR from "../4_InformeGestionReforzado/FormularioIGR/previsualizarIGR";

import ModalEndProcess from "../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";

import AttachmentFileCore from "../../../components/Common/AttachmentFileCore";
import { AttachmentFileInputModel } from '../../../models/Common/AttachmentFileInputModel';
import { Tab, Tabs } from "react-bootstrap";
import PrevicualizarIGR from "../4_InformeGestionReforzado/FormularioIGR/previsualizarIGRcomponente";
import PrevisualizarPropCred from "../5_PropuestaCredito/previsualizarPropCredcomponente";
import PrevicualizarAIF from "../6_AnalisisCredito/previsualizarAIFcomponente";

import ModalBitacora from "../../../components/Common/ModalBitacora";
import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";
import moment from "moment";
import { saveLogProcess } from "../../../helpers/logs_helper";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

import { formatCurrency, translationHelpers } from '../../../helpers';
import ApiServiceCore from "../../../services/ApiServiceBpm";
import LoadingOverlay from "react-loading-overlay";
import CheckListComponent from '../../../components/Common/CheckList';
const Offsymbol = () => {
  const { Option } = Select;
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

const AutonomiaCredito = props => {

  const { t, i18n } = useTranslation();

  const history = useHistory();
  const location = useLocation()
  const [dataLocation, setdataLocation] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));

  const [ModalPrevisualizardata, settoogleModalPrevisualizar] = useState(false);
  const [ShowModelCreditProposal, setShowModelCreditProposal] = useState(false);
  const [ShowModelFinancialReport, setShowModelFinancialReport] = useState(false);
  const [ShowModelTermsOfConditions, setShowModelTermsOfConditions] = useState(false);
  const [ModalPrevisualizardataProp, settoogleModalPrevisualizarProp] = useState(false);

  const [acceptClient, setacceptClient] = useState(false);
  const [CustomerAcceptance, setCustomerAcceptance] = useState(null);

  const [locationData, setLocationData] = useState(null);
  const [personId, setpersonId] = useState(null);
  const [fechaSet, setfechaSet] = useState(null)
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());

  const [mainDebtor, setmainDebtor] = useState(null);

  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

  const [isValid, setisValid] = useState(false);
  const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina

  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);
  const [optionSelected, setoptionSelected] = useState(null);
  const [tariffRows, settariffRows] = useState([]);

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
    loadTariffData(locationData.transactionId);
  }

  function loadUserProspect(transactionId) {
    // consultarDeudorPrincipal
    backendServices.consultPrincipalDebtor(transactionId)
      .then((data) => {
        if (data !== undefined) {
          setmainDebtor(data);
          setpersonId(data.personId)
        }
        backendServices.getCustomerAcceptance(transactionId).then(resp => {
          if (resp !== undefined) {
            setacceptClient(resp.accept);
            setCustomerAcceptance(resp);
            setfechaSet(resp.date == "" || resp.date == null || resp.date == undefined ? null : moment(resp.date).format("DD-MM-YYYY"))
          } else {
            setfechaSet(" ")

          }
        }).catch(err => { });
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

  function toggleShowModelTermsOfConditions() {
    setShowModelTermsOfConditions(!ShowModelTermsOfConditions)
  }

  function toogleModalPrevisualizarProp() {
    settoogleModalPrevisualizarProp(!ModalPrevisualizardataProp);
    removeBodyCss()
  }

  function saveDataAcceptclient() {
    let form = document.getElementById('frmSearch');
    form.requestSubmit();
  }

  function handleSubmit(event, errors, values) {
    setisValid(false)
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    values.date = moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD"));

    let data = {
      transactId: locationData.transactionId,
      personId: personId,
      accept: acceptClient,
      date: values.date
    }

    backendServices.saveCustomerAcceptance(data).then(resp => {
      if (resp !== undefined) {
        //showMessage({ msg: t("Datahasbeensavedsuccessfully"), error: false, show: true });
        setisValid(true)
      } else {
        showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
      }
      loadUserProspect(locationData.transactionId)
    }).catch(err => {
      showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
    })
  }

  async function checkToContinue() {

    saveDataAcceptclient();
    setTimeout(async function () {

      // if (!isValid) {
      //   return;
      // }

      //chequear si ya tiene desicion del cliente
      var result = await backendServices.getCustomerAcceptance(locationData.transactionId);
      if (result === undefined) {
        showMessage({ msg: t("PleaseSaveDescicionBeforeContinue"), error: true, show: true });
        return;
      }
      if (result.accept === true) {
        var ldata = await backendServices.consultGeneralDataPropCred(locationData.transactionId);
        if (ldata !== undefined && ldata.length > 0) {
          //chequear si tiene fideicomiso
          var facilityList = await backendServices.consultarFacilidades(ldata[ldata.length - 1].requestId);
          var facility = facilityList.find(x => x.applyEscrow === true);
          if (facility !== undefined && facility !== null) {
            saveJBPMProcess(OPTs.PROCESS_ASIGNARNUMFIDEICOMISO);
            return;
          }
        }
      }
      else {
        saveJBPMProcess(OPTs.PROCESS_CLIENTDECLINED);
        return;
      }
      saveJBPMProcess(OPTs.PROCESS_DOCUMENTACIONLEGAL);

    }, 2500)
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

    console.log("saveJBPMProcess", option);
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
      case OPTs.PROCESS_CLIENTDECLINED: { //Rechasado
        infoBpmModel.processId = OPTs.PROCESS_CLIENTDECLINED;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_CLIENTDECLINED.toString(),
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
      case OPTs.PROCESS_ACEPTACIONCLIENTE: {
        infoBpmModel.processId = OPTs.PROCESS_ACEPTACIONCLIENTE;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_ACEPTACIONCLIENTE.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId.toString(),
        };
        bpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog(OPTs.APPLICATION_STATUS_ACEP, "");
              showMessage({ msg: t("Datahasbeensavedsuccessfully"), error: false, show: true });
              history.push(url.URL_DASHBOARD);
            }
            else {
              showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
            }
          });
        break;
      }
      case OPTs.PROCESS_ASIGNARNUMFIDEICOMISO: {
        infoBpmModel.processId = OPTs.PROCESS_ASIGNARNUMFIDEICOMISO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_ASIGNARNUMFIDEICOMISO.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "confide",
          //"decicionfide": "si"
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog(OPTs.APPLICATION_STATUS_ACEP, "");
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

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_DOCUMENTACIONLEGAL.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "sinfide",
          //"decicionfide": "no"
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog(OPTs.APPLICATION_STATUS_ACEP, "");
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
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ACEPTACIONCLIENTE, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_09)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }

  //Cargamos la tabla catalgo de Tarifario
  async function loadTariffData(transactionId) {
    setIsActiveLoading(true)
    try {
      var dataRows = [];

      var catalogGarantia = await coreServices.getTipoGarantiaCatalogo();
      var facilityTypes = await backendServices.retrieveFacilityType();

      var propousalData = await backendServices.consultGeneralDataPropCred(transactionId);
      var lfacilities = await backendServices.consultarFacilidades(propousalData[0].requestId);
      for (var facility of lfacilities) {
        var showFacility = true;
        var facilityMain = facilityTypes.find(x => x.id === facility.facilityTypeId)
        var lguarantees = await backendServices.consultarGarantiaPropCred(facility.facilityId);
        if (lguarantees !== undefined) {
          for (var guarantee of lguarantees) {
            var showWarantee = true;

            var garantia = catalogGarantia.Records.find(x => x.Code === guarantee.guaranteeTypeName);
            var catalogSubGarantia = await coreServices.getSubTipoGarantiaCatalogo(guarantee.guaranteeTypeName);
            var lTariff = await backendServices.getTariffData(guarantee.guaranteeSubtypeCode, facility.amount);
            if (lTariff !== undefined && lTariff !== null && lTariff.length > 0) {
              var showSubWarantee = true;
              var i = 0;
              for (var tariff of lTariff) {
                i++;
                if (showFacility) {
                  dataRows.push(
                    <tr key={"tariff_" + i}>
                      <td style={{ textAlign: "center" }}>{facilityMain.description}</td> {/*SACAR EL NOMBRE DEL TIPO DE FACILIDAD */}
                      <td style={{ textAlign: "center" }}>{garantia.Description}</td>
                      <td style={{ textAlign: "center" }}>{guarantee.guaranteeSubtypeDesc}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', facility.amount)}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', tariff.commissionMonthly)}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', tariff.commissionMonthlyAd)}</td>
                    </tr>
                  )
                  showFacility = false;
                }
                else if (showWarantee) {
                  dataRows.push(
                    <tr key={"tariff_" + i}>
                      <td style={{ textAlign: "center" }}></td> {/*SACAR EL NOMBRE DEL TIPO DE FACILIDAD */}
                      <td style={{ textAlign: "center" }}>{garantia.Description}</td>
                      <td style={{ textAlign: "center" }}>{guarantee.guaranteeSubtypeDesc}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', facility.amount)}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', tariff.commissionMonthly)}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', tariff.commissionMonthlyAd)}</td>
                    </tr>
                  )
                  showWarantee = false;
                }
                else if (showSubWarantee) {
                  dataRows.push(
                    <tr key={"tariff_" + i}>
                      <td style={{ textAlign: "center" }}></td> {/*SACAR EL NOMBRE DEL TIPO DE FACILIDAD */}
                      <td style={{ textAlign: "center" }}></td>
                      <td style={{ textAlign: "center" }}>{guarantee.guaranteeSubtypeDesc}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', facility.amount)}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', tariff.commissionMonthly)}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', tariff.commissionMonthlyAd)}</td>
                    </tr>
                  )
                  showSubWarantee = false;
                }
                else {
                  dataRows.push(
                    <tr key={"tariff_" + i}>
                      <td style={{ textAlign: "center" }}></td> {/*SACAR EL NOMBRE DEL TIPO DE FACILIDAD */}
                      <td style={{ textAlign: "center" }}></td>
                      <td style={{ textAlign: "center" }}></td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', facility.amount)}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', tariff.commissionMonthly)}</td>
                      <td style={{ textAlign: "center" }}>{formatCurrency('$', tariff.commissionMonthlyAd)}</td>
                    </tr>
                  )
                  showSubWarantee = false;
                }
              }
            }
          }
        }
      }

      settariffRows(dataRows);
      setIsActiveLoading(false)

    }
    catch (err) {
      console.log(err)
      setIsActiveLoading(false)

    }

  }

  /*
  // Camino Feliz ... Acepta
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"si"
  };
    
  //Terminar No Acepta ... 
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"no"
  };

  //Terminar Sin Fideicomiso ... 
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"si",
    "decicionfide":"no"
  };

  //Terminar Con Fideicomiso ... 
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"si",
    "decicionfide":"si"
  };
  */


  return (
    <React.Fragment>

      <div className="page-content">

        <Breadcrumbs title={t("CommercialCredit")} breadcrumbItem={t("ClientAcceptance")} />

        <HorizontalSteeper processNumber={2} activeStep={0}></HorizontalSteeper>

        <Row>
          <Col md={3} style={{ textAlign: "left" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>

          </Col>
          <Col md={9} style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { saveDataAcceptclient(); onSaveProcess(OPTs.PROCESS_ACEPTACIONCLIENTE) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            <Button color="success" type="button"
              onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
          </Col>
        </Row>


        <Card>
          <CardHeader>
            <Row>
              <Col md={6}>
                <h4 className="card-title">{t("ClientAcceptance")}</h4>
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
            {/*  <Row>
              <Col md="12">
                <Tabs defaultActiveKey="1" id="uncontrolled-tab-example" className="mb-3">
                  <Tab className="m-4" key={1} eventKey={1} title={props.t("ConsultManagementReport")}>
                    <PrevicualizarIGR />
                  </Tab>
                  <Tab className="m-4" key={2} eventKey={2} title={props.t("ConsultCreditProposal")}>
                    <PrevisualizarPropCred />
                  </Tab>
                  <Tab className="m-4" key={3} eventKey={3} title={props.t("ConsultFinancialReport")}>
                    <PrevicualizarAIF />
                  </Tab>
                </Tabs>
              </Col>
            </Row>
            */}

            {/* <Row>
              <Col>
              <div className="d-flex flex-row justify-content-between">
                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toogleModalPrevisualizarIGR() }}>
                  {" "} {t("ConsultManagementReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toogleModalPrevisualizarProp() }}>
                  {" "} {t("ConsultCreditProposal")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelFinancialReport() }}>
                  {" "} {t("ConsultFinancialReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelTermsOfConditions() }}>
                  {" "} {t("GenerateLetterOfTermsOfConditions")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>
              </div>
              </Col>
            </Row> */}


          </CardBody>
          <CardBody>
            <Row>
              <Col>
                <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit} autoComplete="off">
                  <Row>
                    <Col md="3" className="d-flex flex-column justify-content-center">
                      <label className="kt-checkbox d-flex flex-row justify-content-start align-items-start">
                        <AvGroup check>
                          <Label className="d-felx" style={{ display: "flex" }} htmlFor="requestDate">{t("ClientAccepts")}</Label>
                          <Switch name="preapproval"
                            uncheckedIcon={<Offsymbol />}
                            checkedIcon={<OnSymbol />}
                            onColor="#007943"
                            className="form-label"
                            onChange={(e) => { setacceptClient(!acceptClient) }}
                            checked={acceptClient}
                          />
                        </AvGroup>
                      </label>
                    </Col>
                    <Col md="3">
                      <AvGroup >
                        <Label htmlFor="requestDate">{t("Date")}</Label>
                        {fechaSet && (<Flatpickr
                          name="birthDate"
                          className="form-control d-block"
                          placeholder={OPTs.FORMAT_DATE_SHOW}
                          options={{
                            dateFormat: OPTs.FORMAT_DATE,
                            defaultDate: fechaSet
                          }}
                          onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                        />)}

                      </AvGroup>
                    </Col>

                  </Row>
                </AvForm>

              </Col>
            </Row>
            <Row>
              <Col md="12">
                {locationData ?
                  <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_ACEPTACIONCLIENTE, OPTs.ACT_NONE)} />
                  : null}
              </Col>

            </Row>
          </CardBody>
          <CardBody>
            <Row>
              <Col md="6">
                <h5 className="card-sub-title">{t("Tariff")}</h5>
              </Col>
              <Col md={6} style={{ textAlign: "right", }}>
                {/**  <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={showWatchListCheck} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>*/}
              </Col>
            </Row>
            <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>
              <Row>
                <Col md="12">
                  <div className="table-responsive styled-table-div">
                    <Table className="table table-striped table-hover styled-table table">
                      <thead>
                        <tr>
                          <th style={{ textAlign: "center" }}>{t("Facilidad")}</th>
                          <th style={{ textAlign: "center" }}>{t("Garantía")}</th>
                          <th style={{ textAlign: "center" }}>{t("SubGarantía")}</th>
                          <th style={{ textAlign: "center" }}>{t("Monto Financiero")}</th>
                          <th style={{ textAlign: "center" }}>{t("Comisión Fiduciaria Estructuración (Cobro Único)")}</th>
                          <th style={{ textAlign: "center" }}>{t("Comisión Mensual de Administración Fiduciaria (Por Vehiculo)")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tariffRows !== undefined && tariffRows !== null && tariffRows.length > 0 ?
                          tariffRows :
                          <tr>
                            <td colSpan={7}>
                              <div className="alert alert-info" style={{ textAlign: "center" }}>{t("NoData")}</div>
                            </td>
                          </tr>

                        }
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </LoadingOverlay>
          </CardBody>
          <CardFooter>
          </CardFooter>

        </Card>
        {locationData ?
          <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_ACEPTACIONCLIENTE, OPTs.ACT_NONE)} />
          : null}
        {locationData ?
          <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ACEPTACIONCLIENTE, OPTs.ACT_NONE, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_09)} />
          : null}

        <Row>
          <Col md={3} style={{ textAlign: "left" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>

          </Col>
          <Col md={9} style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { saveDataAcceptclient(); onSaveProcess(OPTs.PROCESS_ACEPTACIONCLIENTE) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            <Button color="success" type="button"
              onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
          </Col>
        </Row>

      </div>
      {locationData && displayModalBitacora ?
        <ModalBitacora logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ACEPTACIONCLIENTE, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_09)}
          successSaved={() => { onSaveProcess(optionSelected); }}
          isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
        : null}

      {/* <ModalPrevisualizarPropCred isOpen={ShowModelCreditProposal} toggle={() => { toggleShowModelCreditProposal() }} /> */}
      {/* <ModalPrevicualizarAIF isOpen={ShowModelFinancialReport} toggle={() => { toggleShowModelFinancialReport() }} /> */}
      <ModalTermsOfConditions isOpen={ShowModelTermsOfConditions} toggle={() => { toggleShowModelTermsOfConditions() }} />
      {/* <ModalPrevicualizarIGR isOpen={ModalPrevisualizardata} toggle={() => { toogleModalPrevisualizarIGR() }} /> */}

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
  // onSelectClient: PropTypes.func.isRequired
}

export default (withTranslation()(AutonomiaCredito))
