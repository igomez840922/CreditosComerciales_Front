/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { Link } from "react-router-dom"
import { useTranslation, withTranslation } from "react-i18next"
import * as url from "../../../../helpers/url_helper"
import * as OPTs from "../../../../helpers/options_helper";

import {
  Card,
  CardBody, CardHeader,
  Col, Row,
  Button,
  CardFooter,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../../components/Common/Breadcrumb"

import ResultadosBusqueda from "../../12_Abogado/PantallaDetalle/ResultadosBusqueda.js"

import SweetAlert from "react-bootstrap-sweetalert"

import { BpmServices, BackendServices } from "../../../../services";

import ModalEndProcess from "../../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../components/LogProcess/index";


import AttachmentFileCore from "../../../../components/Common/AttachmentFileCore";
import { AttachmentFileInputModel } from '../../../../models/Common/AttachmentFileInputModel';
import CheckListComponent from '../../../../components/Common/CheckList';

import { Tab, Tabs } from "react-bootstrap";

import HorizontalSteeper from "../../../../components/Common/HorizontalSteeper";

import {saveLogProcess} from "../../../../helpers/logs_helper";
import { options } from "toastr"

const PantallaBusqueda = props => {

  const { t, i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation()

  const [locationData, setLocationData] = useState(null);
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  //const [coreServices, setcoreServices] = useState(new CoreServices());

  const [mainDebtor, setmainDebtor] = useState(null);

  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

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

  async function checkToContinue() {

    //await guardarDatos();

    setTimeout(async function () {
      /*
      if(!formIsValid){
        showMessage({ msg: t("PleaseSaveDescicionBeforeContinue"), error: true, show: true });
        return;
      }
      */
      saveJBPMProcess(OPTs.PROCESS_FINISHED);
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

    var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
    var infoBpmModel = new InfoBpmModel( locationData.instanceId, locationData.transactionId,
      OPTs.PROCESS_SIGNCONTRACT, OPTs.ACT_NONE,
      maindebtor?.personId
    );
    infoBpmModel.personName = maindebtor !== undefined ? (maindebtor.typePerson=="2"?maindebtor.name:(maindebtor.name + " " + maindebtor.name2 + " " + maindebtor.lastName + " " + maindebtor.lastName2)) : "";
    infoBpmModel.fromProcess = locationData.infobpm.fromProcess;

    switch (option) {
      case OPTs.PROCESS_CANCELPROCESS: {
        bpmServices.abortProcess(infoBpmModel.instanceId)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog(OPTs.APPLICATION_STATUS_CANC,"");
              history.push(url.URL_DASHBOARD);
            }
            else {
              showMessage({ msg: t("TheProcessCouldNotFinish"), error: true, show: true });
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
      case OPTs.PROCESS_FINISHED: {

        console.log("saveJBPMProcess",locationData.infobpm.fromProcess)
       if(locationData.infobpm.fromProcess===null||locationData.infobpm.fromProcess===undefined ){
          await instanceNewProcessInstructivoDesembolso();
        }
         
        infoBpmModel.processId = OPTs.PROCESS_VALIDATEFILE;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_VALIDATEFILE.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId
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
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_VALIDATEFILE, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_17)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }

  async function instanceNewProcessInstructivoDesembolso(){

    var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
    var propousalData = await backendServices.consultGeneralDataPropCred(locationData.transactionId);
    //propousalData[0].requestId;
    var lfacilities = await backendServices.consultarFacilidades(propousalData[0]?.requestId ?? "");    
    for (var i = 0; i < lfacilities.length; i++){
      var facilidad = lfacilities[i];
      var result = await bpmServices.createNewInstanceDisbursementInstructions();
      if (result !== undefined) {

        console.log("facilidad",facilidad);
        //instanceId:result.instanceId,taskId:result.taskId,taskStatus:result.status
        //locationData.instanceId = result.instanceId;
        //locationData.taskId = result.taskId;
        //locationData.taskStatus = result.status;

        var infoBpmModel = new InfoBpmModel(result.instanceId,locationData.transactionId,
          OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT,
          OPTs.ACT_NONE,
          facilidad.debtor
        );
        infoBpmModel.personName=maindebtor!==undefined?(maindebtor.name + " " +maindebtor.name2 + " " +maindebtor.lastName + " " +maindebtor.lastName2 ):"";
        infoBpmModel["facilityTypeId"] = facilidad.facilityTypeId;
        
        //infoBpmModel.emailto = locationData.infobpm.emailto;

        //Actualizamos Variables        
        var values = {
          "info":JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT.toString(),
          "activityId": "0",
          "transactionId":locationData.transactionId,
          "customerId": "",
          "applicationNumber": "",
          "procedureNumber": "",
          "requestId": "",
          "facilityId": facilidad.facilityId,
          "facilityTypeId":facilidad.facilityTypeId,
          "decision": "",
          "id": "",
          "regresar": "", 
        };
        await bpmServices.updatevariables(result.instanceId, values);
      }
      else {
        //Mensaje ERROR
        //setIsActiveLoading(false)
        showMessage(t("TheProcessCouldNotFinish"), true);
        //return;
      }  
    }
    
    
  }

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


  return (
    <React.Fragment>

      <div className="page-content">

        <Breadcrumbs title={props.t("CommercialCredit")} breadcrumbItem={props.t("ArchiveCenter")} />


        <HorizontalSteeper processNumber={3} activeStep={ 3 }></HorizontalSteeper>

        <Row>
              <Col md={3} style={{ textAlign: "left"}}>
              </Col>
              <Col md={9} style={{ textAlign: "right"}}>
              <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_VALIDATEFILE) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
              <Button color="success" type="button"
                  onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
              </Col>
            </Row>
        
        <Card>

        <CardHeader>
              <Row>
                <Col md={6}>
                  <h4 className="card-title">{t("ArchiveCenter")}</h4>
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
              <Col md="12">
                <Tabs defaultActiveKey="1" id="uncontrolled-tab-example" className="mb-3">
                  <Tab className="m-4" key={1} eventKey={1} title={props.t("LegalDocumentation")}>
                    {<ResultadosBusqueda validacion={true} />}
                  </Tab>
                  <Tab className="m-4" key={2} eventKey={2} title={props.t("CheckList")}>
                  {locationData?
                    <CheckListComponent attachmentFileInputModel={ new AttachmentFileInputModel(locationData.transactionId,OPTs.CHECKLIST_PROCESS_ARCHIVO,OPTs.ACT_NONE)} />
                    :null}  
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

        </Card>
        
        {locationData ?
          <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_VALIDATEFILE, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_17)} />
          : null}

<Row>
              <Col md={3} style={{ textAlign: "left"}}>
              </Col>
              <Col md={9} style={{ textAlign: "right"}}>
              <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_VALIDATEFILE) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
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
              confirmButtonText= {t("Confirm")}
              cancelButtonText= {t("Cancel")}          
              onConfirm={() => { showMessage(); }}>
              {messageDlg.msg}
            </SweetAlert>
          ) : null
        }
      </div>

    </React.Fragment>
  )
}

PantallaBusqueda.propTypes = {
  selectedId: PropTypes.any,
  onClose: PropTypes.func.isRequired
}

export default (withTranslation()(PantallaBusqueda))
