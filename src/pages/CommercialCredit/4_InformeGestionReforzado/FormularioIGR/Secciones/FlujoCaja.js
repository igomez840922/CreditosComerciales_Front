import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useLocation, useHistory } from "react-router-dom"
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  CardHeader,
  Table,
  CardFooter
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import AvInput from 'availity-reactstrap-validation/lib/AvInput'
import ModalFlujoCaja from "./ModalFlujoCaja.js"
import ModalCargaTrabajo from "./ModalCargaTrabajo.js"
import { BackendServices } from "../../../../../services/index.js"
import SweetAlert from "react-bootstrap-sweetalert"
import HeaderSections from "../../../../../components/Common/HeaderSections";
import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';
import * as url from "../../../../../helpers/url_helper"
import Currency from "../../../../../helpers/currency";
import { uniq_key } from "../../../../../helpers/unq_key.js"
const FlujoCaja = React.forwardRef((props, ref) => {
  const currencyData = new Currency();
  const { t } = useTranslation();
  // const { locationData } = props;
  const location = useLocation()
  /* ---------------------------------------------------------------------------------------------- */
  /*                        Variables de estados para los mensajes de alerta                        */
  /* ---------------------------------------------------------------------------------------------- */
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [dataDelete, setDataDelete] = useState([]);
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [flujoCaja1Rows, setflujoCaja1Rows] = useState(null);
  const [flujoCaja2Rows, setflujoCaja2Rows] = useState(null);
  const [flujoCaja3Rows, setflujoCaja3Rows] = useState(null);
  const [flujoCaja4Rows, setflujoCaja4Rows] = useState(null);
  const [tituloSet, settituloSet] = useState("");
  const [flujoCaja7Rows, setflujoCaja7Rows] = useState(null);
  const [cargaTrabajoRows, setcargaTrabajoRows] = useState(null);
  const [tipo, setTipo] = useState("");
  const [dataSet, setdataSet] = useState({
    transactId: 0,
    description: null,
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0
  });
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmProveedores');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }
  }));
  const [showModalFlujoCaja, setShowModalFlujoCaja] = useState(false);
  const [showModalCargaTrabajo, setShowModalCargaTrabajo] = useState(false);
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
    if (props.activeTab == 24) {
      // Read Api Servic e data 
      initializeData(dataSession);
    }
  }, [props.activeTab == 24]);

  function initializeData(dataLocation) {
    api.queryCashFlowDollar(dataLocation.transactionId).then(resp => {
      if (resp.cashFlowDollarDTOList.length > 0) {
        setflujoCaja1Rows(resp.cashFlowDollarDTOList.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Description")}>{data.description}</td>
              <td data-label={t("January")}>${currencyData.formatTable(data.january ?? 0)}</td>
              <td data-label={t("February")}>${currencyData.formatTable(data.february ?? 0)}</td>
              <td data-label={t("March")}>${currencyData.formatTable(data.march ?? 0)}</td>
              <td data-label={t("April")}>${currencyData.formatTable(data.april ?? 0)}</td>
              <td data-label={t("May")}>${currencyData.formatTable(data.may ?? 0)}</td>
              <td data-label={t("June")}>${currencyData.formatTable(data.june ?? 0)}</td>
              <td data-label={t("July")}>${currencyData.formatTable(data.july ?? 0)}</td>
              <td data-label={t("August")}>${currencyData.formatTable(data.august ?? 0)}</td>
              <td data-label={t("September")}>${currencyData.formatTable(data.september ?? 0)}</td>
              <td data-label={t("October")}>${currencyData.formatTable(data.october ?? 0)}</td>
              <td data-label={t("November")}>${currencyData.formatTable(data.november ?? 0)}</td>
              <td data-label={t("December")}>${currencyData.formatTable(data.december ?? 0)}</td>
              <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                <Button type="button" color="link" onClick={() => { settituloSet(t("InDollars")); updateDataModal(data, "EDINERO") }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={() => { settituloSet(t("InDollars")); deleteData(data, "DDINERO") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setflujoCaja1Rows(
          <tr key={uniq_key()}>
            <td colSpan="13" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    // consultarFlujoCajaCobranzas
    api.checkCashFlowCollections(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        setflujoCaja3Rows(resp.cashFlowCollection.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Description")}>{data.description}</td>
              <td data-label={t("January")}>${currencyData.formatTable(data.january ?? 0)}</td>
              <td data-label={t("February")}>${currencyData.formatTable(data.february ?? 0)}</td>
              <td data-label={t("March")}>${currencyData.formatTable(data.march ?? 0)}</td>
              <td data-label={t("April")}>${currencyData.formatTable(data.april ?? 0)}</td>
              <td data-label={t("May")}>${currencyData.formatTable(data.may ?? 0)}</td>
              <td data-label={t("June")}>${currencyData.formatTable(data.june ?? 0)}</td>
              <td data-label={t("July")}>${currencyData.formatTable(data.july ?? 0)}</td>
              <td data-label={t("August")}>${currencyData.formatTable(data.august ?? 0)}</td>
              <td data-label={t("September")}>${currencyData.formatTable(data.september ?? 0)}</td>
              <td data-label={t("October")}>${currencyData.formatTable(data.october ?? 0)}</td>
              <td data-label={t("November")}>${currencyData.formatTable(data.november ?? 0)}</td>
              <td data-label={t("December")}>${currencyData.formatTable(data.december ?? 0)}</td>
              <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                <Button type="button" color="link" onClick={() => { settituloSet(t("CollectionsITBMSNotIncluded")); updateDataModal(data, "ECOBRANZA") }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={() => { settituloSet(t("CollectionsITBMSNotIncluded")); deleteData(data, "DCOBRANZA") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setflujoCaja3Rows(
          <tr key={uniq_key()}>
            <td colSpan="13" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    // consultarFlujoCajaEgresos
    api.consultCashFlowExpenses(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        setflujoCaja4Rows(resp.cashFlowOutcome.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Description")}>{data.description}</td>
              <td data-label={t("January")}>${currencyData.formatTable(data.january ?? 0)}</td>
              <td data-label={t("February")}>${currencyData.formatTable(data.february ?? 0)}</td>
              <td data-label={t("March")}>${currencyData.formatTable(data.march ?? 0)}</td>
              <td data-label={t("April")}>${currencyData.formatTable(data.april ?? 0)}</td>
              <td data-label={t("May")}>${currencyData.formatTable(data.may ?? 0)}</td>
              <td data-label={t("June")}>${currencyData.formatTable(data.june ?? 0)}</td>
              <td data-label={t("July")}>${currencyData.formatTable(data.july ?? 0)}</td>
              <td data-label={t("August")}>${currencyData.formatTable(data.august ?? 0)}</td>
              <td data-label={t("September")}>${currencyData.formatTable(data.september ?? 0)}</td>
              <td data-label={t("October")}>${currencyData.formatTable(data.october ?? 0)}</td>
              <td data-label={t("November")}>${currencyData.formatTable(data.november ?? 0)}</td>
              <td data-label={t("December")}>${currencyData.formatTable(data.december ?? 0)}</td>
              <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>

                <Button type="button" color="link" onClick={() => {
                  updateDataModal(data, "EEGRESO"); settituloSet(t("Expenses"));
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={() => {
                  deleteData(data, "DEGRESO"); settituloSet(t("Expenses"));
                }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setflujoCaja4Rows(
          <tr key={uniq_key()}>
            <td colSpan="13" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    // consultarFlujoCajaIngresoFacturacion
    api.checkCashFlowIncomeInvoicing(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        setflujoCaja2Rows(resp.cashFlowInvoiceIncome.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("Description")}>{data.description}</td>
            <td data-label={t("January")}>${currencyData.formatTable(data.january ?? 0)}</td>
            <td data-label={t("February")}>${currencyData.formatTable(data.february ?? 0)}</td>
            <td data-label={t("March")}>${currencyData.formatTable(data.march ?? 0)}</td>
            <td data-label={t("April")}>${currencyData.formatTable(data.april ?? 0)}</td>
            <td data-label={t("May")}>${currencyData.formatTable(data.may ?? 0)}</td>
            <td data-label={t("June")}>${currencyData.formatTable(data.june ?? 0)}</td>
            <td data-label={t("July")}>${currencyData.formatTable(data.july ?? 0)}</td>
            <td data-label={t("August")}>${currencyData.formatTable(data.august ?? 0)}</td>
            <td data-label={t("September")}>${currencyData.formatTable(data.september ?? 0)}</td>
            <td data-label={t("October")}>${currencyData.formatTable(data.october ?? 0)}</td>
            <td data-label={t("November")}>${currencyData.formatTable(data.november ?? 0)}</td>
            <td data-label={t("December")}>${currencyData.formatTable(data.december ?? 0)}</td>
            <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
              <Button type="button" color="link" onClick={() => { settituloSet(t("IncomeInvoicesITBMSNotIncluded")); updateDataModal(data, "EINGREFACTURA") }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={() => { settituloSet(t("IncomeInvoicesITBMSNotIncluded")); deleteData(data, "DINGREFACTURA") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)
        ));
      } else {
        setflujoCaja2Rows(
          <tr key={uniq_key()}>
            <td colSpan="13" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    // consultarFlujoCajaServicioDeudas
    api.consultCashFlowServiceDebts(dataLocation.transactionId).then(resp => {
      if (resp.cashFlowDebtServiceDTOList.length > 0) {
        setflujoCaja7Rows(resp.cashFlowDebtServiceDTOList.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Description")}>{data.description}</td>
              <td data-label={t("January")}>${currencyData.formatTable(data.january ?? 0)}</td>
              <td data-label={t("February")}>${currencyData.formatTable(data.february ?? 0)}</td>
              <td data-label={t("March")}>${currencyData.formatTable(data.march ?? 0)}</td>
              <td data-label={t("April")}>${currencyData.formatTable(data.april ?? 0)}</td>
              <td data-label={t("May")}>${currencyData.formatTable(data.may ?? 0)}</td>
              <td data-label={t("June")}>${currencyData.formatTable(data.june ?? 0)}</td>
              <td data-label={t("July")}>${currencyData.formatTable(data.july ?? 0)}</td>
              <td data-label={t("August")}>${currencyData.formatTable(data.august ?? 0)}</td>
              <td data-label={t("September")}>${currencyData.formatTable(data.september ?? 0)}</td>
              <td data-label={t("October")}>${currencyData.formatTable(data.october ?? 0)}</td>
              <td data-label={t("November")}>${currencyData.formatTable(data.november ?? 0)}</td>
              <td data-label={t("December")}>${currencyData.formatTable(data.december ?? 0)}</td>
              <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                <Button type="button" color="link" onClick={() => { settituloSet(t("DebtServicing")); updateDataModal(data, "EDEUDAS") }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={() => { settituloSet(t("DebtServicing")); deleteData(data, "DDEUDAS") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setflujoCaja7Rows(
          <tr key={uniq_key()}>
            <td colSpan="13" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    // consultarFlujoCajaCargaTrabajo
    api.queryCashFlowLoadWork(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {

        setcargaTrabajoRows(resp.cashFlowWorkLoad.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Client")}>{data.customer}</td>
              <td data-label={t("ProjectName")}>{data.projectName}</td>
              <td data-label={t("PublicOrganizationPrivateCompany")}>{data.organismType}</td>
              <td data-label={t("ContractAmount")}>${currencyData.formatTable(data?.contractAmount ?? 0)}</td>
              <td data-label={t("PendinAmount")}>${currencyData.formatTable(data?.pendingAmount ?? 0)}</td>
              <td data-label={t("StartExecutionPeriod")}>${currencyData.formatTable(data?.initialPlan ?? 0)}</td>
              <td data-label={t("EndExecutionPeriod")}>${currencyData.formatTable(data?.endPlan ?? 0)}</td>
              <td data-label={t("PercentExecuted")}>{currencyData.formatTable(data.executedPercentage)}%</td>
              <td data-label={t("PercentToExecute")}>{currencyData.formatTable(data.percentageTobeExecuted)}%</td>
              <td data-label={t("ExpectedExecution")}>{currencyData.formatTable(data.expectedExecution)}%</td>
              <td data-label={t("AssignedDomiciledContract")}>{data.contractType}</td>
              <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                <Button type="button" color="link" onClick={() => {
                  updateDataModal(data, "ECARGATRABAJO")
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={() => {
                  deleteData(data, "DCARGATRABAJO")
                }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setcargaTrabajoRows(
          <tr key={uniq_key()}>
            <td colSpan="12" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
  }
  function deleteData(data, tipoData) {
    setTipo(tipoData)
    setDataDelete(data)
    setconfirm_alert(true);
  }
  function updateDataModal(data, tipoData) {
    setTipo(tipoData)
    setdataSet(data)
    if (tipoData == "EDINERO" || tipoData == "EDEUDAS" || tipoData == "EINGREFACTURA" || tipoData == "ECOBRANZA" || tipoData == "EEGRESO") {
      toggleShowModalFlujoCaja(true);
    } else {
      setbotonValidation(true);
      toggleShowModalCargaTrabajo(true);
    }
  }
  function saveData(data, tipo) {
    data.transactId = Number(locationData.transactionId);
    const api = new BackendServices()
    if (tipo != "CARGATRABAJO") {
      data.january = Number(currencyData.getRealValue(data?.january ?? 0))
      data.february = Number(currencyData.getRealValue(data?.february ?? 0))
      data.februray = Number(currencyData.getRealValue(data?.february ?? 0))
      data.march = Number(currencyData.getRealValue(data?.march ?? 0))
      data.april = Number(currencyData.getRealValue(data?.april ?? 0))
      data.may = Number(currencyData.getRealValue(data?.may ?? 0))
      data.june = Number(currencyData.getRealValue(data?.june ?? 0))
      data.july = Number(currencyData.getRealValue(data?.july ?? 0))
      data.august = Number(currencyData.getRealValue(data?.august ?? 0))
      data.september = Number(currencyData.getRealValue(data?.september ?? 0))
      data.october = Number(currencyData.getRealValue(data?.october ?? 0))
      data.november = Number(currencyData.getRealValue(data?.november ?? 0))
      data.december = Number(currencyData.getRealValue(data?.december ?? 0))
    }
    data.status = true;
    /* ---------------------------------------------------------------------------------------------- */
    /*                                  Guardamos los datos del cash                                  */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "DINERO") {
      // nuevoFlujoCajaDollar
      api.newCashFlowDollar(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalFlujoCaja(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                        Guardamos los datos de la deuda nueva del cliente                       */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "DEUDAS") {
      // nuevoFlujoCajaServicioDeudas
      api.newCashFlowServiceDebts(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalFlujoCaja(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*           Se realiza el ingreso de la factura Ingresos por Facturas(no incluye ITBMS)          */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "INGREFACTURA") {
      // nuevoFlujoCajaIngresoFacturacion
      api.newCashFlowRevenueInvoicing(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalFlujoCaja(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                                   Cobranzas(no incluye ITBMS)                                  */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "COBRANZA") {
      // nuevoFlujoCajaCobranzas
      api.newCashFlowCollections(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalFlujoCaja(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                                             Egresos                                            */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "EGRESO") {
      // nuevoFlujoCajaEgresos
      api.newCashFlowExpenses(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalFlujoCaja(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "CARGATRABAJO") {
      let jsonSet = {
        transactId: Number(data?.transactId) ?? 0,
        customer: data?.customer ?? " ",//
        projectName: (data?.projectName) ?? " ",//
        organismType: (data?.organismType) ?? " ",//
        contractAmount: Number(currencyData.getRealValue(data?.contractAmount ?? 0)) ?? 0,
        pendingAmount: Number(currencyData.getRealValue(data?.pendingAmount ?? 0)) ?? 0,
        initialPlan: Number(currencyData.getRealValue(data?.initialPlan ?? 0)) ?? 0,
        endPlan: Number(currencyData.getRealValue(data?.endPlan ?? 0)) ?? 0,
        executedPercentage: Number(data?.executedPercentage) ?? 0,
        percentageTobeExecuted: Number(data?.percentageTobeExecuted) ?? 0,
        expectedExecution: Number(data?.expectedExecution) ?? 0,
        contractType: (data?.contractType) ?? " " //
      }
      // nuevoFlujoCajaCargaTrabajo
      api.newCashFlowLoadWork(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalCargaTrabajo(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
  }
  function updateData(data, tipo) {
    data.transactId = Number(locationData.transactionId);
    const api = new BackendServices()
    if (tipo != "ECARGATRABAJO") {
      data.january = Number(currencyData.getRealValue(data?.january ?? 0))
      data.february = Number(currencyData.getRealValue(data?.february ?? 0))
      data.februray = Number(currencyData.getRealValue(data?.february ?? 0))
      data.march = Number(currencyData.getRealValue(data?.march ?? 0))
      data.april = Number(currencyData.getRealValue(data?.april ?? 0))
      data.may = Number(currencyData.getRealValue(data?.may ?? 0))
      data.june = Number(currencyData.getRealValue(data?.june ?? 0))
      data.july = Number(currencyData.getRealValue(data?.july ?? 0))
      data.august = Number(currencyData.getRealValue(data?.august ?? 0))
      data.september = Number(currencyData.getRealValue(data?.september ?? 0))
      data.october = Number(currencyData.getRealValue(data?.october ?? 0))
      data.november = Number(currencyData.getRealValue(data?.november ?? 0))
      data.december = Number(currencyData.getRealValue(data?.december ?? 0))
    }
    data.status = true;

    /* ---------------------------------------------------------------------------------------------- */
    /*                                    Editita el flujo de caja                                    */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "EDINERO") {
      // actualizarFlujoCajaDollar
      api.updateCashFlowDollar(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalFlujoCaja(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                            Editamos las deudas que otorga el cliente                           */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "EDEUDAS") {
      // actualizarFlujoCajaServicioDeudas
      api.updateCashFlowServiceDebts(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalFlujoCaja(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                        Se edita Ingresos por Facturas(no incluye ITBMS)                        */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "EINGREFACTURA") {
      // actualizarFlujoCajaIngresoFacturacion
      api.updateCashFlowRevenueInvoicing(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalFlujoCaja(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                            Se edita las Cobranzas(no incluye ITBMS)                            */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "ECOBRANZA") {
      // actualizarFlujoCajaCobranzas
      api.updateCashFlowCollections(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalFlujoCaja(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "EEGRESO") {
      // actualizarFlujoCajaEgresos
      api.updateCashFlowEgresses(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalFlujoCaja(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "ECARGATRABAJO") {
      let jsonSet = {
        transactId: Number(data?.transactId) ?? 0,
        cashFlowWorkloadId: Number(data?.cashFlowWorkloadId) ?? 0,
        customer: data?.customer ?? " ",//
        projectName: (data?.projectName) ?? " ",//
        organismType: (data?.organismType) ?? " ",//
        contractAmount: Number(currencyData.getRealValue(data?.contractAmount ?? 0)) ?? 0,
        pendingAmount: Number(currencyData.getRealValue(data?.pendingAmount ?? 0)) ?? 0,
        initialPlan: Number(currencyData.getRealValue(data?.initialPlan ?? 0)) ?? 0,
        endPlan: Number(currencyData.getRealValue(data?.endPlan ?? 0)) ?? 0,
        executedPercentage: Number(data?.executedPercentage) ?? 0,
        percentageTobeExecuted: Number(data?.percentageTobeExecuted) ?? 0,
        expectedExecution: Number(data?.expectedExecution) ?? 0,
        contractType: (data?.contractType) ?? " " //
      }
      jsonSet.status = true;
      // actualizarFlujoCajaCargaTrabajo
      api.updateCashFlowWorkLoad(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalCargaTrabajo(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(() => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalFlujoCaja(estado) {
    setShowModalFlujoCaja(estado);
    removeBodyCss()
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalCargaTrabajo(estado) {
    setShowModalCargaTrabajo(estado);
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
  }
  return (
    <React.Fragment>
      <h5>
        {t("CashFlow")}
      </h5>
      <p className="card-title-desc"></p>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>

        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("InDollars")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setdataSet({
                transactId: 0,
                description: null,
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
              }); setTipo("DINERO"); settituloSet(t("InDollars")); toggleShowModalFlujoCaja(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
        </Row>
        <Row>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("Description")}</th>
                  <th>{t("January")}</th>
                  <th>{t("February")}</th>
                  <th>{t("March")}</th>
                  <th>{t("April")}</th>
                  <th>{t("May")}</th>
                  <th>{t("June")}</th>
                  <th>{t("July")}</th>
                  <th>{t("August")}</th>
                  <th>{t("September")}</th>
                  <th>{t("October")}</th>
                  <th>{t("November")}</th>
                  <th>{t("December")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {flujoCaja1Rows}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col md="6">
            <h5 className="card-sub-title">{t("IncomeInvoicesITBMSNotIncluded")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setdataSet({
                transactId: 0,
                description: null,
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
              }); setTipo("INGREFACTURA"); settituloSet(t("IncomeInvoicesITBMSNotIncluded")); toggleShowModalFlujoCaja(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
        </Row>
        <Row>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("Description")}</th>
                  <th>{t("January")}</th>
                  <th>{t("February")}</th>
                  <th>{t("March")}</th>
                  <th>{t("April")}</th>
                  <th>{t("May")}</th>
                  <th>{t("June")}</th>
                  <th>{t("July")}</th>
                  <th>{t("August")}</th>
                  <th>{t("September")}</th>
                  <th>{t("October")}</th>
                  <th>{t("November")}</th>
                  <th>{t("December")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {flujoCaja2Rows}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col md="6">
            <h5 className="card-sub-title">{t("CollectionsITBMSNotIncluded")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setdataSet({
                transactId: 0,
                description: null,
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
              }); setTipo("COBRANZA"); settituloSet(t("CollectionsITBMSNotIncluded")); toggleShowModalFlujoCaja(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
        </Row>
        <Row>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("Description")}</th>
                  <th>{t("January")}</th>
                  <th>{t("February")}</th>
                  <th>{t("March")}</th>
                  <th>{t("April")}</th>
                  <th>{t("May")}</th>
                  <th>{t("June")}</th>
                  <th>{t("July")}</th>
                  <th>{t("August")}</th>
                  <th>{t("September")}</th>
                  <th>{t("October")}</th>
                  <th>{t("November")}</th>
                  <th>{t("December")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {flujoCaja3Rows}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col md="6">
            <h5 className="card-sub-title">{t("Expenses")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setdataSet({
                transactId: 0,
                description: null,
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
              }); setTipo("EGRESO"); settituloSet(t("Expenses")); toggleShowModalFlujoCaja(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
        </Row>
        <Row>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("Description")}</th>
                  <th>{t("January")}</th>
                  <th>{t("February")}</th>
                  <th>{t("March")}</th>
                  <th>{t("April")}</th>
                  <th>{t("May")}</th>
                  <th>{t("June")}</th>
                  <th>{t("July")}</th>
                  <th>{t("August")}</th>
                  <th>{t("September")}</th>
                  <th>{t("October")}</th>
                  <th>{t("November")}</th>
                  <th>{t("December")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {flujoCaja4Rows}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col md="6">
            <h5 className="card-sub-title">{t("DebtServicing")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setdataSet({
                transactId: 0,
                description: null,
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0
              }); setTipo("DEUDAS"); settituloSet(t("DebtServicing")); toggleShowModalFlujoCaja(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
        </Row>
        <Row>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("Description")}</th>
                  <th>{t("January")}</th>
                  <th>{t("February")}</th>
                  <th>{t("March")}</th>
                  <th>{t("April")}</th>
                  <th>{t("May")}</th>
                  <th>{t("June")}</th>
                  <th>{t("July")}</th>
                  <th>{t("August")}</th>
                  <th>{t("September")}</th>
                  <th>{t("October")}</th>
                  <th>{t("November")}</th>
                  <th>{t("December")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {flujoCaja7Rows}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col md="6">
            <h5 className="card-sub-title">{t("Workload")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setdataSet({
                transactId: null,
                cashFlowWorkloadId: null,
                customer: null,
                projectName: null,
                organismType: null,
                contractAmount: null,
                pendingAmount: null,
                initialPlan: null,
                endPlan: null,
                executedPercentage: null,
                percentageTobeExecuted: null,
                expectedExecution: null,
                contractType: null
              }); setTipo("CARGATRABAJO"); toggleShowModalCargaTrabajo(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
        </Row>
        <Row>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table " >
              <thead>
                <tr>
                  <th>{t("Client")}</th>
                  <th>{t("ProjectName")}</th>
                  <th>{t("PublicOrganizationPrivateCompany")}</th>
                  <th>{t("ContractAmount")}</th>
                  <th>{t("PendinAmount")}</th>
                  <th>{t("StartExecutionPeriod")}</th>
                  <th>{t("EndExecutionPeriod")}</th>
                  <th>{t("PercentExecuted")}</th>
                  <th>{t("PercentToExecute")}</th>
                  <th>{t("ExpectedExecution")}</th>
                  <th>{t("AssignedDomiciledContract")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cargaTrabajoRows}
              </tbody>
            </Table>
          </Col>
        </Row>
      </AvForm>
      {locationData ? (props?.activeTab == 24 ?
        <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_FLUJODECAJA)} />
        : null) : null}

      <ModalFlujoCaja titulo={tituloSet} jsonSow={dataSet} tipo={tipo} updateData={updateData} saveData={saveData} botones={botonValidation} isOpen={showModalFlujoCaja} toggle={() => { toggleShowModalFlujoCaja(false) }} />
      <ModalCargaTrabajo jsonSow={dataSet} tipo={tipo} updateData={updateData} saveData={saveData} botones={botonValidation} isOpen={showModalCargaTrabajo} toggle={() => { toggleShowModalCargaTrabajo(false) }} />
      {successSave_dlg ? (
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
      ) : null}

      {error_dlg ? (
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
            if (tipo == "DDINERO") {
              apiBack.deleteCashFlowDollar({ transactId: dataDelete.transactId, cashFlowDolarId: dataDelete.cashFlowDolarId }).then(resp => {
                if (resp.statusCode == "500") {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  initializeData(locationData);
                }
              }).catch(() => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
            if (tipo == "DDEUDAS") {
              apiBack.eliminateCashFlowServiceDebts({ transactId: dataDelete.transactId, cashFlowDebtServiceId: dataDelete.cashFlowDebtServiceId }).then(resp => {
                if (resp.statusCode == "500") {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  initializeData(locationData);
                }
              }).catch(() => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
            if (tipo == "DINGREFACTURA") {
              apiBack.eliminateCashFlowRevenueInvoicing({ transactId: dataDelete.transactId, cashFlowInvoiceId: dataDelete.cashFlowInvoiceId }).then(resp => {
                if (resp.statusCode == "500") {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  initializeData(locationData);
                }
              }).catch(() => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
            if (tipo == "DCOBRANZA") {
              apiBack.eliminateCashFlowCollections({ transactId: dataDelete.transactId, cashFlowCollectiond: dataDelete.cashFlowCollectiond }).then(resp => {
                if (resp.statusCode == "500") {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  initializeData(locationData);
                }
              }).catch(() => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
            if (tipo == "DEGRESO") {
              apiBack.eliminateCashFlowExpenses({ transactId: dataDelete.transactId, cashFlowOutcomeId: dataDelete.cashFlowOutcomeId }).then(resp => {
                if (resp.statusCode == "500") {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  initializeData(locationData);
                }
              }).catch(() => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
            if (tipo == "DCARGATRABAJO") {
              apiBack.deleteCashFlowWorkLoad({ transactId: dataDelete.transactId, cashFlowWorkloadId: dataDelete.cashFlowWorkloadId }).then(resp => {
                if (resp.statusCode == "500") {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  initializeData(locationData);
                }
              }).catch(() => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
          }}
          onCancel={() => setconfirm_alert(false)}
        >
          {t("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
    </React.Fragment>
  );

});

FlujoCaja.propTypes = {
  locationData: PropTypes.any,
}

export default FlujoCaja;
