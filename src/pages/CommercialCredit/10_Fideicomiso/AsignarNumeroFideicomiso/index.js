/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types'
import { useLocation, useHistory } from "react-router-dom";
import { Link } from "react-router-dom"
import * as url from "../../../../helpers/url_helper"
import * as OPTs from "../../../../helpers/options_helper";

import {
  Card, CardHeader,
  CardBody, Row,
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
import Fideicomiso from "./Fideicomiso"
import Fideicomitente from "./Fideicomitente"
import ComisioinesFiduciarias from "./ComisioinesFiduciarias"
import BeneficiarioSecundario from "./BeneficiarioSecundario"
import Conclusiones from "./Conclusiones"
import ApiServicesFideicomitentes from "../../../../services/Fideicomiso/ApiServicesFideicomitentes"
import ModalCloseOptions from "./ModalCloseOptions";
import ModalAdvanceOptions from "./ModalAdvanceOptions";
import { BackendServices, CoreServices, BpmServices, } from "../../../../services";
import SweetAlert from "react-bootstrap-sweetalert";
import { AvForm } from "availity-reactstrap-validation";

import ModalPrevicualizarAIF from "../../6_AnalisisCredito/previsualizarAIF";
import ModalPrevisualizarPropCred from "../../5_PropuestaCredito/previsualizarPropCred";
import ModalPrevicualizarIGR from "../../4_InformeGestionReforzado/FormularioIGR/previsualizarIGR";

import ModalEndProcess from "../../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../components/LogProcess/index";

import AttachmentFileCore from "../../../../components/Common/AttachmentFileCore";
import HorizontalSteeper from "../../../../components/Common/HorizontalSteeper";

import { saveLogProcess } from "../../../../helpers/logs_helper";


import CheckListComponent from '../../../../components/Common/CheckList';
import { AttachmentFileInputModel } from "../../../../models/Common/AttachmentFileInputModel"
import ModalBitacora from "../../../../components/Common/ModalBitacora";
import BlackListForm from "../../1_Presolicitud/BlackListForm";
import { BlackListHistoryModel } from "../../../../models/Common/BlackListHistoryModel";
import Guarantors from "./guarantors";
import { PersonModel } from "../../../../models/Common/PersonModel";
import { Tab, Tabs } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";

const PantallaBusqueda = props => {
  const { t, i18n } = useTranslation();
  const apiBack = new BackendServices();
  const history = useHistory();

  const location = useLocation()
  const { selectedData } = location;
  const [dataList, setDataList] = useState([]);
  const [datosUsuario, setdatosUsuario] = useState(null);
  const [displayModalCloseOptions, setDisplayModalCloseOptions] = useState(false);
  const [displayModalAdvanceOptions, setDisplayModalAdvanceOptions] = useState(false);
  const [dataTrust, setdataTrust] = useState(null);
  const [dataFeduciario, setdataFeduciario] = useState({
    "transactId": 0,
    "structuring": "",
    "facilityType": "",
    "creditLineRot": "",
    "creditLineNoRot": "",
    "declineLoan": "",
    "status": true
  });

  const comisionesFiduciariaRef = React.useRef();
  const conclusionesRef = React.useRef();

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

  const [conslusions, setconslusions] = useState("");
  const [locationData, setLocationData] = useState(null);

  const [optionSelected, setoptionSelected] = useState(null);
  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);

  const [showBlackListForm, setshowBlackListForm] = useState(false);
  const [selectClient, setselectClient] = useState(new PersonModel());

  const [isActiveLoading, setIsActiveLoading] = useState(true);
  const [facility, setFacility] = useState(null);
  const [facilities, setFacilities] = useState(null);
  const [facilityId, setFacilityId] = useState(null);
  const [proposalType, setProposalType] = useState(null);
  const [tabsFacility, setTabsFacility] = useState(null);
  const [guaranteesType, setGuaranteesType] = useState(null);
  const [msgDataND, setmsgDataND] = useState({ show: false, msg: "", isError: false });

  const api = new BackendServices()


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
        fetchData(location.data);
        dataSession = location.data;
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        dataSession = result;
        setLocationData(result);
        fetchData(result);
      }
    }

    loadData(dataSession);
  }, []);

  React.useEffect(() => {
    facilityId && cargarDatosPrincipales(locationData)
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
            <Tab className="m-0" key={index} eventKey={index} title={`${FacilityType.find($$ => $$.id === items.facilityTypeId).description}`}></Tab>
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
    searchData(null)

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

  function searchData(values) {
    const api = new ApiServicesFideicomitentes()
    api.getResultadosFideicomitentes(values)
      .then((data) => {
        setDataList(data);
      })
      .catch((error) => {
        console.error('Error fetching documents', error);
      });
  }
  function guardarDatos() {
    return new Promise(async (resolve, reject) => {
      setIsActiveLoading(true);
      if (!conclusionesRef.current.getFormValidation()) {
        conclusionesRef.current.validateForm();
        //return false;
      }
      let flag = true;

      console.log(facilities)

      let fiduciaries = await api.consultarNumeroFideicomiso(locationData.transactionId);
      for (let facility of facilities) {
        let dato = {
          "transactId": Number(locationData.transactionId),
          "conclusions": facility.facilityId === facilityId ? conslusions ?? '' : fiduciaries.find(fiduciary => fiduciary.facilityId === facilityId).conclusions,
          facilityId: facility.facilityId,
          "status": true
        }
        console.log(dato)
        var resp = await apiBack.guardarNumeroFideicomiso(dato)
        if (resp === undefined) {
          showMessage({ msg: t("ErrorDialog"), error: true, show: true });
          flag = false;
        }
      }

      setIsActiveLoading(false);
      resolve(flag);
    })
  }
  function cargarDatosPrincipales(locationData) {
    api.consultPrincipalDebtor(locationData.transactionId).then(resp => {
      setdatosUsuario(resp)
    })
    api.consultarTipoFiduciarioYOtrosDatos(locationData.transactionId).then(resp => {
      console.log(resp);
      setdataFeduciario(resp)
    })
    fiduciaryFacility();
  }

  function fiduciaryFacility() {
    api.consultarNumeroFideicomiso(locationData.transactionId).then(resp => {
      if (resp == undefined || resp?.length == 0) {
        api.guardarNumeroFideicomiso({
          "transactId": Number(locationData.transactionId),
          "conclusions": " "
        }).then(response => {
          setdataTrust(response.trustName)
        })
      } else {
        console.log("fideico", resp[0]);
        let fiduciaryFacility = resp?.find(fiduciary => fiduciary.facilityId === facilityId)
        setdataTrust(fiduciaryFacility)
        setconslusions(fiduciaryFacility?.conclusions)
      }
    })
  }


  //Modal Opciones al Salir
  function toggleModalCloseOptions() {
    setDisplayModalCloseOptions(!displayModalCloseOptions);
  }

  //Modal Opciones al Salir
  function toggleModalModalAdvanceOptions() {
    setDisplayModalAdvanceOptions(!displayModalAdvanceOptions);
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
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

  async function checkToContinue() {

    await guardarDatos();

    //chequear si ya tiene desicion del cliente
    var result = await backendServices.consultarNumeroFideicomiso(locationData.transactionId);
    if (result === undefined || result?.length === 0) {
      showMessage({ msg: t("PleaseSaveDescicionBeforeContinue"), error: true, show: true });
      return;
    }

    saveJBPMProcess(OPTs.PROCESS_DATOSFIDEICOMISO);
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
      case OPTs.PROCESS_ASIGNARNUMFIDEICOMISO: {
        infoBpmModel.processId = OPTs.PROCESS_ASIGNARNUMFIDEICOMISO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_ASIGNARNUMFIDEICOMISO.toString(),
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
              saveAutoLog(null);
              showMessage({ msg: t("Datahasbeensavedsuccessfully"), error: false, show: true });
              history.push(url.URL_DASHBOARD);
            }
            else {
              showMessage({ msg: t("ErrorSaveMessage"), error: true, show: true });
            }
          });
        break;
      }
      case OPTs.PROCESS_INFORMEGESTION: { //requiere ajustes
        infoBpmModel.processId = OPTs.PROCESS_INFORMEGESTION;
        infoBpmModel.activityId = OPTs.ACT_NONE;
        infoBpmModel.toprocess = OPTs.PROCESS_ASIGNARNUMFIDEICOMISO

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_INFORMEGESTION.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "ajuste",          //requiere ajustes
          "dcreditoparalelo": "sinparalelo",
          "statuscredito": "completo", //el paralelo de Credito esta activo
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog(OPTs.APPLICATION_STATUS_DEV, t("The activity has been returned for adjustment"));

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

  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
  }



  function addWatchListResult(resultWatchList) {
    if (selectClient !== undefined) {
      var blacklistmdl = new BlackListHistoryModel(); //new BlacklistModel();
      blacklistmdl.blackList = resultWatchList.blackList;
      blacklistmdl.comment = resultWatchList.comments;
      blacklistmdl.transactId = locationData.transactionId;
      selectClient?.blacklist?.push(blacklistmdl);
      setselectClient(selectClient);
      console.log(selectClient)
      // saveBlackListHistory
      if (blacklistmdl.blackList) return;
      apiBack.saveBlackListHistory({
        "transactId": locationData.transactionId,
        "personId": selectClient.personId,
        "roleId": blacklistmdl.roleId,
        "blackList": blacklistmdl.blackList,
        "comment": blacklistmdl.comment
      }).then(resp => {
        console.log(resp);
      })
    }
  }

  function showBlackListFormModal(data) {
    setselectClient(data)
    setshowBlackListForm(!showBlackListForm)
  }

  function handleSelect(e) {
    api.guardarNumeroFideicomiso({
      "transactId": Number(locationData.transactionId),
      "conclusions": conslusions,
      facilityId
    }).then(response => {
      setdataTrust(response.trustName)
    })

    let data = facilities.at(e);
    setFacility(data);
    setFacilityId(data.facilityId)
  }

  return (
    <React.Fragment>
      <div className="page-content">

        <Breadcrumbs title={t("CommercialCredit")} breadcrumbItem={t("Assignescrownumber")} />

        <HorizontalSteeper processNumber={2} activeStep={1}></HorizontalSteeper>

        <Row>
          <Col md={4} style={{ textAlign: "left" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
            <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>
          </Col>
          <Col md={8} style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { guardarDatos(); onSaveProcess(OPTs.PROCESS_ASIGNARNUMFIDEICOMISO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            <Button color="success" type="button"
              onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
          </Col>
        </Row>

        <Card>
          <CardHeader>
            <Row>
              <Col md={6}>
                <h4 className="card-title">{t("Assignescrownumber")}</h4>
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

                  {/* <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toogleModalPrevisualizarIGR() }}>
                    {" "} {t("ConsultManagementReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                  <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelCreditProposal() }}>
                    {" "} {t("ConsultCreditProposal")} <i className="mdi mdi-eye-outline mid-12px"></i></Button> */}

                  {/* <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelFinancialReport() }}>
                    {" "} {t("ConsultFinancialReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button> */}

                </div>
              </Col>
            </Row>

            <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
              <div className="mt-5">
                {tabsFacility != null ?
                  <>
                    <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-4" onSelect={(e) => { handleSelect(e) }}>
                      {tabsFacility}
                    </Tabs>
                    {facilityId && <>
                      <Fideicomiso facilityId={facilityId} />
                      <Fideicomitente results={dataList} showBlackListFormModal={showBlackListFormModal} />
                      {/* <ComisioinesFiduciarias dataFeduciario={dataFeduciario} ref={comisionesFiduciariaRef} /> */}
                      <BeneficiarioSecundario showBlackListFormModal={showBlackListFormModal} />
                      <Guarantors showBlackListFormModal={showBlackListFormModal} />
                      <Conclusiones conslusions={conslusions} ref={conclusionesRef} onSubmit={(data) => setconslusions(data)} />
                    </>}
                  </>
                  : <Alert show="true" variant="warning" dismissible="true" onClose={() => { setmsgDataND({ show: false, msg: "", isError: false }) }}>
                    {t("No facilities")}
                  </Alert>}
              </div>

            </LoadingOverlay>
          </CardBody>

          {locationData ?
            <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_FIDEICOMISO, OPTs.ACT_NONE)} />
            : null}

          <CardFooter>
          </CardFooter>

        </Card>

        {locationData ?
          <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ASIGNARNUMFIDEICOMISO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_10)} />
          : null}

        <Row>
          <Col md={4} style={{ textAlign: "left" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
            <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>
          </Col>
          <Col md={8} style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { guardarDatos(); onSaveProcess(OPTs.PROCESS_ASIGNARNUMFIDEICOMISO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            <Button color="success" type="button"
              onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
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
        <ModalBitacora logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ASIGNARNUMFIDEICOMISO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_10)}
          successSaved={() => { onSaveProcess(optionSelected); }}
          isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
        : null}


      {showBlackListForm ?
        <BlackListForm clientSelected={selectClient} isOpen={showBlackListForm} toggle={() => { setshowBlackListForm(!showBlackListForm) }} watchListResult={addWatchListResult} />
        : null}
    </React.Fragment>
  );
}

PantallaBusqueda.propTypes = {
  selectedId: PropTypes.any,
  onClose: PropTypes.func.isRequired
}

export default PantallaBusqueda
