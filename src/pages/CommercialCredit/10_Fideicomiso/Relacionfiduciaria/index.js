/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import PropTypes from 'prop-types'
import { useLocation, useHistory } from "react-router-dom";
import { Link } from "react-router-dom"
import * as url from "../../../../helpers/url_helper"
import * as OPTs from "../../../../helpers/options_helper";

import {
  Card, CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  CardFooter,
  Alert,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../../components/Common/Breadcrumb"

//i18n
import { useTranslation, withTranslation } from "react-i18next"

import DatosGenerales from "./DatosGenerales"
import DatosServicioFiduciario from "./DatosServicioFiduciario"
import DatosOtrosDatos from "./DatosOtrosDatos"
import ModalCloseOptions from "./ModalCloseOptions";
import ModalAdvanceOptions from "./ModalAdvanceOptions";
import { BpmServices } from "../../../../services";
import SweetAlert from "react-bootstrap-sweetalert";

import { BackendServices, CoreServices } from "../../../../services";
import React, { useEffect, useState } from "react"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"

import ModalPrevicualizarAIF from "../../6_AnalisisCredito/previsualizarAIF";
import ModalPrevisualizarPropCred from "../../5_PropuestaCredito/previsualizarPropCred";
import ModalPrevicualizarIGR from "../../4_InformeGestionReforzado/FormularioIGR/previsualizarIGR";

import ModalEndProcess from "../../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../components/LogProcess/index";

import AttachmentFileCore from "../../../../components/Common/AttachmentFileCore";
import Currency from '../../../../helpers/currency';

import HorizontalSteeper from "../../../../components/Common/HorizontalSteeper";
import { saveLogProcess } from "../../../../helpers/logs_helper";


import CheckListComponent from '../../../../components/Common/CheckList';
import { AttachmentFileInputModel } from "../../../../models/Common/AttachmentFileInputModel"
import ModalBitacora from '../../../../components/Common/ModalBitacora';
import { Tab, Tabs } from 'react-bootstrap';
import LoadingOverlay from 'react-loading-overlay';

const PantallaBusqueda = props => {

  const { t, i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation()
  const { selectedData } = location;
  const [displayModalCloseOptions, setDisplayModalCloseOptions] = useState(false);
  const [displayModalAdvanceOptions, setDisplayModalAdvanceOptions] = useState(false);

  const [ServiciosFiduciario, setServiciosFiduciario] = useState(null);
  const [OtherServiciosFiduciario, setOtherServiciosFiduciario] = useState(null);
  const [BasaFid, setBasaFid] = useState(null);
  const [DataGeneral, setDataGeneral] = useState(null);

  const [locationData, setLocationData] = useState(null);
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());

  const [mainDebtor, setmainDebtor] = useState(null);

  const [ShowModelReportManagment, setShowModelReportManagment] = useState(false);
  const [ShowModelCreditProposal, setShowModelCreditProposal] = useState(false);
  const [ShowModelFinancialReport, setShowModelFinancialReport] = useState(false);
  const [ShowModelTermsOfConditions, setShowModelTermsOfConditions] = useState(false);
  const [ModalPrevisualizardataProp, settoogleModalPrevisualizarProp] = useState(false);

  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

  const [formIsValid, setformIsValid] = useState(false);
  const [stepContinue, setStepContinue] = useState(false);
  const currencyData = new Currency();

  const [optionSelected, setoptionSelected] = useState(null);
  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);

  const [isActiveLoading, setIsActiveLoading] = useState(true);
  const [facility, setFacility] = useState(null);
  const [facilities, setFacilities] = useState(null);
  const [facilityId, setFacilityId] = useState(null);
  const [proposalType, setProposalType] = useState(null);
  const [tabsFacility, setTabsFacility] = useState(null);
  const [guaranteesType, setGuaranteesType] = useState(null);
  const [msgDataND, setmsgDataND] = useState({ show: false, msg: "", isError: false });


  //On Mounting (componentDidMount)
  React.useEffect(() => {
    let dataSession;
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        dataSession = location.data;
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        dataSession = result;
      }
    }
    locationData && fetchData(dataSession);
    loadData(dataSession);
  }, [!locationData]);


  React.useEffect(() => {
    setOtherServiciosFiduciario(undefined)
    facilityId && LoadOtherFiduciario(facilityId);
  }, [facilityId]);

  function loadData(data) {
    setIsActiveLoading(true);
    Promise.allSettled([
      backendServices.consultGeneralDataPropCred(data.transactionId),
      backendServices.retrieveFacilityType(),
      coreServices.getTipoGarantiaCatalogo(),
      backendServices.retrieveProposalType(),
    ]).then(data => {
      const [{ value: GeneralDataPropCred }, { value: FacilityType }, { value: guaranteesType }, { value: proposalType }] = data;
      setProposalType(proposalType)
      setGuaranteesType(guaranteesType?.Records)
      backendServices.consultarFacilidades(GeneralDataPropCred[0].requestId).then(resp => {
        resp = resp.filter($$ => $$.debtor !== '  ' && $$.facilityTypeId !== " ").filter($$ => $$.proposalTypeId !== "MEN" && $$.applyEscrow);
        if (resp.length > 0) {
          setFacilities(resp);
          setFacility(resp[0]);
          setFacilityId(resp[0].facilityId)

          setTabsFacility(resp.map((items, index) => (
            <Tab className="m-0" key={index} eventKey={index} title={FacilityType.find($$ => $$.id === items.facilityTypeId).description}></Tab>
          )));
        }
        setIsActiveLoading(false)
      }).catch(err => {
        console.log(err);
        setIsActiveLoading(false)
      });

    }).catch(err => {
      console.log(err)
      setIsActiveLoading(false)
    })
  }

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
    LoadAll();
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

  function LoadAll() {
    LoadFiduciario();
    // LoadNumeroFideicomiso();
  }

  //Modal Opciones al Salir
  function toggleModalCloseOptions() {
    setDisplayModalCloseOptions(!displayModalCloseOptions);
  }

  //Modal Opciones al Salir
  function toggleModalModalAdvanceOptions() {
    setDisplayModalAdvanceOptions(!displayModalAdvanceOptions);
  }

  function LoadFiduciario() {
    backendServices.consultarSeccionServiciosFiduciario(locationData.transactionId).then(resp => {
      let data = resp;
      (data !== null || data !== undefined) && setServiciosFiduciario(data);
    });
  }

  function LoadOtherFiduciario(facilityId) {
    LoadNumeroFideicomiso();
    setIsActiveLoading(true);
    Promise.allSettled([
      backendServices.consultListProgramPagoPropCred(facilityId),
      backendServices.consultarGarantiaPropCred(facilityId),
      backendServices.consultarSeccionOtrosServiciosFiduciario(locationData.transactionId, facilityId),
    ]).then(allPromise => {
      const [{ value: paymentMethods }, { value: guarantees }, { value: otherServiceFiduciary }] = allPromise;

      (paymentMethods !== null || paymentMethods !== undefined) && setOtherServiciosFiduciario(otherServiciosFiduciario => ({ ...otherServiciosFiduciario, paymentType: paymentMethods.map(paymentMethod => paymentMethod.paymentProgram).join('; ') }));
      (guarantees !== null || guarantees !== undefined) && setOtherServiciosFiduciario(otherServiciosFiduciario => ({ ...otherServiciosFiduciario, fixedActiveType: guarantees.map(guarantee => guaranteesType.find(x => x.Code === guarantee.guaranteeTypeName)?.Description).join('; ') }));
      (otherServiceFiduciary !== null || otherServiceFiduciary !== undefined) && setOtherServiciosFiduciario(otherServiciosFiduciario => ({ ...otherServiciosFiduciario, proposal: proposalType.find(x => x.id === facility.proposalTypeId)?.description, purpose: facility.purpose, ...otherServiceFiduciary }));
      setIsActiveLoading(false);
    }).catch(err => {
      console.log(err)
      setIsActiveLoading(false);
    });

  }

  function LoadNumeroFideicomiso() {
    backendServices.consultarNumeroFideicomiso(locationData.transactionId).then(resp => {
      setBasaFid(resp.find(fiduciary => fiduciary.facilityId === facilityId));
      // let data = resp.data;
      // (data != null || data != undefined) && setRecomendation(data);
    });
  }

  async function handleSubmit(event, errors, values) {

    let formIsValid = false;
    event.preventDefault();
    if (errors.length > 0) {
      formIsValid = (false);
      return;
    } else {
      formIsValid = (true);
    }


    values.guaranteetrust = currencyData.getRealValue(values.guaranteetrust);
    values.administrationTrust = currencyData.getRealValue(values.administrationTrust);
    values.investmentTrust = currencyData.getRealValue(values.investmentTrust);
    values.stateTrust = currencyData.getRealValue(values.stateTrust);
    values.scrowAccount = currencyData.getRealValue(values.scrowAccount);
    values.description = currencyData.getRealValue(values.description);
    values.others = currencyData.getRealValue(values.others);
    // values.proposal = currencyData.getRealValue(values.proposal);
    // values.purpose = currencyData.getRealValue(values.purpose);
    // values.fixedActiveType = currencyData.getRealValue(values.fixedActiveType);
    // values.description = currencyData.getRealValue(values.description);
    values.structureCommission = currencyData.getRealValue(values.structureCommission);
    values.paymentType = values.paymentType;
    values.term = currencyData.getRealValue(values.term);
    values.administrationCommision = currencyData.getRealValue(values.administrationCommision);
    values.total = currencyData.getRealValue(values.total);
    // values.others = currencyData.getRealValue(values.others);
    values.facilityId = facilityId;

    setDataGeneral({ transactId: locationData.transactionId, ...values });
    setIsActiveLoading(true);

    let DataG = { transactId: locationData.transactionId, ...values };
    await backendServices.guardarSeccionServiciosFiduciario(DataG).then(resp => {
      if (resp === undefined) {
        formIsValid = (false);
      }
    });

    DataG.description = DataG.descriptionOtherServiciosFiduciario
    DataG.others = DataG.othersOtherServiciosFiduciario

    await backendServices.guardarSeccionOtrosServiciosFiduciario(DataG).then(resp => {
      if (resp === undefined) {
        formIsValid = (false);
      }
    });
    setIsActiveLoading(false);

    stepContinue && checkToContinue(formIsValid);
    // toggleModalModalAdvanceOptions()
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

  async function guardarDatos() {
    let form = document.getElementById('frmDataFiduciary');
    form.requestSubmit();
  }

  async function checkToContinue(formIsValid) {

    // await guardarDatos();

    if (!formIsValid) {
      showMessage({ msg: t("PleaseSaveDescicionBeforeContinue"), error: true, show: true });
      return;
    }

    saveJBPMProcess(OPTs.PROCESS_DOCUMENTACIONLEGAL);
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
      case OPTs.PROCESS_DATOSFIDEICOMISO: {
        infoBpmModel.processId = OPTs.PROCESS_DATOSFIDEICOMISO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_DATOSFIDEICOMISO.toString(),
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
      case OPTs.PROCESS_DOCUMENTACIONLEGAL: {
        infoBpmModel.processId = OPTs.PROCESS_DOCUMENTACIONLEGAL;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_DOCUMENTACIONLEGAL.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "noajuste"
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
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ASIGNARNUMFIDEICOMISO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_10)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }

  /*
  // Camino Feliz ... 
  var values = {
    "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
    "activityId": OPTs.ACT_NONE.toString(),
    "transactionId": locationData.transactionId,
    "requestId":locationData.requestId,
    "decision":"no"
  };
    
  //Requiere Ajustes 
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

  function handleSelect(e) {
    let data = facilities.at(e);
    setFacility(data);
    setFacilityId(data.facilityId)
  }

  return (
    <React.Fragment>
      <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
        <div className="page-content">

          <Breadcrumbs title={props.t("CommercialCredit")} breadcrumbItem={props.t("TrustServices")} />

          <HorizontalSteeper processNumber={2} activeStep={1}></HorizontalSteeper>

          <Row>
            <Col md={4} style={{ textAlign: "left" }}>
              <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
              <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>

            </Col>
            <Col md={8} style={{ textAlign: "right" }}>
              {/* <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_INFORMEGESTION) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button> */}
              <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { guardarDatos(); onSaveProcess(OPTs.PROCESS_DATOSFIDEICOMISO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
              <Button color="success" type="button"
                onClick={() => { setStepContinue(true); guardarDatos() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}
              </Button>
            </Col>
          </Row>


          <Card>
            <CardHeader>
              <Row>
                <Col md={6}>
                  <h4 className="card-title">{t("TrustServices")}</h4>
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
                <Col>
                  <div className="d-flex flex-row justify-content-between">
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
                        pathname: '/creditocomercial/PrevisualizarFideicomiso/' + btoa(locationData?.transactionId),
                      }}
                      target="_blank"
                    >{" "} {t("Consultar Fideicomiso")} <i className="mdi mdi-eye mdi-12px"></i></Link>

                  </div>
                </Col>
              </Row>

            </CardBody>

            <AvForm id="frmDataFiduciary" className="needs-validation mx-3" onSubmit={handleSubmit}>

              {tabsFacility != null ?
                <>
                  <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-4" onSelect={(e) => { handleSelect(e) }}>
                    {tabsFacility}
                  </Tabs>
                  {facilityId && <>
                    <CardBody>
                      <Col md="12" style={{ textAlign: "right" }}>
                        <h5 className="card-Subtitle">{props.t("TrustNumber")}: {BasaFid?.trustName}</h5>
                      </Col>
                    </CardBody>
                    <DatosServicioFiduciario ServiciosFiduciario={ServiciosFiduciario} />

                    {<DatosOtrosDatos OtherServiciosFiduciario={OtherServiciosFiduciario} />}
                  </>}
                </>
                : <Alert show="true" variant="warning" dismissible="true" onClose={() => { setmsgDataND({ show: false, msg: "", isError: false }) }}>
                  {t("No facilities")}
                </Alert>}

              {/*<DatosGenerales BasaFid={BasaFid} />*/}

              <Col md={12} className="d-flex justify-content-end px-4">
                <Button color="primary" type="button" onClick={() => { guardarDatos(); }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Save")}</Button>
              </Col>

            </AvForm>


            <CardFooter>
            </CardFooter>


            {locationData ?
              <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_FIDEICOMISO, OPTs.ACT_NONE)} />
              : null}
          </Card>


          <ModalAdvanceOptions DataGeneral={DataGeneral} onSaveProcess={onSaveProcess} isOpen={displayModalAdvanceOptions} toggle={() => { toggleModalModalAdvanceOptions() }} />

          {locationData ?
            <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_DATOSFIDEICOMISO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_10)} />
            : null}

          <Row>
            <Col md={4} style={{ textAlign: "left" }}>
              <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
              <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>

            </Col>
            <Col md={8} style={{ textAlign: "right" }}>
              {/* <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_INFORMEGESTION) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button> */}
              <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { guardarDatos(); onSaveProcess(OPTs.PROCESS_DATOSFIDEICOMISO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
              <Button color="success" type="button"
                onClick={() => { setStepContinue(true); guardarDatos() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}
              </Button>
            </Col>
          </Row>

          <ModalEndProcess onSaveEndProcess={onSaveEndProcess} isOpen={displayModalEndProcess} toggle={() => { showModalEndProcess(false) }} />
          {/* <ModalPrevicualizarAIF isOpen={ShowModelFinancialReport} toggle={() => { toggleShowModelFinancialReport() }} /> */}
          {/* <ModalPrevicualizarIGR isOpen={ShowModelReportManagment} toggle={() => { toogleModalPrevisualizarIGR() }} />
        <ModalPrevisualizarPropCred isOpen={ShowModelCreditProposal} toggle={() => { toggleShowModelCreditProposal() }} /> */}

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


        {locationData && displayModalBitacora ?
          <ModalBitacora logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_04)}
            successSaved={() => { onSaveProcess(optionSelected); }}
            isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
          : null}
      </LoadingOverlay>
    </React.Fragment>
  )
}

PantallaBusqueda.propTypes = {
  selectedId: PropTypes.any,
  onClose: PropTypes.func.isRequired
}

export default (withTranslation()(PantallaBusqueda))
