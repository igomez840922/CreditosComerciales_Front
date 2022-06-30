/*ExclusionList = Lista de Exclusion*/
import React, { useState } from "react"
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom'
import LoadingOverlay from 'react-loading-overlay';
import ModalEndProcess from "../../../components/EndProcess/ModalEndProcess"
import * as OPTs from "../../../helpers/options_helper"
import * as url from "../../../helpers/url_helper"

import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  CardFooter,
  CardHeader,
  Button
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"
import { Link } from "react-router-dom"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"

import FormResult from "./FormResultados"
import ModalAdvanceOptions from "./ModalAdvanceOptions"
import ModalCloseOptions from "./ModalCloseOptions"
import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import SweetAlert from "react-bootstrap-sweetalert";
import { useTranslation } from "react-i18next";
import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';

import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";

import { saveLogProcess } from "../../../helpers/logs_helper";

import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";

const LIST = [
  "Trabajo forzoso significa todo trabajo o servicio, que no se realiza voluntariamente, que se extrae de un individuo bajo la amenaza de la fuerza o la pena según lo definido en los convenios de la OIT.",
  "Las personas solo pueden ser empleadas si tienen al menos 14 años, como se define en los Convenios Fundamentales de Derechos Humanos de la OIT (Convenio de edad mínima C138, Art.2), a menos que la legislación local especifique la asistencia escolar obligatoria o la edad mínima para trabajar. En tales casos, se aplicará la edad más avanzada.",
  "Destrucción significa la (1) eliminación o disminución severa de la integridad de un área causada por un cambio importante a largo plazo en el uso de la tierra o el agua o (2) modificación de un hábitat de tal manera que la capacidad del área para mantener su papel está perdido.",
  `Las áreas de Alto Valor de Conservación (AVC) se definen como hábitats naturales donde estos valores se consideran de gran importancia o importancia crítica (ver <a href="http://www.hcvnetwork.org" target="_blank">http://www.hcvnetwork.org)</a>.`,
  "Esto no se aplica a la compra de equipos médicos, equipos de control de calidad o cualquier otro equipo donde se entiende que la fuente radiactiva es trivial y / o está adecuadamente protegida.",
  "Para las empresas, \"sustancial\" significa más del 10% de sus balances o ganancias consolidadas.<br>Para las instituciones financieras y los fondos de inversión, \"sustancial\" significa más del 10% de su cartera subyacente.",
  "Se exceptúan la producción y/ o distribución de cerveza, vinos, ron y seco (bebida alcohólica destilada de la caña de azúcar de origen panameño).",
]

const ListaExclusion = props => {

  const [isReadOnly, setReadOnly] = useState(false);

  const history = useHistory();
  const location = useLocation()
  //Data que recibimos en el location
  const [locationData, setLocationData] = useState(undefined);

  const { t, i18n } = useTranslation();

  const [dataList, setDataList] = useState([]); //items de la lista de exclusion
  const [dataListSelected, setDataListSelected] = useState([]); //items selected de la lista de exclusion       
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [displayModalAdvanceOptions, setDisplayModalAdvanceOptions] = useState(false);
  const [displayModalCloseOptions, setDisplayModalCloseOptions] = useState(false);
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);

  const [mainDebtor, setmainDebtor] = useState(null);
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());

  const [checked, setchecked] = useState(false);
  const [listDetail, setListDetail] = useState(undefined);
  //On Mounting (componentDid Mount)
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

    loadDetail()
  }, []);
  React.useEffect(() => {
    let lista = document.getElementsByClassName("listaExclusion");
    for (var i = 0; i < lista.length; i++) {
      for (let j = 0; j < dataListSelected.length; j++) {
        if (dataListSelected[j].exclusionCatListId == dataList[i].exclusionId) {
          document.getElementById(dataList[i].exclusionId).checked = true;
          setchecked(true);
        }
      }
    }
  }, [props, dataListSelected]);

  function loadDetail() {
    setListDetail(LIST.map((listDetail, index) => (
      <div key={index}>
        <div className="d-flex flex-row mx-3" style={{ fontSize: '12px' }}>
          <Label style={{ marginRight: '15px' }}>
            {index + 1})
          </Label>
          <p className="m-0" dangerouslySetInnerHTML={{ __html: listDetail }}>
          </p>
        </div>
      </div>
    )))
  }

  //Caraga Inicial de datos
  function fetchData(locationData) {
    console.log(locationData);
    if (locationData.readOnly != null) {
      setReadOnly(locationData.readOnly);
      if (locationData.readOnly && locationData.taskStatus == "Reservado") {
        bpmServices.checkAndStartTask(locationData)
          .then((iniresult) => {
            if (iniresult === false) {
              history.push(url.URL_DASHBOARD);
            }
          });
      }
    } else {
      setReadOnly(false);
    }

    loadMainDebtor(locationData);
    setLocationData(locationData);
    initializeData(locationData);
    UpdateTramite(locationData)
  }

  //Caraga Inicial
  function initializeData(locdata) {
    var processNumber = locdata ? locdata.transactionId : null;
    /* ---------------------------------------------------------------------------------------------- */
    /*                     Buscar en Servicio el ExclisionList de este proceso...                     */
    /* ---------------------------------------------------------------------------------------------- */
    backendServices.queryListExclusion().then((data) => {
      setDataList(data.exclusionCatListDTOList);
    }).catch((error) => {
      console.error('api error: ', error);
    });
    //{ transactId: location.data.transactionId, processId: location.data.processId, activityId: location.data.activityId }

    /* ---------------------------------------------------------------------------------------------- */
    /*                       Obtenemos los datos de la lista de exclusion record                      */
    /* ---------------------------------------------------------------------------------------------- */
    if (processNumber != null) {
      backendServices.consultListExclusionChecked({ transactId: processNumber }).then((data) => {
        let datos = data.getExclusionApplicationListDTOList;
        setDataListSelected(datos);

      }).catch((error) => {
        console.error('api error: ', error);
      });
    }
  }
  function startProcess(status, taskId) {
    if (status === "Ready") {
      bpmServices.startedStatusTask(taskId).then(resp => {
        if (resp === undefined) {
          history.push(url.URL_DASHBOARD);
        }
      });
    }
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  function loadMainDebtor(InputData) {
    backendServices.consultPrincipalDebtor(InputData.transactionId).then(resp => {
      //resp.personType
      //resp.identificationType
      //resp.customerNumberT24
      //resp.firstName
      //resp.secondName
      //resp.firstLastName
      //resp.secondLastName
      //resp.customerDocumentId
      // dataReturn.nuevoDato = ""
      setmainDebtor(resp)
    })
  }

  async function UpdateTramite(locationData){
    //moment().valueOf()
    var data = {
      transactId: locationData.transactionId,//9330
      instanceId: locationData.instanceId,
      currentProcessId: locationData.processId,//1
      nextProcessId: OPTs.PROCESS_INFORMEGESTION,//2
      responsible: "admin",
      requestId: "1"
    }
    
    await backendServices.actualizarTramite(data)
  }

  //Modal Opciones para avanzar
  function toggleModalAdvanceOptions() {
    setDisplayModalAdvanceOptions(!displayModalAdvanceOptions);
  }
  //Modal Opciones al Salir
  function toggleModalCloseOptions() {
    setDisplayModalCloseOptions(!displayModalCloseOptions);
  }

  function onSelectOption(e) {
    if (document.getElementById(e.exclusionId).checked) {
      setchecked(true);
      backendServices.saveListExclusion(locationData.transactionId, e.exclusionId).then(resp => {
        if (resp === undefined) {
          //Mensaje ERROR
          seterror_msg(t("ErrorSaveMessage") + " " + t("ExclusionList"))
          seterror_dlg(false)
          return;
        }
      });
    } else {
      setchecked(false);
      backendServices.removeCheckedExclusionList(locationData.transactionId, e.exclusionId).then(resp => {
        if (resp === undefined) {
          //Mensaje ERROR
          seterror_msg(t("ErrorSaveMessage") + " " + t("ExclusionList"))
          seterror_dlg(false)
          return;
        }
      });
    }
  }

  //Chequear si existen opciones seleccionadas en la lista
  function checkSelectedOptions() {
    /* ---------------------------------------------------------------------------------------------- */
    /*              chequear si tiene seleccionada alguna opcion de la lista de exclusion             */
    /*              mostrar mensaje para confirmacion y finalizar proceso                             */
    /* ---------------------------------------------------------------------------------------------- */
    var checkboxes = document.getElementsByClassName("listaExclusion");
    let check = 0;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        check++;
      }
    }

    if (check > 0) {
      setDisplayModalAdvanceOptions(true);
    } else {
      //Avanzamos el Proceso
      onSaveProcess(OPTs.PROCESS_INFORMEGESTION);
    }
  }

  //Salvando el Proceso y le pasamos una opcion: 1-Finalizar Proceso, 2- Salvarlo, 3- A Cumplimmineto, 4- Avanzar a IGR
  function onSaveProcess(option) {
    let tipo = false;
    switch (option) {
      case OPTs.PROCESS_INFORMEGESTION: {
        //Guardamos la seleccion
        var checkboxes = document.getElementsByClassName("listaExclusion");
        for (var i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked) {
            tipo = true;
            option = OPTs.PROCESS_CANCELPROCESS;
          }
        }
        break;
      }
    }


    saveJBPMProcess(option, tipo);

  }

  async function saveJBPMProcess(option, validacion = false) {

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
              saveAutoLog(null, validacion)
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("ErrorSaveMessage"))
              seterror_dlg(false)
            }
          });
        break;
      }
      case OPTs.PROCESS_LISTAEXCLUSION: {
        infoBpmModel.processId = OPTs.PROCESS_LISTAEXCLUSION;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_LISTAEXCLUSION.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId.toString(),
          "customerId": locationData.customerId.toString(),
          "applicationNumber": "",
          "procedureNumber": "",
          //"decision":"no"          
        };
        bpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            if (data !== undefined) {
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("ErrorSaveMessage"))
              seterror_dlg(false)
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
          "activityId": OPTs.ACT_DATOSGENERALES.toString(),
          "transactionId": locationData.transactionId.toString(),
          "customerId": locationData.customerId.toString(),
          "applicationNumber": "",
          "procedureNumber": "",
          //"decision":"no"          
        };
        bpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog(null)
              history.push({
                pathname: url.URL_MANAGEMENTREPORT,
                data: locationData,
              });
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("ErrorSaveMessage"))
              seterror_dlg(false)
            }
          });

        break;
      }
    }
  }

  ////////// PARTE ES LA FINAL DEL PROCESO ///////
  //Modal Para mostrar Comentario de Fin de Proceso
  function showModalEndProcess(show = true) {
    setdisplayModalEndProcess(show);
  }

  //salvar comentario de end process
  function onSaveEndProcess(values) {

    //Salvar los comentarios en Bitacora    
    locationData["endProcessComment"] = values.txtComment;

    UpdateDataModel(locationData);

    onSaveProcess(OPTs.PROCESS_CANCELPROCESS);
  }

  //Actualizamos El Modelo de Datos segun va cambiando
  function UpdateDataModel(data) {
    setLocationData(data);
  }

  async function saveAutoLog(APPLICATION_STATUS, validacion = false) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_LISTAEXCLUSION, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_03)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = validacion ? t("Presents a match in the exclusion list") : t("NotCoincidenceInExclusionList");
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title={t("CommercialCredit")} breadcrumbItem={t("ExclusionList")} />

        <HorizontalSteeper processNumber={1} activeStep={1}></HorizontalSteeper>

        <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
          {!isReadOnly ?
            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={3} style={{ textAlign: "left" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
              </Col>
              <Col md={9} style={{ textAlign: "right" }}>
                <Button color="primary" type="button" style={{ marginRight: "5px" }} onClick={() => { onSaveProcess(OPTs.PROCESS_LISTAEXCLUSION) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                <Button color="success" type="button" style={{}}
                  onClick={() => { checkSelectedOptions(); }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
              </Col>
            </Row> : <Row style={{ marginBottom: "15px" }} />
          }


          <Card>
            <CardHeader>
              <Row>
                <Col md={6}>
                  <h4 className="card-title">{t("ExclusionList")}</h4>
                  <p className="card-title-desc">{t("Selectifyoumeetanyofthefollowingpoints")}</p>
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
              {dataList.length > 0 && (
                <FormResult results={dataList} dataCheck={dataListSelected} setDataListSelected={setDataListSelected} onSelectOption={onSelectOption} />
              )}
            </CardBody>
            <CardFooter>
              {listDetail}
              {/*
              <Row>
                <Col md={3} style={{ textAlign: "left"}}>
                  <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
                </Col>
                <Col md={9} style={{ textAlign: "right"}}>
                  <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_LISTAEXCLUSION) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                  <Button color="success" type="button"
                    onClick={() => { checkSelectedOptions(); }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("ManagementReport")}</Button>
                </Col>
              </Row>
              */}
            </CardFooter>
          </Card>

          {(locationData !== undefined && locationData.customerId !== null && locationData.customerId !== undefined && locationData.customerId.length > 0) ? (<LogProcess locationData={locationData} />) : null}

        </LoadingOverlay>

        {locationData ?
          <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_LISTAEXCLUSION, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_03)} />
          : null}

        {!isReadOnly ?
          <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
            <Col md={3} style={{ textAlign: "left" }}>
              <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
            </Col>
            <Col md={9} style={{ textAlign: "right" }}>
              <Button color="primary" type="button" style={{ marginRight: "5px" }} onClick={() => { onSaveProcess(OPTs.PROCESS_LISTAEXCLUSION) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
              <Button color="success" type="button" style={{}}
                onClick={() => { checkSelectedOptions(); }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
            </Col>
          </Row> : null
        }




        <ModalCloseOptions onSaveProcess={onSaveProcess} isOpen={displayModalCloseOptions} toggle={() => { toggleModalCloseOptions() }} />
        <ModalAdvanceOptions onSaveProcess={onSaveProcess} isOpen={displayModalAdvanceOptions} toggle={() => { toggleModalAdvanceOptions() }} />
        <ModalEndProcess onSaveEndProcess={onSaveEndProcess} isOpen={displayModalEndProcess} toggle={() => { showModalEndProcess(false) }} />

        {successSave_dlg ? (
          <SweetAlert
            success
            title={t("SuccessDialog")}
            confirmButtonText={t("Confirm")}
            cancelButtonText={t("Cancel")}
            onConfirm={() => {
              setsuccessSave_dlg(false)

              history.push(url.URL_DASHBOARD);
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
    </React.Fragment>
  )
}

export default (withTranslation()(ListaExclusion))
