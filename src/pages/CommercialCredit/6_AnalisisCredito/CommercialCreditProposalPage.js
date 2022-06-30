import React, { useEffect, useState } from "react"
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../../helpers/url_helper"
import { useTranslation, withTranslation } from "react-i18next"

import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Label,
  Table,
} from "reactstrap"
import { Link } from "react-router-dom"

// UI Components
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import {
  FacilityListBpm, FacilityListCore, ChangeSummaryReadOnly, CorporateExposure, CorporateExposureClient,
  FacilityList, FinancialSummary,
  GeneralSection
} from "../../../components/PropuestaCreditoComercial"


import SweetAlert from "react-bootstrap-sweetalert"
import AttachmentFileCore from "../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../models/Common/AttachmentFileInputModel';
import HeaderSections from "../../../components/Common/HeaderSections";
import ModalEndProcess from "../../../components/EndProcess/ModalEndProcess"

// Services
import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import LoadingOverlay from "react-loading-overlay"
import { translationHelpers, formatCurrency } from '../../../helpers';
import { success } from "toastr"

import { InfoBpmModel } from '../../../models/Common/InfoBpmModel';

import { LogProcessModel } from '../../../models/Common/LogProcessModel';
import LogProcess from "../../../components/LogProcess/index";
import FacilityHistory from "../../../components/Common/FacilityHistory"

import ModalBitacora from "../../../components/Common/ModalBitacora";

import { saveLogProcess } from "../../../helpers/logs_helper";

import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";
import ExposicionCorportativa from "../5_PropuestaCredito/Secciones/ExposicionCorporativa"
import ExposicionCorporativaClientes from "../5_PropuestaCredito/Secciones/ExposicionCorporativaCliente"
import LevelAutonomy from "../5_PropuestaCredito/Secciones/LevelAutonomy"
import { uniq_key } from "../../../helpers/unq_key"

const CommercialCreditProposalPage = (props) => {


  const history = useHistory();
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const [locationData, setLocationData] = useState(null);

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
  }
  const [proposal, setProposal] = useState(null);
  const [changeSummaryItems, setChangeSummaryItems] = useState([]);
  const [facilityListItems, setFacilityListItems] = useState([]);
  const [identificationList, setIdentificationList] = useState([]);
  const [financialSummary, setFinancialSummary] = useState(sumaryData);
  const [prospect, setProspect] = useState({});
  const [isActiveLoading, setIsActiveLoading] = useState(true);
  const [personId, setpersonId] = useState(null);

  const [mainDebtor, setmainDebtor] = useState(null);
  const [data, setData] = useState(modelo)
  //mostrar el modal para la opción de finalizar proceso
  const [displayModalEndProcess, setdisplayModalEndProcess] = useState(false);
  const [messageDlg, setmessageDlg] = useState({ msg: "", show: false, error: false });
  const [datosDeudores, setdatosDeudores] = useState(null)


  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());

  const [displayModalBitacora, setdisplayModalBitacora] = useState(false);
  const [optionSelected, setoptionSelected] = useState(null);

  //On Mounting (componentDidMount)
  useEffect(() => {
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

    console.log("fetchData", locationData);
    //chequear si la tarea no ha sido iniciada
    bpmServices.checkAndStartTask(locationData)
      .then((iniresult) => {
        if (iniresult === false) {
          history.push(url.URL_DASHBOARD);
        }
      })
    backendServices.consultGeneralDataIGR(locationData.transactionId).then(resp => {
      if (resp != undefined) {
        data.datosGenerales.transactId = locationData.transactionId;
        data.datosGenerales.economicGroup.code = resp.economicGroup.code;
        data.datosGenerales.economicGroup.name = resp.economicGroup.name;
        data.datosGenerales.economicActivity.code = resp.economicActivity.code;
        data.datosGenerales.economicActivity.name = resp.economicActivity.name;
        data.datosGenerales.subeconomicActivity.code = resp.subeconomicActivity.code;
        data.datosGenerales.subeconomicActivity.name = resp.subeconomicActivity.name;
        data.datosGenerales.bank.code = resp.bank.code;
        data.datosGenerales.bank.name = resp.bank.name;
        setData(data);

      }
    }).catch((error) => {
    });
    backendServices.consultarCatalogoTipoPersonaDescripcion("").then(resp2 => {
      if (resp2 != undefined) {
        // consultarDeudores
        backendServices.consultarDeudores(locationData.transactionId).then(resp => {
          if (resp == undefined) return;
          if (resp.length > 0) {
            setdatosDeudores(resp.map((data) => (
              <tr key={uniq_key()}>
                <td>{resp2.find(x => x.code === Number(data.typePerson)).label}</td>
                <td>{Number(data.typePerson) === 2 ? data.name : data.name + " " + data.name2 + " " + data.lastName + " " + data.lastName2}</td>
                <td>{data.idType}</td>
                <td>{data.clientDocId}</td>
                <td>{data.customerNumberT24}</td>
              </tr>)))
          } else {
            setdatosDeudores(
              <tr key={uniq_key()}>
                <td colSpan="4" style={{ textAlign: 'center' }}></td>
              </tr>);

          }

        }).catch((error) => {

        });
      }
    })
    loadUserProspect(locationData.transactionId)
    getProspect(locationData);
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



  function loadIdentifications() {

    return new Promise((resolve, reject) => {
      backendServices.consultarCatalogoTipoIdentificacion()
        .then((data) => {
          if (data !== null && data !== undefined) {
            setIdentificationList(data);
          }
          resolve();
        })
        .catch((error) => {
          resolve();
          console.error('api error: ', error);
        });
    })
  }

  function handleReturn() {
    history.push(url.URL_DASHBOARD);
  }

  function handleClose() {
    history.push(url.URL_DASHBOARD);
  }

  function handleSaveFacility(newItem) {
    const newFacilities = [...facilityListItems, newItem];
    setFacilityListItems(newFacilities);
  }

  function getProspect(locationData) {
    Promise.allSettled([
      //backServices.consultarUsuarioProspecto(location.data.transactionId),
      //backServices.consultProspectUser(location.data.transactionId),
      backendServices.consultPrincipalDebtor(locationData.transactionId),
      loadIdentifications()
    ]).then((resp) => {
      const [{ value: PrincipalDebtor }] = resp;
      console.log(resp, location, PrincipalDebtor);
      setIsActiveLoading(false);
      let customerNumberT24 = PrincipalDebtor.customerNumberT24;
      setProspect(customerNumberT24);
      //loadFacilitiesList(customerNumberT24);
      setpersonId(PrincipalDebtor.personId);
    }).catch(err => {
      // console.log(err);
    });

    // backServices.consultProspectUser(location.data.transactionId).then(async (resp) => {
    //   console.log(resp);
    //   setIsActiveLoading(false)
    //   // customerNumberT24 = resp.customerNumberT24;
    //   setProspect(customerNumberT24);
    //   loadFacilitiesList(customerNumberT24);
    //   fetchProposal();
    // });

    // backServices.consultPrincipalDebtor(location.data.transactionId).then(async (resp) => {
    //   setpersonId(resp.personId);
    // });

  }

  /*
  function loadFacilitiesList(idcliente) {
      return new Promise(function (resolve, reject) {
        coreServices.getFacilitiesByTransaction(locationData.transactionId)
          .then(resp => {
            setFacilityListItems(resp);
            resolve();
          })
          .catch(err => {
            resolve();
          });
      })
    }
  */

  function handleSaveFacility(newItem) {
    const newFacilities = [...facilityListItems, newItem];
    setFacilityListItems(newFacilities);
  }


  ////////// PARTE ES LA FINAL DEL PROCESO ///////

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

              saveAutoLog(t("ActivityHasBeenFinishedSuccessfully"));

              history.push({
                pathname: url.URL_FINANCIALINFO,
                data: locationData,
              });
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

  function showModalBitacora(show = true) {
    setdisplayModalBitacora(show);
  }

  async function saveAutoLog(APPLICATION_STATUS = null, observations = null) {
    var mainDebtor = await backendServices.consultPrincipalDebtor(locationData.transactionId);
    var log = new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_04)
    log.clientId = mainDebtor?.personId ?? log.clientId;
    log.observations = (observations == null ? t("ActivityHasBeenFinishedSuccessfully") : observations) ?? "";
    log.requestId = APPLICATION_STATUS?.id ?? 0;
    log.statusDescription = APPLICATION_STATUS?.name ?? "";
    saveLogProcess(log);
  }

  return (
    <React.Fragment>
      {locationData ?
        <div className="page-content">

          <Breadcrumbs title={t("Commercial Credit")} breadcrumbItem={t("Credit Analysis")} />

          <HorizontalSteeper processNumber={1} activeStep={2}></HorizontalSteeper>

          <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
            <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
              <Col md={6} style={{ textAlign: "left" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
                <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>

              </Col>
              <Col md={6} style={{ textAlign: "right" }}>
                <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_ANALISISCREDITO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
                <Button color="success" type="button"
                  onClick={() => { onSaveProcess(OPTs.PROCESS_INFORMEFINANCIERO) }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("FinantialReport")}</Button>
              </Col>
            </Row>

            <Card>
              <CardHeader>
                <Row>
                  <Col md={6}>
                    <h4 className="card-title">{t("Credit Analysis")}</h4>
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

              <CardBody>
                <Row>
                  <Col xl="12">
                    <GeneralSection proposal={proposal} prospect={prospect} />
                  </Col>
                </Row>
                <Card>
                  <CardHeader>
                    <h5 className="card-title">{t("General Data")}</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md="12" className="table-responsive styled-table-div">
                        <Table className="table table-striped table-hover styled-table table">
                          <thead >
                            <tr>
                              <th><strong>{t("PersonType")}</strong></th>
                              <th><strong>{t("FullName")}</strong></th>
                              <th><strong>{t("IdentificationType")}</strong></th>
                              <th><strong>{t("IdentificationNumber")}</strong></th>
                              <th><strong>{t("Customer ID")}</strong></th>
                            </tr>
                          </thead>
                          <tbody>
                            {datosDeudores}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                    <Row>
                      <Col xl="2">
                        <strong htmlFor="clientNumber">{t("Economic Group")}</strong>
                      </Col>
                      <Col xl="4">
                        <Label htmlFor="clientNumber">{data.datosGenerales.economicGroup?.name == "" || data.datosGenerales.economicGroup?.name == null ? t("NoData") : data.datosGenerales.economicGroup?.name}</Label>
                      </Col>
                      <Col xl="2">
                        <strong htmlFor="clientNumber">{t("Economic Activity")}</strong>
                      </Col>
                      <Col xl="4">
                        <Label htmlFor="clientNumber">{data.datosGenerales.economicActivity?.name == "" || data.datosGenerales.economicActivity?.name == null ? t("NoData") : data.datosGenerales.economicActivity?.name}</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col xl="2">
                        <strong htmlFor="clientNumber">{t("Banking")}</strong>
                      </Col>
                      <Col xl="4">
                        <Label htmlFor="clientNumber">{data.datosGenerales.bank?.name == "" || data.datosGenerales.bank?.name == null ? t("NoData") : data.datosGenerales.bank?.name}</Label>
                      </Col>
                      <Col xl="2">
                        <strong htmlFor="clientNumber">Sub{t("Economic Activity")}</strong>
                      </Col>
                      <Col xl="4">
                        <Label htmlFor="clientNumber">{data.datosGenerales.subeconomicActivity?.name == "" || data.datosGenerales.subeconomicActivity?.name == null ? t("NoData") : data.datosGenerales.subeconomicActivity?.name}</Label>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Row>
                  <Col xl="12">
                    {mainDebtor ?
                      // <CorporateExposure title={t("CorporateExhibition")} customerNumberT24={mainDebtor?.customerNumberT24} />
                      <ExposicionCorportativa activeTab={2} title={t("CorporateExhibition")} customerNumberT24={mainDebtor?.customerNumberT24} />
                      : null}
                  </Col>
                </Row>
                <Row>
                  <Col xl="12">
                    {mainDebtor ?
                      // <CorporateExposureClient title={t("CorporateExhibitionClient")} customerNumberT24={mainDebtor?.customerNumberT24} />
                      <ExposicionCorporativaClientes activeTab={2} title={t("CorporateExhibitionClient")} customerNumberT24={mainDebtor?.customerNumberT24} />
                      : null}
                  </Col>
                </Row>

                <Row>
                  <Col xl="12">

                    {locationData ?
                      <ChangeSummaryReadOnly transactionId={locationData?.transactionId} />
                      : null}
                  </Col>
                </Row>

                <Row>
                  <Col xl="12">
                    {mainDebtor && locationData ?
                      // <FacilityListCore transactId={locationData.transactionId} customerNumberT24={mainDebtor?.customerNumberT24} />
                      <FacilityHistory validacion={true} transactId={locationData.transactionId} design={true} mainDebtor={mainDebtor} partyId={mainDebtor.customerNumberT24} />
                      : null}
                  </Col>
                </Row>

                <Row>
                  <Col xl="12">
                    {locationData ?
                      <FacilityListBpm transactionId={locationData?.transactionId} />
                      : null}
                  </Col>
                </Row>

                <Row>
                  <Col xl="12">
                    <CardBody>
                      <HeaderSections title="Attachments" t={t}></HeaderSections>
                      {locationData ?
                        <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_ANALISISCREDITO)} />
                        : null}
                    </CardBody>
                  </Col>
                </Row>

                {/* <Row>
                  <Col xl="12">
                    <CardBody>
                      <FinancialSummary client={financialSummary.client}
                        financialStatus={financialSummary.financialStatus}
                        balances={financialSummary.balances}
                        debts={financialSummary.debts}
                        debtorId={personId}
                      />
                    </CardBody>
                  </Col>
                </Row> */}
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>


          </LoadingOverlay >

          {locationData ?
            <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_04)} />
            : null}

          <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
            <Col md={6} style={{ textAlign: "left" }}>
              <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_CANCELPROCESS); showModalBitacora() }}><i className="mdi mdi-cancel mid-12px"></i> {t("CancelProcess")}</Button>
              <Button color="primary" style={{ margin: '0px 5px' }} type="button" onClick={() => { setoptionSelected(OPTs.PROCESS_INFORMEGESTION); showModalBitacora() }}><i className="mdi mdi-backspace-outline mid-12px"></i> {t("AdjustRequired")}</Button>

            </Col>
            <Col md={6} style={{ textAlign: "right" }}>
              <Button color="primary" type="button" style={{ margin: '5px' }} onClick={() => { onSaveProcess(OPTs.PROCESS_ANALISISCREDITO) }}><i className="mdi mdi-content-save-outline mid-12px"></i> {t("Exit")}</Button>
              <Button color="success" type="button"
                onClick={() => { onSaveProcess(OPTs.PROCESS_INFORMEFINANCIERO) }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("FinantialReport")}</Button>
            </Col>
          </Row>


          {locationData && displayModalBitacora ?
            <ModalBitacora
              logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_ANALISISCREDITO, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_04)}
              successSaved={() => { onSaveProcess(optionSelected); }}
              isOpen={displayModalBitacora} toggle={() => { showModalBitacora(false) }} />
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
        </div>
        : null}
    </React.Fragment>
  );

}


export default CommercialCreditProposalPage;
