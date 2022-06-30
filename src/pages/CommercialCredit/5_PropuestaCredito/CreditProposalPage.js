import React, { useState, useRef, useEffect } from "react"
import { useLocation, useHistory, Link } from 'react-router-dom'
import * as OPTs from "../../../helpers/options_helper"
import * as url from "../../../helpers/url_helper"
import moment from "moment";
import classnames from "classnames"
import { CreditProposalProvider } from '../../../components/PropuestaCreditoComercial/CreditProposalContext';
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  TabPane,
  Nav,
  NavLink,
  TabContent,
  Alert
} from "reactstrap"
import LoadingOverlay from "react-loading-overlay";
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import LoadingIndicator from "../../../components/UI/LoadingIndicator";
import SuccessMessage from "../../../components/UI/SuccessMessage";
import ModalCloseOptions from "../../../components/UI/ModalCloseOptions";
import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  ServicioExposicionCorporativa,
  ServicioResumenCambios,
  ServicioRefinanciamiento,
  ServicioChecklist,
} from "../../../services/PropuestaCredito";
import DatosGeneralesPropuesta from "./Secciones/DatosGenerales";
import { useTranslation } from "react-i18next/";
import ListaFacilidad from "./Secciones/FacilidadesSeccion";
import ExposicionCorportativa from "./Secciones/ExposicionCorporativa";
import ExposicionCorporativaClientes from "./Secciones/ExposicionCorporativaCliente";
import CheckList from "./Secciones/CheckList";
import ModalPrevisualizarPropCred from "./previsualizarPropCred";
import ChangeSummary from "./Secciones/ResumenCambios";
import ModalEndProcess from "../../../components/EndProcess/ModalEndProcess";
import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';

import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";

import ModalBitacora from "../../../components/Common/ModalBitacora";

import { saveLogProcess } from "../../../helpers/logs_helper";
import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";

import AutoSaveData from '../../../helpers/AutoSaveData';
import CorporatePresentation from "./Secciones/CorporatePresentation/CorporatePresentation";
import LevelAutonomy from "./Secciones/LevelAutonomy";
import { LevelAutonomyClass } from "./Secciones/LevelAutonomy.model";

const CreditProposalPage = (props) => {

  const [autoSaveData, setautoSaveData] = useState(new AutoSaveData());
  const location = useLocation();
  const history = useHistory();
  const [locationData, setLocationData] = useState(null);
  const [mainDebtor, setusuarioProspecto] = useState(null);
  const [dataGlobal, setdataGlobal] = useState({
    requestId: null,
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [changeSummaryItems, setChangeSummaryItems] = useState([]);
  const [facilityListItems, setFacilityListItems] = useState([]);
  const [identificationList, setIdentificationList] = useState([]);
  const [refinancing, setRefinancing] = useState([]);
  const [documentAuthors, setDocumentAuthors] = useState(null);
  const [checkListItems, setCheckListItems] = useState([]);
  const [displayModalCloseOptions, setDisplayModalCloseOptions] = useState(false);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [context, setContext] = useState({});
  const [datosGenerales, setDatosGenerales] = useState({});
  const [activeTab, setactiveTab] = useState(1);
  const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina
  const [validarDatos, setvalidarDatos] = useState(false); //loading de la pagina
  const [ModalPrevisualizardata, settoogleModalPrevisualizar] = useState(false);
  const servicioResumenCambios = new ServicioResumenCambios();
  const servicioRefinanciamiento = new ServicioRefinanciamiento();
  const servicioChecklist = new ServicioChecklist();
  const wizardRef = useRef();
  const creditProposalRef = useRef();
  const FacilidadesRef = useRef();
  const ResumenCambiosRef = useRef();
  const { t, i18n } = useTranslation();
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());
  //Riesgo Ambiental
  const [environmentalRisk, setenvironmentalRisk] = useState(null);

  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);
  const [optionSelected, setoptionSelected] = useState(null);
  const [errorHandler, setErrorHandler] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);

  const [errorHandlerIGR, setErrorHandlerIGR] = useState(false);
  const [errorMessageIGR, setErrorMessageIGR] = useState([]);

  const [levelAutonomy, setLevelAutonomy] = useState(0);
  const [viewAutonomy, setViewAutonomy] = useState(true);

  //On Mounting (componentDidMount)
  useEffect(() => {

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
        setLocationData(result);
        fetchData(result);
        dataSession = result
      }
    }



  }, []);




  useEffect(() => {
    if (dataGlobal.requestId != null) {
      setvalidarDatos(true)
    } else {
      setvalidarDatos(false)
    }
  }, [props, dataGlobal]);

  //Caraga Inicial de datos
  function fetchData(locationData) {

    backendServices.consultGeneralDataIGR(locationData.transactionId).then(IGR => {
      console.log(IGR)
      if (IGR?.bank?.code === '' || IGR?.bank?.name === '' || IGR?.economicActivity?.code === '' || IGR?.economicActivity?.name === '') {

        let errorIGR = [];

        (IGR?.bank?.code === '' || IGR?.bank?.name === '') && errorIGR.push(t("Banking"));
        (IGR?.economicActivity?.code === '' || IGR?.economicActivity?.name === '') && errorIGR.push(t("Economic Activity"));

        setErrorMessageIGR(errorIGR)
        setErrorHandlerIGR(true);
      }

    }).catch(err => {
      console.log(err)
    })

    //chequear si la tarea no ha sido iniciada

    bpmServices.checkAndStartTask(locationData)
      .then((iniresult) => {
        if (iniresult === false) {
          history.push(url.URL_DASHBOARD);
        }
      })
    initializeData(locationData);
    // update context
    setContext({
      transactionId: locationData.transactionId,
      customerId: locationData.customerId,
      instanceId: locationData.instanceId,
      requestId: locationData.requestId, // debe venir del resultado de guardar datos generales
    });
  }
  //Caraga Inicial
  function initializeData(params) {
    const { transactionId, requestId, customerId } = params;
    loadUserProspect(params.transactionId);
    loadEnvironmentalRisk(params.transactionId);
    loadDataGeneral(params);
    loadIdentification();
    //loadListFacility(params.transactionId);
    fetchReport(transactionId);
  }
  function loadEnvironmentalRisk(transactionId) {
    // consultarDeudorPrincipal
    backendServices.consultEnvironmentalAspectsIGR(transactionId)
      .then((data) => {
        if (data !== undefined) {
          setenvironmentalRisk(data.environmentalAspectsDTO);
        }
      });
  }
  function loadUserProspect(transactionId) {
    // consultarDeudorPrincipal
    backendServices.consultPrincipalDebtor(transactionId)
      .then((data) => {
        if (data !== undefined) {
          setusuarioProspecto(data);
        }
      });
  }
  async function loadDataGeneral(params) {



    await backendServices.consultGeneralDataPropCred(params?.transactionId ?? 0)
      .then((data) => {
        if (data !== undefined) {
          var datosgenerales = data.length == 0 ? undefined : data[0]?.requestId;
          if (datosgenerales === undefined || datosgenerales == null) {
            datosgenerales = data[data.length - 1];
            newDataGeneral(params);
            return;
          }
          setdataGlobal({})
          dataGlobal.requestId = datosgenerales
          setdataGlobal(dataGlobal)
          setDatosGenerales(data[0]);
          autoSaveData.saveInitialData(params?.transactionId ?? 0);
        }
        else {
        }
      });
  }
  async function newDataGeneral(params) {
    var data2 = {
      "transactId": Number(params?.transactionId ?? 0),
      "customerNumber": mainDebtor?.customerNumberT24,
      "revision": "",
      "preapproval": false,
      "customerNumber": "",
      "economicGroupNumber": "",
      "economicGroupName": "",
      "country": "",
      "activityCompany": "",
      "riskClassification": "",
      "minimumProvisionSIB": 0,
      "relatedPart": false,
      "approvalLevel": "",
      "accountExecutive": "",
      "responsibleUnit": "",
      "countryRisk": "",
      "requestDate": moment().format("YYYY-MM-DD"),
      "lastRequestDate": moment().format("YYYY-MM-DD"),
      "nextRevisionDate": moment().format("YYYY-MM-DD"),
      "proposedExpirationDate": moment().format("YYYY-MM-DD"),
      "flow": ""
    };
    // nuevoDatosGeneralesPropCred
    await backendServices.newDataGeneralPropCred(data2).then(async (data) => {
      if (data !== undefined) {
        await autoSaveData.saveInitialData(params?.transactionId ?? 0);
        var values = {
          "processId": OPTs.PROCESS_PROPUESTACREDITO,
          "activityId": OPTs.ACT_DATOSGENERALES,
          "transactionId": params?.transactionId ?? 0,
          "customerId": params?.customerId ?? "",
          "requestId": data.requestId,
          //"decision":"no"          
        };
        // updatevariables
        await bpmServices.updatevariables(locationData.instanceId, values)
          .then((data3) => { });

        locationData.requestId = data.requestId;
        setLocationData(locationData);
        // setvalidarDatos(true)
        setdataGlobal({})
        dataGlobal.requestId = data.requestId;
        setdataGlobal(dataGlobal)
        loadDataGeneral(data.requestId);
      }
    });
  }
  /*
  function loadListFacility(transactionId) {
    coreServices.getFacilitiesByTransaction(transactionId)
      .then(resp => {
        setFacilityListItems(resp);
      })
      .catch(err => {
        console.log(err);
      });
  }
  */
  function loadIdentification() {
    // consultarCatalogoTipoIdentificacion
    backendServices.consultarCatalogoTipoIdentificacion()
      .then((data) => {
        if (data !== null && data !== undefined) {
          setIdentificationList(data);
        }
      })
  }
  function fetchReport(transactionId) {
    // consultarResumenCambios
    servicioResumenCambios.consultarResumenCambios(transactionId)
      .then((results) => {
        setChangeSummaryItems(results);
      });
    // consultarBitacoraRefinanciamiento
    servicioRefinanciamiento.consultarBitacoraRefinanciamiento(transactionId)
      .then((results) => {
        setRefinancing(results);
      });
    // consultarListaCheckList
    servicioChecklist.consultarListaCheckList(transactionId)
      .then((results) => {
        setCheckListItems(results);
      });
    setDocumentAuthors({
      owner: { name: 'Carolina Delgado' },
      ceo: { name: 'Carolina Delgado' }
    });
  }
  function handleSaveFacility(newItem) {
    const newFacilities = [...facilityListItems, newItem];
    setFacilityListItems(newFacilities);
  }
  function toogleModalPrevisualizar() {
    settoogleModalPrevisualizar(!ModalPrevisualizardata);
    removeBodyCss()
  }
  //Modal Opciones al Salir
  function toggleModalCloseOptions() {
    setDisplayModalCloseOptions(!displayModalCloseOptions);
    removeBodyCss();
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

  //Salvando el Proceso y le pasamos una opcion: 1-Finalizar Proceso, 2- Salvarlo, 3- A Cumplimmineto, 4- Avanzar a IGR
  async function onSaveProcess(option) {
    let validate = false;
    switch (option) {
      case OPTs.PROCESS_INFORMEGESTION:
      case OPTs.PROCESS_PROPUESTACREDITO: {
        // submitData();
        //wizardRef.current.next();
        break;
      }
      case OPTs.PROCESS_ANALISISCREDITO:
      case OPTs.PROCESS_ASIGNARANALISISCREDITO: {
        // submitData();
        var result = false;

        // creditProposalRef.current.validateForm();

        // if (!creditProposalRef?.current?.dataReturn) {
        //   setIsActiveLoading(false);
        //   result = true;
        // }
        // if (creditProposalRef?.current?.dataReturn.status) {
        //   setIsActiveLoading(false);
        //   result = true;
        // }

        await Promise.allSettled([
          validateFacility(),
          backendServices.consultGeneralDataPropCred(locationData.transactionId)
        ]).then(promises => {

          let [{ value: facilities }, { value: dataProposal }] = promises;
          dataProposal = dataProposal[0];

          if (!facilities || dataProposal.accountExecutive === '' || dataProposal.requestDate === '' || dataProposal.lastRequestDate === '' || dataProposal.nextRevisionDate === '' || dataProposal.proposedExpirationDate === '' || dataProposal.country === '' || dataProposal.countryRisk === '') {

            let errors = [];

            !facilities && errors.push(t("Facilities"));
            dataProposal.accountExecutive === '' && errors.push(t("Account Executive"));
            dataProposal.requestDate === '' && errors.push(t("Application Date"));
            dataProposal.lastRequestDate === '' && errors.push(t("Last Application Date"));
            dataProposal.nextRevisionDate === '' && errors.push(t("Next Revision Date"));
            dataProposal.proposedExpirationDate === '' && errors.push(t("Account Executive"));
            dataProposal.revision === '' && errors.push(t("Revision Type"));
            dataProposal.country === '' && errors.push(t("Country Class"));
            dataProposal.countryRisk === '' && errors.push(t("Country Risk"));

            setErrorMessage(errors);
            setErrorHandler(true)
            validate = true;
            return;
          } else {
            setErrorMessage([]);
            setErrorHandler(false)
          }
        }).catch(err => {
          console.log(err)
        });
        break;
      }

      default:
        break;
    }
    console.log(validate)
    if (validate)
      return;

    console.log(option)
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
    infoBpmModel.toprocess = locationData.infobpm.toprocess;

    console.log(option)
    switch (option) {
      case OPTs.PROCESS_CANCELPROCESS: {
        console.log('test')
        bpmServices.abortProcess(infoBpmModel.instanceId)
          .then((data) => {
            console.log(data)
            if (data !== undefined) {

              saveAutoLog(OPTs.APPLICATION_STATUS_CANC, "");
              history.push(url.URL_DASHBOARD);
            }
            else {
              seterror_msg(props.t("TheProcessCouldNotFinish"))
              seterror_dlg(false)
            }
          });
        break;
      }
      case OPTs.PROCESS_PROPUESTACREDITO: {
        infoBpmModel.processId = OPTs.PROCESS_PROPUESTACREDITO;
        infoBpmModel.activityId = OPTs.ACT_NONE;
        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_PROPUESTACREDITO.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          //"decision":"no"          
        };
        bpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            history.push(url.URL_DASHBOARD);
            if (data !== undefined) {
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("ErrorSaveMessage"));
              // seterror_dlg(false);
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
          //"decision":"no"          
        };
        bpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            if (data !== undefined) {
              history.push({
                pathname: url.URL_MANAGEMENTREPORT,
                data: locationData,
              });
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("ErrorSaveMessage"));
              // seterror_dlg(false);
            }
          });
        break;
      }
      case OPTs.PROCESS_ANALISISCREDITO: { //Enviar a Analisis de Credito
        infoBpmModel.processId = OPTs.PROCESS_ANALISISCREDITO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        let autonomy = new LevelAutonomyClass();
        autonomy = await autonomy.getLevelAutonomy();

        if (infoBpmModel.toprocess !== undefined) {
          infoBpmModel.processId = infoBpmModel.toprocess;
          infoBpmModel.activityId = OPTs.ACT_NONE;
          values = {
            "info": JSON.stringify(infoBpmModel),
            "processId": infoBpmModel.toprocess.toString(),
            "activityId": OPTs.ACT_NONE.toString(),
            "transactionId": locationData.transactionId,
            "requestId": locationData.requestId,
            "decision": (infoBpmModel.toprocess === OPTs.PROCESS_ASIGNARNUMFIDEICOMISO || infoBpmModel.toprocess === OPTs.PROCESS_DATOSFIDEICOMISO ? "fideicomiso" : infoBpmModel.toprocess === OPTs.PROCESS_DOCUMENTACIONLEGAL ? "legal" : ""),
            "dambientalparalelo": "sinparalelo", //con riesgo ambiental
            //"tiposolicitud": "no", //flujo normal (no es devolucion)
            "monto": 10000, //monto total de suma de facilidades
            "status": "activo", //el paralelo de Ambiental esta activo
            "id": locationData.instanceId,
            "rol": infoBpmModel.toprocess === OPTs.PROCESS_ASIGNARNUMFIDEICOMISO ? "fideicomiso" : "legal",
            "credito": autonomy.credit,
            "banca": autonomy.banca
          };
        }
        else {
          console.log("statusambiental", locationData.statusambiental)
          var statusAmbiental = locationData.statusambiental !== undefined && locationData.statusambiental !== null && locationData.statusambiental.length > 0 ? true : false;
          var values = {};
          console.log("statusambiental", environmentalRisk)
          if (environmentalRisk !== null && environmentalRisk.riskClassificationConfirmation !== "BAJA" && statusAmbiental === false) {
            infoBpmModel["environmentalrisk"] = true;
            values = {
              "info": JSON.stringify(infoBpmModel),
              "processId": OPTs.PROCESS_ANALISISCREDITO.toString(),
              "activityId": OPTs.ACT_NONE.toString(),
              "transactionId": locationData.transactionId,
              "requestId": locationData.requestId,
              //"decision": "si",
              //"tiposolicitud": "si", //flujo normal (no es devolucion)
              "status": "activo", //el paralelo de Ambiental esta activo
              "dambientalparalelo": "conparalelo", //con riesgo ambiental
              "monto": 10000, //monto total de suma de facilidades
              "id": locationData.instanceId,
              "credito": autonomy.credit,
              "banca": autonomy.banca
            };
          }
          else {
            infoBpmModel["environmentalrisk"] = false;
            values = {
              "info": JSON.stringify(infoBpmModel),
              "processId": OPTs.PROCESS_ANALISISCREDITO.toString(),
              "activityId": OPTs.ACT_NONE.toString(),
              "transactionId": locationData.transactionId,
              "requestId": locationData.requestId,
              //"decision": "si",
              //"tiposolicitud": "si", //flujo normal (no es devolucion)
              "dambientalparalelo": "sinparalelo", //sin riesgo ambiental
              "status": "completo", //el paralelo de Ambiental esta completo
              "monto": 10000, //monto total de suma de facilidades
              "id": locationData.instanceId,
              "credito": autonomy.credit,
              "banca": autonomy.banca
            };
          }
        }
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {

              saveAutoLog(null, null);
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("ErrorSaveMessage"));
              // seterror_dlg(false);
            }
          });

        break;
      }
      case OPTs.PROCESS_INVESTFINCAS: { //Enviar a Investigacion de Fincas
        infoBpmModel.processId = OPTs.PROCESS_INVESTFINCAS;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        infoBpmModel.processId = infoBpmModel.toprocess;
        infoBpmModel.activityId = OPTs.ACT_NONE;
        values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": infoBpmModel.toprocess.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "investiga",
          "dambientalparalelo": "sinparalelo", //con riesgo ambiental
          //"tiposolicitud": "no", //flujo normal (no es devolucion)
          "monto": 10000, //monto total de suma de facilidades
          "status": "activo", //el paralelo de Ambiental esta activo
        };
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {

              saveAutoLog(null, null);
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("ErrorSaveMessage"));
              // seterror_dlg(false);
            }
          });

        break;
      }
      case OPTs.PROCESS_ASIGNARANALISISCREDITO: { //Enviar a Analisis de Credito
        infoBpmModel.processId = OPTs.PROCESS_ASIGNARANALISISCREDITO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        let autonomy = new LevelAutonomyClass();
        autonomy = await autonomy.getLevelAutonomy()??{};
        if (infoBpmModel.toprocess !== undefined) {
          infoBpmModel.processId = infoBpmModel.toprocess;
          infoBpmModel.activityId = OPTs.ACT_NONE;
          values = {
            "info": JSON.stringify(infoBpmModel),
            "processId": infoBpmModel.toprocess.toString(),
            "activityId": OPTs.ACT_NONE.toString(),
            "transactionId": locationData.transactionId,
            "requestId": locationData.requestId,
            "decision": (infoBpmModel.toprocess === OPTs.PROCESS_ASIGNARNUMFIDEICOMISO || infoBpmModel.toprocess === OPTs.PROCESS_DATOSFIDEICOMISO ? "fideicomiso" : infoBpmModel.toprocess === OPTs.PROCESS_DOCUMENTACIONLEGAL ? "legal" : ""),
            "dambientalparalelo": "sinparalelo", //con riesgo ambiental
            //"tiposolicitud": "no", //flujo normal (no es devolucion)
            "monto": 10000, //monto total de suma de facilidades
            "status": "activo", //el paralelo de Ambiental esta activo
            "id": locationData.instanceId,
            "rol": infoBpmModel.toprocess === OPTs.PROCESS_ASIGNARNUMFIDEICOMISO ? "fideicomiso" : "legal",
            "credito": autonomy?.credit??"",
            "banca": autonomy?.banca??""
          };
        }
        else {
          console.log("statusambiental", locationData.statusambiental)
          var statusAmbiental = locationData.statusambiental !== undefined && locationData.statusambiental !== null && locationData.statusambiental.length > 0 ? true : false;
          var values = {};
          console.log("statusambiental", environmentalRisk)
          if (environmentalRisk !== null && environmentalRisk.riskClassificationConfirmation !== "BAJA" && statusAmbiental === false) {
            infoBpmModel["environmentalrisk"] = true;
            values = {
              "info": JSON.stringify(infoBpmModel),
              "processId": OPTs.PROCESS_ASIGNARANALISISCREDITO.toString(),
              "activityId": OPTs.ACT_NONE.toString(),
              "transactionId": locationData.transactionId,
              "requestId": locationData.requestId,
              //"decision": "si",
              //"tiposolicitud": "si", //flujo normal (no es devolucion)
              "status": "activo", //el paralelo de Ambiental esta activo
              "dambientalparalelo": "conparalelo", //con riesgo ambiental
              "monto": 10000, //monto total de suma de facilidades
              "id": locationData.instanceId,
              "credito": autonomy?.credit??"",
              "banca": autonomy?.banca??""
            };
          }
          else {
            infoBpmModel["environmentalrisk"] = false;
            values = {
              "info": JSON.stringify(infoBpmModel),
              "processId": OPTs.PROCESS_ASIGNARANALISISCREDITO.toString(),
              "activityId": OPTs.ACT_NONE.toString(),
              "transactionId": locationData.transactionId,
              "requestId": locationData.requestId,
              //"decision": "si",
              //"tiposolicitud": "si", //flujo normal (no es devolucion)
              "dambientalparalelo": "sinparalelo", //sin riesgo ambiental
              "status": "completo", //el paralelo de Ambiental esta completo
              "monto": 10000, //monto total de suma de facilidades
              "id": locationData.instanceId,
              "credito": autonomy?.credit??"",
              "banca": autonomy?.banca??""
            };
          }
        }
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {

              saveAutoLog(null, null);
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("ErrorSaveMessage"));
              // seterror_dlg(false);
            }
          });

        break;
      }
      
      default:
        break;
    }
  }

  function saveDataCreditProposal(validacion = false, activeTabNew = activeTab, activation = false) {
    if (activeTabNew == 1) {
      creditProposalRef.current.validateForm();
      // if (!creditProposalRef.current.getFormValidation()) {
      //   //mandamos a validar el formulario
      //   //nos movemos al tab para llenar los campos
      //   setIsActiveLoading(false);
      //   return false;
      // }
      // guardarSeccionDatosGeneralesPropCred
      if (!creditProposalRef?.current?.dataReturn) {
        setIsActiveLoading(false);
        return false;
      }
      if (creditProposalRef?.current?.dataReturn.status) {
        setIsActiveLoading(false);
        return false;
      }
      backendServices.saveSectionDataGeneralPropCred(creditProposalRef.current.dataReturn).then((resp) => {
        if (resp != undefined) {
          if (validacion == false) {
            console.log("datosgenerales");
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false);
        }
        setIsActiveLoading(false);
        // loadDataGeneral(locationData.transactId);
      }).catch(err => {
        setIsActiveLoading(false);
        // seterror_dlg(false);
      })
    }
    else if (activeTabNew == 4) {
      ResumenCambiosRef.current.validateForm();
      let jsonSet = {
        "requestId": 0,
        "increase": ResumenCambiosRef?.current?.dataReturn?.increase ?? " ",
        "rate": ResumenCambiosRef?.current?.dataReturn?.rate ?? " ",
        "guarantee": ResumenCambiosRef?.current?.dataReturn?.guarantee ?? " ",
        "desbtorsGuarantors": ResumenCambiosRef?.current?.dataReturn?.desbtorsGuarantors ?? " ",
        "terms": ResumenCambiosRef?.current?.dataReturn?.terms ?? " ",
        "fees": ResumenCambiosRef?.current?.dataReturn?.fees ?? " ",
        "covenats": ResumenCambiosRef?.current?.dataReturn?.covenats ?? " ",
        "others": ResumenCambiosRef?.current?.dataReturn?.others ?? " ",
        "status": true
      }
      if (!ResumenCambiosRef?.current?.dataReturn || ResumenCambiosRef?.current?.rate) {
        setIsActiveLoading(false);
        return false;
      }
      if (activation === true) {
        return;
      }
      // guardarResumenCambios
      backendServices.consultGeneralDataPropCred(locationData.transactionId).then(resp3 => {
        jsonSet.requestId = resp3[0]?.requestId ?? " ";
        backendServices.guardarResumenCambios(jsonSet).then((resp) => {

          if (resp != undefined) {
            if (validacion == false) {
              console.log("guardarResumenCambios");
              toggleTab(activeTabNew + 1);
            }
          } else {
            // seterror_dlg(false);
          }
          setIsActiveLoading(false);
        })
      })
    } else {
      setIsActiveLoading(false);
      if (validacion == false) {
        console.log("otros");
        console.log("validacion", validacion);
        console.log("activeTabNew", activeTabNew);
        toggleTab(activeTabNew + 1);
      }
    }
  }
  function submitData(validate = false) {
    if (!creditProposalRef.current.getFormValidation()) {
      //mandamos a validar el formulario
      creditProposalRef.current.validateForm();
      //nos movemos al tab para llenar los campos
      setIsActiveLoading(false);
      toggleTab(1);
      return false;
    }
    // consultarFacilidades
    backendServices.consultarFacilidades(dataGlobal.requestId).then(resp => {
      if (resp === undefined || resp === null || resp.length == 0) {
        toggleTab(3);
        setIsActiveLoading(false);
        return false;
      }
    })
    setIsActiveLoading(false);
    // Aqui pasamos a actualizar la variable
    return true;
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 6) {
        setactiveTab(tab)
        window.scrollTo(0, 0)
      }
    }
  }

  /**
   * validateFacility
   * funcion que valida si hay facilidades
   * @returns promise:boolean
   */
  function validateFacility() {
    return new Promise((resolve, reject) => {
      backendServices.consultGeneralDataPropCred(locationData.transactionId).then(resp3 => {
        backendServices.consultarFacilidades(resp3[0].requestId).then(resp => {
          resolve(resp?.filter($$ => $$.debtor != "  ").length > 0)
        })
      })
    })
  }

  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
  }

  async function saveAutoLog(APPLICATION_STATUS = null, observations = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_PROPUESTACREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_03)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }


  return (
    <React.Fragment>
      {locationData !== null && locationData !== undefined ?
        <CreditProposalProvider value={context}>
          <div className="page-content">
            <Breadcrumbs title={t("Commercial Credit")} breadcrumbItem={t("Credit Proposal")} />

            <HorizontalSteeper processNumber={1} activeStep={1}></HorizontalSteeper>

            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={3} style={{ textAlign: "left" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
              </Col>
              <Col md={9} style={{ textAlign: "right" }}>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_INFORMEGESTION) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ManagementReport")}</Button>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => {
                  saveDataCreditProposal(true, activeTab);
                  setTimeout(() => {
                    saveDataCreditProposal(true, activeTab);
                    onSaveProcess(OPTs.PROCESS_PROPUESTACREDITO)
                  }, 1000);
                }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                <Button color="success" type="button"
                  onClick={() => {
                    saveDataCreditProposal(true, activeTab);
                    setTimeout(() => {
                      saveDataCreditProposal(true, activeTab);
                      onSaveProcess(OPTs.PROCESS_ASIGNARANALISISCREDITO)
                    }, 1000);
                    // onSaveProcess(OPTs.PROCESS_ANALISISCREDITO);
                  }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
              </Col>
            </Row>

            <Card>
              <CardHeader>
                {/* <div align="right" className="mb-3">
                  <Col>
                    <Link
                      style={{ margin: '5px', border: "1px", backgroundColor: "#1C8464", color: "#fff" }}
                      className="btn"
                      color="success"
                      type="button"
                      to={{
                        pathname: '/creditocomercial/fideicomiso/garantias',
                        data: locationData,
                      }}
                    >{" "} {`${t("TrustServices")} ${t("Guarantee")}`} <i className="mdi mdi-eye mdi-12px"></i></Link>
                  </Col>
                </div> */}
                <Row>
                  <Col md={6}>
                    <h4 className="card-title">{t("Credit Proposal")}</h4>
                    <div>
                      <p className="card-title-desc m-0">{t("Selectifyoumeetanyofthefollowingpoints")}</p>
                    </div>
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
                  <Col md={12} className="d-flex flex-column flex-sm-row justify-content-between">
                    {viewAutonomy && <LevelAutonomy />}
                  </Col>
                </Row>
                {errorHandler && (<Alert show={true} color="danger" dismissible onClose={() => { }}>
                  {t("There are empty fields")}: {errorMessage.join(', ')}
                </Alert>)}
                {errorHandlerIGR && (<Alert show={true} color="danger" dismissible onClose={() => { }}>
                  {`${t("The following fields are required in the management report stage")}`}: {errorMessageIGR.join(', ')}
                </Alert>)}
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={3}>
                    <Nav pills className="flex-column">
                      <NavLink className={classnames({ active: activeTab === 1 })}
                        onClick={() => {
                          // console.log("G",activacion);
                          saveDataCreditProposal(true, activeTab, true);
                          setTimeout(() => {
                            saveDataCreditProposal(true, activeTab);
                            toggleTab(1)
                          }, 1000);

                        }}>
                        {t("General Data")}
                      </NavLink>
                      <NavLink className={classnames({ active: activeTab === 2 })}
                        onClick={() => {
                          // console.log("C",activacion);
                          saveDataCreditProposal(true, activeTab, true);
                          setTimeout(() => {
                            saveDataCreditProposal(true, activeTab);
                            toggleTab(2)
                          }, 1000);
                        }}>
                        {t("CorporateExhibition")}
                      </NavLink>
                      <NavLink className={classnames({ active: activeTab === 3 })}
                        onClick={() => {
                          // console.log("F",activacion);
                          saveDataCreditProposal(true, activeTab, true);
                          setTimeout(() => {
                            saveDataCreditProposal(true, activeTab);
                            toggleTab(3)
                          }, 1000);
                        }}>
                        {t("FacilitiesList")}
                      </NavLink>
                      <NavLink className={classnames({ active: activeTab === 4 })}
                        onClick={() => {
                          // console.log("R",activacion);
                          saveDataCreditProposal(true, activeTab, true);
                          setTimeout(() => {
                            saveDataCreditProposal(true, activeTab);
                            toggleTab(4)
                          }, 1000);

                        }}>
                        {t("Change Summary")}
                      </NavLink>
                      <NavLink className={classnames({ active: activeTab === 5 })}
                        onClick={() => {
                          saveDataCreditProposal(true, activeTab, true);
                          setTimeout(() => {
                            saveDataCreditProposal(true, activeTab);
                            toggleTab(5)
                          }, 1000);
                        }}>
                        {t("CheckList")}
                      </NavLink>
                      {/* <NavLink className={classnames({ active: activeTab === 6 })}
                        onClick={() => {
                          saveDataCreditProposal(true, activeTab, true);
                          setTimeout(() => {
                            saveDataCreditProposal(true, activeTab);
                            toggleTab(6)
                          }, 1000);
                        }}>
                        {t("Tables for Corporate Presentation")}
                      </NavLink> */}
                    </Nav>
                  </Col>
                  <Col md={9}>
                    <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>
                      <TabContent activeTab={activeTab} className="body">
                        <TabPane tabId={1}>
                          <DatosGeneralesPropuesta dataGlobal={dataGlobal} ref={creditProposalRef}
                            title={t("General Data")}
                            values={datosGenerales}
                            activeTab={activeTab}
                            saveDataCreditProposal={saveDataCreditProposal}
                          />
                        </TabPane>
                        <TabPane tabId={2}>
                          <ExposicionCorportativa dataGlobal={dataGlobal} activeTab={activeTab} title={t("CorporateExhibition")} customerNumberT24={mainDebtor?.customerNumberT24} />
                          <ExposicionCorporativaClientes activeTab={activeTab} title={t("CorporateExhibitionClient")} customerNumberT24={mainDebtor?.customerNumberT24} />
                        </TabPane>
                        <TabPane tabId={3}>
                          {activeTab == 3 ?
                            <ListaFacilidad title={t("Facility List")}
                              items={facilityListItems}
                              editMode={true}
                              ref={FacilidadesRef}
                              dataGlobal={dataGlobal}
                              activeTab={activeTab}
                              onSaveFacility={handleSaveFacility}
                              identificationList={identificationList}
                              setLevelAutonomy={setLevelAutonomy}
                              setViewAutonomy={setViewAutonomy}
                            />
                            : null}
                        </TabPane>
                        <TabPane tabId={4}>
                          {locationData && activeTab === 4 ?
                            <ChangeSummary activeTab={activeTab} dataGlobal={dataGlobal} ref={ResumenCambiosRef} title={t("Change Summary")} items={changeSummaryItems} />
                            : null
                          }
                        </TabPane>
                        <TabPane tabId={5}>
                          {locationData && activeTab === 5 ?
                            <CheckList title={t("CheckList")} locationData={locationData} />
                            : null
                          }
                        </TabPane>
                        <TabPane tabId={6}>
                          {activeTab === 6 ?
                            <CorporatePresentation />
                            : null
                          }
                        </TabPane>
                      </TabContent>
                    </LoadingOverlay>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter className="text-end">
                <Row>
                  <Col md={12} style={{ textAlign: "right", marginTop: "10px" }}>
                    {/* <Button color="info" type="button" style={{ margin: '5px' }} onClick={() => {
                      setIsActiveLoading(true);
                      saveDataCreditProposal(true);
                      setTimeout(() => {
                        saveDataCreditProposal(true);
                        setTimeout(() => {
                          // toggleTab(activeTab - 1);
                          toogleModalPrevisualizar()
                        }, 500);
                      }, 1000);
                    }}><i className="mdi mdi-eye mdi-12px"></i> Previsualizar</Button> */}
                    <Link
                      style={{ margin: '5px', border: "1px" }}
                      className="btn"
                      color="info"
                      type="button"
                      onClick={() => {
                        setIsActiveLoading(true);
                        saveDataCreditProposal(true);
                        setTimeout(() => {
                          saveDataCreditProposal(true);
                        }, 1000);
                      }}
                      to={{
                        pathname: '/creditocomercial/previsualizarPropCred/' + btoa(locationData?.transactionId),
                      }}
                      target="_blank"
                    ><i className="mdi mdi-eye mdi-12px"></i>{ }{t("Preview")}</Link>
                    {activeTab > 1 && (
                      <Button color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                        // wizardRef.current.prev()
                        setIsActiveLoading(true);
                        saveDataCreditProposal(true);
                        setTimeout(() => {
                          saveDataCreditProposal(true);
                          setTimeout(() => {
                            toggleTab(activeTab - 1);
                          }, 500);
                        }, 1000);
                      }}>
                        <i className="mdi mdi-arrow-left-bold mid-12px"></i>&nbsp;
                        {t("Previous")}
                      </Button>)
                    }
                    {activeTab < 5 && (
                      <Button color="success" type="button" onClick={() => {
                        setIsActiveLoading(true);
                        saveDataCreditProposal(false, activeTab, true);
                        setTimeout(() => {
                          saveDataCreditProposal();
                        }, 1000);
                      }}>
                        {t("Next")}&nbsp;
                        <i className="mdi mdi-arrow-right-bold mid-12px"></i>
                      </Button>)
                    }
                  </Col>
                </Row>
              </CardFooter>
            </Card>


            {locationData ?
              <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_PROPUESTACREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_03)} />
              : null}
            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={3} style={{ textAlign: "left" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
              </Col>
              <Col md={9} style={{ textAlign: "right" }}>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_INFORMEGESTION) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ManagementReport")}</Button>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => {
                  saveDataCreditProposal(true, activeTab);
                  setTimeout(() => {
                    saveDataCreditProposal(true, activeTab);
                    onSaveProcess(OPTs.PROCESS_PROPUESTACREDITO)
                  }, 1000);
                }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                <Button color="success" type="button"
                  onClick={() => {
                    saveDataCreditProposal(true, activeTab);
                    setTimeout(() => {
                      saveDataCreditProposal(true, activeTab);
                      onSaveProcess(OPTs.PROCESS_ASIGNARANALISISCREDITO)
                    }, 1000);
                    // onSaveProcess(OPTs.PROCESS_ANALISISCREDITO);
                  }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
              </Col>
            </Row>


            {locationData && displayModalBitacora ?
              <ModalBitacora logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_PROPUESTACREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_03)}
                successSaved={() => { onSaveProcess(optionSelected); }}
                isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
              : null}

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
          </div>
          {loading && (
            <LoadingIndicator message={t("Please Wait")} />
          )}
          {showSuccess && (
            <SuccessMessage title={t("Operation Complete")} message={t("Credit Proposal Saved")} />
          )}
          {/* <ModalPrevisualizarPropCred isOpen={ModalPrevisualizardata} toggle={() => { toogleModalPrevisualizar() }} /> */}
          <ModalCloseOptions onSaveProcess={onSaveProcess} isOpen={displayModalCloseOptions} toggle={() => { toggleModalCloseOptions() }} />
          <ModalEndProcess onSaveEndProcess={onSaveEndProcess} isOpen={displayModalEndProcess} toggle={() => { showModalEndProcess(false) }} />
        </CreditProposalProvider>
        : null}
    </React.Fragment >
  );
}
export default CreditProposalPage;