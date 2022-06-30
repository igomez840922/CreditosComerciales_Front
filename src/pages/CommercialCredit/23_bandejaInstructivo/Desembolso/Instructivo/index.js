/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import * as url from "../../../../../helpers/url_helper"
import * as OPTs from "../../../../../helpers/options_helper";
import moment from "moment";

import { Link } from "react-router-dom"

import {
  Card, CardHeader,
  CardBody,
  Col,
  Button,
  CardFooter,
  Row,
  Alert,
} from "reactstrap"
import { Tabs, Tab } from 'react-bootstrap';

//Import Breadcrumb
import Breadcrumbs from "../../../../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"

import DatosGenerales from "./DatosGenerales"
import ModalCreacionLinea from "./modalCreacionLinea"
import SweetAlert from "react-bootstrap-sweetalert"

import { BackendServices, CoreServices, BpmServices } from "../../../../../services";

import { AvForm, AvField } from "availity-reactstrap-validation"
import { useTranslation } from "react-i18next"
import LoadingOverlay from "react-loading-overlay"

import ModalEndProcess from "../../../../../components/EndProcess/ModalEndProcess"
import { InfoBpmModel } from '../../../../../models/Common/InfoBpmModel';
import { LogProcessModel } from '../../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../../components/LogProcess/index";
import HorizontalSteeper from "../../../../../components/Common/HorizontalSteeper";
import { LineUtil } from "leaflet";
import { saveLogProcess } from "../../../../../helpers/logs_helper";
import CheckListComponent from '../../../../../components/Common/CheckList';
import { AttachmentFileInputModel } from "../../../../../models/Common/AttachmentFileInputModel"
import ModalBitacora from "../../../../../components/Common/ModalBitacora";
import Horarios from "./horarios";
import CreditLine from "./CreditLine";
//Chequear pq hay que hacer dos pantallas para mostrar instructivo

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
const S_seccions = {
  "backgroundColor": "#eee",
  "color": '#187055',
  "padding": '2px',
  "borderRadius": '2px',
  "fontSize": '18px',
  "display": 'flex',
  "justifyContent": 'center',
};
const InstructivoNuevo = props => {
  const { t, i18n } = useTranslation();
  const { adminDesembolso, firmarcontrato } = props;
  const history = useHistory();
  const location = useLocation()
  console.log(props);
  const [instructiveType, setinstructiveType] = useState(null);
  const [facilityId, setfacilityId] = useState(null);
  const [tabsFacility, settabsFacility] = useState(null);
  const [Facility, setFacility] = useState(null);
  const [datosUsuario, setdatosUsuario] = useState(null);
  const [isActiveLoading, setIsActiveLoading] = useState(true);
  const [facilityType, setfacilityType] = useState(null);
  const [faciliadDes, setfaciliadDes] = useState(null);
  const [ShowModelCreditProposal, setShowModelCreditProposal] = useState(false);
  const [ShowModelFinancialReport, setShowModelFinancialReport] = useState(false);
  const [ModalPrevisualizardata, settoogleModalPrevisualizar] = useState(false);
  const [ModalPrevisualizardataProp, settoogleModalPrevisualizarProp] = useState(false);
  ///////
  const [locationData, setLocationData] = useState(null);
  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());

  const [mainDebtor, setmainDebtor] = useState(null);
  const [DeshabilitarSelect, setDeshabilitarSelect] = useState(false);

  const [showModalCreacionLinea, setshowModalCreacionLinea] = useState(false);
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });
  const [msgDataND, setmsgDataND] = useState({ show: false, msg: "", isError: false });

  const [optionSelected, setoptionSelected] = useState(null);
  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);

  const [disbursementInstructionNumber, setDisbursementInstructionNumber] = useState(undefined)
  const [modalCreacionLinea, setmodalCreacionLinea] = useState(false);
  const [ejecutarDesembolso, setejecutarDesembolso] = useState(props !== undefined && props.ejecutarDesembolso !== undefined ? props.ejecutarDesembolso : true)

  //On Mounting (componentDidMount)
  React.useEffect(() => {

    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
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
    if (locationData.processId == "450") {
      setDeshabilitarSelect(false)
    }
    setTimeout(() => {
      if (locationData.processId == "450") {
        document.querySelectorAll('input').forEach(function (item) {
          item.setAttribute("disabled", "disabled");
        });
        document.querySelectorAll('textarea').forEach(function (item) {
          item.setAttribute("disabled", "disabled");
        });
      }
    }, 2000);
    //chequear si la tarea no ha sido iniciada
    bpmServices.checkAndStartTask(locationData)
      .then((iniresult) => {
        if (iniresult === false) {
          history.push(url.URL_DASHBOARD);
        }
      })

    loadUserProspect(locationData.transactionId)
    // Read Api Service data
    loadData(locationData)
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


  function loadData(data) {
    let dataSession = data
    setIsActiveLoading(true);
    Promise.allSettled([
      backendServices.consultPrincipalDebtor(data.transactionId),
      backendServices.consultGeneralDataPropCred(data.transactionId),
      backendServices.retrieveFacilityType()
    ]).then(data => {
      const [{ value: PrincipalDebtor }, { value: GeneralDataPropCred }, { value: FacilityType }] = data;
      setdatosUsuario(PrincipalDebtor)
      backendServices.consultarFacilidades(GeneralDataPropCred[0].requestId).then(resp => {
        if (resp.length > 0) {
          let facilidad = resp.find(x => x.facilityId == dataSession?.facilityId ?? 0)
          console.log("facilidad", FacilityType.find(x => x.id == facilidad?.facilityTypeId ?? 0)?.description ?? "");
          setfaciliadDes(FacilityType.find(x => x.id == facilidad?.facilityTypeId ?? 0)?.description ?? "");

          setFacility(resp);
          setinstructiveType(facilidad.debtor)
          setfacilityId(facilidad.facilityId)
          setfacilityType(facilidad);
        }
        setIsActiveLoading(false)
      }).catch(err => {
        console.log(err);
        setIsActiveLoading(false)
      });

    }).catch(err => {
      setIsActiveLoading(false)
    })
  }

  function handleSelect(e) {
    let data = Facility.at(e);
    setfacilityType(data);
    setinstructiveType(data.debtor)
    setfacilityId(data.facilityId)
  }

  async function onSaveData(option, values = null) {
    if (!disbursementInstructionNumber || disbursementInstructionNumber === ' ') {
      var resp = await backendServices.saveDisbursementInstructiveByFacility(values);
      // await backendServices.saveDisbursementInstructiveByFacility(values);
      if (resp.status.statusCode === OPTs.ResponseBackend_STATUSOK) {
        setDisbursementInstructionNumber(resp.disbursementInstructionNumber)
        return true;
      }
      else {
        showMessage({ msg: t("ErrorSaveMessage"), show: true, error: true })
      }
      return false;
    }
    else {
      var resp = await backendServices.updateDisbursementInstructiveByFacility({ ...values, status: true });
      if (resp.statusCode === OPTs.ResponseBackend_STATUSOK) {
        return true;
      } else {
        showMessage({ msg: t("ErrorSaveMessage"), show: true, error: true })
      }
      return false;
    }
  }

  ////////////////////
  async function checkToContinue(option, values = null) {

    console.log("checkToContinue",locationData.processId);
    if ((await onSaveData(option, values)) === true) {
      if (+locationData.processId === +OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT) {
        saveJBPMProcess(OPTs.PROCESS_ADMINDISBURSEMENT);      
      }
      else if (+locationData.processId === +OPTs.PROCESS_EXECUTEDISBURSEMENT) {  
        console.log("GenerateCreditLines");
    
        //EJECUTAR SERVICIOS DE T24  
        //Generar Lineas 
        await GenerateCreditLines();   
        
        //Generar Instructivo
        await GenerateInstructive();
        return;        
        //Generar Instructivo


        //Chequear si tiene Garantias ... de lo contrario a expediente
        saveJBPMProcess(OPTs.PROCESS_GUARANTEE);        
      }
    }
    else {
      showMessage({ msg: t("Debe Guardar todos los desembolsos antes de continuar"), show: true, error: true })
    }
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

    console.log("saveJBPMProcess", option);
    var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
    var infoBpmModel = new InfoBpmModel(locationData.instanceId, locationData.transactionId,
      OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT, OPTs.ACT_NONE,
      maindebtor?.personId
    );
    infoBpmModel.personName = maindebtor !== undefined ? (maindebtor.typePerson == "2" ? maindebtor.name : (maindebtor.name + " " + maindebtor.name2 + " " + maindebtor.lastName + " " + maindebtor.lastName2)) : "";

    console.log("saveJBPMProcess", option);

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
      case OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT: {
        infoBpmModel.processId = OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT.toString(),
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
      case OPTs.PROCESS_ADMINDISBURSEMENT: {
        infoBpmModel.processId = OPTs.PROCESS_ADMINDISBURSEMENT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_ADMINDISBURSEMENT.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
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
      case OPTs.PROCESS_GUARANTEE: {
        infoBpmModel.processId = OPTs.PROCESS_GUARANTEE;
        infoBpmModel.activityId = OPTs.ACT_NONE;
        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_GUARANTEE.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "garantias"
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
      case OPTs.PROCESS_VALIDATEFILE: {
        infoBpmModel.processId = OPTs.PROCESS_VALIDATEFILE;
        infoBpmModel.activityId = OPTs.ACT_NONE;
        infoBpmModel.fromProcess = OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT;
        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_VALIDATEFILE.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "expediente"
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
      /*
      case OPTs.PROCESS_SIGNCONTRACT: {
        infoBpmModel.processId = OPTs.PROCESS_SIGNCONTRACT;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_SIGNCONTRACT.toString(),
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
      }*/
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
  function toogleModalPrevisualizarProp() {
    settoogleModalPrevisualizarProp(!ModalPrevisualizardataProp);
    removeBodyCss()
  }
  function toggleShowModelFinancialReport() {
    setShowModelFinancialReport(!ShowModelFinancialReport)
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function toogleModalPrevisualizar() {
    settoogleModalPrevisualizar(!ModalPrevisualizardata);
    removeBodyCss()
  }

  async function saveAutoLog(APPLICATION_STATUS = null, observations = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_15)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }
  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
  }

  async function GenerateCreditLines(){
    var dataResult = await backendServices.getCreditLine(locationData?.transactionId??0, locationData?.facilityId ?? 0);
    console.log("GenerateCreditLines",dataResult);

       for( const creditLine of dataResult.creditLine ) {
        var prodArray = [];
        for (var dataprod of creditLine.creditLineProds) {
          prodArray.push(
            {
              "Product": {
                "Cod": dataprod?.tipoSubProducto ?? ""// Preguntar a Yamari, parce que no es el mismo del tipo de linea
              }
            }
          );
        }    
        let datoSetCore = {
          "CreditLine": {
            "Activity": {
              "Cod": creditLine.actividadEconomica.split("-")[1] ?? "" //codigo de subactividad economica = 2103
            },
            "AuthType": creditLine?.tipoAutorizacion ?? "", // = 1,
            "AutonomyCode": {
              "Cod": creditLine?.autonomia, //100,
              "Desc": creditLine?.descAutonomia, //"JUNTA DIRECTIVA"
            },
            "AutonomyUser": creditLine?.usuarioAutonomia, // 2,
            "CreditLimit": {
              "AdviseAmt": {
                "Amt": creditLine?.montoAprobado ?? 0, //-> Monto de La Linea = 50000,
                "CurCode": creditLine?.moneda ?? "" //-> Codigo Moneda = "USD"
              },
              "Allow": {
                "CurrencyData": {
                  "CurAmt": {
                    "Amt": {
                      "-self-closing": "true"
                    },
                    "CurCode": {
                      "-self-closing": "true"
                    }
                  }
                },
                "Party": {
                  "PartyId": {
                    "-self-closing": "true"
                  }
                },
                "ProductData": prodArray
              },
              "AllowNetting": creditLine?.permiteCompensacion ? "Y" : "N", // -> ?? FIJO = "Y",
              "ApprovalDt": creditLine?.fechaAprobada ?? moment().format("YYYY-MM-DD"), // -> Fecha de Aprobacion = "2022-06-24",
              "AvailDt": creditLine?.fechaPropuesta ?? moment().format("YYYY-MM-DD"),    // -> Fecha de Propuesta = "2022-06-24",
              "AvailMarker": creditLine?.marcadorDisponible ? "Y" : "N", // -> ?? FIJO  = "Y",
              "CountryRisk": {
                "Country": {
                  "CountryCode": creditLine?.riesgoPais, // = "PA",
                  "CountryName": ""
                },
                "Percent": creditLine?.porcentajeRiesgo ?? "0" // = 100
              },
              "CreditLimitKey": {
                "CreditLimitId": creditLine?.numeroLinea //"600197109.0000100.02"
              },
              "CurCode": creditLine?.moneda ?? "", //-> Codigo Moneda = "USD",
              "DeadLineDt": moment().format("YYYY-MM-DD"), //"2022-06-24",
              "DueDt": creditLine?.fechaVencimiento ?? moment().format("YYYY-MM-DD"), //"2023-06-30",
              "LimitAmt": {
                "Amt": creditLine?.montoAprobado ?? 0,
                "CurCode": creditLine?.moneda ?? "", //-> Codigo Moneda = "USD"
              },
              "LimitAmtType": creditLine?.tipoLimite, // = "FIXED",
              "LimitReject": creditLine.rechazarLimite, // = "Y",
              "MaxCurAmt": {
                "Amt": creditLine?.maximoAprobado ?? 0, // = 50000,
                "CurCode": creditLine?.moneda ?? "", //-> Codigo Moneda = "USD"
              },
              "ProposalDt": creditLine.fechaPropuesta,  //= "2022-06-24",
              "ReviewFreq": {
                "FreqValue": creditLine?.frecuenciaRevision //="20230630M1230"
              },
              "Signatories": {
                "Signatory": {
                  "PartyKey": {
                    "PartyId": creditLine?.idDeudor // 990057781
                  }
                }
              },
              "StateProvDest": {
                "Cod": "",
                "Desc": ""
              }
            }
          }
        }
        
        /*{
          "CreditLine": {
            "Activity": {
              "Cod": creditLine.actividadEconomica.split("-")[1] ?? "" //codigo de subactividad economica
            },
            "AuthType": creditLine?.tipoAutorizacion ?? "",
            "AutonomyCode": {
              "Cod": creditLine?.autonomia,
              "Desc": creditLine?.descAutonomia,
            },
            "AutonomyUser": creditLine?.usuarioAutonomia,
            "CreditLimit": {
              "AdviseAmt": {
                "Amt": creditLine?.montoAprobado.toString() ?? "0", //-> Monto de La Linea
                "CurCode": creditLine?.moneda ?? "" //-> Codigo Moneda
              },
              "Allow": {
                "CurrencyData": {
                  "CurAmt": {
                    "Amt": {
                      "-self-closing": "true"
                    },
                    "CurCode": {
                      "-self-closing": "true"
                    }
                  }
                },
                "Party": {
                  "PartyId": {
                    "-self-closing": "true"
                  }
                },
                "ProductData": prodArray
              },
              "AllowNetting": creditLine?.permiteCompensacion ? "Y" : "N", // -> ?? FIJO
              "ApprovalDt": creditLine?.fechaAprobada ?? moment().format("YYYY-MM-DD"), // -> Fecha de Aprobacion
              "AvailDt": creditLine?.fechaPropuesta ?? moment().format("YYYY-MM-DD"),    // -> Fecha de Propuesta
              "AvailMarker": creditLine?.marcadorDisponible ? "Y" : "N", // -> ?? FIJO
              "CountryRisk": {
                "Country": {
                  "CountryCode": creditLine?.riesgoPais,
                  "CountryName": {
                    "-self-closing": "true"
                  }
                },
                "Percent": creditLine?.porcentajeRiesgo.toString() ?? "0"
              },
              "CreditLimitKey": {
                "CreditLimitId": creditLine?.numeroLinea
              },
              "CurCode": creditLine?.moneda ?? "", //-> Codigo Moneda
              "DeadLineDt": moment().format("YYYY-MM-DD"),
              "DueDt": creditLine?.fechaVencimiento ?? moment().format("YYYY-MM-DD"),
              "LimitAmt": {
                "Amt": creditLine?.montoAprobado.toString() ?? "0",
                "CurCode": creditLine?.moneda ?? "", //-> Codigo Moneda
              },
              "LimitAmtType": creditLine?.tipoLimite,
              "LimitReject": creditLine.rechazarLimite,
              "MaxCurAmt": {
                "Amt": creditLine?.maximoAprobado.toString() ?? "0",
                "CurCode": creditLine?.moneda ?? "", //-> Codigo Moneda
              },
              "ProposalDt": creditLine.fechaPropuesta,
              "ReviewFreq": {
                "FreqValue": creditLine?.frecuenciaRevision
              },
              "Signatories": {
                "Signatory": {
                  "PartyKey": {
                    "PartyId": creditLine?.idDeudor.toString()
                  }
                }
              }
            }
          }
        }*/

       var result = await coreServices.newline(datoSetCore);
       if(result === undefined){
          return;
       }
    } 
  }

  async function GenerateInstructive(){

    var dataResult = await backendServices.getDisbursementInstructiveByFacility(locationData.transactionId, locationData.facilityId);
    console.log("GenerateInstructive",dataResult);

        var data ={
            AcctLoan: {
                AcctSubtype: {
                    Cod: dataResult.subProductTypeCode//"AL.COMPANY.PRIVATE"  // Subproducto
                },
                AutonomyCode: dataResult.autonomyCode, // ******** Codigo de la autonomia
                AutonomyUser: dataResult.autonomyCode, //La autonomia o usuario que esta logueado
                //ClosedDt:"2029-10-03", //
                //ClubBanesco:"false",
                CurCode: "USD", //codigo de Moneda
                SubCategory: dataResult.provinceDesc.split("*")[1] ?? "", //Codigo de Subcategoria??
                Variation: { //variacion -> Puede ir vacía
                    "Cod": "CLIENTE"
                },
                "AcctOpeningInfo": {
                    BusinessUnit: dataResult.branchDesc ?? "", // Banca viene de IGR
                    "InitialAmt": {
                        "Amt": dataResult.disbursementApprovedAmount, //monto
                    },
                    OpenDt: dataResult.disbursementDate, // Fecha de Inicio del desembolso
                    SaleOfficer: dataResult.saleChannel //Canal de venta .... ****** no está en pantalla
                },
                CreditAcctData: {
                    AuthType: dataResult.authType, //-> ?? ************ no esta en pantalla
                    BillsCombined: dataResult.billsCombined, // Capital de Interes ... ********** no esta en pantalla
                    CodeDestination: dataResult.provinceCode, // codigo de Destino ... Provincia de Destino
                    CollOfficer: "9999", /// campo fijo siempre
                    CountryDestination: dataResult.countryCode, // codigo Pais de Destino
                    CreditDestination: dataResult.creditDestination, // ********* Destino del Credito : LOCAL 1 /EXTRANJERO 2
                    FundsDestination: dataResult.fundsDestination, // ********* Destino de los Fondos: LOCAL 1 / EXTRANJERO 2
                    FundsPurpose: dataResult.fundsPurposeCode, // ********** Proposito de los Fondos viene de un catalogo
                    OriginationRef: dataResult.originationRef, // ********** referencia de Orientacion , viene de un catalodo
                    RefinanceNum: { // QUEDA FIJO
                        "self-closing": "true"
                    },
                    SourceSales: { // ********* Viene de Catalogo
                        "Cod": dataResult.sourceSalesCod,
                        "Desc": dataResult.sourceSalesDesc,
                    },
                    WritingType: dataResult.writingType, // *********** Tipo de Escritura .. PAG/WRT .. Pagaré o Escritura
                    Charge: [ //cargos 
                        {
                            ChargeType: "LENDCOMMISSION", //Instrucciones Operativas -> Monto por Comision
                            "CurAmt": {
                                "Amt": dataResult.disbursementComisionAmount,
                            }
                        },
                        {
                            "ChargeType": "TAX", //Instrucciones Operativas -> ITBMs
                            "CurAmt": {
                                "Amt": dataResult.disbursementItbms,
                            }
                        },
                        {
                            "ChargeType": "ALLEGALFEE", //Instrucciones Operativas -> Notaría
                            "CurAmt": {
                                "Amt": dataResult.adminNotaryFees,
                            }
                        },
                        {
                            "ChargeType": "TFISCAL", //Instrucciones Operativas -> Timbre Fisical
                            "CurAmt": {
                                "Amt":  dataResult.adminSealFees,
                            }
                        },
                    ],
                    /*"CreditRegularPmt": { // La podemos Omitir no es obligatorio
                        "BillType": "INSTALLMENT",
                        "Freq": {
                            "NoPaymentMonth": "1",
                            "OnDayNumber": "3"
                        },
                        "PmtClass": "DUE",
                        "PmtType": "CONSTANT",
                        "PmtTargetDetail": {
                            "ActualAmt": {
                                "Amt": "114.9"
                            },
                            "StartDate": "2022-04-03"
                        }
                    },*/
                    Term: {    //*********** Termino o Plazo de desembolso ... + Tipo de Termino D/M/A
                        ProposedTerm: dataResult.disbursementTerm.toString() + dataResult.disbursementTermType.substring(0,1),
                    },
                    SettleInstruction: {
                        PayIn: [
                            {
                                ACDBRule: "PARTIAL", //Constante
                                PmtType: "CONSTANT",//Constante
                                SettleActivity: { //Constante
                                    Cod: "LENDING-APPLYPAYMENT-PR.REPAYMENT"
                                },
                                Settlement: "false", //************* desembolso en cuenta TRUE/FALSE
                                PayInAcctRef: {
                                    Activity: {  //Constante
                                        Cod: "ACCOUNTS-DEBIT-ARRANGEMENT"
                                    },
                                    PayInAcct: { // Número de Línea de Crédito
                                        "AcctReference": "USD1273300020014"
                                    }
                                }
                            },
                        ],
                        PayOut: {
                            PayOutAcct: { // Número de Línea de Crédito, el numero de la cuenta
                                "AcctReference": "USD1273300020014"
                            },
                            Property: "ACCOUNT", // Si es una cuenta "ACCOUNT"
                            SettleActivity: { //Constante
                                Cod: "LENDING-APPLYPAYMENT-PR.REPAYMENT"
                            },
                            Settlement: "true" //Constante
                        }
                    },
                    CreditAcctPmtInfo: {
                        PmtMethod: "DD" // ******** Metodo de Pago ... DC/PV  Descuento Directo - Pago Voluntario
                    }
                },
                IntRateData: [
                    {
                        IntRate: "11.50", // Tasa de Interes
                        IntRateType: "PRINCIPALINT"
                    },
                    {
                        "IntRate": "12.50",
                        "IntRateType": "LT.DPF.BASE"
                    },
                    {
                        "IntRate": "13.50",
                        "IntRateType": "LT.SPREAD.POINT"
                    }
                ],
                AcctMember: {
                    "PartyKey": {
                        "PartyId": "990091561" //Numero de Cliente T24
                    },
                    "PartyRole": {
                        "Cod": "OWNER"
                    }
                }
            }
        }       
        
       var result = await coreServices.DesembolsoBajoLinea(data);
       if(result === undefined){
          return;
       }
       
  }

  return (
    <React.Fragment>
      <div className={ejecutarDesembolso === false ? "" : "page-content"}>
        <Card>
          <CardBody>
            <Row>
              <Col md="12">
                <span className="mb-3" style={S_seccions}>{faciliadDes}</span>
              </Col>
            </Row>
            {facilityType &&
              <DatosGenerales
                // firmarcontrato={props?.firmarcontrato ?? true}
                adminDesembolso={props?.adminDesembolso ?? true}
                ejecutarDesembolso={ejecutarDesembolso}
                facilityId={facilityId}
                facilityType={facilityType}
                DeshabilitarSelect={DeshabilitarSelect}
                instructiveType={instructiveType}
                onSaveProcess={checkToContinue}
                ejecutivoDesembolso={props?.ejecutivoDesembolso ? true : false}
                disbursementInstructionNumber={disbursementInstructionNumber}
                setDisbursementInstructionNumber={setDisbursementInstructionNumber}
              />}



          </CardBody>

        </Card>

        {ejecutarDesembolso === false ? null :
          <>
            {locationData ?
              <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_DESEMBOLSO, OPTs.ACT_NONE)} />
              : null}
          </>
        }

        {ejecutarDesembolso === false ? null :
          <>
            {locationData ?
              <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_14)} />
              : null}

            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={4} style={{ textAlign: "left" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { onSaveProcess(OPTs.PROCESS_CANCELPROCESS) }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
                <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_SIGNCONTRACT); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>
              </Col>
              <Col md={8} style={{ textAlign: "right", marginTop: "10px" }}>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(Number(OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT)) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                {/* <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_SIGNCONTRACT) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("ReturnToExecutive")}</Button> */}
                <Button color="success" type="button"
                  onClick={() => { checkToContinue() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Continue")}</Button>
              </Col>
            </Row>
          </>
        }
        <ModalEndProcess onSaveEndProcess={onSaveEndProcess} isOpen={displayModalEndProcess} toggle={() => { showModalEndProcess(false) }} />
        {/* <ModalPrevicualizarIGR isOpen={ModalPrevisualizardata} toggle={() => { toogleModalPrevisualizar() }} />
        <ModalPrevisualizarPropCred isOpen={ModalPrevisualizardataProp} toggle={() => { toogleModalPrevisualizarProp() }} /> */}
        {/* <ModalPrevicualizarAIF isOpen={ShowModelFinancialReport} toggle={() => { toggleShowModelFinancialReport() }} /> */}
        {
          messageDlg && messageDlg.show ? (
            <SweetAlert
              type={messageDlg.error ? "error" : "success"}
              confirmButtonText={t("Confirm")}
              cancelButtonText={t("Cancel")}
              title={messageDlg.error ? t("Error") : t("Message")}
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

    </React.Fragment >
  )
}

InstructivoNuevo.propTypes = {
  // selectedId: PropTypes.any,
  // onClose: PropTypes.func.isRequired
}

export default (withTranslation()(InstructivoNuevo))
