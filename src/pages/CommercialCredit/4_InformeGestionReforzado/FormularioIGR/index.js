import React, { useState, useEffect, useRef, createRef } from "react"
import { useLocation, useHistory, Link } from 'react-router-dom'
import * as OPTs from "../../../../helpers/options_helper"
import * as url from "../../../../helpers/url_helper"
import moment from "moment";
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Nav,
  NavLink,
  TabContent,
  TabPane,
  CardHeader,
  Alert,
} from "reactstrap"
import jsonAmbientales from "./Secciones/jsonAspectosAmbientales.json";
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import { InfoBpmModel } from '../../../../models/Common/InfoBpmModel';
import { useTranslation, withTranslation } from "react-i18next"
import classnames from "classnames"
import DatosGenerales from "./Secciones/DatosGenerales"
import GeneralesEmpresa from "./Secciones/GeneralesEmpresa"
import HistoriaEmpresa from "./Secciones/HistoriaEmpresa"
import InformacionAccionista from "./Secciones/InformacionAccionosta"
import EstructuraOrganizacionalEmpresa from "./Secciones/EstructuraOrganizacionalEmpresa"
import GobiernoCorporativo from "./Secciones/GobiernoCorporativo"
import RelevoGeneracional from "./Secciones/RelevoGeneracional"
import FlujoOperativo from "./Secciones/FlujoOperativo"
import EmpresasRelacionadas from "./Secciones/EmpresasRelacionadas"
import InformacionClientes from "./Secciones/InformacionClientes"
import InformacionProveedores from "./Secciones/InformacionProveedores"
import PrincipalesCompetidores from "./Secciones/PrincipalesCompetidores"
import Proyecciones from "./Secciones/Proyecciones"
import RelacionesBancarias from "./Secciones/RelacionesBancarias"
import MoviemientosCuentas from "./Secciones/MoviemientosCuentas"
import Reciprocidad from "./Secciones/Reciprocidad"
import FacilidadActivosFijos from "./Secciones/FacilidadActivosFijos"
import AspectosAmbientales from "./Secciones/AspectosAmbientales"
import InformacionGarante from "./Secciones/InformacionGarante"
import SegurosActualesEmpresa from "./Secciones/SegurosActualesEmpresa"
import ArquitecturaEmpresarial from "./Secciones/ArquitecturaEmpresarial"
import CuentasCobrar from "./Secciones/CuentasCobrar"
import Capex from "./Secciones/Capex"
import FlujoCaja from "./Secciones/FlujoCaja"
import NegociosObtener from "./Secciones/NegociosObtener"
import MatrizCompetitiva from "./Secciones/MatrizCompetitiva"
import RecomendacionesOtros from "./Secciones/RecomendacionesOtros"
import ModalCloseOptions from "../../../../components/UI/ModalCloseOptions"
import ModalEndProcess from "../../../../components/EndProcess/ModalEndProcess"
import { BackendServices, CoreServices, BpmServices, } from "../../../../services";
import ModalPrevicualizarIGR from "./previsualizarIGR";
import SweetAlert from "react-bootstrap-sweetalert"
import LoadingOverlay from "react-loading-overlay";

import { LogProcessModel } from '../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../components/LogProcess/index";
import Currency from "../../../../helpers/currency"

import ModalBitacora from "../../../../components/Common/ModalBitacora";

import { saveLogProcess } from "../../../../helpers/logs_helper";


import HorizontalSteeper from "../../../../components/Common/HorizontalSteeper";
import { uniq_key } from "../../../../helpers/unq_key";
import AutoSaveData from '../../../../helpers/AutoSaveData';

const FormularioIgr = props => {

  const [autoSaveData, setautoSaveData] = useState(new AutoSaveData());
  let modelo = {
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
    },
    datosEmpresa: {
      transactId: "",
      referencePoint: "",
      residency: "",
      houseNumber: "",
      phoneNumber: "",
      mobileNumber: "",
      workNumber: "",
      email: "",
      exclusion: false,
      sustainable: false,
      apto: "",
      country: {
        code: "",
        name: ""
      },
      province: {
        code: "",
        name: ""
      },
      district: {
        code: "",
        name: ""
      },
      township: {
        code: "",
        name: ""
      },
      city: {
        code: "",
        name: ""
      },
      sector: {
        code: "",
        name: ""
      },
      subSector: {
        code: "",
        name: ""
      },
      sustainableProjectId: '',
      sustainableProjectDesc: ''
    },
    historiaEmpresa: {
      transactId: 0,
      description: " ",
      employeesNumber: 0,
      details: " "
    },
    dataAccionistas: {
      transactId: 0,
      informacionAccionistaDetails: " ",
      datosTablaAccionistas: null,
      observations: " ",
      description: " ",
    },
    dataGobiernoCorporativo: {
      transactId: 0,
      corporateIdentification: 0,
      name: " ",
      position: " ",
      birthDate: " ",
      age: " ",
      status: true,
      dataTableGobiernoCorporativo: null
    },
    dataGobiernoCorporativoInformation: {
      transactId: 0,
      description: ''
    },
    dataRelevoGenrencial: {
      trasactId: 0,
      observations: " ",
      dataTableRelevoGerencial: null
    },
    dataFlujoOperativo: {
      transactId: 0,
      observations: " ",
      infoDate: null
    },
    dataEstructuraOrganizacional: {
      transactId: 0,
      description: null,
      date: ""
    },
    dataEmpresaRelacionada: {
      transactId: 0,
      description: null,
      observations: null,
      dataTableEmpresaRelacionada: null,
      date: ""
    },
    dataInformacionClientes: {
      transactId: 0,
      dataTableInformacionClientes: null,
      description: " ",
      cicloVenta: false,
      observations: " ",
      porcenVenta: 0,
      "seasonalSales": false,
      "percSeasonalPeriodSales": 0,
    },
    dataInformacionProveedores: {
      transactId: 0,
      dataTableInformacionProveedores: null,
      cicloCompra: " ",
      description: " ",
      purchasingCycle: " "
    },
    dataPrincipalesCompetidores: {
      transactId: 0,
      dataTablePrincipalesCompetidores: null
    },
    dataProyecciones: {
      transactId: 0,
      descripcion: " ",
      assetsOperatingAmount: 0,
      assetsOperatingReason: " ",
      fixedAssetsAmount: 0,
      fixedAssetsReason: " ",
      othersAssetsAmount: 0,
      othersAssetsReason: " ",
      bankAmount: 0,
      bankReason: " ",
      providersAmount: 0,
      providersReason: " ",
      capitalAmount: 0,
      capitalReason: " ",
      maximodeuda: 0,
      estimatedDate: null,
    },
    dataRelacionesBancarias: {
      transactId: 0,
      observations: " ",
      dataTablDeudaCorto: null,
      dataTablDeudaLargo: null,
      dataTablSowActual: null,
      dataTablSowPropuesto: null,
      sumatoriaDeudaCorto: { monto: 0, saldo1: 0, saldo2: 0, saldo3: 0 },
      sumatoriaDeudaLargo: { monto: 0, saldo1: 0, saldo2: 0, saldo3: 0 }
    },
    dataMoviemientosCuentas: {
      transactId: 0,
      dataTableMovimientoCuentas: null,
      details: " ",
      observations: " ",
    },
    dataReciprocidad: {
      transactId: 0,
      dataTableReciprocidad: null,
      description: " ",
      observations: " ",
    },
    dataFacilidadActivosFijos: {
      transactId: 0,
      dataTableFacilidadActivosFijos: null,
      notApplicable: false,
      variationsAssets: false,
      variationsAssetsObs: " ",
      manufacturingAgroCompanies: false,
      productionLine: " ",
      capacity: " ",
      usedCapacity: " ",
      tradingCompany: false,
      warehouseCapacity: " ",
      transportDistributionFleet: false,
      units: " ",
      renovation: " ",

      descriptionOfTheFacilities: false,
      physicalLocation: '',
      numberOfBranches: '',
      rentalConditions: '',
      invested: '',
      vinversionesefectuadas: '',
    },
    dataAspectosAmbientales: {
      transactId: 0,
      riskPreClassification: null,
      sustainableCreditRating: "2",
      riskClassificationConfirmation: null,
      natureLocationProject: false,
      physicalResettlement: false,
      environmentalPermits: false,
      newProject: false,
      tipo: true,
      workersContractors: false,
      legalInvestigation: " "
    },
    dataInformacionGarante: {
      transactId: 0,
      dataTbleInformacionGarantes: null
    },
    dataSegurosActualesEmpresa: {
      transactId: 0,
      dataTableSegurosActualesEmpresa: null
    },
    dataArquitecturaEmpresarial: {
      transactId: 0,
      ticCompanyUse: " ",
      auditedAreas: " "
    },
    dataCuentasCobrar: {
      transactId: 0,
      dataTableCuentasCobrar: null
    },
    dataCapex: {
      transactId: 0,
      dataTableCapex1: null,
      dataTableCapex2: null,
      dataTableCapex3: null,
    },
    dataFlujoCaja: {
      transactId: 0,
      dataTableFlujoCaja1: null,
      dataTableFlujoCaja2: null,
      dataTableFlujoCaja3: null,
      dataTableFlujoCaja4: null,
      dataTableFlujoCaja5: null,
      dataTableFlujoCaja6: null,
    },
    dataNegociosObtener: { transactId: 0, observations: null },
    dataMatrizCompetitiva: {
      transactId: 0,
      observations: " ",
    },
    dataRecomendacionesOtros: {
      transactId: 0,
      recommendations: " ",
      valueChain: " ",
      background: " ",
      refinancingLog: " "
    },
  }
  const location = useLocation()
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [selectedData, setSelectedData] = useState(modelo);
  const [ValidacionGeneralesEmpresa, setValidacionGeneralesEmpresa] = useState(false);
  const [ModalPreviewData, settoogleModalPreview] = useState(false);

  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);
  const [optionSelected, setoptionSelected] = useState(null);
  /* ---------------------------------------------------------------------------------------------- */
  /*                          Variables de refactor para todos los paneles                          */
  /* ---------------------------------------------------------------------------------------------- */
  const datosGeneralesRef = useRef();
  const generalesEmpresaRef = useRef();
  const historiaEmpresaRef = useRef();
  const informacionAccionistaRef = useRef();
  const gobiernoCorporativoRef = useRef();
  const flujoOperativoRef = useRef();
  const estructuraOrganizacionalEmpresaRef = useRef();
  const relevoGeneracionalRef = useRef();
  const empresaRelacionadaRef = useRef();
  const informacionClientesRef = useRef();
  const InformacionProveedoresRef = useRef();
  const PrincipalesCompetidoresRef = useRef();
  const ProyeccionesRef = useRef();
  const [ProyeccionesState, setProyeccionesState] = useState({});
  const ProyeccionesRef2 = useRef();
  const RelacionesBancariasRef = useRef();
  const MoviemientosCuentasRef = useRef();
  const ReciprocidadRef = useRef();
  const FacilidadActivosFijosRef = useRef();
  const AspectosAmbientalesRef = useRef();
  const InformacionGaranteRef = useRef();
  const SegurosActualesEmpresaRef = useRef();
  const ArquitecturaEmpresarialRef = useRef();
  const CuentasCobrarRef = useRef();
  const CapexRef = useRef();
  const FlujoCajaRef = useRef();
  const NegociosObtenerRef = useRef();
  const MatrizCompetitivaRef = useRef();
  const RecomendacionesOtrosRef = useRef();
  /* ---------------------------------------------------------------------------------------------- */
  /*                            Variables de estado para el indice de IGR                           */
  /* ---------------------------------------------------------------------------------------------- */
  const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina
  const [selectedClient, setSelectedClient] = useState(undefined); //cargar la data seleccionada
  const [activeTab, setactiveTab] = useState(1) //Tab seleccionado. Por defecto 1
  const [displayModalCloseOptions, setDisplayModalCloseOptions] = useState(false);
  const [displayModalSeleccionarCliente, setDisplayModalSeleccionarCliente] = useState(false);
  //mostrar el modal para la opción de finalizar proceso
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [activarPantallas, setactivarPantallas] = useState(false);
  const [datosUsuario, setdatosUsuario] = useState(null);
  const currencyData = new Currency();

  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());

  const [errorHandlerIGR, setErrorHandlerIGR] = useState(false);
  const [errorMessageIGR, setErrorMessageIGR] = useState([]);

  React.useEffect(() => {
    setIsActiveLoading(false);
  }, [activeTab])
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
    setLocationData(locationData);
    initializeData(locationData);
  }
  // React.useEffect(() => {
  //   if (location.data !== null && location.data !== undefined) {
  //     if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
  //       //location.data.transactionId = 0;
  //       //checkAndCreateProcedure(location.data);
  //       history.push(url.URL_DASHBOARD);
  //     }
  //     else {
  //       sessionStorage.setItem('locationData', JSON.stringify(location.data));
  //       setLocationData(location.data);
  //       initializeData(location.data);
  //     }
  //   }
  //   else {
  //     //chequeamos si tenemos guardado en session
  //     var result = sessionStorage.getItem('locationData');
  //     if (result !== undefined && result !== null) {
  //       result = JSON.parse(result);
  //       setLocationData(result);
  //       initializeData(result);
  //     }
  //   }
  // }, [activeTab]);
  //Caraga Inicial
  function initializeData(InputData) {

    //Salvamos toda la data inicial de T24 a nuesta BD
    autoSaveData.saveInitialData(InputData.transactionId);

    if (InputData !== undefined && InputData !== null) {
      if (InputData.taskStatus === "Ready") {
        bpmServices.startedStatusTask(InputData.taskId)
          .then((iniresult) => {
            if (iniresult === undefined) {
              history.push(url.URL_DASHBOARD);
            }
          })
      } else {
        setactivarPantallas(true)
        /* ---------------------------------------------------------------------------------------------- */
        /*              Cargamos todos los datos si existe algun registro de datos generales              */
        /* ---------------------------------------------------------------------------------------------- */
        backendServices.consultPrincipalDebtor(InputData.transactionId).then(resp => {
          setLocationData(InputData)
          console.log("consultPrincipalDebtor", resp);
          setdatosUsuario(resp)
          ////console.log("consultPrincipalDebtor", resp);
        })
        // if (activeTab == 1) {          
        /* ---------------------------------------------------------------------------------------------- */
        /*                     Consultamos los datos Generales del informe de gestion                     */
        /* ---------------------------------------------------------------------------------------------- */
        backendServices.consultGeneralDataIGR(InputData.transactionId).then(async resp => {
          modelo.datosGenerales.codigoTipoIdentificacion = resp?.identificationType
          modelo.datosGenerales.transactId = InputData.transactionId;
          modelo.datosGenerales.economicGroup.code = resp?.economicGroup?.code ?? "";
          modelo.datosGenerales.economicGroup.name = resp?.economicGroup?.name ?? "";
          modelo.datosGenerales.economicActivity.code = resp?.economicActivity?.code ?? "";
          modelo.datosGenerales.economicActivity.name = resp?.economicActivity?.name ?? "";
          modelo.datosGenerales.subeconomicActivity.code = resp?.subeconomicActivity?.code ?? "";
          modelo.datosGenerales.subeconomicActivity.name = resp?.subeconomicActivity?.name ?? "";
          modelo.datosGenerales.bank.code = resp?.bank?.code ?? "";
          modelo.datosGenerales.bank.name = resp?.bank?.name ?? "";
          setSelectedData(modelo);
        })
        // }
      }
    }
    else {
      history.push(url.URL_DASHBOARD);
    }
  }
  // funcion que sirve para ir guardando cada vez que se da en siguiente
  async function saveDataTabs(validacion = false, activeTabNew = activeTab, activar = false, activacion = false) {
    if (activar) {
      setIsActiveLoading(true);
    }
    if (activeTabNew == 1) {
      datosGeneralesRef.current.validateForm();
      setTimeout(() => {
        setIsActiveLoading(false);
      }, 2500);
      let ambiental = await backendServices.consultGeneralDataIGR(locationData.transactionId);
      // datosGeneralesRef.current.dataReturn2.transactId = Number(locationData.transactionId);
      selectedData.datosGenerales = datosGeneralesRef.current.dataReturn2;
      setSelectedData(selectedData);
      let dataGenerales =
      {
        customerId: locationData.customerId,
        transactId: Number(locationData.transactionId),
        personType: datosGeneralesRef.current?.dataReturn2?.codigoTipoPersona ?? " ",
        identificationType: datosGeneralesRef.current?.dataReturn2?.codigoTipoIdentificacion ?? " ",
        customerDocumentId: datosGeneralesRef.current?.dataReturn2?.numeroIdentificacion ?? " ",
        customerNumberT24: datosGeneralesRef.current?.dataReturn2?.numeroCliente ?? " ",
        firstName: datosGeneralesRef.current?.dataReturn2?.primerNombre ?? " ",
        secondName: datosGeneralesRef.current?.dataReturn2?.segundoNombre ?? " ",
        firstLastName: datosGeneralesRef.current?.dataReturn2?.primerApellido ?? " ",
        secondLastName: datosGeneralesRef.current?.dataReturn2?.segundoApellido ?? " ",
        "economicGroup": {
          "code": datosGeneralesRef.current?.dataReturn2?.economicGroup.code ?? " ",
          "name": datosGeneralesRef.current?.dataReturn2?.economicGroup.name ?? " "
        },
        "economicActivity": {
          "code": datosGeneralesRef.current?.dataReturn2?.economicActivity.code ?? " ",
          "name": datosGeneralesRef.current?.dataReturn2?.economicActivity.name ?? " "
        },
        "subeconomicActivity": {
          "code": datosGeneralesRef.current?.dataReturn2?.subeconomicActivity.code ?? " ",
          "name": datosGeneralesRef.current?.dataReturn2?.subeconomicActivity.name ?? " "
        },
        "bank": {
          "code": datosGeneralesRef.current?.dataReturn2?.bank.code ?? " ",
          "name": datosGeneralesRef.current?.dataReturn2?.bank.name ?? " "
        },
        date: moment().format("YYYY-MM-DD"),
        status: true,
      }
      // guardarDatosGeneralesIGR
      backendServices.saveGeneralDataIGR(dataGenerales).then(resp => {
        if (resp != undefined) {
          if (ambiental != undefined) {
            console.log(ambiental);
            console.log(datosGeneralesRef.current?.dataReturn2);
            if (ambiental?.economicActivity?.code != datosGeneralesRef.current?.dataReturn2?.economicActivity.code) {
              let tipoClasificacion = "BAJA";
              tipoClasificacion = jsonAmbientales[datosGeneralesRef.current?.dataReturn2?.economicActivity?.code][datosGeneralesRef.current?.dataReturn2?.subeconomicActivity?.code]
              let jsonAmbiental = {
                "transactId": locationData.transactionId,
                "riskPreClassification": tipoClasificacion.values.clasificacion,
                "sustainableCreditRating": "2",
                "riskClassificationConfirmation": "Baja",
                "natureLocationProject": false,
                "physicalResettlement": false,
                "environmentalPermits": false,
                "newProject": false,
                "workersContractors": false,
                "legalInvestigation": ""
              }
              console.log(jsonAmbiental)
              backendServices.saveEnvironmentalAspectsIGR(jsonAmbiental).then(resp => {
              })
            } else {
            }
          } else {
          }
          if (validacion == false) {

            toggleTab(activeTabNew + 1);

          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
      if (validacion == false) {
        toggleTab(activeTabNew + 1);
      }
    } else if (activeTabNew == 2) {
      generalesEmpresaRef.current.validateForm();
      generalesEmpresaRef.current.dataReturn.transactId = Number(locationData.transactionId);
      generalesEmpresaRef.current.dataReturn.phoneNumber = Number(generalesEmpresaRef.current.dataReturn.phoneNumber);
      selectedData.datosEmpresa = generalesEmpresaRef.current.dataReturn;
      setSelectedData(selectedData)
      /* ---------------------------------------------------------------------------------------------- */
      /*                       Llamamos al servicio de guardar datos de la empresa                      */
      /* ---------------------------------------------------------------------------------------------- */
      let dataGenerales = {
        "transactId": +locationData.transactionId ?? 0,
        "country": {
          "code": generalesEmpresaRef?.current?.dataReturn?.country?.code ?? '',
          "name": generalesEmpresaRef?.current?.dataReturn?.country?.name ?? ''
        },
        "province": {
          "code": generalesEmpresaRef?.current?.dataReturn?.province?.code ?? '',
          "name": generalesEmpresaRef?.current?.dataReturn?.province?.name ?? ''
        },
        "district": {
          "code": generalesEmpresaRef?.current?.dataReturn?.district?.code ?? '',
          "name": generalesEmpresaRef?.current?.dataReturn?.district?.name ?? ''
        },
        "township": {
          "code": generalesEmpresaRef?.current?.dataReturn?.township?.code ?? '',
          "name": generalesEmpresaRef?.current?.dataReturn?.township?.name ?? ''
        },
        "city": {
          "code": generalesEmpresaRef?.current?.dataReturn?.city?.code ?? '',
          "name": generalesEmpresaRef?.current?.dataReturn?.city?.name ?? ''
        },
        "referencePoint": generalesEmpresaRef?.current?.dataReturn?.referencePoint ?? '',
        "residency": generalesEmpresaRef?.current?.dataReturn?.residency ?? '',
        "houseNumber": generalesEmpresaRef?.current?.dataReturn?.houseNumber ?? '',
        "phoneNumber": "" + generalesEmpresaRef?.current?.dataReturn?.phoneNumber ?? "0",
        "mobileNumber": "" + generalesEmpresaRef?.current?.dataReturn?.mobileNumber ?? "0",
        "workNumber": "" + generalesEmpresaRef?.current?.dataReturn?.workNumber ?? "0",
        "email": generalesEmpresaRef?.current?.dataReturn?.email ?? '',
        "sector": {
          "code": generalesEmpresaRef?.current?.dataReturn?.sector?.code ?? '',
          "name": generalesEmpresaRef?.current?.dataReturn?.sector?.name ?? ''
        },
        "subSector": {
          "code": generalesEmpresaRef?.current?.dataReturn?.subSector?.code ?? '',
          "name": generalesEmpresaRef?.current?.dataReturn?.subSector?.name ?? ''
        },
        "exclusion": !!generalesEmpresaRef?.current?.dataReturn?.exclusion ?? false,
        "sustainable": !!generalesEmpresaRef?.current?.dataReturn?.sustainable ?? false,
        sustainableProjectId: generalesEmpresaRef?.current?.dataReturn.sustainableProjectId ?? '',
        sustainableProjectDesc: generalesEmpresaRef?.current?.dataReturn.sustainableProjectDesc ?? ''

      }
      if (activacion == true) {
        return;
      }
      backendServices.saveDataCompanyIGR(dataGenerales).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 3) {
      historiaEmpresaRef.current.validateForm();
      historiaEmpresaRef.current.dataReturn.transactId = locationData.transactionId;
      selectedData.historiaEmpresa = historiaEmpresaRef.current.dataReturn;
      setSelectedData(selectedData);
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                         Guardamos la seccion de historia de la empresa                         */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveCompanyHistoryIGR(selectedData.historiaEmpresa).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 4) {
      informacionAccionistaRef.current.validateForm();
      informacionAccionistaRef.current.dataReturn.transactId = Number(locationData.transactionId);
      selectedData.dataAccionistas = informacionAccionistaRef.current.dataReturn;
      setSelectedData(selectedData)
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                               Guardamos la seccion de accionista                               */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveSectionShareholder(selectedData.dataAccionistas).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 5) {
      estructuraOrganizacionalEmpresaRef.current.validateForm();
      estructuraOrganizacionalEmpresaRef.current.dataReturn.transactId = Number(locationData.transactionId);
      estructuraOrganizacionalEmpresaRef.current.dataReturn.description = estructuraOrganizacionalEmpresaRef.current.dataReturn.description == null ? " " : estructuraOrganizacionalEmpresaRef.current.dataReturn.description;
      selectedData.dataEstructuraOrganizacional = estructuraOrganizacionalEmpresaRef.current.dataReturn;
      setSelectedData(selectedData);
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                        Guardamos la secicon de estructura organizacional                       */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveCompanyStructureIGR(selectedData.dataEstructuraOrganizacional).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })

    } else if (activeTabNew == 6) {
      gobiernoCorporativoRef.current.validateForm();
      setIsActiveLoading(false);
      // gobiernoCorporativoRef.current.dataReturn.transactId = Number(locationData.transactionId);
      // selectedData.dataRelevoGenrencial = gobiernoCorporativoRef.current.dataReturn;
      // setSelectedData(selectedData)

      let dataSet = {
        transactId: Number(locationData.transactionId),
        description: gobiernoCorporativoRef.current?.dataReturn2?.description ?? "",
      }
      if (activacion === true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                           Guardamos la sección de gobierno corporativo descripción                          */
      /* ---------------------------------------------------------------------------------------------- */

      let newDescription = gobiernoCorporativoRef.current?.dataReturn2.transactId === 0;

      let backendFunction = newDescription ? (backendServices.saveGovernanceInformation(dataSet)) : (backendServices.updateGovernanceInformation(dataSet))

      backendFunction.then(resp => {
        setIsActiveLoading(false);
        if (resp !== undefined) {
          if (validacion === false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
      }).catch(() => {
        if (validacion === false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      });

    } else if (activeTabNew == 7) {
      relevoGeneracionalRef.current.validateForm();
      relevoGeneracionalRef.current.dataReturn.transactId = Number(locationData.transactionId);
      selectedData.dataRelevoGenrencial = relevoGeneracionalRef.current.dataReturn;
      setSelectedData(selectedData)
      let dataSet = {
        transactId: Number(locationData.transactionId),
        observations: selectedData.dataRelevoGenrencial.observations,
      }
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                           Guardamos la seccion de relevo generacional                          */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveSectionRelevoGeneracional(dataSet).then(resp => {
        setIsActiveLoading(false);
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 8) {
      flujoOperativoRef.current.validateForm();
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      today = yyyy + '-' + mm + '-' + dd;
      flujoOperativoRef.current.dataReturn.transactId = locationData.transactionId;
      flujoOperativoRef.current.dataReturn.infoDate = today;
      selectedData.dataFlujoOperativo = flujoOperativoRef.current.dataReturn;
      setSelectedData(selectedData);
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                             Guardamos la seccion de flujo operativo                            */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveOperatingFlow(selectedData.dataFlujoOperativo).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 9) {
      empresaRelacionadaRef.current.validateForm();
      empresaRelacionadaRef.current.dataReturn2.trasactId = Number(locationData.transactionId);
      selectedData.dataEmpresaRelacionada = empresaRelacionadaRef.current.dataReturn2;
      setSelectedData(selectedData);
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                          Guardamos la seccion de empresas relacionadas                         */
      /* ---------------------------------------------------------------------------------------------- */
      selectedData.dataEmpresaRelacionada.description = selectedData.dataEmpresaRelacionada.description ?? ' ';
      let datosJson = {
        "trasactId": Number(locationData.transactionId),
        "description": empresaRelacionadaRef?.current.dataReturn2?.informacionAccionistaDetails ?? empresaRelacionadaRef?.current.dataReturn2?.informacionAccionistaDetails ?? " "
      }
      backendServices.saveRelatedCompanySection(datosJson).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 10) {
      informacionClientesRef.current.validateForm();
      // informacionClientesRef.current.dataReturn.transactId = locationData.transactionId;
      // selectedData.dataInformacionClientes = informacionClientesRef.current.dataReturn;
      // selectedData.dataInformacionClientes.description = informacionClientesRef.current.dataReturn.observations;
      // setSelectedData(selectedData)
      let datoCliente = {
        "transactId": Number(locationData.transactionId),
        "description": informacionClientesRef.current.dataReturn.observacion == null || informacionClientesRef.current.dataReturn.observacion == "" ? " " : informacionClientesRef.current.dataReturn.observacion,
        "seasonalSales": informacionClientesRef.current.dataReturn.seasonalSales == null || informacionClientesRef.current.dataReturn.seasonalSales == "" ? false : informacionClientesRef.current.dataReturn.seasonalSales,
        "percSeasonalPeriodSales": Number(informacionClientesRef.current.dataReturn.percSeasonalPeriodSales == null || informacionClientesRef.current.dataReturn.percSeasonalPeriodSales == "" ? " " : informacionClientesRef.current.dataReturn.percSeasonalPeriodSales)
      }
      if (activacion == true) {
        return;
      }
      //console.log("InformacionClientes2222222", datoCliente);
      //console.log("InformacionClientes3333333", informacionClientesRef.current.dataReturn);
      /* ---------------------------------------------------------------------------------------------- */
      /*                                Guardamos la seccion de clientes                                */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveClientSectionIGR(datoCliente).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 11) {
      InformacionProveedoresRef.current.validateForm();
      InformacionProveedoresRef.current.dataReturn.transactId = Number(locationData.transactionId);
      selectedData.dataInformacionProveedores = InformacionProveedoresRef.current.dataReturn;
      setSelectedData(selectedData)
      let datos = {
        "transactId": Number(locationData.transactionId),
        "description": InformacionProveedoresRef.current.dataReturn.description == null || InformacionProveedoresRef.current.dataReturn.description == "" ? " " : InformacionProveedoresRef.current.dataReturn.description,
        "purchasingCycle": InformacionProveedoresRef.current.dataReturn.purchasingCycle == null || InformacionProveedoresRef.current.dataReturn.purchasingCycle == "" ? " " : InformacionProveedoresRef.current.dataReturn.purchasingCycle
      }
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                              Guardamos la seccion de proveeedores                              */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveProviderSectionIGR(datos).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 12) {
      selectedData.dataPrincipalesCompetidores = {};
      setIsActiveLoading(false);
      setSelectedData(selectedData)
      if (validacion == false) {
        toggleTab(activeTabNew + 1);
      }
    } else if (activeTabNew == 13) {
      //console.log("Data proyecciones", ProyeccionesRef);
      ProyeccionesRef.current.validateForm();
      if (ProyeccionesRef.current.dataReturn.projectionsDTO) {
        return;
      }
      selectedData.dataProyecciones = ProyeccionesState.dataReturn;
      setSelectedData(selectedData);
      let datosJsonSet = {
        transactId: Number(locationData.transactionId) ?? 0,
        descripcion: ProyeccionesRef.current?.dataReturn?.descripcion ?? "",
        assetsOperatingAmount: Number(currencyData.getRealValue(ProyeccionesRef.current?.dataReturn?.assetsOperatingAmount ?? 0)) ?? 0,
        assetsOperatingReason: ProyeccionesRef.current?.dataReturn?.assetsOperatingReason ?? "",
        fixedAssetsAmount: Number(currencyData.getRealValue(ProyeccionesRef.current?.dataReturn?.fixedAssetsAmount ?? 0)) ?? 0,
        fixedAssetsReason: ProyeccionesRef.current?.dataReturn?.fixedAssetsReason ?? "",
        othersAssetsAmount: Number(currencyData.getRealValue(ProyeccionesRef.current?.dataReturn?.othersAssetsAmount ?? 0)) ?? 0,
        othersAssetsReason: ProyeccionesRef.current?.dataReturn?.othersAssetsReason ?? "",
        bankAmount: Number(currencyData.getRealValue(ProyeccionesRef.current?.dataReturn?.bankAmount ?? 0)) ?? 0,
        bankReason: ProyeccionesRef.current?.dataReturn?.bankReason ?? "",
        providersAmount: Number(currencyData.getRealValue(ProyeccionesRef.current?.dataReturn?.providersAmount ?? 0)) ?? 0,
        providersReason: ProyeccionesRef.current?.dataReturn?.providersReason ?? "",
        capitalAmount: Number(currencyData.getRealValue(ProyeccionesRef.current?.dataReturn?.capitalAmount ?? 0)) ?? 0,
        capitalReason: ProyeccionesRef.current?.dataReturn?.capitalReason ?? "",
        maximodeuda: Number(currencyData.getRealValue(ProyeccionesRef.current?.dataReturn?.maximodeuda ?? 0)) ?? 0,
        estimatedDate: ProyeccionesRef.current?.dataReturn?.estimatedDate
      }
      // datosJsonSet.estimatedDate = datosJsonSet?.estimatedDate ?? "2022-01-01";
      setSelectedData(selectedData)
      if (activacion == true) {
        return;
      }
      // if (ProyeccionesRef.current?.dataReturn?.estimatedDate == " ") {
      //   setIsActiveLoading(false);        
      //   return
      // }
      /* ---------------------------------------------------------------------------------------------- */
      /*                              Guardamos la seccion de proyecciones                              */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveProjections(datosJsonSet).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 14) {
      RelacionesBancariasRef.current.validateForm();
      RelacionesBancariasRef.current.dataReturn.transactId = locationData.transactionId;
      selectedData.dataRelacionesBancarias = RelacionesBancariasRef.current.dataReturn;
      setSelectedData(selectedData);
      let jsonSet = {
        "transactId": Number(locationData.transactionId ?? 0),
        "observations": RelacionesBancariasRef?.current?.dataReturn?.observations ?? " "
      }
      if (activacion == true) {
        return;
      }
      // setSelectedData(jsonSet)
      /* ---------------------------------------------------------------------------------------------- */
      /*                          Guardamos la seccion de relaciones bancarias                          */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveRelacionesBancariasSeccionIGR(jsonSet).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 15) {
      MoviemientosCuentasRef.current.validateForm();
      MoviemientosCuentasRef.current.dataReturn.transactId = Number(locationData.transactionId);
      selectedData.dataMoviemientosCuentas = MoviemientosCuentasRef.current.dataReturn;
      setSelectedData(selectedData)
      let datos = {
        trasactId: Number(locationData.transactionId),
        observations: MoviemientosCuentasRef.current.dataReturn.observations
      }
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                         Guardamos la seccion de movimientos de cuentas                         */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveSectionMovementsAccounts(datos).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 16) {
      ReciprocidadRef.current.validateForm();
      ReciprocidadRef.current.dataReturn.transactId = Number(locationData.transactionId);
      selectedData.dataReciprocidad = ReciprocidadRef.current.dataReturn;
      setSelectedData(selectedData);
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                              Guardamos la seccion de reciprocidad                              */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveSectionReciprocity(selectedData.dataReciprocidad).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 17) {
      FacilidadActivosFijosRef.current.validateForm();
      FacilidadActivosFijosRef.current.dataReturn.transactId = Number(locationData.transactionId);
      selectedData.dataFacilidadActivosFijos = FacilidadActivosFijosRef.current.dataReturn;
      setSelectedData(selectedData);
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                              Guardamos la seccion de activos fijos                             */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveSectionFixedAssetsIGR(FacilidadActivosFijosRef?.current?.dataReturn).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 18) {
      AspectosAmbientalesRef.current.validateForm();
      AspectosAmbientalesRef.current.dataReturn.transactId = locationData.transactionId;
      selectedData.dataAspectosAmbientales = AspectosAmbientalesRef.current.dataReturn;
      console.log(AspectosAmbientalesRef.current.dataReturn)
      setSelectedData(selectedData);
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                          Guardamos la seccion de aspectos ambientales                          */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveEnvironmentalAspectsIGR(selectedData.dataAspectosAmbientales).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 21) {
      ArquitecturaEmpresarialRef.current.validateForm();
      ArquitecturaEmpresarialRef.current.dataReturn.transactId = Number(locationData.transactionId);
      selectedData.dataArquitecturaEmpresarial = ArquitecturaEmpresarialRef.current.dataReturn;
      setSelectedData(selectedData);
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                        Guardamos la seccion de arquitectura empresarial                        */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveArchitectureBusinessIGR(selectedData.dataArquitecturaEmpresarial).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 25) {
      NegociosObtenerRef.current.validateForm();
      NegociosObtenerRef.current.dataReturn.transactId = Number(locationData.transactionId);
      selectedData.dataNegociosObtener = NegociosObtenerRef.current.dataReturn;
      setSelectedData(selectedData)
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                           Guardamos la seccion de negocios a obtener                           */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveBusinessGetIGR(selectedData.dataNegociosObtener).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 26) {
      MatrizCompetitivaRef.current.validateForm();
      MatrizCompetitivaRef.current.dataReturn.transactId = Number(locationData.transactionId);
      selectedData.dataMatrizCompetitiva = MatrizCompetitivaRef.current.dataReturn;
      setSelectedData(selectedData);
      // //console.log(MatrizCompetitivaRef);
      /* ---------------------------------------------------------------------------------------------- */
      /*                           Guardamos la seccion de matriz competitiva                           */
      /* ---------------------------------------------------------------------------------------------- */
      let jsonSet = {
        "transactId": Number(locationData.transactionId),
        "observations": MatrizCompetitivaRef?.current?.dataReturn?.observations ?? " "
      }
      if (activacion == true) {
        return;
      }
      // return
      backendServices.saveMatrixSectionIGR(jsonSet).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else if (activeTabNew == 27) {
      RecomendacionesOtrosRef.current.validateForm();
      RecomendacionesOtrosRef.current.dataReturn.transactId = Number(locationData.transactionId);
      selectedData.dataRecomendacionesOtros = RecomendacionesOtrosRef.current.dataReturn;
      setSelectedData(selectedData);
      if (activacion == true) {
        return;
      }
      /* ---------------------------------------------------------------------------------------------- */
      /*                             Guardamos la seccion de recomendaciones                            */
      /* ---------------------------------------------------------------------------------------------- */
      backendServices.saveRecommendationsIGR(selectedData.dataRecomendacionesOtros).then(resp => {
        if (resp != undefined) {
          if (validacion == false) {
            toggleTab(activeTabNew + 1);
          }
        } else {
          // seterror_dlg(false)
        }
        setIsActiveLoading(false);
      }).catch(err => {
        if (validacion == false) {
          toggleTab(activeTabNew + 1);
        }
        setIsActiveLoading(false);
      })
    } else {
      setIsActiveLoading(false);
      if (validacion == false) {
        toggleTab(activeTabNew + 1);
      }
    }
  }
  //guardar la data
  function submitData() {
    generalesEmpresaRef.current.validateForm();
    // if (!generalesEmpresaRef.current.getFormValidation()) {
    //   toggleTab(2);
    //   return false;
    // }
    if (generalesEmpresaRef?.current?.dataReturn?.formValid == false) {

      return false;
    }
    //console.log(generalesEmpresaRef.current);
    return true;
  }
  //moverse entre los tabs
  async function toggleTab(tab) {
    if (tab == 2) {
      /* ---------------------------------------------------------------------------------------------- */
      /*            Cargatos todos los datos si exite algun registro de datos para la empresa           */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultDataCompanyIGR(locationData?.transactionId ?? 0).then(async resp => {
        // //console.log(resp);
        if (resp !== undefined && resp !== null) {
          if (resp.statusService.statusCode == "204" && locationData?.transactionId.length > 0) {
            backendServices.consultPrincipalDebtor(locationData?.transactionId ?? 0).then(async response => {
              coreServices.getPartiesInformationExtra(response.typePerson, response.customerNumberT24).then(async resp2 => {
                coreServices.getPaisesCatalogo()
                  .then(response => {
                    if (response === null) { return; }
                    let json = [];
                    for (let i = 0; i < response?.Records.length; i++) {
                      json.push({ label: response?.Records[i]["Description"], value: response?.Records[i]["Code"] })
                    }
                    //console.log("getPartiesInformationExtra", resp2);
                    modelo.datosEmpresa.transactId = locationData?.transactionId ?? 0;
                    // modelo.datosEmpresa.country.code = json.find(x => x.value === resp2?.address?.Country).value;
                    modelo.datosEmpresa.country.code = resp2?.address?.Country ?? '';
                    modelo.datosEmpresa.country.name = json.find(x => x.value === resp2?.address?.Country)?.label ?? "";
                    modelo.datosEmpresa.province.name = resp2?.address?.Province ?? "";
                    modelo.datosEmpresa.province.code = resp2?.address?.Province ?? "";
                    modelo.datosEmpresa.district.code = resp2?.address?.Province + "" + resp2?.address?.CountyDistrict ?? "";
                    modelo.datosEmpresa.district.name = resp2?.address?.Province + "" + resp2?.address?.CountyDistrict ?? "";
                    modelo.datosEmpresa.township.name = resp2?.address?.Jurisdiction ?? "";
                    modelo.datosEmpresa.township.code = resp2?.address?.Jurisdiction ?? "";
                    modelo.datosEmpresa.city.code = resp2?.address?.City ?? "";
                    modelo.datosEmpresa.city.name = resp2?.address?.City ?? "";
                    modelo.datosEmpresa.referencePoint = resp2?.address?.AddrDesc ?? "";
                    modelo.datosEmpresa.residency = resp2?.address?.Building ?? "";
                    modelo.datosEmpresa.phoneNumber = resp2?.PhoneNumber ?? "";
                    modelo.datosEmpresa.email = resp2?.Email ?? "";
                    modelo.datosEmpresa.sustainableProjectId = resp?.sustainableProjectId;
                    modelo.datosEmpresa.sustainableProjectDesc = resp?.sustainableProjectDesc;
                    setSelectedData(modelo);
                    setValidacionGeneralesEmpresa(true)
                  });
              });
            })
          }
          else {
            modelo.datosEmpresa.transactId = locationData?.transactionId ?? 0;
            modelo.datosEmpresa.country.code = resp?.country.code;
            modelo.datosEmpresa.country.name = resp?.country.name;
            modelo.datosEmpresa.province.name = resp?.province.name;
            modelo.datosEmpresa.province.code = resp?.province.code;
            modelo.datosEmpresa.district.code = resp?.district.code;
            modelo.datosEmpresa.district.name = resp?.district.name;
            modelo.datosEmpresa.township.name = resp?.township.name;
            modelo.datosEmpresa.township.code = resp?.township.code;
            modelo.datosEmpresa.city.code = resp?.city.code;
            modelo.datosEmpresa.city.name = resp?.city.name;
            modelo.datosEmpresa.referencePoint = resp?.referencePoint;
            modelo.datosEmpresa.residency = resp?.residency;
            modelo.datosEmpresa.houseNumber = resp?.houseNumber;
            modelo.datosEmpresa.phoneNumber = resp?.phoneNumber;
            modelo.datosEmpresa.mobileNumber = resp?.mobileNumber;
            modelo.datosEmpresa.workNumber = resp?.workNumber;
            modelo.datosEmpresa.email = resp?.email;
            modelo.datosEmpresa.sector.name = resp?.sector.name;
            modelo.datosEmpresa.sector.code = resp?.sector.code;
            modelo.datosEmpresa.subSector.name = resp?.subSector.name;
            modelo.datosEmpresa.subSector.code = resp?.subSector.code;
            modelo.datosEmpresa.exclusion = resp?.exclusion;
            modelo.datosEmpresa.sustainable = resp?.sustainable;
            modelo.datosEmpresa.sustainableProjectId = resp?.sustainableProjectId;
            modelo.datosEmpresa.sustainableProjectDesc = resp?.sustainableProjectDesc;
          }
          setSelectedData(modelo);
          setValidacionGeneralesEmpresa(true)
        } else {
          backendServices.consultPrincipalDebtor(locationData?.transactionId ?? 0).then(async response => {
            coreServices.getPartiesInformationExtra(response.typePerson, response.customerNumberT24).then(async resp2 => {
              coreServices.getPaisesCatalogo()
                .then(response => {
                  if (response === null) { return; }
                  let json = [];
                  for (let i = 0; i < response?.Records.length; i++) {
                    json.push({ label: response?.Records[i]["Description"], value: response?.Records[i]["Code"] })
                  }
                  //console.log("getPartiesInformationExtra", resp2);
                  modelo.datosEmpresa.transactId = locationData?.transactionId ?? 0;
                  modelo.datosEmpresa.country.code = resp2?.address?.Country ?? '';
                  modelo.datosEmpresa.country.name = json.find(x => x.value === resp2?.address?.Country)?.label ?? "";
                  modelo.datosEmpresa.province.name = resp2?.address?.Province ?? "";
                  modelo.datosEmpresa.province.code = resp2?.address?.Province ?? "";
                  modelo.datosEmpresa.district.code = resp2?.address?.Province + "" + resp2?.address?.CountyDistrict ?? "";
                  modelo.datosEmpresa.district.name = resp2?.address?.Province + "" + resp2?.address?.CountyDistrict ?? "";
                  modelo.datosEmpresa.township.name = resp2?.address?.Jurisdiction ?? "";
                  modelo.datosEmpresa.township.code = resp2?.address?.Jurisdiction ?? "";
                  modelo.datosEmpresa.city.code = resp2?.address?.City ?? "";
                  modelo.datosEmpresa.city.name = resp2?.address?.City ?? "";
                  modelo.datosEmpresa.referencePoint = resp2?.address?.AddrDesc ?? "";
                  modelo.datosEmpresa.residency = resp2?.address?.Building ?? "";
                  modelo.datosEmpresa.phoneNumber = resp2?.PhoneNumber ?? "";
                  modelo.datosEmpresa.email = resp2?.Email ?? "";
                  setSelectedData(modelo);
                  setValidacionGeneralesEmpresa(true)
                });
            });
          })
        }
      })
    }
    if (tab == 3) {
      /* ---------------------------------------------------------------------------------------------- */
      /*           Cargatos todos los datos si exite algun registro de historia de la empresa           */
      /* ----------------------------------------------------------------------------------------------*/
      await backendServices.checkHistoryCompanyIGR(locationData?.transactionId ?? 0).then(resp => {
        // //console.log("empresa historia", resp);
        if (resp !== undefined && resp !== null) {
          modelo.historiaEmpresa.transactId = locationData?.transactionId ?? 0
          modelo.historiaEmpresa.description = resp?.data.description;
          modelo.historiaEmpresa.employeesNumber = resp?.data.employeesNumber;
          modelo.historiaEmpresa.details = resp?.data.details;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 6) {
      /* ---------------------------------------------------------------------------------------------- */
      /*           Cargatos todos los datos si exite algun registro de gobierno corporativo descripcion           */
      /* ----------------------------------------------------------------------------------------------*/
      backendServices.getGovernanceInformation(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataGobiernoCorporativoInformation.description = resp.description;
          modelo.dataGobiernoCorporativoInformation.transactId = locationData?.transactionId;
          setSelectedData(modelo);
        }
      }).catch();

    }
    if (tab == 8) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                      Cargamos los datos por defecto del flujo de operativo                      */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultOperatingFlow(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataFlujoOperativo.transactId = locationData?.transactionId ?? 0;
          modelo.dataFlujoOperativo.observations = resp?.observations;
          modelo.dataFlujoOperativo.infoDate = resp?.infoDate;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 4) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                         Cargamos los datos de la seccion de accionista                         */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultSectionShareholder(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataAccionistas.observations = resp;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 9) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                     Cargamos los datos de la empresa relacionada la seccion                    */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultRelatedCompanyData(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataEmpresaRelacionada.observations = resp?.observations;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 7) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                     Cargamos los datos de la seccion de relevo generacional                    */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultSectionRelevoGeneracional(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataRelevoGenrencial.observations = resp;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 16) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                        Cargamos los datos de la seccion de reciprocidad                        */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultSectionReciprocity(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataReciprocidad.observations = resp;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 26) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                     Cargamos los datos de la seccion de matriz competitiva                     */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultMatrixSectionIGR(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          // //console.log(resp);
          modelo.dataMatrizCompetitiva.observations = resp?.observations;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 15) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                         Cargamos los datos de la seccion de movimiento                         */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultSectionMovementsAccounts(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataMoviemientosCuentas.observations = resp?.observations;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 17) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                    Cargamos los datos de la seccion de activos fijos en IGR                    */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultFixedAssetsIGR(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataFacilidadActivosFijos.notApplicable = resp?.notApplicable;
          modelo.dataFacilidadActivosFijos.variationsAssets = resp?.variationsAssets;
          modelo.dataFacilidadActivosFijos.variationsAssetsObs = resp?.variationsAssetsObs;
          modelo.dataFacilidadActivosFijos.manufacturingAgroCompanies = resp?.manufacturingAgroCompanies;
          modelo.dataFacilidadActivosFijos.productionLine = resp?.productionLine;
          modelo.dataFacilidadActivosFijos.capacity = resp?.capacity;
          modelo.dataFacilidadActivosFijos.usedCapacity = resp?.usedCapacity;
          modelo.dataFacilidadActivosFijos.tradingCompany = resp?.tradingCompany;
          modelo.dataFacilidadActivosFijos.warehouseCapacity = resp?.warehouseCapacity;
          modelo.dataFacilidadActivosFijos.transportDistributionFleet = resp?.transportDistributionFleet;
          modelo.dataFacilidadActivosFijos.units = resp?.units;
          modelo.dataFacilidadActivosFijos.renovation = resp?.renovation;

          modelo.dataFacilidadActivosFijos.descriptionOfTheFacilities = resp?.descriptionOfTheFacilities;
          modelo.dataFacilidadActivosFijos.physicalLocation = resp?.physicalLocation;
          modelo.dataFacilidadActivosFijos.numberOfBranches = resp?.numberOfBranches;
          modelo.dataFacilidadActivosFijos.rentalConditions = resp?.rentalConditions;
          modelo.dataFacilidadActivosFijos.rentalConditionsAf = resp?.rentalConditionsAf;
          modelo.dataFacilidadActivosFijos.invested = resp?.invested;
          modelo.dataFacilidadActivosFijos.vinversionesefectuadas = resp?.vinversionesefectuadas;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 10) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                          Cargamos los datos de la seccion del cliente                          */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultIGRClientSection(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataInformacionClientes.description = resp?.description;
          modelo.dataInformacionClientes.seasonalSales = resp?.seasonalSales;
          modelo.dataInformacionClientes.percSeasonalPeriodSales = resp?.percSeasonalPeriodSales;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 11) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                         Cargamos los datos de la seccion de proveedores                        */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultProviderSectionIGR(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataInformacionProveedores.description = resp?.description;
          modelo.dataInformacionProveedores.purchasingCycle = resp?.purchasingCycle;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 25) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                         Cargamos los datos de negocio a obtener seccion                        */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultBusinessGetIGR(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataNegociosObtener.observations = resp?.observations;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 13) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                               Cargamos los datos de Proyecciones                               */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultProjections(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataProyecciones.descripcion = resp?.projectionsDTO.descripcion;
          modelo.dataProyecciones.assetsOperatingAmount = resp?.projectionsDTO.assetsOperatingAmount;
          modelo.dataProyecciones.assetsOperatingReason = resp?.projectionsDTO.assetsOperatingReason;
          modelo.dataProyecciones.fixedAssetsAmount = resp?.projectionsDTO.fixedAssetsAmount;
          modelo.dataProyecciones.fixedAssetsReason = resp?.projectionsDTO.fixedAssetsReason;
          modelo.dataProyecciones.othersAssetsAmount = resp?.projectionsDTO.othersAssetsAmount;
          modelo.dataProyecciones.othersAssetsReason = resp?.projectionsDTO.othersAssetsReason;
          modelo.dataProyecciones.bankAmount = resp?.projectionsDTO.bankAmount;
          modelo.dataProyecciones.bankReason = resp?.projectionsDTO.bankReason;
          modelo.dataProyecciones.providersAmount = resp?.projectionsDTO.providersAmount;
          modelo.dataProyecciones.providersReason = resp?.projectionsDTO.providersReason;
          modelo.dataProyecciones.capitalAmount = resp?.projectionsDTO.capitalAmount;
          modelo.dataProyecciones.capitalReason = resp?.projectionsDTO.capitalReason;
          modelo.dataProyecciones.maximodeuda = resp?.projectionsDTO.maximodeuda;
          modelo.dataProyecciones.estimatedDate = resp?.projectionsDTO.estimatedDate;
          modelo.dataProyecciones.transactId = locationData?.transactionId ?? 0;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 5) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                  Cargamos los datos de la seccion de estructura de una empresa                 */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultStructureCompanyIGR(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataEstructuraOrganizacional.transactId = locationData?.transactionId ?? 0;
          modelo.dataEstructuraOrganizacional.description = resp?.observations;
          modelo.dataEstructuraOrganizacional.date = resp?.infoDate;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 14) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                           Cargamos los datos de relaciones bancarias                           */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultBankingRelationsSectionIGR(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataRelacionesBancarias.transactId = locationData?.transactionId ?? 0;
          modelo.dataRelacionesBancarias.observations = resp?.bankingRelationSection?.observations;
          setSelectedData(modelo);
        }
      });
    }
    if (tab == 18) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                          Consultamos los datos de aspectos ambientales                         */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultEnvironmentalAspectsIGR(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          // modelo.dataAspectosAmbientales.transactId = locationData?.transactionId ?? 0;
          // modelo.dataAspectosAmbientales.riskPreClassification = resp?.environmentalAspectsDTO.riskPreClassification;
          // modelo.dataAspectosAmbientales.sustainableCreditRating = resp?.environmentalAspectsDTO.sustainableCreditRating;
          // modelo.dataAspectosAmbientales.riskClassificationConfirmation = resp?.environmentalAspectsDTO.riskClassificationConfirmation;
          // modelo.dataAspectosAmbientales.natureLocationProject = resp?.environmentalAspectsDTO.natureLocationProject;
          // modelo.dataAspectosAmbientales.physicalResettlement = resp?.environmentalAspectsDTO.physicalResettlement;
          // modelo.dataAspectosAmbientales.environmentalPermits = resp?.environmentalAspectsDTO.environmentalPermits;
          // modelo.dataAspectosAmbientales.newProject = resp?.environmentalAspectsDTO.newProject;
          // modelo.dataAspectosAmbientales.workersContractors = resp?.environmentalAspectsDTO.workersContractors;
          // modelo.dataAspectosAmbientales.tipo = false;
          // setSelectedData(modelo);
        }
      });
    }
    if (tab == 21) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                  Cargamos los datos de arquitectura empresarial en la seccion                  */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultBusinessArchitectureIGR(locationData?.transactionId ?? 0).then(async resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataArquitecturaEmpresarial.transactId = locationData?.transactionId ?? 0;
          modelo.dataArquitecturaEmpresarial.ticCompanyUse = resp?.ticCompanyUse;
          modelo.dataArquitecturaEmpresarial.auditedAreas = resp?.auditedAreas;
          await setSelectedData(modelo);
        }
      });
    }
    if (tab == 27) {
      /* ---------------------------------------------------------------------------------------------- */
      /*                       Cargamos los datos de la seccion de recomendaciones                      */
      /* ---------------------------------------------------------------------------------------------- */
      await backendServices.consultRecommendationsIGR(locationData?.transactionId ?? 0).then(resp => {
        if (resp !== undefined && resp !== null) {
          modelo.dataRecomendacionesOtros.transactId = locationData?.transactionId ?? 0;
          modelo.dataRecomendacionesOtros.recommendations = resp?.recommendations;
          modelo.dataRecomendacionesOtros.valueChain = resp?.valueChain;
          modelo.dataRecomendacionesOtros.background = resp?.background;
          modelo.dataRecomendacionesOtros.refinancingLog = resp?.refinancingLog;
          setSelectedData(modelo);
        }
      });
    }
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 27) {
        // setTimeout(() => {
        setactiveTab(tab)
        window.scrollTo(0, 0)
        // }, 1500);
      }
    }
  }
  //Modal Opciones al Salir
  function toggleModalCloseOptions() {
    setDisplayModalCloseOptions(!displayModalCloseOptions);
    removeBodyCss();
  }
  // Mostramos la data del previsaualizar
  function toogleModalPreview() {
    // settoogleModalPreview(!ModalPreviewData);
    // removeBodyCss();

  }
  //nuevo informe abrimos modal para buscar y seleccionar cliente
  function toogleShowClient() {
    setDisplayModalSeleccionarCliente(!displayModalSeleccionarCliente);
    removeBodyCss();
  }
  function setUseState(json, tipo, activeTabs) {
    if (tipo == "proyecciones") {
      // //console.log(json);
      setProyeccionesState(json);
    }
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  ////////// PARTE ES LA FINAL DEL PROCESO ///////

  //salvar comentario de end process
  async function checkToContinueAndSave(option) {
    // saveDataTabs(true, activeTab);
    // var result = await backendServices.consultGeneralDataIGR(locationData.transactionId);
    let errorIGR = [];
    await backendServices.consultGeneralDataIGR(locationData.transactionId).then(IGR => {
      if (IGR?.bank?.code === '' || IGR?.bank?.name === '' || IGR?.economicActivity?.code === '' || IGR?.economicActivity?.name === '') {

        (IGR?.bank?.code === '' || IGR?.bank?.name === '') && errorIGR.push(t("Banking"));
        (IGR?.economicActivity?.code === '' || IGR?.economicActivity?.name === '') && errorIGR.push(t("Economic Activity"));

      }
    }).catch(err => {
      console.log(err)
    })

    await backendServices.consultDataCompanyIGR(locationData.transactionId).then(company => {
      if (!company) {
        errorIGR.push(t("General of the Company"));
      }
    }).catch(err => {
      console.log(err)
    })

    setErrorMessageIGR(errorIGR)
    setErrorHandlerIGR(errorIGR.length > 0);

    if (errorIGR.length > 0) {
      return;
    }
    onSaveProcess(option);
  }
  //Salvando el Proceso y le pasamos una opcion: 1-Finalizar Proceso, 2- Salvarlo, 3- A Cumplimmineto, 4- Avanzar a IGR
  function onSaveProcess(option) {
    switch (option) {
      case OPTs.PROCESS_CANCELPROCESS: {
        break;
      }
      case OPTs.PROCESS_INFORMEGESTION: {
        // submitData();
        // saveDataTabs(true, activeTab);
        /*setTimeout(() => {
          saveDataTabs(true, activeTab);
          setTimeout(() => {
            toogleModalPreview();
          }, 1000);
          //toogleModalPreview();
        }, 2500);*/
        break;
      }
      default:
        break;
    }
    saveJBPMProcess(option);
  }
  async function saveJBPMProcess(option) {
    var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var infoBpmModel = new InfoBpmModel(locationData.instanceId, locationData.transactionId,
      locationData.processId, OPTs.ACT_NONE,
      maindebtor?.personId
    );
    infoBpmModel.toprocess = locationData.infobpm.toprocess;

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
              seterror_msg(props.t("TheProcessCouldNotFinish"));
              // seterror_dlg(false)
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
          "customerId": locationData?.customerId?.toString() ?? "",
          "applicationNumber": "",
          "procedureNumber": "",
        };
        bpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            history.push(url.URL_DASHBOARD);
            if (data !== undefined) {
              setsuccessSave_dlg(true);
            }
            else {
              seterror_msg(props.t("ErrorSaveMessage"));
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
          "customerId": locationData.customerId,
          "applicationNumber": "",
          "procedureNumber": "",
          "decision": "si"
        };
        bpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            if (data !== undefined) {

              saveAutoLog(null, t("ReinforcedManagementReport"))

              history.push({
                pathname: url.URL_CREDITPROPOSAL,
                data: locationData,
              });
            }
            else {
              seterror_msg(t("ErrorSaveMessage"))
            }
          });
        break;
      }
      default:
        break;
    }
  }
  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
  }
  async function saveAutoLog(APPLICATION_STATUS = null, observations = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_03)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }
  return (
    <React.Fragment>
      {locationData !== null && locationData !== undefined ?
        <div className="page-content">
          <Breadcrumbs title={t("CommercialCredit")} breadcrumbItem={t("ReinforcedManagementReport")} />
          <HorizontalSteeper processNumber={1} activeStep={1}></HorizontalSteeper>
          <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>
            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={3} style={{ textAlign: "left" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
              </Col>
              <Col md={9} style={{ textAlign: "right" }}>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => {
                  saveDataTabs(true, activeTab, true, true); setTimeout(() => {
                    //console.log("saveDataTabs", activeTab);
                    saveDataTabs(true, activeTab);
                    setTimeout(() => {
                      onSaveProcess(OPTs.PROCESS_INFORMEGESTION);
                    }, 1000);
                  }, 1000);

                }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                <Button color="success" type="button"
                  onClick={() => {
                    saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                      saveDataTabs(true, activeTab);
                      checkToContinueAndSave(OPTs.PROCESS_PROPUESTACREDITO)
                    }, 1000);

                  }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Credit Proposal")}</Button>
              </Col>
            </Row>
            <Card>
              <CardHeader>
                <Row>
                  <Col md={6}>
                    <h4 className="card-title">{t("Reinforced Management Report")}</h4>
                    <p className="card-title-desc">{t("This form is official and must be filled out correctly")}</p>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <Col sm={12} style={{ textAlign: "right" }}>
                        <h5 className="card-title title-header">{datosUsuario != null ? (datosUsuario.typePerson === "1" ? (datosUsuario.name + " " + datosUsuario.name2 + " " + datosUsuario.lastName + " " + datosUsuario.lastName2) : (datosUsuario.name)) : ""} </h5>
                      </Col>
                      <Col sm={12} style={{ textAlign: "right" }}>
                        <h5 className="card-title" style={{ textAlign: "right" }}>{t("Tramit")}:{" "}#{locationData?.transactionId}</h5>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardHeader>
              {errorHandlerIGR && (<div className="mx-3">
                <Alert show={true} color="danger" dismissible onClose={() => { }}>
                  {`${t("The following fields are required")}`}: {errorMessageIGR.join(', ')}
                </Alert>
              </div>)}
              <CardBody>
                <div className="form-wizard-wrapper wizard clearfix">
                  <Row>
                    <Col md={3}>
                      <Nav pills className="flex-column">
                        <NavLink className={classnames({ active: activeTab === 1 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(1);
                            }, 1000);
                          }}>
                          {t("General Data")}
                        </NavLink>
                        <NavLink
                          className={classnames({ active: activeTab === 2 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(2);
                            }, 1000);
                          }}
                        >
                          {t("General of the Company")}
                        </NavLink>
                        <NavLink
                          className={classnames({ active: activeTab === 3 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(3);
                            }, 1000);
                          }}
                        >
                          {t("History of the Company")}
                        </NavLink>
                        <NavLink
                          className={classnames({ active: activeTab === 4 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(4);
                            }, 1000);
                          }}
                        >
                          {t("Shareholder Information")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 5 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(5);
                            }, 1000);
                          }}
                        >{t("OrganizationalStructure")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 6 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(6);
                            }, 1000);
                          }}
                        > {t("CorporateGovernance")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 7 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(7);
                            }, 1000);
                          }}
                        > {t("ManagementRelays")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 8 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(8);
                            }, 1000);
                          }}
                        > {t("OperationalFlow")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 9 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(9);
                            }, 1000);
                          }}
                        > {t("RelatedCompanies")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 10 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(10);
                            }, 1000);
                          }}
                        > {t("ClientsInfo")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 11 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(11);
                            }, 1000);
                          }}
                        > {t("ProvidersInfo")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 12 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(12);
                            }, 1000);
                          }}
                        > {t("MainCompetitorsintheMarket")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 13 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(13);
                            }, 1000);
                          }}
                        > {t("Projections")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 14 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(14);
                            }, 1000);
                          }}
                        > {t("CurrentBankingRelations")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 15 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(15);
                            }, 1000);
                          }}
                        > {t("AccountMovements")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 16 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(16);
                            }, 1000);
                          }}
                        > {t("Reciprocity")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 17 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(17);
                            }, 1000);
                          }}
                        > {t("FixedAssetsFacilities")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 18 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(18);
                            }, 1000);
                          }}
                        > {t("EnvironmentalAspects")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 19 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(19);
                            }, 1000);
                          }}
                        > {t("GuarantorInformation")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 20 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(20);
                            }, 1000);
                          }}
                        > {t("CurrentCompanyInsurance")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 21 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(21);
                            }, 1000);
                          }}
                        > {t("EnterpriseArchitecture")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 22 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(22);
                            }, 1000);
                          }}
                        > {t("AccountsReceivable")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 23 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(23);
                            }, 1000);
                          }}
                        > {t("Capex")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 24 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(24);
                            }, 1000);
                          }}
                        > {t("CashFlow")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 25 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(25);
                            }, 1000);
                          }}
                        > {t("BusinessObtain")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 26 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(26);
                            }, 1000);
                          }}
                        > {t("Matriz Competitiva")}
                        </NavLink>

                        <NavLink
                          className={classnames({ active: activeTab === 27 })}
                          onClick={() => {
                            saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                              saveDataTabs(true, activeTab);
                              toggleTab(27);
                            }, 1000);
                          }}
                        > {t("RecomendationsAndOthers")}
                        </NavLink>

                      </Nav>
                    </Col>
                    <Col md={9}>
                      <TabContent activeTab={activeTab} className="body">
                        <TabPane tabId={1}>
                          <DatosGenerales activeTab={activeTab} datosGenerales={selectedData.datosGenerales} ref={datosGeneralesRef} onSubmit={submitData} onOpenClientSelection={() => { toogleShowClient() }} selectedClient={selectedClient} />
                        </TabPane>
                        <TabPane tabId={2}>
                          {activeTab == 2 ?
                            <GeneralesEmpresa activeTab={activeTab} ValidacionGeneralesEmpresa={ValidacionGeneralesEmpresa} datosEmpresa={selectedData.datosEmpresa} ref={generalesEmpresaRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={3}>
                          {activeTab == 3 ?
                            <HistoriaEmpresa activeTab={activeTab} locationData={locationData} historiaEmpresa={selectedData.historiaEmpresa} ref={historiaEmpresaRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={4}>
                          {activeTab == 4 ?
                            <InformacionAccionista activeTab={activeTab} jsonAccionistas={selectedData.dataAccionistas} ref={informacionAccionistaRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={5}>
                          {activeTab == 5 ?
                            <EstructuraOrganizacionalEmpresa activeTab={activeTab} locationData={locationData} dataEstructuraOrganizacional={selectedData.dataEstructuraOrganizacional} ref={estructuraOrganizacionalEmpresaRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={6}>
                          {activeTab == 6 ?
                            <GobiernoCorporativo activeTab={activeTab} ref={gobiernoCorporativoRef} jsonCorporativo={selectedData.dataGobiernoCorporativo} dataGobiernoCorporativoInformation={selectedData.dataGobiernoCorporativoInformation} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={7}>
                          {activeTab == 7 ?
                            <RelevoGeneracional activeTab={activeTab} dataRelevoGenrencial={selectedData.dataRelevoGenrencial} ref={relevoGeneracionalRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={8}>
                          {activeTab == 8 ?
                            <FlujoOperativo activeTab={activeTab} locationData={locationData} dataFlujoOperativo={selectedData.dataFlujoOperativo} ref={flujoOperativoRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={9}>
                          {activeTab == 9 ?
                            <EmpresasRelacionadas activeTab={activeTab} dataEmpresaRelacionada={selectedData.dataEmpresaRelacionada} ref={empresaRelacionadaRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={10}>
                          {activeTab == 10 ?
                            <InformacionClientes activeTab={activeTab} dataInformacionClientes={selectedData.dataInformacionClientes} ref={informacionClientesRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={11}>
                          {activeTab == 11 ?
                            <InformacionProveedores activeTab={activeTab} dataInformacionProveedores={selectedData.dataInformacionProveedores} ref={InformacionProveedoresRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={12}>
                          {activeTab == 12 ?
                            <PrincipalesCompetidores activeTab={activeTab} dataPrincipalesCompetidores={selectedData.dataPrincipalesCompetidores} ref={PrincipalesCompetidoresRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={13}>
                          {activeTab == 13 ?
                            <Proyecciones activeTab={activeTab} setUseState={setUseState} locationData={locationData} dataProyecciones={selectedData.dataProyecciones} ref={ProyeccionesRef} setProyeccionesState={setProyeccionesState} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={14}>
                          {activeTab == 14 ?
                            <RelacionesBancarias activeTab={activeTab} dataRelacionesBancarias={selectedData.dataRelacionesBancarias} ref={RelacionesBancariasRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={15}>
                          {activeTab == 15 ?
                            <MoviemientosCuentas activeTab={activeTab} dataMoviemientosCuentas={selectedData.dataMoviemientosCuentas} ref={MoviemientosCuentasRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={16}>
                          {activeTab == 16 ?
                            <Reciprocidad activeTab={activeTab} dataReciprocidad={selectedData.dataReciprocidad} ref={ReciprocidadRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={17}>
                          {activeTab == 17 ?
                            <FacilidadActivosFijos activeTab={activeTab} locationData={locationData} dataFacilidadActivosFijos={selectedData.dataFacilidadActivosFijos} ref={FacilidadActivosFijosRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={18}>
                          {activeTab == 18 ?
                            <AspectosAmbientales IGR={true} activeTab={activeTab} datosGenerales={selectedData.datosGenerales} locationData={locationData} dataAspectosAmbientales={selectedData.dataAspectosAmbientales} ref={AspectosAmbientalesRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={19}>
                          {activeTab == 19 ?
                            <InformacionGarante activeTab={activeTab} dataInformacionGarante={selectedData.dataInformacionGarante} ref={InformacionGaranteRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={20}>
                          {activeTab == 20 ?
                            <SegurosActualesEmpresa activeTab={activeTab} dataSegurosActualesEmpresa={selectedData.dataSegurosActualesEmpresa} ref={SegurosActualesEmpresaRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={21}>
                          {activeTab == 21 ?
                            <ArquitecturaEmpresarial activeTab={activeTab} locationData={locationData} dataArquitecturaEmpresarial={selectedData.dataArquitecturaEmpresarial} ref={ArquitecturaEmpresarialRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={22}>
                          {activeTab == 22 ?
                            <CuentasCobrar activeTab={activeTab} locationData={locationData} dataCuentasCobrar={selectedData.dataCuentasCobrar} ref={CuentasCobrarRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={23}>
                          {activeTab == 23 ?
                            <Capex activeTab={activeTab} locationData={locationData} dataCapex={selectedData.dataCapex} ref={CapexRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={24}>
                          {activeTab == 24 ?
                            <FlujoCaja activeTab={activeTab} locationData={locationData} dataFlujoCaja={selectedData.dataFlujoCaja} ref={FlujoCajaRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={25}>
                          {activeTab == 25 ?
                            <NegociosObtener activeTab={activeTab} dataNegociosObtener={selectedData.dataNegociosObtener} ref={NegociosObtenerRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={26}>
                          {activeTab == 26 ?
                            <MatrizCompetitiva activeTab={activeTab} dataMatrizCompetitiva={selectedData.dataMatrizCompetitiva} ref={MatrizCompetitivaRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                        <TabPane tabId={27}>
                          {activeTab == 27 ?
                            <RecomendacionesOtros activeTab={activeTab} dataRecomendacionesOtros={selectedData.dataRecomendacionesOtros} ref={RecomendacionesOtrosRef} onSubmit={submitData} />
                            : null}
                        </TabPane>
                      </TabContent>
                      <Row>
                        <Col md={12} style={{ textAlign: "right", marginTop: "10px" }}>

                          {/* <Button color="info" type="button" style={{ margin: '5px' }} onClick={() => {
                            saveDataTabs(true, activeTab, true, true); setTimeout(() => {
                              saveDataTabs(true, activeTab, true);
                              setTimeout(() => {
                                toogleModalPreview();
                              }, 1000);
                            }, 1000);

                          }}><i className="mdi mdi-eye mdi-12px"></i> {t("Preview")}</Button> */}
                          <Link
                            style={{ margin: '5px', border: "1px" }}
                            className="btn"
                            color="info"
                            type="button"
                            onClick={() => {
                              saveDataTabs(true, activeTab, true, true); setTimeout(() => {
                                saveDataTabs(true, activeTab, true);
                              }, 1000);

                            }}
                            to={{
                              pathname: '/creditocomercial/previsualizarIGR/' + btoa(locationData?.transactionId),
                            }}
                            target="_blank"
                          ><i className="mdi mdi-eye mdi-12px"></i>{ }{t("Preview")}</Link>

                          {activeTab > 1 && (
                            <Button color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                              saveDataTabs(true, activeTab, true, true); setTimeout(() => {
                                saveDataTabs(true, activeTab, true);
                                toggleTab(activeTab - 1);
                              }, 1000);
                            }}><i className="mdi mdi-arrow-left-bold mid-12px"></i> {t("Previous")}</Button>
                          )
                          }

                          {activeTab < 27 && (
                            <Button color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                              saveDataTabs(true, activeTab, true, true); setTimeout(() => {
                                saveDataTabs(true, activeTab, true);
                                toggleTab(activeTab + 1);
                              }, 1000);
                            }}>{t("Next")} <i className="mdi mdi-arrow-right-bold mid-12px"></i></Button>
                          )
                          }
                        </Col>
                      </Row>

                    </Col>
                  </Row>
                </div>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
            {locationData ?
              <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_03)} />
              : null}
            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={3} style={{ textAlign: "left" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { console.log("saveDataTabs", activeTab); setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
              </Col>
              <Col md={9} style={{ textAlign: "right" }}>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => {
                  //console.log("saveDataTabs", activeTab);
                  // onSaveProcess(OPTs.PROCESS_INFORMEGESTION);
                  saveDataTabs(true, activeTab, true, true); setTimeout(() => {
                    saveDataTabs(true, activeTab);
                    setTimeout(() => {
                      onSaveProcess(OPTs.PROCESS_INFORMEGESTION)
                    }, 1000);
                  }, 1000);
                }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                <Button color="success" type="button"
                  onClick={() => {
                    saveDataTabs(true, activeTab, false, true); setTimeout(() => {
                      saveDataTabs(true, activeTab);
                      setTimeout(() => {
                        checkToContinueAndSave(OPTs.PROCESS_PROPUESTACREDITO)
                      }, 1000);
                    }, 1000);
                  }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Credit Proposal")}</Button>
              </Col>
            </Row>
          </LoadingOverlay>
          {locationData && displayModalBitacora ?
            <ModalBitacora logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_03)}
              successSaved={() => { onSaveProcess(optionSelected); }}
              isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
            : null}
          <ModalCloseOptions onSaveProcess={onSaveProcess} isOpen={displayModalCloseOptions} toggle={() => { toggleModalCloseOptions() }} />
          {/* <ModalPrevicualizarIGR dataIGR={selectedData} isOpen={ModalPreviewData} toggle={() => { toogleModalPreview() }} /> */}
          {
            error_dlg ? (
              <SweetAlert
                error
                title={t("ErrorDialog")}
                confirmButtonText={t("Confirm")}
                cancelButtonText={t("Cancel")}
                onConfirm={() => {
                  seterror_dlg(false);
                }}
              >
                {error_msg}
              </SweetAlert>
            ) : null
          }
        </div >
        : null}
    </React.Fragment >
  )
}
export default FormularioIgr;