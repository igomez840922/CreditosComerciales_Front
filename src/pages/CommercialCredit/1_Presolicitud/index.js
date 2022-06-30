import React, { useState } from "react"
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom'
import * as opt from "../../../helpers/options_helper"
import * as url from "../../../helpers/url_helper"
import moment from "moment";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  CardFooter,
  Button,
  Table,
  CardHeader,
} from "reactstrap"
import Alert from 'react-bootstrap/Alert'
import { Link } from "react-router-dom"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { setDefaults, useTranslation } from "react-i18next";
import LoadingOverlay from 'react-loading-overlay';
import ClientForm from "./ClientForm";
import ModalEndProcess from "../../../components/EndProcess/ModalEndProcess";
import { BackendServices, CoreServices, BpmServices } from "../../../services";
import { PersonModel } from '../../../models/Common/PersonModel';
import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';

import SearchClientCore from "../../../components/Common/SearchClientCore";
import SessionHelper from "../../../helpers/SessionHelper";

import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";
import ErrorHandler from "../../../components/Common/ErrorHandler";
import CheckListComponent from '../../../components/Common/CheckList';
import LocalStorageHelper from "../../../helpers/LocalStorageHelper";
import ModalSearchClient from "./ModalSearchClient";
import ModalClientForm from "./ModalClientForm"
import ModalBitacora from "../../../components/Common/ModalBitacora";

import AttachmentFileCore from '../../../components/Common/AttachmentFileCore';
import { AttachmentFileInputModel } from "../../../models/Common/AttachmentFileInputModel"

import SweetAlert from "react-bootstrap-sweetalert"
import { saveLogProcess } from "../../../helpers/logs_helper";
import * as OPTs from "../../../helpers/options_helper"
import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";

const PreRequest = props => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [locationData, setLocationData] = useState(undefined);
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [openNewClient, setopenNewClient] = useState(false);
  const [dataClientList, setdataClientList] = useState([]);
  const [dataDelete, setDataDelete] = useState([]);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [selectedClient, setselectedClient] = useState(undefined);
  const [identificationTypeList, setidentificationTypeList] = useState([]);
  const [personTypeList, setpersonTypeList] = useState([]);
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [sessionHelper, setsessionHelper] = useState(new SessionHelper());

  const [localStorageHelper, setlocalStorageHelper] = useState(new LocalStorageHelper());
  const [showModalSearchClient, setshowModalSearchClient] = useState(false);
  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);
  const [optionSelected, setoptionSelected] = useState(null);
  const [activitySuccess, setactivitySuccess] = useState(false);
  const [updatedataLog, setupdatedataLog] = useState(false);
  const [attachmentFileInputModel, setattachmentFileInputModel] = useState(null)

  const [mainPerson, setmainPerson] = useState(undefined);

  //On Mounting (componentDidMount)
  React.useEffect(() => {
    var data = location.data !== undefined ? location.data : sessionHelper.get(opt.VARNAME_LOCATIONDATA);
    if (data !== null && data !== undefined) {
      if (data.transactionId === undefined || data.transactionId.length <= 0) {
        data.transactionId = 0;
        checkAndCreateProcedure(data);
      }
      else {
        setLocationData(data);
        fetchData(data);
      }
    }
    else {
      history.push(url.URL_DASHBOARD);
    }
  }, []);
  //Caraga Inicial de datos
  function fetchData(locationData) {

    setattachmentFileInputModel(new AttachmentFileInputModel(locationData.transactionId, opt.PROCESS_BUSQUEDADESCARTE, opt.ACT_NONE))

    //chequear si la tarea no ha sido iniciada
    /*bpmServices.checkAndStartTask(locationData)
      .then((iniresult) => {
        if (iniresult === false) {
          history.push(url.URL_DASHBOARD);
        }
      })*/
    //checkAndCreateProcedure(locationData);
    loadIdentificationTypes();
    loadPersonTypes();
    getProcessClients(locationData.transactionId);
    loadMainDebtor(locationData.transactionId);
  }
  async function loadMainDebtor(transactionId) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(transactionId);
    setmainPerson(mainDebtor);//mainDebtor.personId
  }
  //CHEQUEAMOS Y GENERAMOS EL PROCESO EN BASE DE DATOS
  function checkAndCreateProcedure(locationData) {
    var credentials = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);
    backendServices.nuevoTramite(locationData.transactionId, locationData.instanceId, opt.PROCESS_BUSQUEDADESCARTE, opt.PROCESS_BUSQUEDADESCARTE, credentials?.usr ?? "admin", "0")
      .then((data) => {
        if (data !== null && data !== undefined) {
          locationData.transactionId = data.transactId;
          sessionHelper.save(opt.VARNAME_LOCATIONDATA, locationData);
          setLocationData(locationData);
          fetchData(locationData);
        }
      }).catch((error) => { });
  }
  //cargar lista de tipo de identificacion
  function loadIdentificationTypes() {
    backendServices.consultarCatalogoTipoIdentificacion()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["description"]), value: data[i]["id"] })
          }
          setidentificationTypeList(json);
        }
      }).catch((error) => { });
  }
  //cargar lista de tipo de personas
  function loadPersonTypes() {
    backendServices.consultarCatalogoTipoPersona()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["label"]), value: data[i]["code"] })
          }
          setpersonTypeList(json);
        }
      }).catch((error) => { });
  }
  //se buscan todos los clientes de este proceso 
  function getProcessClients(transactionId) {
    backendServices.consultarOrquestadoListaPersonaSolicitud(transactionId)
      .then((data) => {
        if (data !== null && data !== undefined) {
          setdataClientList(data)


          loadMainDebtor(locationData.transactionId);
        }
      }).catch((error) => { });
  }
  //Abrir formulario Persona
  function onOpenNewClient(show = true) {
    setopenNewClient(show)
  }
  //Editar Persona
  function onEditClient(dataClient) {
    dataClient["isNew"] = false;
    setselectedClient(dataClient)
    onOpenNewClient();
  }
  //Eliminar Persona

  function removeRelay(data) {
    setDataDelete(data)
    setconfirm_alert(true);
  }

  function onDeleteClient(dataClient) {
    console.log(dataClient);
    setDataDelete(dataClient)
    setconfirm_alert(true);
    //setconfirm_alert(true);
    //eliminarOrquestadoListaPersonaSolicitud
    {/*backendServices.eliminarOrquestadoListaPersonaSolicitud(dataClient)
      .then((data) => {
        getProcessClients(dataClient.transactId);
      }).catch((error) => { });*/}
  }
  //retorna el Tipo de Persona
  function getPersnoType(pType) {
    return personTypeList.find(x => x.value === pType);
  }
  //retorna el Tipo de identificacion
  function getIdentificationType(idType) {
    if (idType !== undefined && idType !== null && idType.length > 0) {
      return identificationTypeList.find(x => x.value === idType);
    }
    return "";
  }
  //Carga de Datos de Cliente de T24 Seleccionado
  function loadClientDataT24(dataClientT24) {
    console.log("loadClientDataT24", dataClientT24);

    var clientPerson = new PersonModel();
    clientPerson.customerNumberT24 = dataClientT24.id;
    clientPerson.clientDocumentId = dataClientT24.idnumber;
    clientPerson.name = dataClientT24.firstname !== undefined ? dataClientT24.firstname : "";
    clientPerson.secondName = dataClientT24.secondname !== undefined ? dataClientT24.secondname : "";
    clientPerson.lastName = dataClientT24.lastname !== undefined ? dataClientT24.lastname : "";
    clientPerson.secondSurname = dataClientT24.secondlastname !== undefined ? dataClientT24.secondlastname : "";
    clientPerson.phone = dataClientT24.phoneNumber !== undefined ? dataClientT24.phoneNumber : "";
    clientPerson.email = dataClientT24.email !== undefined ? dataClientT24.email : "";
    clientPerson.personType = personTypeList.find(x => x.value === Number(dataClientT24.partyType)).value;
    clientPerson.idType = identificationTypeList.find(x => x.value === dataClientT24.idtype).value;
    clientPerson.isNew = false;
    clientPerson.birthDate = dataClientT24["birthdate"] !== undefined ? moment(dataClientT24["birthdate"]).format("YYYY-MM-DD") : clientPerson.birthDate;
    clientPerson.nationality = dataClientT24["nationality"];
    onEditClient(clientPerson);
  }

  function showSearchClient(show = true) {
    setshowModalSearchClient(show);
  }

  //Chequear si el deudor principal tiene accionistas y otros y agregarlos automaticamente
  async function checkDebtorShareholders() {

    setIsActiveLoading(true)

    try {
      var lDdebtors = await backendServices.consultarDeudores(locationData.transactionId)
      if (lDdebtors === null || lDdebtors === undefined || lDdebtors.length <= 0) {
        showMessage(t("Youmustselectatleastonedebtor"), true);
        return;
      }

      for (let p = 0; p < lDdebtors.length; p++) {
        var maindebtor = lDdebtors[p];

        //buscamos a los accionistas de este deudor
        var data = await coreServices.getPartiesStaff(maindebtor.customerNumberT24);
        if (data !== null && data !== undefined && data.results.length > 0) {
          data = data.results;
          for (let i = 0; i < data.length; i++) {
            try {
              var clientPerson = new PersonModel();
              clientPerson.transactId = locationData.transactionId;
              clientPerson.personType = data[i].PartyType;// "1"; //tipo de Persona
              clientPerson.idType = data[i].PartyType !== undefined && data[i].PartyType === "1" ? "CED" : "RUC"; //tipo de Identificacion
              clientPerson.clientDocumentId = data[i].Identification !== undefined ? data[i].Identification[0]?.Ident.IssuedIdentValue ?? "" : "";//No. de identificacion
              clientPerson.customerNumberT24 = ""; //No. de Cliente T24
              clientPerson.name = data[i].PersonName.FirstName !== undefined ? data[i].PersonName.FirstName : "";//1er Nombre
              clientPerson.secondName = data[i].PersonName.SecondName !== undefined ? data[i].PersonName.SecondName : "";//2do Apellido//2do Nombre
              clientPerson.lastName = data[i].PersonName.LastName !== undefined ? data[i].PersonName.LastName : "";//1er Apellido
              clientPerson.secondSurname = data[i].PersonName.SecondLastName !== undefined ? data[i].PersonName.SecondLastName : "";
              clientPerson.nationality = data[i].Nationality !== undefined ? data[i].Nationality : "";//Nacionalidad
              clientPerson.birthDate = data[i].BirthDt !== undefined ? moment(data[i].BirthDt).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");//Fecha nacimiento "1998-08-17",
              clientPerson.address = ""; //direccion
              clientPerson.phone = data[i].Phone !== undefined ? data[i].Phone[0]?.PhoneNum ?? "" : ""; //Telefono,
              //clientPerson.email=data[i].Phone[0]?.PhoneNum??"";//Email
              clientPerson.countryOfResidence = "PA";//pais de residencia
              clientPerson.comments = "";
              clientPerson.roles = [{ roleId: data[i].StaffPosition }];
              clientPerson.blacklist = [/*{
                blackList: false, comment: "", date: moment().format("YYYY-MM-DD"),
                personId: 0, roleId: data[i].StaffPosition, status: true, transactId: locationData.transactionId
              }*/];
              console.log("sharehold", data[i]);
              var resultPerson = await backendServices.nuevoOrquestadoListaPersonaSolicitud(clientPerson);
              console.log("Shareholding",data[i]?.Shareholding,Number(data[i]?.Shareholding.toString().replace('%','')));
              if (resultPerson !== undefined && data[i].StaffPosition === "ACC") {
                var sharehold = {
                  "transactId": clientPerson.transactId,
                  "personId": resultPerson.personId,
                  "participation": Number(data[i]?.Shareholding.toString().replace('%','')),
                  "yearsExperience": 0,
                  "status": true
                }
                await backendServices.salvarAccionistaBD(sharehold);
              }
            }
            catch (err) { console.error(err) }
          }
          getProcessClients(locationData.transactionId)
        }
        else {
          //showMessage(t("NoResults"), true);
          //return;
        }
      }

    }
    catch (err) { }
    finally {
      setIsActiveLoading(false)
    }
  }

  //mostrar mensaje 
  function showMessage(message, isError = false) {

    setmsgData({ show: true, msg: message, isError: isError })
  }
  ////////// PARTE ES LA FINAL DEL PROCESO ///////
  //Salvando el Proceso y le pasamos una opcion: 1-Finalizar Proceso, 2- Salvarlo, 3- A Cumplimmineto, 4- Avanzar a IGR
  function onSaveProcess(option) {

    switch (option) {
      case opt.PROCESS_LISTAEXCLUSION:
      case opt.PROCESS_CUMPLIMIENTO: {
        setIsActiveLoading(true)
        //check si hay clientes sin evaluar en listas negras
        for (var i = 0; i < dataClientList.length; i++) {
          if (dataClientList[i].blacklist.length <= 0) {
            setIsActiveLoading(false)
            showMessage(t("ExistClientWithoutVerification"), true);
            return;
          }
        }
        //chequear si existe algun deudor para poder continuar
        backendServices.consultPrincipalDebtor(locationData.transactionId)
          .then((data) => {
            if (data !== null && data !== undefined) {
              saveJBPMProcess(option);
            }
            else {
              //Mensaje ERROR
              setIsActiveLoading(false)
              showMessage(t("Youmustselectatleastonedebtor"), true);
            }
          }).catch((error) => {
            setIsActiveLoading(false)
          });

        var person = null;
        //check si existen clientes en listas negras
        for (var i = 0; i < dataClientList.length; i++) {
          if (dataClientList[i].blacklist[dataClientList[i].blacklist.length - 1].blackList === true) {
            person = dataClientList[i];
            setIsActiveLoading(false)
            break;
          }
        }
        if (person !== null && option === opt.PROCESS_LISTAEXCLUSION) {
          option = opt.PROCESS_CUMPLIMIENTO;
          setIsActiveLoading(false)
        }

        break;
      }
      case opt.PROCESS_BUSQUEDADESCARTE: {
        if (dataClientList.length > 0) {
          saveJBPMProcess(option);
          break;
        }
        else {
          showMessage(t("Youmustenteratleastoneclient"), true);
          return;
        }
      }
      default: {
        saveJBPMProcess(option);
        break;
      }
    }
  }

  async function saveJBPMProcess(option) {

    if (locationData.instanceId === undefined || locationData.instanceId.length <= 0) {
      var result = await bpmServices.createNewInstance();
      if (result !== undefined) {

        //instanceId:result.instanceId,taskId:result.taskId,taskStatus:result.status
        locationData.instanceId = result.instanceId;
        locationData.taskId = result.taskId;
        locationData.taskStatus = result.status;

        sessionHelper.save(opt.VARNAME_LOCATIONDATA, locationData);

        //Actualizamos Variables
        var values = { "transactionId": locationData.transactionId };
        await bpmServices.updatevariables(locationData.instanceId, values);
      }
      else {
        //Mensaje ERROR
        setIsActiveLoading(false)
        showMessage(t("TheProcessCouldNotFinish"), true);
        return;
      }
    }

    var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
    var infoBpmModel = new InfoBpmModel(locationData.instanceId, locationData.transactionId,
      opt.PROCESS_BUSQUEDADESCARTE, opt.ACT_NONE, maindebtor?.personId);
    infoBpmModel.personName = maindebtor !== undefined ? (maindebtor.typePerson == "2" ? maindebtor.name : (maindebtor.name + " " + maindebtor.name2 + " " + maindebtor.lastName + " " + maindebtor.lastName2)) : "";
    infoBpmModel.personName = infoBpmModel.personName.trim();

    var credentials = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);
    infoBpmModel.emailto = credentials.email;

    console.log("infoBpmModel", infoBpmModel, maindebtor);

    switch (option) {
      case opt.PROCESS_CANCELPROCESS: {
        setIsActiveLoading(false)
        bpmServices.abortProcess(locationData.instanceId)
          .then((data) => {
            if (data !== undefined) {
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              showMessage(t("TheProcessCouldNotFinish"), true);
            }
          });
        break;
      }
      case opt.PROCESS_BUSQUEDADESCARTE: {
        setIsActiveLoading(false)
        infoBpmModel.processId = opt.PROCESS_BUSQUEDADESCARTE;
        infoBpmModel.activityId = opt.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": opt.PROCESS_BUSQUEDADESCARTE.toString(),
          "activityId": opt.ACT_DATOSGENERALES.toString(),
          "transactionId": locationData.transactionId.toString()
        };
        bpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            if (data !== undefined) {
              history.push(url.URL_DASHBOARD);
            }
            else {
              showMessage(t("ErrorSaveMessage"), true);
            }
          });
        break;
      }
      case opt.PROCESS_CUMPLIMIENTO: {
        setIsActiveLoading(false)
        infoBpmModel.processId = opt.PROCESS_CUMPLIMIENTO;
        infoBpmModel.activityId = opt.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": opt.PROCESS_CUMPLIMIENTO.toString(),
          "activityId": opt.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "customerId": "",
          "applicationNumber": "",
          "procedureNumber": "",
          "decision": "si"
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog(opt.APPLICATION_STATUS_NREC);
              setactivitySuccess(true);
              //history.push(url.URL_DASHBOARD);
              //showMessage(t("TheProcessCouldNotFinish"));
            }
            else {
              //Mensaje ERROR
              showMessage(t("ErrorSaveMessage"), true);
            }
          });
        break;
      }
      case opt.PROCESS_LISTAEXCLUSION: {

        infoBpmModel.processId = opt.PROCESS_LISTAEXCLUSION;
        infoBpmModel.activityId = opt.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": opt.PROCESS_LISTAEXCLUSION.toString(),
          "activityId": opt.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "customerId": "",
          "applicationNumber": "",
          "procedureNumber": "",
          "decision": "no"
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              setIsActiveLoading(false);
              saveAutoLog(null);
              setactivitySuccess(true);
            }
            else {
              //Mensaje ERROR
              showMessage(t("ErrorSaveMessage"), true);
            }
          }).catch(e => {
            setIsActiveLoading(false)
          });
        break;
      }
      default:
        break;
    }
  }

  function setError() {
    throw new Error("erro fatal");
  }

  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
  }

  async function saveAutoLog(APPLICATION_STATUS) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", opt.PROCESS_BUSQUEDADESCARTE, opt.ACT_NONE, opt.BPM_ACTIVITY_01)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = t("ActivityHasBeenFinishedSuccessfully");
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }

  async function setDeleteLog(clientDataDeleted) {
    setupdatedataLog(false)
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", opt.PROCESS_BUSQUEDADESCARTE, opt.ACT_NONE, opt.BPM_ACTIVITY_01)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = t("ParticipantHasBeenDeleted") + ": " + (clientDataDeleted.name + " " + clientDataDeleted.secondName + " " + clientDataDeleted.lastName + " " + clientDataDeleted.secondSurname);
    console.log("setDeleteLog", log.observations)
    log.requestId = 0;
    log.statusDescription = "";
    saveLogProcess(log);
    setupdatedataLog(true)
  }

  return (
    <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>
      <div className="page-content">
        <Breadcrumbs title={t("CommercialCredit")} breadcrumbItem={t("PreRequest")} />
        <HorizontalSteeper processNumber={1} activeStep={0}></HorizontalSteeper>
        <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
          <Col md="3" style={{ textAlign: "left" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(opt.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
          </Col>
          <Col md="9" style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ marginRight: "5px" }} onClick={() => { onSaveProcess(opt.PROCESS_BUSQUEDADESCARTE) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            <Button color="success" type="button" style={{}} onClick={() => { onSaveProcess(opt.PROCESS_LISTAEXCLUSION) }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
          </Col>
        </Row>
        <Card>
          <CardHeader>
            <Row>
              <Col md={6}>
                <h4 className="card-title">{t("PreRequest")}</h4>
                <p className="card-title-desc">{t("This form is official and must be filled out correctly")}</p>
              </Col>
              <Col md={6}>
                <Row>
                  <Col sm={12} style={{ textAlign: "right" }}>
                    <h5 className="card-title" style={{ textAlign: "right" }}>{t("Tramit")}:{" "}#{locationData?.transactionId}</h5>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardHeader>

          <CardBody>
            <Row>
              <Col md="6">
                <h5 className="card-sub-title">{t("ParticipantsList")}</h5>
              </Col>
              <Col md={6} style={{ textAlign: "right", }}>
                <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => { showSearchClient() }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
              </Col>
            </Row>

            <Row>
              <Col md="12">

                <div className="table-responsive styled-table-div">
                  <Table className="table table-striped table-hover styled-table">
                    <thead>
                      <tr>
                        <th>{t("PersonType")}</th>
                        <th>{t("FullName")}</th>
                        <th>{t("IdentificationType")}</th>
                        <th>{t("IdentificationNumber")}</th>
                        <th>{t("Roles")}</th>
                        <th>{t("WatchList")}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataClientList !== null && dataClientList !== undefined && dataClientList.length > 0 ?
                        dataClientList.map((item, index) => (
                          <tr key={index}>
                            <td>{getPersnoType(Number(item.personType)).label}</td>
                            <td>{Number(item.personType) > 1 ? (item.name) : (item.name + " " + item.secondName + " " + item.lastName + " " + item.secondSurname)}</td>
                            <td>{getIdentificationType(item.idType).label}</td>
                            <td>{item.clientDocumentId}</td>
                            <td>
                              {item.roles !== undefined ?
                                item.roles.map((rol, index) => (
                                  rol.roleDescription + " - "
                                )) : null}
                            </td>
                            <td>
                              {item.blacklist !== undefined && item.blacklist.length > 0 ?
                                (item.blacklist[item.blacklist.length - 1].blackList === true ? "Aplica" : "No Aplica") : "Sin Verificar"}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <Link to="#" onClick={(e) => { onEditClient(item) }}><i className="mdi mdi-border-color mdi-24px"></i></Link>
                              <Link to="#" onClick={(e) => { onDeleteClient(item) }}><i className="mdi mdi-trash-can-outline mdi-24px"></i></Link>
                            </td>
                          </tr>
                        )) :
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
          </CardBody>

          {locationData && mainPerson ?
            <CardBody>
              <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_BUSQUEDADESCARTE, OPTs.ACT_NONE)} />
            </CardBody> : null}

          {locationData ?
            <CardBody>
              <AttachmentFileCore attachmentFileInputModel={attachmentFileInputModel} />
            </CardBody>
            : null}

          {!openNewClient ?
            <React.Fragment>

              <CardFooter>
                <Row>
                  <Col md="12">
                    <Alert show={msgData.show} variant={msgData.isError ? "danger" : "success"} dismissible onClose={() => { console.log("onClose"); setmsgData({ show: false, msg: "", isError: false }) }}>
                      {msgData.msg}
                    </Alert>
                  </Col>
                </Row>
              </CardFooter>
            </React.Fragment>
            : null
          }
        </Card>


        {locationData ?
          <LogProcess updatedata={updatedataLog} logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", opt.PROCESS_BUSQUEDADESCARTE, opt.ACT_NONE, opt.BPM_ACTIVITY_01)} />
          : null}


        <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
          <Col md="3" style={{ textAlign: "left" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(opt.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
          </Col>
          <Col md="9" style={{ textAlign: "right" }}>
            <Button color="primary" type="button" style={{ marginRight: "5px" }} onClick={() => { onSaveProcess(opt.PROCESS_BUSQUEDADESCARTE) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
            <Button color="success" type="button" style={{}} onClick={() => { onSaveProcess(opt.PROCESS_LISTAEXCLUSION) }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
          </Col>
        </Row>

        {showModalSearchClient ?
          <ModalSearchClient isOpen={showModalSearchClient} toggle={() => { showSearchClient(!showModalSearchClient) }} onClientSelect={(data) => { loadClientDataT24(data); showSearchClient(false); }} onNewClientSelect={(data) => { var person = new PersonModel(); person.clientDocumentId = data !== undefined ? data : ""; console.log("selectedperson", data, person); setselectedClient(data !== undefined ? person : undefined); onOpenNewClient(); showSearchClient(false) }} />
          : null}

        {locationData ?
          <ModalClientForm isOpen={openNewClient} toggle={() => { onOpenNewClient(!openNewClient) }} transactId={locationData.transactionId} clientSelected={selectedClient} onCancel={() => { onOpenNewClient(false); getProcessClients(locationData.transactionId) }} checkDebtorShareholders={checkDebtorShareholders} />
          : null}

        {locationData && displayModalBitacora ?
          <ModalBitacora logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", opt.PROCESS_CUMPLIMIENTO, opt.ACT_NONE, opt.BPM_ACTIVITY_02)}
            successSaved={() => { onSaveProcess(optionSelected); }}
            isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
          : null}


        {activitySuccess ? (
          <SweetAlert
            success
            title={t("SuccessDialog")}
            confirmButtonText={t("Accept")}
            onConfirm={() => {
              history.push(url.URL_DASHBOARD);
            }}
          >
            {t("ActivityFinishedSuccessfully")}
          </SweetAlert>
        ) : null}

        {confirm_alert ? (
          <SweetAlert
            title={t("Areyousure")}
            warning
            showCancel
            confirmButtonText={t("Yesdeleteit")}
            cancelButtonText={t("Cancel")}
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            onConfirm={() => {
              const apiBack = new BackendServices();
              apiBack.eliminarOrquestadoListaPersonaSolicitud(dataDelete)
                .then((resp) => {
                  if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                  } else {
                    setconfirm_alert(false)
                    setDeleteLog(dataDelete);
                    getProcessClients(dataDelete.transactId);
                  }

                }).catch((error) => { });
            }}
            onCancel={() => setconfirm_alert(false)}
          >
            {t("Youwontbeabletorevertthis")}
          </SweetAlert>
        ) : null}

      </div>
    </LoadingOverlay>
  )
}

export default PreRequest
