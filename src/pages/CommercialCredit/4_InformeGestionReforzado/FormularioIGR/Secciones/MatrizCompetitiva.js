import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useLocation, useHistory } from "react-router-dom"
import {
  Row,
  Col,
  Button,
  Label,
  Table,
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import ModalOtrosBancosActivosPasivos from "./ModalOtrosBancosActivosPasivos.js"
import ModalNegociosCompromisos from "./ModalNegociosCompromisos.js"
import ModalExpedientesOtros from "./ModalExpedientesOtros.js"
import ModalMatrizCompetitiva from "./ModalMatrizCompetitiva.js"
import { BackendServices } from "../../../../../services/index.js"
import SweetAlert from "react-bootstrap-sweetalert"
import HeaderSections from "../../../../../components/Common/HeaderSections";
import ModalMatrizCompetitivaPosicionBanesco from "./ModalMatrizPosicionBanesco.js"
import * as url from "../../../../../helpers/url_helper"
import Currency from "../../../../../helpers/currency";
import { uniq_key } from "../../../../../helpers/unq_key.js"
const estiloTotales = { backgroundColor: "lightgrey", color: "black" }
const MatrizCompetitiva = React.forwardRef((props, ref) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  const location = useLocation()
  /* ---------------------------------------------------------------------------------------------- */
  /*                        Variables de estados para los mensajes de alerta                        */
  /* ---------------------------------------------------------------------------------------------- */
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  const [dataDelete, setDataDelete] = useState([]);
  const [dataReturn, setdataReturn] = useState({});
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [dataSet, setdataSet] = useState({
    "transactId": 0,
    "bank": "",
    "passivePercentage": 0,
    "participation": 0,
    "longTerm": 0,
    "shortTerm": 0
  });
  const [tipo, settipo] = useState("");
  const [posicionBanescoRows, setposicionBanescoRows] = useState(null);
  const [productosTransaccionalesRows, setproductosTransaccionalesRows] = useState(null);
  const [matrizRentabilidadRows, setmatrizRentabilidadRows] = useState(null);
  const [otrosBancosActivosPasivosRows, setotrosBancosActivosPasivosRows] = useState(null);
  const [nuevosNegociosCompromisosRows, setnuevosNegociosCompromisosRows] = useState(null);
  const [expedientesOtrosRows, setexpedientesOtrosRows] = useState(null);
  const [monto, setmonto] = useState(0);
  const [participacion, setparticipacion] = useState(0);
  const [montoTransacciones, setmontoTransacciones] = useState(0);
  const [otrosBancosMonto, setotrosBancosMonto] = useState({
    pasivo: 0,
    participacion: 0,
    largoPlazo: 0,
    cortoPlazo: 0
  });
  const [participacionTransaccion, setparticipacionTransaccion] = useState(0);
  const [showModalOtrosBancosActivosPasivos, setShowModalOtrosBancosActivosPasivos] = useState(false);
  const [showModalNegociosCompromisos, setShowModalNegociosCompromisos] = useState(false);
  const [showModalExpedientesOtros, setShowModalExpedientesOtros] = useState(false);
  const [showModalMatrizCompetitiva, setShowModalMatrizCompetitiva] = useState(false);
  const [showModalMatrizCompetitivaPosicionBanesco, setShowModalMatrizCompetitivaPosicionBanesco] = useState(false);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmMatrizCompetitiva');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
  const api = new BackendServices();
  const [locationData, setLocationData] = useState(null);
  const history = useHistory();
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
        dataSession = location.data;
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        dataSession = result;
      }
    }
    if (props.activeTab == 26) {
      // Read Api Service  data
      initializeData(dataSession);
    }
  }, [props.activeTab == 26]);
  function initializeData(dataLocation) {
    // consultarMatrizPosicionBanescoIGR
    dataReturn.observations = props.dataMatrizCompetitiva.observations
    setdataReturn(dataReturn)
    api.consultMatrixPosicionBanescoIGR(dataLocation.transactionId).then(resp => {
      if (resp.length > 0) {
        setposicionBanescoRows(resp.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Product")}>{data.product}</td>
              <td data-label={t("Amount")}>${currencyData.formatTable(data.closeVol ?? 0)}</td>
              <td data-label={t("ParticipationBanesco")}>{currencyData.formatTable(data.participation)}%</td>
              <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                <Button type="button" color="link" onClick={(resp) => {
                  settipo("EposicionBanesco"); editPositionTransactions(data)
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => {
                  settipo("DposicionBanesco"); deleteData(data)
                }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
        let monto1 = 0;
        let participacion1 = 0;
        for (let i = 0; i < resp.length; i++) {
          if (resp[i].status) {
            monto1 = parseFloat(monto1) + parseFloat(resp[i].closeVol);
            participacion1 = parseFloat(participacion1) + parseFloat(resp[i].participation);
          }
        }
        setmonto(monto1);
        setparticipacion(participacion1);

      } else {
        setposicionBanescoRows(
          <tr key={uniq_key()}>
            <td colSpan="4" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    // consultarMatrizTransaccionBanescoIGR
    api.consultMatrixTransactionBanescoIGR(dataLocation.transactionId).then(resp => {
      if (resp.length > 0) {
        let monto1 = 0;
        let participacion1 = 0;
        for (let i = 0; i < resp.length; i++) {
          if (resp[i].status) {
            monto1 = parseFloat(monto1) + parseFloat(resp[i].closeVol);
            participacion1 = parseFloat(participacion1) + parseFloat(resp[i].participation);
          }
        }
        setmontoTransacciones(monto1);
        setparticipacionTransaccion(participacion1);
        setproductosTransaccionalesRows(resp.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Product")}>{data.product}</td>
              <td data-label={t("Amount")}>${currencyData.formatTable(data.closeVol ?? 0)}</td>
              <td data-label={t("ParticipationBanesco")}>{currencyData.formatTable(data.participation)}%</td>
              <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                <Button type="button" color="link" onClick={(resp) => {
                  settipo("EproductosTransaccionales"); editPositionTransactions(data)
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => {
                  settipo("DproductosTransaccionales"); deleteData(data)
                }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setproductosTransaccionalesRows(
          <tr key={uniq_key()}>
            <td colSpan="4" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    // consultarMatrizOtrosBancosIGR
    api.consultMatrixOtherBanksIGR(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        let pasivo = 0;
        let participacion = 0;
        let largoPlazo = 0;
        let cortoPlazo = 0;
        for (let i = 0; i < resp.competitiveMatrixOtherBanks.length; i++) {
          pasivo = parseFloat(pasivo) + parseFloat(resp.competitiveMatrixOtherBanks[i].passivePercentage);
          participacion = parseFloat(participacion) + parseFloat(resp.competitiveMatrixOtherBanks[i].participation);
          largoPlazo = parseFloat(largoPlazo) + parseFloat(resp.competitiveMatrixOtherBanks[i].longTerm);
          cortoPlazo = parseFloat(cortoPlazo) + parseFloat(resp.competitiveMatrixOtherBanks[i].shortTerm);
        }

        otrosBancosMonto.pasivo = pasivo;
        otrosBancosMonto.participacion = participacion;
        otrosBancosMonto.largoPlazo = largoPlazo;
        otrosBancosMonto.cortoPlazo = cortoPlazo;
        setotrosBancosMonto(otrosBancosMonto)
        setotrosBancosActivosPasivosRows(resp.competitiveMatrixOtherBanks.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("Bank")}>{data.bank}</td>
            <td data-label={t("Passive")}>{currencyData.formatTable(data.passivePercentage)}%</td>
            <td data-label={t("Participation")}>{currencyData.formatTable(data.participation)}%</td>
            <td data-label={t("LongTerm")}>${currencyData.formatTable(data?.longTerm ?? 0)}</td>
            <td data-label={t("ShortTerm")}>${currencyData.formatTable(data?.shortTerm ?? 0)}</td>
            <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
              <Button type="button" color="link" onClick={(resp) => {
                settipo("EOTROBANCO"); editPositionBank(data)
              }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => {
                settipo("DOTROBANCO"); deleteData(data)
              }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)
        ));
      } else {
        setotrosBancosActivosPasivosRows(
          <tr key={uniq_key()}>
            <td colSpan="7" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    // consultarMatrizNuevosNegociosIGR
    api.consultMatrixNewBusinessIGR(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        setnuevosNegociosCompromisosRows(resp.newBusiness.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("Type")}>{data.observations}</td>
            <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
              <Button type="button" color="link" onClick={(resp) => { editBusinessCommitments(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { deleteData(data); settipo("DNUEVONEGOCIO"); }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)
        ));
      } else {
        setnuevosNegociosCompromisosRows(
          <tr key={uniq_key()}>
            <td colSpan="2" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    // consultarMatrizExpedientesIGR
    api.consultMatrixFilesIGR(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        setexpedientesOtrosRows(resp.files.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("Type")}>{data.observations}</td>
            <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
              <Button type="button" color="link" onClick={(resp) => { editFilesOthers(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { deleteData(data); settipo("DEXPEDIENTES") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)
        ));
      } else {
        setexpedientesOtrosRows(
          <tr key={uniq_key()}>
            <td colSpan="2" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    // consultarMatrizRentabilidadIGR
    api.consultMatrixProfitabilityIGR(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        setmatrizRentabilidadRows(resp.profitability.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("Type")}>{data.matrixType.code}</td>
            <td data-label={t("Quantity")}>{data.quantity}</td>
            <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
              <Button type="button" color="link" onClick={(resp) => { editCompetitiveMatrix(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { deleteData(data); settipo("DRENTABILIDAD") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)
        ));
      } else {
        setmatrizRentabilidadRows(
          <tr key={uniq_key()}>
            <td colSpan="4" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
  }
  function dataManagament(data, tipo) {
    data.transactId = Number(locationData.transactionId);
    const api = new BackendServices()
    /* ---------------------------------------------------------------------------------------------- */
    /*                                  Guardamos los datos del cash                                  */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "OTROBANCO") {
      let jsonSet = {
        transactId: Number(data?.transactId ?? 0),
        bank: data?.bank ?? " ",//
        passivePercentage: Number(data?.passivePercentage ?? 0),
        participation: data?.participation,
        longTerm: Number(currencyData.getRealValue(data?.longTerm ?? 0)),
        shortTerm: Number(currencyData.getRealValue(data?.shortTerm ?? 0))
      }
      // nuevoMatrizOtrosBancosIGR
      api.newMatrixOtherBanksIGR(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalOtrosBancosActivosPasivos(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "NUEVONEGOCIO") {
      // nuevoMatrizNuevosNegociosIGR
      api.newMatrixNewBusinessIGR(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalNegociosCompromisos(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "EXPEDIENTES") {
      // nuevoMatrizExpedientesIGR/
      api.newMatrixIGRFiles(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalExpedientesOtros(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "RENTABILIDAD") {
      // nuevoMatrizRentabilidadIGR
      api.newMatrixProfitabilityIGR(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalMatrizCompetitiva(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "posicionBanesco") {
      // nuevoMatrizPosicionBanescoIGR
      let jsonSet = {
        transactId: Number(data?.transactId) ?? 0,
        product: data?.product ?? " ",
        closeVol: Number(currencyData.getRealValue(data?.closeVol ?? 0)) ?? 0,
        participation: data?.participation
      }
      api.newMatrixPositionBanescoIGR(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalMatrizCompetitivaPosicionBanesco(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "productosTransaccionales") {
      // nuevoMatrizTransaccionBanescoIGR
      api.newMatrixTransactionBanescoIGR(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalMatrizCompetitivaPosicionBanesco(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
  }
  function updateDataManagament(data, tipo) {
    data.transactId = Number(locationData.transactionId);
    const api = new BackendServices()
    /* ---------------------------------------------------------------------------------------------- */
    /*                                    Editita el flujo de caja                                    */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "EOTROBANCO") {
      let jsonSet = {
        transactId: Number(data?.transactId ?? 0),
        otherBankId: Number(data?.otherBankId ?? 0),
        bank: data?.bank ?? " ",//
        passivePercentage: Number(data?.passivePercentage ?? 0),
        participation:data?.participation,
        longTerm: Number(currencyData.getRealValue(data?.longTerm ?? 0)),
        shortTerm: Number(currencyData.getRealValue(data?.shortTerm ?? 0))
      }
      // actualizarMatrizOtrosBancosIGR
      api.updateMatrixOtherBanksIGR(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalOtrosBancosActivosPasivos(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "ENUEVONEGOCIO") {
      // actualizarMatrizNuevosNegociosIGR
      api.updateMatrixNewBusinessIGR(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalNegociosCompromisos(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "EEXPEDIENTES") {
      // actualizarMatrizExpedientesIGR
      api.updateMatrizIGRFiles(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalExpedientesOtros(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "ERENTABILIDAD") {
      // actualizarMatrizRentabilidadIGR
      api.updateMatrixProfitabilityIGR(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalMatrizCompetitiva(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "EposicionBanesco") {
      data.positionId = dataSet.positionId;
      // actualizarMatrizPosicionBanescoIGR
      api.updateMatrixPosicionBanescoIGR(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalMatrizCompetitivaPosicionBanesco(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "EproductosTransaccionales") {
      data.transactionalId = dataSet.transactionalId;
      // actualizarMatrizTransaccionBanescoIGR
      api.updateTransactionMatrixBanescoIGR(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalMatrizCompetitivaPosicionBanesco(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
  }
  // editarPosicionTransacciones
  function editPositionTransactions(data) {
    setdataSet(data)
    setbotonValidation(true);
    toggleShowModalMatrizCompetitivaPosicionBanesco(true)
  }
  // editarPosisionBanco
  function editPositionBank(data) {
    setdataSet(data)
    setbotonValidation(true);
    toggleShowModalOtrosBancosActivosPasivos(true)
  }
  // editarNegociosCompromisos
  function editBusinessCommitments(data) {
    settipo("ENUEVONEGOCIO");
    setdataSet(data)
    setbotonValidation(true);
    toggleShowModalNegociosCompromisos(true)
  }
  // editarExpedientesOtros
  function editFilesOthers(data) {
    settipo("EEXPEDIENTES");
    setdataSet(data)
    setbotonValidation(true);
    toggleShowModalExpedientesOtros(true)
  }
  // editarMatrixCompetitiva
  function editCompetitiveMatrix(data) {
    settipo("ERENTABILIDAD");
    setdataSet(data)
    setbotonValidation(true);
    toggleShowModalMatrizCompetitiva(true)
  }
  // eliminarDatos
  function deleteData(data) {
    setDataDelete(data)
    setconfirm_alert(true);
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalOtrosBancosActivosPasivos(estado) {
    setShowModalOtrosBancosActivosPasivos(estado);
    removeBodyCss()
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalNegociosCompromisos(estado) {
    setShowModalNegociosCompromisos(estado);
    removeBodyCss()
  }
  //
  function toggleShowModalExpedientesOtros(estado) {
    setShowModalExpedientesOtros(estado);
    removeBodyCss()
  }
  //
  function toggleShowModalMatrizCompetitiva(estado) {
    setShowModalMatrizCompetitiva(estado);
    removeBodyCss()
  }
  function toggleShowModalMatrizCompetitivaPosicionBanesco(estado) {
    setShowModalMatrizCompetitivaPosicionBanesco(estado);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    //console.log(values);
    // dataReturn.observations=values.comment;
    // setdataReturn(dataReturn)
    setFormValid(true)
    //props.onSubmit(values);
  }


  return (
    <React.Fragment>
      <h5>
        {t("Matriz Competitiva")}
      </h5>
      <p className="card-title-desc"></p>
      <AvForm id="frmMatrizCompetitiva" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <Row>
              <Col md="6">
                <h5 className="card-sub-title">{t("BanescoPosition")}</h5>
              </Col>
              <Col md="6" style={{ textAlign: "right" }}>
                <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                  setdataSet({
                    product: "",
                    closeVol: 0,
                    participation: 0
                  }); settipo("posicionBanesco"); setbotonValidation(true); toggleShowModalMatrizCompetitivaPosicionBanesco(true)
                }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
              </Col>
            </Row>
            <Col md="12" className="table-responsive styled-table-div">
              <Table className="table table-striped table-hover styled-table table" >
                <thead>
                  <tr>
                    <th>{t("Product")}</th>
                    <th>{t("Amount")}</th>
                    <th>{t("ParticipationBanesco")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {posicionBanescoRows}
                  <tr style={estiloTotales}><td><strong>{t("Total")}</strong></td><td><strong>${currencyData.formatTable(monto ?? 0)}</strong></td><td><strong>{parseFloat(currencyData.format(participacion ?? 0)).toFixed(2)}%</strong></td><td></td></tr>
                </tbody>
              </Table>
            </Col>
          </Col>
          <Col md="12">
            <Row style={{ marginTop: "15px" }}>
              <Col md="6">
                <h5 className="card-sub-title">{t("BanescoTransactionalProducts")}</h5>
              </Col>
              <Col md="6" style={{ textAlign: "right" }}>
                <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                  setdataSet({
                    product: "",
                    closeVol: 0,
                    participation: 0
                  }); settipo("productosTransaccionales"); setbotonValidation(true); toggleShowModalMatrizCompetitivaPosicionBanesco(true)
                }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
              </Col>
            </Row>
            <Col md="12" className="table-responsive styled-table-div">
              <Table className="table table-striped table-hover styled-table table" >
                <thead>
                  <tr>
                    <th>{t("Product")}</th>
                    <th>{t("Amount")}</th>
                    <th>{t("ParticipationBanesco")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productosTransaccionalesRows}
                  <tr style={estiloTotales}><td><strong>{t("Total")}</strong></td><td><strong>${currencyData.formatTable(montoTransacciones ?? 0)}</strong></td><td><strong>{parseFloat(currencyData.format(participacionTransaccion ?? 0)).toFixed(2)}%</strong></td><td></td></tr>
                </tbody>
              </Table>
            </Col>
          </Col>
          <Col md="12">
            <Row style={{ marginTop: "15px" }}>
              <Col md="6">
                <h5 className="card-sub-title">{t("OtherBanksLiabilitiesAssets")}</h5>
              </Col>
              <Col md="6" style={{ textAlign: "right" }}>
                <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                  setdataSet({
                    "transactId": 0,
                    "bank": "",
                    "passivePercentage": 0,
                    "participation": 0,
                    "longTerm": 0,
                    "shortTerm": 0
                  }); settipo("OTROBANCO"); setbotonValidation(true); toggleShowModalOtrosBancosActivosPasivos(true)
                }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
              </Col>
              <Col md="12" className="table-responsive styled-table-div">
                <Table className="table table-striped table-hover styled-table table" >
                  <thead>
                    <tr>
                      <th>{t("Bank")}</th>
                      <th>{t("Passive")}</th>
                      <th>{t("Participation")}</th>
                      <th>{t("LongTerm")}</th>
                      <th>{t("ShortTerm")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {otrosBancosActivosPasivosRows}
                    <tr style={estiloTotales}><td><strong>{t("Total")}</strong></td><td><strong>{parseFloat(currencyData.format(otrosBancosMonto?.pasivo ?? 0)).toFixed(2)}%</strong></td><td><strong>{parseFloat(currencyData.format(otrosBancosMonto?.participacion ?? 0)).toFixed(2)}%</strong></td><td><strong>${currencyData.formatTable(otrosBancosMonto?.largoPlazo ?? 0)}</strong></td><td><strong>${currencyData.formatTable(otrosBancosMonto?.cortoPlazo ?? 0)}</strong></td><td></td></tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
          <Col md="12">
            <Row style={{ marginTop: "15px" }}>
              <Col md="6">
                <h5 className="card-sub-title">{t("NewBusinessesCommitments")}</h5>
              </Col>
              <Col md="6" style={{ textAlign: "right" }}>
                <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                  setdataSet({
                    "transactId": 0,
                    "businessType": {
                      "code": "",
                      "name": ""
                    },
                    "businessStatus": "",
                    "observations": ""
                  }); settipo("NUEVONEGOCIO"); setbotonValidation(true); toggleShowModalNegociosCompromisos(true)
                }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
              </Col>
            </Row>
            <Col md="12" className="table-responsive styled-table-div">
              <Table className="table table-striped table-hover styled-table table" >
                <thead>
                  <tr>
                    <th>{t("Type")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {nuevosNegociosCompromisosRows}
                </tbody>
              </Table>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Row style={{ marginTop: "15px" }}>
              <Col md="6">
                <h5 className="card-sub-title">{t("ProfitabilityMatrix")}</h5>
              </Col>
              <Col md="6" style={{ textAlign: "right" }}>
                <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                  setdataSet({
                    "transactId": 0,
                    "matrixType": {
                      "code": "",
                      "name": ""
                    },
                    "quantity": 0,
                    "status": true
                  }); settipo("RENTABILIDAD"); setbotonValidation(true); toggleShowModalMatrizCompetitiva(true)
                }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
              </Col>
            </Row>
            <Col md="12" className="table-responsive styled-table-div">
              <Table className="table table-striped table-hover styled-table table" >
                <thead>
                  <tr>
                    <th>{t("Type")}</th>
                    <th>{t("Quantity")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {matrizRentabilidadRows}
                </tbody>
              </Table>
            </Col>
          </Col>
          <Col md="12">
            <Row style={{ marginTop: "15px" }}>
              <Col md="6">
                <h5 className="card-sub-title">{t("FilesOthers")}</h5>
              </Col>
              <Col md="6" style={{ textAlign: "right" }}>
                <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                  setdataSet({
                    "transactId": 5,
                    "fileType": {
                      "code": "",
                      "name": ""
                    },
                    "fileStatus": "",
                    "observations": ""
                  }); settipo("EXPEDIENTES"); setbotonValidation(true); toggleShowModalExpedientesOtros(true)
                }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
              </Col>
            </Row>
            <Col md="12" className="table-responsive styled-table-div">
              <Table className="table table-striped table-hover styled-table table" >
                <thead>
                  <tr>
                    <th>{t("Type")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {expedientesOtrosRows}
                </tbody>
              </Table>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="comment">{t("Comment")}</Label>
              <AvField
                type="textarea"
                name="comment"
                id="comment"
                maxLength="1000"
                rows="7"
                // validate={{
                //   required: { value: true, errorMessage: t("Required Field") },
                // }}
                value={props.dataMatrizCompetitiva.observations}
                onChange={(e) => { dataReturn.observations = e.target.value; setdataReturn(dataReturn); }}

              />
            </div>
          </Col>
        </Row>
      </AvForm>
      <ModalMatrizCompetitivaPosicionBanesco jsonSow={dataSet} tipo={tipo} updateDataManagament={updateDataManagament} dataManagament={dataManagament} botones={botonValidation} isOpen={showModalMatrizCompetitivaPosicionBanesco} toggle={() => { toggleShowModalMatrizCompetitivaPosicionBanesco(false) }} />
      <ModalMatrizCompetitiva jsonSow={dataSet} tipo={tipo} updateDataManagament={updateDataManagament} dataManagament={dataManagament} botones={botonValidation} isOpen={showModalMatrizCompetitiva} toggle={() => { toggleShowModalMatrizCompetitiva(false) }} />
      <ModalOtrosBancosActivosPasivos jsonSow={dataSet} tipo={tipo} updateDataManagament={updateDataManagament} dataManagament={dataManagament} botones={botonValidation} isOpen={showModalOtrosBancosActivosPasivos} toggle={() => { toggleShowModalOtrosBancosActivosPasivos(false) }} />
      <ModalNegociosCompromisos jsonSow={dataSet} tipo={tipo} updateDataManagament={updateDataManagament} dataManagament={dataManagament} botones={botonValidation} isOpen={showModalNegociosCompromisos} toggle={() => { toggleShowModalNegociosCompromisos(false) }} />
      <ModalExpedientesOtros jsonSow={dataSet} tipo={tipo} updateDataManagament={updateDataManagament} dataManagament={dataManagament} botones={botonValidation} isOpen={showModalExpedientesOtros} toggle={() => { toggleShowModalExpedientesOtros(false) }} />
      {
        successSave_dlg ? (
          <SweetAlert
            success
            title={t("SuccessDialog")}
            confirmButtonText={t("Confirm")}
            cancelButtonText={t("Cancel")}
            onConfirm={() => {
              setsuccessSave_dlg(false)
              initializeData(locationData);
            }}
          >
            {t("SuccessSaveMessage")}
          </SweetAlert>
        ) : null
      }

      {
        error_dlg ? (
          <SweetAlert
            error
            title={t("ErrorDialog")}
            confirmButtonText={t("Confirm")}
            cancelButtonText={t("Cancel")}
            onConfirm={() => {
              seterror_dlg(false)
              initializeData(locationData);
            }}
          >
            {error_msg}
          </SweetAlert>
        ) : null
      }
      {
        confirm_alert ? (
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
              if (tipo == "DOTROBANCO") {
                // eliminarMatrizOtrosBancosIGR
                apiBack.deleteMatrixOtherBanksIGR({ transactId: Number(locationData.transactionId), otherBankId: dataDelete.otherBankId }).then(resp => {
                  if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                  } else {
                    setconfirm_alert(false)
                    initializeData(locationData);
                  }
                }).catch(error => {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                })
              }
              if (tipo == "DNUEVONEGOCIO") {
                // eliminarMatrizNuevosNegociosIGR
                apiBack.deleteMatrixNewBusinessIGR({ transactId: Number(locationData.transactionId), newBusinessId: dataDelete.newBusinessId }).then(resp => {
                  if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                  } else {
                    setconfirm_alert(false)
                    initializeData(locationData);
                  }
                }).catch(error => {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                })
              }
              if (tipo == "DEXPEDIENTES") {
                // eliminarMatrizExpedientesIGR
                apiBack.deleteMatrixFilesIGR({ transactId: Number(locationData.transactionId), filesId: dataDelete.filesId }).then(resp => {
                  if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                  } else {
                    setconfirm_alert(false)
                    initializeData(locationData);
                  }
                }).catch(error => {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                })
              }
              if (tipo == "DRENTABILIDAD") {
                // eliminarMatrizRentabilidadIGR
                apiBack.deleteMatrixProfitabilityIGR({ transactId: Number(locationData.transactionId), profitabilityId: dataDelete.profitabilityId }).then(resp => {
                  if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                  } else {
                    setconfirm_alert(false)
                    initializeData(locationData);
                  }
                }).catch(error => {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                })
              }
              if (tipo == "DposicionBanesco") {
                // eliminarMatrizPosicionBanescoIGR
                apiBack.eliminateMatrixPosicionBanescoIGR({ transactId: Number(locationData.transactionId), positionId: dataDelete.positionId }).then(resp => {
                  if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                  } else {
                    setconfirm_alert(false)
                    initializeData(locationData);
                  }
                }).catch(error => {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                })
              }
              if (tipo == "DproductosTransaccionales") {
                // eliminarMatrizTransaccionBanescoIGR
                apiBack.eliminateMatrizTransaccionBanescoIGR({ transactId: Number(locationData.transactionId), transactionalId: dataDelete.transactionalId }).then(resp => {
                  if (resp.statusCode == "500") {
                    setconfirm_alert(false)
                    seterror_dlg(false)
                  } else {
                    setconfirm_alert(false)
                    initializeData(locationData);
                  }
                }).catch(error => {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                })
              }
            }}
            onCancel={() => setconfirm_alert(false)}
          >
            {t("Youwontbeabletorevertthis")}
          </SweetAlert>
        ) : null
      }
    </React.Fragment >
  );

});


MatrizCompetitiva.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}


export default MatrizCompetitiva;
