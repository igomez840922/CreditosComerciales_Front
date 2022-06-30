import React, { useEffect, useState } from "react"
import { translationHelpers } from "../../../helpers"
import { Link } from "react-router-dom"
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../../helpers/url_helper"
import * as OPTs from "../../../helpers/options_helper";

import {
  Row,
  Col,
  Button,
  Nav,
  NavLink,
  Card,
  CardBody, CardFooter, CardHeader,
} from "reactstrap"

import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { FinancialSummary } from "../../../components/PropuestaCreditoComercial"
import {
  Background, Capex, CreditProposal, CreditPolicyReview,
  ExchangeRisk, FinancialInformation, FormCreditRisk,
  Projections, Workload, FormRecommendations, DocumentFooter
} from "../../../components/InformeFinanciero"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"

import { Tabs, Tab } from 'react-bootstrap';
import { getDateMeta } from "@fullcalendar/react"
import classnames from "classnames"
import FinancialReportComp from "./FinancialReportComp";
import LoadingOverlay from "react-loading-overlay"
import Guarantees from "../../../components/InformeFinanciero/background/Guarantees"
import DebtSL from "../../../components/PropuestaCreditoComercial/financialSummary/DebtSL"
import History from "../../../components/PropuestaCreditoComercial/financialSummary/History"
import CapexIF from "../../../components/InformeFinanciero/CapexIF"
import SweetAlert from "react-bootstrap-sweetalert"

import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';

import { useTranslation } from "react-i18next"

// Services
import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import ModalPrevicualizarAIF from "../../../pages/CommercialCredit/6_AnalisisCredito/previsualizarAIF";
import FinancialReportContent from "./FinancialReportContent"

import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";
import ModalEndProcess from "../../../components/EndProcess/ModalEndProcess"

import CheckListComponent from '../../../components/Common/CheckList';
import { AttachmentFileInputModel } from "../../../models/Common/AttachmentFileInputModel"

import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";
import { saveLogProcess } from "../../../helpers/logs_helper";

import ModalBitacora from "../../../components/Common/ModalBitacora";
import ModalRiesgoCredito from "./ModalRiesgoCredito"
import LevelAutonomy from "../5_PropuestaCredito/Secciones/LevelAutonomy"
import { LevelAutonomyClass } from "../5_PropuestaCredito/Secciones/LevelAutonomy.model"

const FinancialReportPage = (props) => {

  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);
  const [optionSelected, setoptionSelected] = useState(null);

  const [t, c, tr] = translationHelpers('translation', 'common', 'translation');
  const propostarData = {
    products: [
      {
        id: 1,
        product: 'Línea de Crédito Rotativa',
        debtor: { name: 'Inversion Yarlys SA' },
        rate: 7.0,
        safi: '5-6: Riesgo Standard',
        currentApprovedRisk: 0,
        usedBalance: 0,
        proposedRisk: 126.0
      },
      {
        id: 2,
        product: 'Línea de Crédito Rotativa',
        debtor: { name: 'Inversion Yarlys SA' },
        rate: 7.0,
        safi: '5-6: Riesgo Standard',
        currentApprovedRisk: 0,
        usedBalance: 0,
        proposedRisk: 126.0
      }
    ]
  }
  const sumaryData = {
    client: {
      name: 'Nombre Deudor'
    },
    financialStatus: {
      headers: ['Auditados Dic-18', 'Auditados Dic-19', 'Auditados Dic-20', 'Proyecciones Dic-21'],
      items: [
        {
          label: 'Clasificación SAFI',
          data: ['-', '-', '5:6 Riesgo', '-']
        },
        {
          label: 'Crecimiento',
          data: ['-', '-3.4%', '-12.5%', '0.0%']
        },
        {
          label: 'Costo de Ventas',
          data: ['(1550)66.2%', '(1510)66.8%', '(1360)68.8%', '(1360)68.8%']
        },
        {
          label: 'Beneficio Mutuo en Operaciones',
          data: ['(790)66.2%', '(751)66.8%', '(618)68.8%', '(618)68.8%']
        },
        {
          label: 'Margen Bruto',
          data: ['', '', '', '']
        }
      ]
    },
    balances: {
      active: {
        title: t('Active Balance'),
        headers: [t('Period Date'), '', '', ''],
        items: [
          [t('Months'), '', '', ''],
          [t('Auditor'), '', '', ''],
          [t('Balance Type'), '', '', ''],
          [t('Figures Types'), '', '', ''],
          [t('Coins Types'), '', '', ''],
          [t('Exchange Rates'), '', '', '']
        ]
      },
      passive: {
        title: t('Passive Balance and Capital'),
        headers: [t('Period Date'), '', '', ''],
        items: [
          [t('Months'), '', '', ''],
          [t('Auditor'), '', '', ''],
          [t('Balance Type'), '', '', ''],
          [t('Figures Types'), '', '', ''],
          [t('Coins Types'), '', '', ''],
          [t('Exchange Rates'), '', '', '']
        ]
      },
      application: {
        title: t('Origin and Application Status'),
        headers: [t('Period Date'), '', '', ''],
        items: [
          [t('Months'), '', '', ''],
          [t('Auditor'), '', '', ''],
          [t('Balance Type'), '', '', ''],
          [t('Figures Types'), '', '', ''],
          [t('Coins Types'), '', '', ''],
          [t('Exchange Rates'), '', '', '']
        ]
      },
      indicators: {
        title: t('Indicators'),
        headers: [t('Period Date'), '', '', ''],
        items: [
          [t('Months'), '', '', ''],
          [t('Auditor'), '', '', ''],
          [t('Balance Type'), '', '', ''],
          [t('Figures Types'), '', '', ''],
          [t('Coins Types'), '', '', ''],
          [t('Exchange Rates'), '', '', '']
        ]
      }
    },
    debts: {
      short: {
        items: [
          {
            bank: 'Capital Bank',
            purpose: 'Linea de Crédito',
            approvedAmount: 200,
            balanceLastYear: 200,
            balanceLast6Months: 154,
            balanceForecast: 200,
            rate: 7.0,
            surety: 'Fianza'
          },
          {
            bank: 'St Georges',
            purpose: 'Linea de Crédito',
            approvedAmount: 320,
            balanceLastYear: 200,
            balanceLast6Months: 436,
            balanceForecast: 450,
            rate: 7.5,
            surety: 'Fianza'
          },
          {
            bank: 'St Georges',
            purpose: 'TDC',
            approvedAmount: 11,
            balanceLastYear: 11,
            balanceLast6Months: 0,
            balanceForecast: 11,
            rate: null,
            surety: ''
          }
        ]
      },
      long: {
        items: [
          {
            bank: 'Banesco',
            purpose: 'Préstamo',
            approvedAmount: 126,
            balanceLastYear: 0,
            balanceLast6Months: 0,
            balanceForecast: 126,
            rate: 6.5,
            surety: 'Bien Inmueble'
          }
        ]
      }
    },
    history: {
      headers: [
        t('# days', { days: 30 }),
        t('# days', { days: 60 }),
        t('# days', { days: 90 }),
        t('# days', { days: 120 }),
        t('# days', { days: 150 }),
        t('# days', { days: 180 }),
        t('# days', { days: 210 }),
        t('# days', { days: 240 }),
        t('# days', { days: 270 }),
        t('# days', { days: 300 }),
        t('# days', { days: 330 }),
        t('+# days', { days: 331 }),
        t('Totals')
      ],
      data: [
        {
          name: 'Banesco',
          data: [100, 80, 80, 80, 100, 80, 80, 80, 100, 80, 80, 200, 0]
        },
        {
          name: 'Banesco',
          data: [100, 80, 80, 80, 100, 80, 80, 80, 100, 80, 80, 200, 0]
        }
      ]
    }
  }
  const capexData = {
    sources: [
      { id: 10010, description: 'Presupuesto 1', usage: 0.4, shareholders: 0, bank: 0 },
      { id: 10020, description: 'Presupuesto 2', usage: 0.8, shareholders: 0, bank: 0 },
      { id: 10030, description: 'Presupuesto 3', usage: 1.2, shareholders: 0, bank: 0 },
      { id: 10040, description: 'Presupuesto 4', usage: 1.1, shareholders: 0, bank: 0 },
    ],
    budgets: [
      { id: 10010, description: 'Costo Directo de Construcción', value: 100_000 },
      { id: 10020, description: 'Costo Directo de Infraestructura', value: 120_000 },
    ],
    projects: [
      { id: 10010, description: 'Area de construcción total m2', value: 1000 },
      { id: 10020, description: 'Area de construcción infraestructura total m2', value: 1000 },
    ],
    attachments: []
  }
  const backgroundData = {
    items: {
      headers: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'],
      data: [{
        id: 10010,
        description: 'Monto Aprobado Corto Plazo',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10020,
        description: 'Desembolsos Corto Plazo (Utilizaciones)',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10030,
        description: 'Desembolsos Largo Plazo',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10040,
        description: 'Consumo',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10050,
        description: 'TOTAL Desembolsos',
        values: [200, 200, 0, 0, 0, 0, 0, 0, 2000, 4000]
      }, {
        id: 10060,
        description: 'Pagos Capital Corto Plazo',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10070,
        description: 'Pagos Intereses Corto Plazo',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10080,
        description: 'Amortización Capital Largo Plazo',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10090,
        description: 'Amortización Intereses Largo Plazo',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10100,
        description: 'Consumo (Capital + Intereses)',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10110,
        description: 'TOTAL Pagos a Capital',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10120,
        description: 'TOTAL Pago a Intereses',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10130,
        description: 'Saldos LP + CP (al cierre)',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10140,
        description: 'Saldos Corto Plazo (al cierre)',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10150,
        description: 'Saldos Largo Plazo (al cierre)',
        values: [100, 100, 0, 0, 0, 0, 0, 0, 1000, 2000]
      }, {
        id: 10160,
        description: 'Refinanciamientos (#)',
        values: [1, 1, 0, 0, 0, 0, 0, 0, 1, 2]
      }, {
        id: 10170,
        description: 'Reestructuraciones (#)',
        values: [1, 1, 0, 0, 0, 0, 0, 0, 1, 2]
      }, {
        id: 10180,
        description: 'Clasificación de Riesgos',
        values: ['', '', '', '', '', '', '', '', '', '']
      }]
    },
    facilities: [
      {
        id: 22151,
        debtor: { id: 15050, name: 'Arturo Vidal' },
        facility: { id: 1090, name: 'Facilidad' },
        amount: 12_000,
        balance: 10_000,
        quota: 0,
        capital: 0,
        status: '',
        classification: '',
        interests: 2.5,
        charges: 0,
        refi1: '',
        refi2: '',
        currentStatus: '',
        comments: ''
      }
    ],
    restructuring: {
      headers: ['jun-16', 'nov-18', 'jun-20 (actual)'],
      data: [
        {
          description: 'Concepto',
          values: ['Reestructuración', '', '']
        },
        {
          description: 'Monto (Miles $US)',
          values: [5.142, '', '']
        },
        {
          description: 'Tasa',
          values: ['5%', '', '']
        },
        {
          description: 'Vencimiento',
          values: ['5 años', '', '']
        },
        {
          description: 'Solicitud',
          values: ['Reestructuración', '', '']
        },
        {
          description: 'Plan de Pagos',
          values: ['Primeros 2 años: $25,750 (Capital e Intereses), 3er año: $30,000 (Capital e Intereses), 4to año: $35,000 (Capital e intereses)', '', '']
        }
      ]

    },
    guarantees: {
      headers: ['jun-16', 'nov-18', 'jun-20 (actual)'],
      data: [
        {
          description: 'Empresa Avaluadora',
          values: ['AIR Avaluos', '', '']
        },
        {
          description: 'Valor de Venta Rápida (Miles $US)',
          values: [5.400, '', '']
        },
        {
          description: 'LTV',
          values: ['95%', '', '']
        }
      ]
    }
  }
  const documetsData = {
    date: '25-ago-2021',
    code: '###',
    owner: { id: 1010, name: 'Carolina Delgado' }
  }
  const history = useHistory();
  const location = useLocation();

  const [proposal, setProposal] = useState(propostarData);
  const [policies, setPolicies] = useState([]);
  const [financialSummary, setFinancialSummary] = useState(sumaryData);
  //const [financialInformation, setFinancialInformation] = useState(null);
  const [capex, setCapex] = useState(capexData);
  const [background, setBackground] = useState(backgroundData);
  const [document, setDocument] = useState(documetsData);
  const [Opinion, setOpinion] = useState(null);
  const [Recomendation, setRecomendation] = useState(null);
  const [deudor, setDeudor] = useState(null);
  const [debtorId, setDebtorId] = useState(null);
  const [DataDeudor, setDataDeudor] = useState(0);
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_dlg_risk_opiion, setError_dlg_risk_opiion] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [mainDebtor, setmainDebtor] = useState(null);
  const [preview, setpreview] = useState(null);
  const [openModalRiesgo, setopenModalRiesgo] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);

  const [locationData, setLocationData] = useState(null);
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });

  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());

  const [validationForm, setvalidationForm] = useState(false);

  //On Mounting (componentDidMount)
  useEffect(() => {
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
      } else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        fetchData(location.data);
      }
    } else {
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
      }).catch(err => { })
    loadUserProspect(locationData.transactionId)
    fetchFinancialReport(locationData);
  }

  function loadUserProspect(transactionId) {
    // consultarDeudorPrincipal
    backendServices.consultPrincipalDebtor(transactionId)
      .then((data) => {
        if (data !== undefined) {
          setmainDebtor(data);
        }
      }).catch(err => { });
  }

  async function fetchFinancialReport(locationData) {
    Promise.allSettled([
      LoadOpinion(locationData),
      LoadRecomendacion(locationData),
    ]).then((resp) => {
      setIsActiveLoading(false);
    }).catch(err => {
      setIsActiveLoading(false);
    });
  }

  async function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    let newOpinion = { transactId: locationData.transactionId, opinion: values.opinion };
    let newRecommendations = {
      transactId: locationData.transactionId,
      debtorId: debtorId,
      strengths: values.strengths,
      weakness: values.weakness,
      conclusion: values.conclusion
    }

    let errOpi = false;

    if (Opinion != undefined && Opinion != null) {
      await backendServices.actualizarDetalleOpinionRiesgoCredito(newOpinion).then(resp => {
        if (resp.statusCode == "500") {
          setconfirm_alert(false)
          seterror_dlg(false)
          errOpi = true;
        } else {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
        }
      }).catch(error => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    } else {
      await backendServices.nuevoDetalleOpinionRiesgoCredito(newOpinion).then(resp => {
        if (resp.statusCode == "500") {
          setconfirm_alert(false)
          seterror_dlg(false)
          errOpi = true;
        } else {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
        }
      }).catch(error => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    let errConc = false;
    if (Recomendation !== undefined && Recomendation != null) {
      await backendServices.actualizarConclusionesRecomendacionesAnalisisFinanciero(newRecommendations).then(resp => {
        if (resp.statusCode == "500") {
          setconfirm_alert(false)
          seterror_dlg(false)
          errConc = true;
        } else {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
        }
      }).catch(error => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    } else {
      await backendServices.nuevoConclusionesRecomendacionesAnalisisFinanciero(newRecommendations).then(resp => {
        if (resp.statusCode == "500") {
          setconfirm_alert(false)
          seterror_dlg(false)
          errConc = true;
        } else {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
        }
      }).catch(error => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }

    //props.onSubmit(values);
    (!errOpi && !errConc) && history.push(url.URL_DASHBOARD);

  }

  function LoadOpinion(locationData) {
    return new Promise(function (resolve, reject) {
      backendServices.consultarDetalleOpinionRiesgoCredito(locationData.transactionId).then(resp => {
        let data = resp[0];
        (data != null || data != undefined) && setOpinion(data);
        resolve();
      }).catch(err => {
        resolve();
      });
    })
  }

  function LoadRecomendacion(locationData) {
    return new Promise(function (resolve, reject) {
      backendServices.consultarConclusionesRecomendacionesAnalisisFinanciero(locationData.transactionId).then(resp => {
        let data = resp[0];
        (data != null || data != undefined) && setRecomendation(data);
        resolve();
      }).catch(err => {
        resolve();
      });
    })
  }



  function toggleModal() {
    setDisplayModal(!displayModal);
  }

  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
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
      case OPTs.PROCESS_ANALISISCREDITO:
      case OPTs.PROCESS_CANCELPROCESS: {
        break;
      }
      default:
        break;
    }
    saveJBPMProcess(option);
  }
  async function saveJBPMProcess(option, data = null) {
    console.log(data);
    // return
    var maindebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId)
    var infoBpmModel = new InfoBpmModel(
      locationData.infoBpmModel?.instanceId ?? locationData.instanceId,
      locationData.infoBpmModel?.transactId ?? locationData.transactionId,
      0, 0,
      maindebtor?.personId, data == null ? 0 : data.value
    );
    infoBpmModel.priority = data == null ? 0 : data.value
    infoBpmModel.personName = maindebtor !== undefined ? (maindebtor.typePerson == "2" ? maindebtor.name : (maindebtor.name + " " + maindebtor.name2 + " " + maindebtor.lastName + " " + maindebtor.lastName2)) : "";
    console.log(infoBpmModel);
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
          }).catch(err => { });
        break;
      }
      case OPTs.PROCESS_INFORMEFINANCIERO: {
        infoBpmModel.processId = OPTs.PROCESS_INFORMEFINANCIERO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_INFORMEFINANCIERO.toString(),
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
          }).catch(err => { });
        break;
      }
      case OPTs.PROCESS_SUPERVISORANALISISCREDITO: {
        infoBpmModel.processId = OPTs.PROCESS_SUPERVISORANALISISCREDITO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var statusCredito = locationData.statuscredito !== undefined && locationData.statuscredito !== null && locationData.statuscredito === "activo" ? true : false;
        var values = null;
        if (locationData["creditrisk"] !== undefined && locationData["creditrisk"] === true && statusCredito === false) {
          infoBpmModel["creditrisk"] = true;
          values = {
            "info": JSON.stringify(infoBpmModel),
            "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
            "activityId": OPTs.ACT_NONE.toString(),
            "transactionId": locationData.transactionId,
            "requestId": locationData.requestId,
            "decision": "supervisor",
            "dcreditoparalelo": "conparalelo",
            "statuscredito": "activo", //el paralelo de Credito esta activo
          };
        }
        else {
          values = {
            "info": JSON.stringify(infoBpmModel),
            "processId": OPTs.PROCESS_SUPERVISORANALISISCREDITO.toString(),
            "activityId": OPTs.ACT_NONE.toString(),
            "transactionId": locationData.transactionId,
            "requestId": locationData.requestId,
            "decision": "supervisor",
            //"dcreditoparalelo": "sinparalelo",
            "statuscredito": "completo", //el paralelo de Credito esta activo
          };
        }
        bpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              saveAutoLog();
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              seterror_msg(t("ErrorSaveMessage"));
              seterror_dlg(false);
            }
          });
        break;
      }
      case OPTs.PROCESS_INFORMEGESTION: { //requiere ajustes
        infoBpmModel.processId = OPTs.PROCESS_INFORMEGESTION;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_INFORMEGESTION.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          "decision": "ajuste",          //requiere ajustes
          "ajuste": "ejecutivo",
          //"dcreditoparalelo": "sinparalelo",
          //"statuscredito": "completo", //el paralelo de Credito esta activo
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
      case OPTs.PROCESS_ANALISISCREDITO: {
        infoBpmModel.processId = OPTs.PROCESS_ANALISISCREDITO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

        var values = {
          "info": JSON.stringify(infoBpmModel),
          "processId": OPTs.PROCESS_ANALISISCREDITO.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": locationData.transactionId,
          "requestId": locationData.requestId,
          //"decision":"no"          
        };
        bpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            if (data !== undefined) {
              history.push({
                pathname: url.URL_CREDITANALISYS,
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

  function changeDebtor(debtorId) {
    setDebtorId(debtorId)
  }

  function askRiskOpinion(data) {
    setopenModalRiesgo(false)
    locationData["creditrisk"] = true;
    setLocationData(locationData);
    saveJBPMProcess(OPTs.PROCESS_SUPERVISORANALISISCREDITO, data)
  }
  function abrirModalRiesgoCheck() {
    setopenModalRiesgo(true);
  }

  async function saveAutoLog(APPLICATION_STATUS = null, observations = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_INFORMEFINANCIERO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_04)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = observations !== null ? t("ActivityHasBeenFinishedSuccessfully") : observations;
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }

  async function advanceWithoutRiskOpinion() {
    setIsActiveLoading(true)
    let autonomyValidation = { 'Junta Directiva': true, 'Comité de Crédito': true, '03': true }
    let levelAutonomyClass = new LevelAutonomyClass();
    let autonomies = await levelAutonomyClass.getLevelAutonomy();
    let riskOpinion = autonomyValidation[autonomies.credit];

    if (!riskOpinion) {
      let debtorPrincipal = await backendServices.consultPrincipalDebtor(locationData.transactionId)
      let reportingServices = await coreServices.getReportingServices(debtorPrincipal.customerNumberT24)
      riskOpinion = reportingServices?.records?.some(reporting => autonomyValidation[reporting.CATEGORIA_CAMBIO])
    }

    setIsActiveLoading(false)
    setError_dlg_risk_opiion(riskOpinion);
    !riskOpinion && onSaveProcess(OPTs.PROCESS_SUPERVISORANALISISCREDITO);
  }

  return (

    <React.Fragment>
      {locationData ?
        <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
          <div className="page-content">

            <Breadcrumbs title={t("Credit Analysis")} breadcrumbItem={t("Financial Report")} />

            <HorizontalSteeper processNumber={1} activeStep={2}></HorizontalSteeper>

            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={4} style={{ textAlign: "left" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
                <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>
              </Col>
              <Col md={8} style={{ textAlign: "right" }}>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_INFORMEFINANCIERO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>

                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_ANALISISCREDITO) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("CreditAnalysis")}</Button>

                <Button color="success" type="button" style={{ margin: '5px' }}
                  onClick={() => { abrirModalRiesgoCheck() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("AskRiskOpinionAndAdvance")}</Button>

                <Button color="success" type="button"
                  onClick={() => { advanceWithoutRiskOpinion() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("AdvanceWithoutRiskOpinion")}</Button>
              </Col>
            </Row>

            <Card>
              <CardHeader>
                <Row>
                  <Col md={6}>
                    <h4 className="card-title">{t("Financial Report")}</h4>
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
                  <Col md={12} className="d-flex flex-column flex-sm-row justify-content-between">
                    <LevelAutonomy />
                  </Col>
                </Row>
              </CardHeader>

              <CardBody style={{ marginTop: '-1px' }}>
                <FinancialReportContent changeDebtor={changeDebtor} hasChangeCategory={() => { locationData["creditrisk"] = true; }} />

                <AvForm className="needs-validation" onSubmit={handleSubmit}>

                  <Col className="mt-4">
                    <FormCreditRisk Opinion={Opinion?.opinion} hasChangeCategory={() => { locationData["creditrisk"] = true; }} />
                  </Col>

                  {/* <Col className="mt-4">
                    <FormRecommendations strengths={Recomendation?.strengths} weakness={Recomendation?.weakness} conclusion={Recomendation?.conclusion} />
                  </Col> */}

                  <Row>
                    <Col md={12} style={{ textAlign: "right", marginTop: "10px" }}>

                      {/* <Button onClick={() => {
                        toggleModal();

                      }} color="info" type="button" style={{ margin: '5px' }}><i className="mdi mdi-eye mdi-12px"></i> {t("Preview")}</Button> */}

                      <Link
                        style={{ margin: '5px', border: "1px" }}
                        className="btn"
                        color="info"
                        type="button"
                        to={{
                          pathname: '/creditocomercial/previsualizarAIF/' + btoa(locationData?.transactionId),
                        }}
                        target="_blank"
                      ><i className="mdi mdi-eye mdi-12px"></i>{ }{t("Preview")}</Link>
                      <Button id="btnSave" color="success" type="submit" style={{ margin: '5px' }}>{t("Save")}</Button>
                    </Col>
                  </Row>
                </AvForm>
              </CardBody>

              <CardBody>
                {locationData ?
                  <CheckListComponent attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.CHECKLIST_PROCESS_ANLISIS, OPTs.ACT_NONE)} />
                  : null}
              </CardBody>


              <CardFooter>
              </CardFooter>
            </Card>

            {locationData ?
              <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_INFORMEFINANCIERO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_04)} />
              : null}
            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={4} style={{ textAlign: "left" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { showModalEndProcess() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
                <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>
              </Col>
              <Col md={8} style={{ textAlign: "right" }}>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_INFORMEFINANCIERO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>

                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_ANALISISCREDITO) }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("CreditAnalysis")}</Button>

                <Button color="success" type="button" style={{ margin: '5px' }}
                  onClick={() => { abrirModalRiesgoCheck() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("AskRiskOpinionAndAdvance")}</Button>

                <Button color="success" type="button"
                  onClick={() => { advanceWithoutRiskOpinion() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("AdvanceWithoutRiskOpinion")}</Button>
              </Col>
            </Row>

            <ModalEndProcess onSaveEndProcess={onSaveEndProcess} isOpen={displayModalEndProcess} toggle={() => { showModalEndProcess(false) }} />
            <ModalRiesgoCredito askRiskOpinion={askRiskOpinion} titulo={"Asignación de prioridad"} isOpen={openModalRiesgo} toggle={() => { setopenModalRiesgo(false) }} />

            {locationData && displayModalBitacora ?
              <ModalBitacora
                logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_INFORMEFINANCIERO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_04)}
                successSaved={() => { onSaveProcess(optionSelected); }}
                isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
              : null}

          </div>
          {/* {displayModal && <ModalPrevicualizarAIF
            isOpen={displayModal}
            toggle={toggleModal}
            preview={preview}
          />} */}
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

          {error_dlg_risk_opiion ? (
            <SweetAlert
              error
              title={t("ErrorDialog")}
              confirmButtonText={t("Confirm")}
              cancelButtonText={t("Cancel")}
              onConfirm={() => {
                setError_dlg_risk_opiion(false)
              }}
            >
              {t("This procedure needs risk opinion to advance")}
            </SweetAlert>
          ) : null}
        </LoadingOverlay >
        : null}

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
};

export default FinancialReportPage;
