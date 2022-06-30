import React, { useState } from "react"
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom'
import * as opt from "../../../helpers/options_helper"
import * as url from "../../../helpers/url_helper"
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
import { AvForm, AvField } from "availity-reactstrap-validation"
import { Link } from "react-router-dom"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { useTranslation } from "react-i18next";
import LoadingOverlay from 'react-loading-overlay';
import ClientForm from "../1_Presolicitud/ClientForm";
import SweetAlert from "react-bootstrap-sweetalert";
import ModalEndProcess from "../../../components/EndProcess/ModalEndProcess";
import { PersonModel } from '../../../models/Common/PersonModel';
import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';
import { BackendServices, CoreServices, BpmServices, } from "../../../services";

import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";
import ModalBitacora from "../../../components/Common/ModalBitacora";

import AttachmentFileCore from '../../../components/Common/AttachmentFileCore';
import { AttachmentFileInputModel } from "../../../models/Common/AttachmentFileInputModel"
import { saveLogProcess } from "../../../helpers/logs_helper";

import LocalStorageHelper from "../../../helpers/LocalStorageHelper";

const Compliance = props => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  //Data que recibimos en el location
  const [locationData, setLocationData] = useState(undefined);
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [openNewClient, setopenNewClient] = useState(false);
  //Datos de la Tabla de Clientes
  const [dataClientList, setdataClientList] = useState([]);
  //Cliente seleccionado
  const [selectedClient, setselectedClient] = useState(undefined);
  const [identificationTypeList, setidentificationTypeList] = useState([]);
  const [personTypeList, setpersonTypeList] = useState([]);
  //mostrar el modal para la opción de finalizar proceso
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());

  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);
  const [optionSelected, setoptionSelected] = useState(null);
  const [mainDebtor, setmainDebtor] = useState(null);
  const [localStorageHelper, setlocalStorageHelper] = useState(new LocalStorageHelper());
  
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
    loadIdentificationTypes();
    loadPersonTypes();
    getProcessClients(locationData.transactionId);
    loadMainDebtor(locationData.transactionId)
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
  //cargar deudor principal
  async function loadMainDebtor(transactionId) {
    var result = await backendServices.consultPrincipalDebtor(transactionId)
    if(result!==undefined && result !== null){
      setmainDebtor(result);
    }    
  }
  
  //se buscan todos los clientes de este proceso 
  function getProcessClients(transactionId) {
    backendServices.consultarOrquestadoListaPersonaSolicitud(transactionId)
      .then((data) => {
        if (data !== null && data !== undefined) {
          setdataClientList(data)
          if (data.length <= 0) {
            setselectedClient(new PersonModel());
            onOpenNewClient();
          }
        }
      }).catch((error) => { });
  }
  //Abrir formulario Persona
  function onOpenNewClient(show = true) {
    setopenNewClient(show)
  }
  //Editar Persona
  function onEditClient(dataClient) {
    setselectedClient(dataClient)
    onOpenNewClient();
  }
  //Eliminar Persona
  function onDeleteClient(dataClient) {
    //eliminarOrquestadoListaPersonaSolicitud
    backendServices.eliminarOrquestadoListaPersonaSolicitud(dataClient)
      .then((data) => {
        getProcessClients(dataClient.transactId);
      }).catch((error) => { });
  }
  //retorna el Tipo de Persona
  function getPersnoType(pType) {
    return personTypeList.find(x => x.value === pType);
  }
  //retorna el Tipo de identificacion
  function getIdentificationType(idType) {
    return identificationTypeList.find(x => x.value === idType);
  }
  //mostrar mensaje 
  function showMessage(message, isError = false) {

    setmsgData({ show: true, msg: message, isError: isError })
  }
  ////////// PARTE ES LA FINAL DEL PROCESO ///////
  //Modal Para mostrar Comentario de Fin de Proceso
  
  function showModalBitacora(show = true){
    setdisplayModalBitacora(show);
  }
  //Salvando el Proceso y le pasamos una opcion: 1-Finalizar Proceso, 2- Salvarlo, 3- A Cumplimmineto, 4- Avanzar a IGR
  async function onSaveProcess(option) {
    switch (option) {
      case opt.PROCESS_LISTAEXCLUSION:{
        //chequear si existe algun deudor para poder continuar
        if (mainDebtor !== null && mainDebtor !== undefined) {
          saveJBPMProcess(option);
        }
        else {
          //Mensaje ERROR
          showMessage(t("Youmustselectatleastonedebtor"), true);
          await loadMainDebtor(locationData.transactionId)
        }
        break;
      }
      case opt.PROCESS_CUMPLIMIENTO:{
        if(dataClientList.length>0){
          saveJBPMProcess(option);
          break;
        }
        else{          
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
    
    var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
    console.log("maindebtor",maindebtor);

    var infoBpmModel = new InfoBpmModel(locationData.instanceId,locationData.transactionId,
      opt.PROCESS_CUMPLIMIENTO,opt.ACT_NONE,
      maindebtor?.personId
    );
    infoBpmModel.personName=maindebtor!==undefined?(maindebtor.name + " " +maindebtor.name2 + " " +maindebtor.lastName + " " +maindebtor.lastName2 ):"";
    infoBpmModel.emailto = locationData.infobpm.emailto;

    switch (option) {
      case opt.PROCESS_CANCELPROCESS: {
        bpmServices.abortProcess(infoBpmModel.instanceId)
          .then((data) => {
            if (data !== undefined) {
              
              saveAutoLog(opt.APPLICATION_STATUS_CANC,"");
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              showMessage(t("TheProcessCouldNotFinish"), true);
            }
          });
        break;
      }
      case opt.PROCESS_CUMPLIMIENTO: {
        infoBpmModel.processId=opt.PROCESS_CUMPLIMIENTO;
        infoBpmModel.activityId=opt.ACT_NONE;
        
        var values = {
          "info":JSON.stringify(infoBpmModel),
          "processId": opt.PROCESS_CUMPLIMIENTO.toString(),
          "activityId": opt.ACT_NONE.toString(),
          "transactionId": locationData.transactionId
        };
        bpmServices.updatevariables(infoBpmModel.instanceId, values)
          .then((data) => {
            if (data !== undefined) {
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              showMessage(t("ErrorSaveMessage"), true);
            }
          });
        break;
      }
      case opt.PROCESS_REFUSED: {
        infoBpmModel.processId=opt.PROCESS_REFUSED;
        infoBpmModel.activityId=opt.ACT_NONE;
        
        var credentials = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);
        var email={  
          "CORREO_EJECUTIVO_RELACION": infoBpmModel.emailto,
          "TIPO_NOTIFICACION": "step-01",
          "NRO_TRAMITE":locationData.transactionId
        }

        var values = {
          "info":JSON.stringify(infoBpmModel),
          "processId": opt.PROCESS_REFUSED.toString(),
          "activityId": opt.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "customerId": "",
          "applicationNumber": "",
          "procedureNumber": "",
          "decision": "si",
          "peticioncorreo":email
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog(opt.APPLICATION_STATUS_RECH,"");
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              showMessage(t("ErrorSaveMessage"), true);
            }
          });
        break;
      }
      case opt.PROCESS_LISTAEXCLUSION: {
        infoBpmModel.processId=opt.PROCESS_LISTAEXCLUSION;
        infoBpmModel.activityId=opt.ACT_NONE;
        
        var values = {
          "info":JSON.stringify(infoBpmModel),
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
              saveAutoLog();
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              showMessage(t("ErrorSaveMessage"), true);
            }
          });
        break;
      }
    }
  }

  async function saveAutoLog(APPLICATION_STATUS=null,observations=null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", opt.PROCESS_CUMPLIMIENTO, opt.ACT_NONE, opt.BPM_ACTIVITY_02)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations!==null? t("ActivityHasBeenFinishedSuccessfully"):observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }
  
  
  return (
    <div className="page-content">
      <Breadcrumbs title={t("CommercialCredit")} breadcrumbItem={t("Compliance")} />
      <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>

      {!openNewClient ?
            <React.Fragment>
           
                <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
                  <Col md="3" style={{ textAlign: "left" }}>
                    <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(opt.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
                  </Col>
                  <Col md="9" style={{ textAlign: "right" }}>
                  <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(opt.PROCESS_REFUSED); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("NotRecommend")}</Button>
                  <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(opt.PROCESS_CUMPLIMIENTO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                  <Button color="success" type="button" onClick={() => { setoptionSelected(opt.PROCESS_LISTAEXCLUSION); showModalBitacora()}}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Recommend")}</Button>
                  </Col>
                </Row>
            </React.Fragment>
            : null
          }

        <Card>
        <CardHeader>
              <Row>
                <Col md={6}>
                  <h4 className="card-title">{t("Compliance")}</h4>
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
          
              
            {openNewClient ?
            <CardBody>
              <ClientForm transactId={locationData.transactionId} clientSelected={selectedClient} onCancel={() => { onOpenNewClient(false); getProcessClients(locationData.transactionId) }}></ClientForm>
            </CardBody>
              :
              <>
              <CardBody>
                  <Row>
                    <Col md="6">
                      <h5 className="card-sub-title">{t("ParticipantsList")}</h5>
                    </Col>
                    {/*<Col md={6} style={{ textAlign: "right", }}>
                      <h5 className="card-sub-title">
                        <Link to="#" onClick={() => { showSearchClient() }} title={t("Search")}><i className="mdi mdi-account-search-outline mdi-24px"></i>{" "}</Link>
                        &nbsp;&nbsp;
                        <Link to="#" onClick={() => { setselectedClient(undefined); onOpenNewClient() }} title={t("AddNew")}><i className="mdi mdi-account-plus-outline mdi-24px"></i>{" "}</Link>
                      </h5>

          </Col>*/}
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
                              {/* <th></th> */}
                            </tr>
                          </thead>
                          <tbody>

                            {dataClientList.length > 0 ?
                              dataClientList.map((item, index) => (
                                <tr>
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
                                      (item.blacklist[item.blacklist.length - 1].blackList === true ? "Aplica" : "No Aplica") : "No Aplica"}
                                  </td>
                                  {/* <td style={{ textAlign: "right" }}>
                                    <Link to="#" onClick={(e) => { onEditClient(item) }}><i className="mdi mdi-border-color mdi-24px"></i></Link>
                                    <Link to="#" onClick={(e) => { onDeleteClient(item) }}><i className="mdi mdi-trash-can-outline mdi-24px"></i></Link>
                                  </td> */}
                                </tr>
                              )) :
                              <td colspan="7"><div className="alert alert-info" style={{ textAlign: "center" }}>{t("NoData")}</div></td>
                            }
                          </tbody>
                        </Table>
                      </div>

                    </Col>
                  </Row>                  
              </CardBody>

              {locationData?
          <CardBody>
            <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, opt.PROCESS_BUSQUEDADESCARTE, opt.ACT_NONE)} />
          </CardBody>
          :null}      
              </>
            }
             {!openNewClient ?
             <Row>
                  <Col md="12">
                    <Alert show={msgData.show} variant={msgData.isError ? "danger" : "success"} dismissible onClose={() => { console.log("onClose"); setmsgData({ show: false, msg: "", isError: false }) }}>
                      {msgData.msg}
                    </Alert>
                  </Col>
                </Row>:null}

        </Card>
      </LoadingOverlay>

      {locationData?
        <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId,locationData.transactionId,0,"","",opt.PROCESS_CUMPLIMIENTO, opt.ACT_NONE, opt.BPM_ACTIVITY_02)}/>
      :null}

{!openNewClient ?
            <React.Fragment>
                
                <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
                  <Col md="3" style={{ textAlign: "left" }}>
                    <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(opt.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
                  </Col>
                  <Col md="9" style={{ textAlign: "right" }}>
                  <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(opt.PROCESS_REFUSED); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("NotRecommend")}</Button>
                  <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(opt.PROCESS_CUMPLIMIENTO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                  <Button color="success" type="button"  onClick={() => { setoptionSelected(opt.PROCESS_LISTAEXCLUSION); showModalBitacora()}}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Recommend")}</Button>
                  </Col>
                </Row>
            </React.Fragment>
            : null
          }
      
      {locationData && displayModalBitacora?
      <ModalBitacora logProcessModel={new LogProcessModel(locationData.instanceId,locationData.transactionId,0,"","",opt.PROCESS_CUMPLIMIENTO, opt.ACT_NONE,opt.BPM_ACTIVITY_02)}
        successSaved={() => { onSaveProcess(optionSelected); }} 
        isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
        :null}

    </div>
  )
}
export default Compliance