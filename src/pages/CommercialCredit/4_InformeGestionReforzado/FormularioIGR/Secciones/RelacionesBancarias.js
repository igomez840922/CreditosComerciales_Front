import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes, { func } from 'prop-types'
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
  CardTitle,
  InputGroup,
  Table,
  CardFooter
} from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
import ModalDeudasCortoPlazo from "./ModalDeudasCortoPlazo"
import ModalDeudasLargoPlazo from "./ModalDeudasLargoPlazo"
import ModalSow from "./ModalSow"
//Import Flatepicker
import moment from "moment";

import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import SweetAlert from "react-bootstrap-sweetalert"
import { BackendServices, CoreServices } from "../../../../../services"
import * as url from "../../../../../helpers/url_helper"
import Currency from "../../../../../helpers/currency"
import ShortLongTermDebts from "../../../../../components/Common/ShortLongTermDebts";
import { uniq_key } from "../../../../../helpers/unq_key"
import LoadingOverlay from "react-loading-overlay"

const estiloTotales = { backgroundColor: "lightgrey", color: "black" }
const RelacionesBancarias = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const location = useLocation()
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmRelacionesBancaria');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
  /* ---------------------------------------------------------------------------------------------- */
  /*                        Variables de estados para los mensajes de alerta                        */
  /* ---------------------------------------------------------------------------------------------- */
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [dataReturn, setdataReturn] = useState(props.dataRelacionesBancarias);
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  /* ---------------------------------------------------------------------------------------------- */
  /*                          Variables de estados generales del componente                         */
  /* ---------------------------------------------------------------------------------------------- */
  const [formValid, setFormValid] = useState(false);
  const [dataDelete, setDataDelete] = useState([]);
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [showModalDeudasCortoPlazo, setShowModalDeudasCortoPlazo] = useState(false);
  const [showModalDeudasLargoPlazo, setShowModalDeudasLargoPlazo] = useState(false);
  const [showModalSow, setShowModalSow] = useState(false);
  const [validationCore, setvalidationCore] = useState(false);
  const [shorttermdebtsRows, setshorttermdebtsRows] = useState(null);
  const [longtermdebtsRows, setlongtermdebtsRows] = useState(null);
  const [sowactualRows, setsowactualRows] = useState(null);
  const [sowproposedRows, setsowproposedRows] = useState(null);
  const [tipo, setTipo] = useState("");
  const currencyData = new Currency();
  const [dataSet, setdataSet] = useState({
    transactId: 0,
    otherBanks: 0,
    banesco: 0,
    total: 0,
    sow: 0
  });
  const [locationData, setLocationData] = useState(null);
  const history = useHistory();
  const [datosUsuario, setdatosUsuario] = useState(null);
  const [coreServices, setcoreServices] = useState(new CoreServices())
  const [backendServices, setbackendServices] = useState(new BackendServices())
  const [sowProposal, setsowProposal] = useState(null);
  const [sowApproved, setsowApproved] = useState(null);
  const [validacion, setvalidacion] = useState(0);

  const [loadDebtsAuto, setloadDebtsAuto] = useState(false);
  const [isActiveLoadingT24, setIsActiveLoadingT24] = useState(false);

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
    setvalidationCore(false)
    setdataReturn(props.dataRelacionesBancarias);
    initializeData(dataSession);

  }, [props.activeTab == 14]);

  // React.useEffect(() => {
  //   if (locationData !== null) {
  //     initializeData(locationData)
  //   }
  // }, [loadDebtsAuto]);

  function loadMainDebtor(transactionId) {
    if (datosUsuario === null) {
      backendServices.consultPrincipalDebtor(transactionId).then(resp => {
        setdatosUsuario(resp)
        loadDebtsT24(resp, transactionId);
      })
    }
  }
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    setFormValid(true)
    // props.onSubmit(values);
  }
  function initializeData(dataSession) {
    // setIsActiveLoading(true)
    loadSowNow(dataSession);
    uploadSowProposed(dataSession);
    loadTablesShortTerm(dataSession);
    loadLongTermTables(dataSession);
    loadMainDebtor(dataSession.transactionId);
  }

  function loadSowNow(dataLocation) {
    const api = new BackendServices()
    // consultarSowActualIGR
    api.consultSowActualIGR(dataLocation.transactionId).then(resp => {
      if (resp == undefined) {

      } else {
        dataReturn.dataTablSowActual = resp.currentSOWDTOList;
        setdataReturn(dataReturn)
        setsowactualRows(resp.currentSOWDTOList.map((data, index) => (
          data.status ?
            <tr key={uniq_key() + "1"}>
              <td data-label={t("OtherBank")}>${currencyData.formatTable(data.otherBanks ?? 0)}</td>
              <td data-label={t("Banesco")}>${currencyData.formatTable(data.banesco ?? 0)}</td>
              <td data-label={t("Total")}>${currencyData.formatTable(data.total ?? 0)}</td>
              <td data-label={t("Sow")}>${currencyData.formatTable(data.sow ?? 0)}</td>
              {props?.activacion ? null :
                <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                  <Button type="button" color="link" onClick={(resp) => { editSowCurrent(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                  <Button type="button" color="link" onClick={(resp) => { deleteSowCurrent(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                </td>}
            </tr> : null
        )
        ));
      }
    });
  }
  function uploadSowProposed(dataLocation) {
    const api = new BackendServices()
    // consultarSowPropuestoIGR
    api.consultSowProposedIGR(dataLocation.transactionId).then(resp => {
      if (resp == undefined) {

      } else {
        if (resp.proposedSOWDTOList.length > 0) {
          dataReturn.dataTablSowPropuesto = resp.proposedSOWDTOList;
          setdataReturn(dataReturn)
          setsowproposedRows(resp.proposedSOWDTOList.map((data, index) => (
            data.status ?
              <tr key={uniq_key() + "2"}>
                <td data-label={t("OtherBank")}>${currencyData.formatTable(parseFloat(data.otherBanks ?? 0).toFixed(2))}</td>
                <td data-label={t("Banesco")}>${currencyData.formatTable(parseFloat(data.banesco ?? 0).toFixed(2))}</td>
                <td data-label={t("Total")}>${currencyData.formatTable(parseFloat(data.total ?? 0).toFixed(2))}</td>
                <td data-label={t("Sow")}>{currencyData.formatTable(parseFloat(data.sow ?? 0).toFixed(2))}%</td>
                <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                  {props?.activacion ? null :
                    <Button type="button" color="link" onClick={(resp) => { editSowProposed(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                  }
                </td>
              </tr> : null
          )
          ));
        } else {
          setsowproposedRows(null)
        }
      }
    });
  }
  async function loadTablesShortTerm(dataLocation) {
    setIsActiveLoading(true)

    // consultarRelacionesBancariasDeudasCP
    let checkCP = false;
    await backendServices.consultBankingRelationsDebtsCP(dataLocation?.transactionId ?? locationData?.transactionId ?? 0).then(async resp => {
      dataReturn.sumatoriaDeudaCorto = { monto: 0, saldo1: 0, saldo2: 0, saldo3: 0 }
      //dataReturn.dataTablDeudaCorto = resp.getBankingRelationCPDTOList;
      dataReturn.dataTablDeudaCorto = resp.getBankingRelationCPDTOList.filter((element) => {
        return element.status === true;
      })
      // if (!props?.activacion && !validationCore) {
      //   setvalidationCore(true)
      //   setIsActiveLoadingT24(true)
      //   await coreServices.getAllTermDebtsByTransaction(dataLocation?.transactionId ?? locationData?.transactionId ?? 0).then(async dataResult => {
      //     dataReturn.dataTablDeudaCorto = resp.getBankingRelationCPDTOList.filter((element) => {
      //       return element.t24 === false;
      //     })
      //     for (var short of dataResult.shortTermresult) {
      //       dataReturn.dataTablDeudaCorto.push({
      //         "facilityType": short.facilityType,
      //         "amount": Number(short.approvedAmount.toFixed(2)),
      //         "date": short.startDate,
      //         "expirationDate": short.endDate,
      //         "debitBalance1": Number(short.balance.toFixed(2)),
      //         "debitBalance2": 0,
      //         "debitBalance3": 0,
      //         "paymentHistory": short.paymentHistory,
      //         "rate": 0,
      //         "fee": 0,
      //         "bail": 0,
      //         "fundDestiny": "",
      //         status: true,
      //         t24: dataSet?.t24 ?? false,
      //         "bank": short.bank,
      //         "transactId": Number(dataLocation?.transactionId ?? locationData?.transactionId ?? 0)
      //       })
      //     }
      //     console.log("fase4",dataResult);

      //     setIsActiveLoadingT24(false)
      //   }).catch(error => {
      //     setIsActiveLoadingT24(false)

      //   })

      // } else {
      // }
      setIsActiveLoading(false)
      dataReturn.sumatoriaDeudaCorto.monto = (dataReturn.dataTablDeudaCorto.reduce((total, currentValue) => total + Number(currentValue.amount), 0));
      dataReturn.sumatoriaDeudaCorto.saldo1 = (dataReturn.dataTablDeudaCorto.reduce((total, currentValue) => total + Number(currentValue.debitBalance1), 0));
      dataReturn.sumatoriaDeudaCorto.saldo2 = (dataReturn.dataTablDeudaCorto.reduce((total, currentValue) => total + Number(currentValue.debitBalance2), 0));
      dataReturn.sumatoriaDeudaCorto.saldo3 = (dataReturn.dataTablDeudaCorto.reduce((total, currentValue) => total + Number(currentValue.debitBalance3), 0));
      console.log("dataReturn.dataTablDeudaCorto", dataReturn.dataTablDeudaCorto);
      setdataReturn(dataReturn)
      calculateSowData(dataReturn);
      setshorttermdebtsRows(drawShortTerm(dataReturn.dataTablDeudaCorto));
    }).catch(err => {
      setIsActiveLoading(false)
    });
  }

  function drawShortTerm(shortTerm) {
    return shortTerm.map((data, index) => (
      data.status ?
        <tr key={uniq_key() + "3"}>
          <td>{data?.bank !== null && data?.bank !== undefined ? data?.bank : ""}</td>
          <td>{data?.facilityType ?? data?.facilityTypeId}</td>
          <td>${currencyData?.formatTable((data?.amount ?? 0).toFixed(2))}</td>
          <td>{formatDate(data?.date)}</td>
          <td>{formatDate(data?.expirationDate)}</td>
          <td>${currencyData.formatTable((data?.debitBalance1 ?? 0).toFixed(2))}</td>
          <td>${currencyData.formatTable((data?.debitBalance2 ?? 0).toFixed(2))}</td>
          <td>${currencyData.formatTable((data?.debitBalance3 ?? 0).toFixed(2))}</td>
          <td>{data?.paymentHistory ?? ""}</td>
          <td>{currencyData.formatTable(data?.rate)}%</td>
          <td>{data?.bail}</td>
          <td>{data?.fee}</td>
          <td>{data?.fundDestiny}</td>
          {props?.activacion ? null :
            <td style={{ textAlign: "right", display: "flex" }}>
              <Button type="button" color="link" onClick={(resp) => { editShortTerm(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { removeShortTerm(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>}
        </tr> : null
    )
    )
  }
  // function cerrarModal() {
  //   setShowModelAttachment(false);
  //   removeBodyCss()
  // }
  // function abrirModal() {
  //   setShowModelAttachment(true);
  //   removeBodyCss()
  // }
  async function loadLongTermTables(dataLocation) {
    console.log("fase1", dataLocation);

    // consultarRelacionesBancariasDeudasLP
    await backendServices.consultBankRelationsDebtsLP(dataLocation?.transactionId ?? locationData?.transactionId ?? 0).then(async resp => {
      console.log("fase2");

      dataReturn.sumatoriaDeudaLargo = { monto: 0, saldo1: 0, saldo2: 0, saldo3: 0 }
      //dataReturn.dataTablDeudaLargo = resp.bankingRelationLPDTOList;

      dataReturn.dataTablDeudaLargo = resp.bankingRelationLPDTOList.filter((element) => {
        console.log("fase3");
        return element.status === true;
      })
      // if (!props?.activacion && !validationCore) {
      //   setvalidationCore(true)
      //   setIsActiveLoadingT24(true)
      //   await coreServices.getAllTermDebtsByTransaction(dataLocation?.transactionId ?? locationData?.transactionId ?? 0).then(async dataResult => {
      //     dataReturn.dataTablDeudaLargo = resp.getBankingRelationCPDTOList.filter((element) => {
      //       return element.t24 === false;
      //     })
      //     for (var short of dataResult.longTermresult) {
      //       dataReturn.dataTablDeudaLargo.push({
      //         "facilityType": short.facilityType,
      //         "amount": Number(short.approvedAmount.toFixed(2)),
      //         "date": short.startDate,
      //         "expirationDate": short.endDate,
      //         "debitBalance1": Number(short.balance.toFixed(2)),
      //         "debitBalance2": 0,
      //         "debitBalance3": 0,
      //         "paymentHistory": short.paymentHistory,
      //         "rate": 0,
      //         "fee": 0,
      //         "bail": 0,
      //         "fundDestiny": "",
      //         status: true,
      //         t24: dataSet?.t24 ?? false,
      //         "bank": short.bank,
      //         "transactId": Number(dataLocation?.transactionId ?? locationData?.transactionId ?? 0)
      //       })
      //     }
      //     setIsActiveLoadingT24(false)

      //   }).catch(error => {
      //     setIsActiveLoadingT24(false)
      //   })
      // } else {
      setIsActiveLoading(false)
      // }
      dataReturn.sumatoriaDeudaLargo.monto = (dataReturn.dataTablDeudaLargo.reduce((total, currentValue) => total + Number(currentValue.amount), 0));
      dataReturn.sumatoriaDeudaLargo.saldo1 = (dataReturn.dataTablDeudaLargo.reduce((total, currentValue) => total + Number(currentValue.debitBalance1), 0));
      dataReturn.sumatoriaDeudaLargo.saldo2 = (dataReturn.dataTablDeudaLargo.reduce((total, currentValue) => total + Number(currentValue.debitBalance2), 0));
      dataReturn.sumatoriaDeudaLargo.saldo3 = (dataReturn.dataTablDeudaLargo.reduce((total, currentValue) => total + Number(currentValue.debitBalance3), 0));

      setdataReturn(dataReturn);
      calculateSowData(dataReturn);
      setlongtermdebtsRows(drawLongTerm(dataReturn.dataTablDeudaLargo));
    }).catch(err => {
      setIsActiveLoading(false)
    });
  }

  function drawLongTerm(longTerm) {
    return longTerm.map((data, index) => (
      data.status ?
        <tr key={uniq_key() + "4"}>
          <td>{data?.bank !== null && data?.bank !== undefined ? data?.bank : ""}</td>
          <td>{data?.facilityType ?? data?.facilityTypeId}</td>
          <td>${currencyData?.formatTable((data?.amount ?? 0).toFixed(2))}</td>
          <td>{formatDate(data?.date)}</td>
          <td>{formatDate(data?.expirationDate)}</td>
          <td>${currencyData.formatTable((data?.debitBalance1 ?? 0).toFixed(2))}</td>
          <td>${currencyData.formatTable((data?.debitBalance2 ?? 0).toFixed(2))}</td>
          <td>${currencyData.formatTable((data?.debitBalance3 ?? 0).toFixed(2))}</td>
          <td>{data?.paymentHistory ?? ""}</td>
          <td>{currencyData.formatTable(data?.rate)}%</td>
          <td>{data?.bail}</td>
          <td>{currencyData?.formatTable(data?.fee ?? 0)}</td>
          <td>{data?.fundDestiny}</td>
          {props?.activacion ? null :
            <td style={{ textAlign: "right" }}>
              <Button type="button" color="link" onClick={(resp) => { editLongTerm(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { removeLongTerm(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>}
        </tr> : null
    )
    )
  }
  function formatDate(date) {
    return !date ? '' : moment(date).format("DD/MM/YYYY");
  }
  /* ---------------------------------------------------------------------------------------------- */
  /*                           Funciones para los Snow actual y propuesto                           */
  /* ---------------------------------------------------------------------------------------------- */
  function saveData(data, tipo) {
    data.transactId = locationData.transactionId;
    const api = new BackendServices()
    if (tipo == "Actual") {
      // nuevoSowActualIGR
      let datoJson = {
        transactId: Number(data?.transactId) ?? 0,
        otherBanks: Number(currencyData.getRealValue(data?.otherBanks)) ?? 0,
        banesco: Number(currencyData.getRealValue(data?.banesco)) ?? 0,
        total: Number(currencyData.getRealValue(data?.total)) ?? 0,
        sow: Number(currencyData.getRealValue(data?.sow)) ?? 0
      }
      api.newSowCurrentIGR(datoJson).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalSow(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "Propuesto") {
      // nuevoSowPropuestoIGR
      let datoJson = {
        transactId: Number(data?.transactId) ?? 0,
        otherBanks: Number(currencyData.getRealValue(data?.otherBanks)) ?? 0,
        banesco: Number(currencyData.getRealValue(data?.banesco)) ?? 0,
        total: Number(currencyData.getRealValue(data?.total)) ?? 0,
        sow: Number(currencyData.getRealValue(data?.sow)) ?? 0
      }
      api.newSowProposedIGR(datoJson).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalSow(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "CP") {
      let datos = {
        "facilityType": data?.facilityType ?? data?.facilityTypeId ?? " ",
        "amount": Number(currencyData.getRealValue(data?.amount)) ?? 0,
        "date": data?.date ?? "",
        "expirationDate": data?.expirationDate == "" || data?.expirationDate == null || data?.expirationDate == undefined ? "" : data?.expirationDate,
        "debitBalance1": Number(currencyData.getRealValue(data?.debitBalance1)) ?? 0,
        "debitBalance2": Number(currencyData.getRealValue(data?.debitBalance2)) ?? 0,
        "debitBalance3": Number(currencyData.getRealValue(data?.debitBalance3)) ?? 0,
        "paymentHistory": data?.paymentHistory ?? "",
        "rate": Number(data?.rate) ?? 0,
        "fee": Number(currencyData.getRealValue(data?.fee)) ?? 0,
        "bail": data.bail ?? " ",
        t24: dataSet?.t24 ?? false,
        "fundDestiny": data.fundDestiny ?? " ",
        "bank": data.bank ?? " ",
        "codigot24": "",
        "fechat24":  moment().format("YYYY-MM-DD"),
        "transactId": Number(data?.transactId) ?? 0
      }
      // nuevoRelacionesBancariasDeudasCP
      api.newBankingRelationsDebtsCP(datos).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalDeudasCortoPlazo(false)
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "CL") {
      let datos = {
        "facilityType": data?.facilityType ?? " ",
        "amount": Number(currencyData.getRealValue(data?.amount)) ?? 0,
        "date": data?.date ?? "",
        "expirationDate": data?.expirationDate == "" || data?.expirationDate == null || data?.expirationDate == undefined ? "" : data?.expirationDate,
        "debitBalance1": Number(currencyData.getRealValue(data?.debitBalance1)) ?? 0,
        "debitBalance2": Number(currencyData.getRealValue(data?.debitBalance2)) ?? 0,
        "debitBalance3": Number(currencyData.getRealValue(data?.debitBalance3)) ?? 0,
        "paymentHistory": data?.paymentHistory ?? "",
        "rate": Number(data?.rate) ?? 0,
        "fee": Number(currencyData.getRealValue(data?.fee)) ?? 0,
        "bail": data?.bail ?? " ",
        t24: dataSet?.t24 ?? false,
        "fundDestiny": data?.fundDestiny ?? " ",
        "bank": data?.bank ?? " ",
        "codigot24": "",
        "fechat24":  moment().format("YYYY-MM-DD"),
        "transactId": Number(data?.transactId) ?? 0
      }
      // nuevoRelacionesBancariasDeudasLP
      api.newBankingRelationsDebtsLP(datos).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalDeudasLargoPlazo(false)
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
  function updateData(data, tipo) {
    data.transactId = locationData?.transactionId;
    const api = new BackendServices()
    if (tipo == "EditarActual") {
      // actualizarSowActualIGR
      let jsonSow = {
        transactId: Number(data?.transactId) ?? 0,
        currentSowId: Number(currencyData.getRealValue(data?.currentSowId)) ?? 0,
        otherBanks: Number(currencyData.getRealValue(data?.otherBanks)) ?? 0,
        banesco: Number(currencyData.getRealValue(data?.banesco)) ?? 0,
        total: Number(currencyData.getRealValue(data?.total)) ?? 0,
        sow: Number(currencyData.getRealValue(data?.sow)) ?? 0,
        status: true
      }
      api.updateSowActualIGR(jsonSow).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalSow(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "EditarPropuesto") {
      // actualizarSowPropuestoIGR
      let datoJson = {
        transactId: Number(data?.transactId) ?? 0,
        otherBanks: Number(currencyData.getRealValue(data?.otherBanks)) ?? 0,
        total: Number(currencyData.getRealValue(data?.total)) ?? 0,
        sow: Number(currencyData.getRealValue(data?.sow)) ?? 0,
        status: true
      }
      console.log(("fase1"));
      api.consultSowProposedIGR(locationData?.transactionId).then(resp => {
        console.log(("fase2"));
        if (resp != undefined) {
          console.log(("fase3"));
          if (resp.proposedSOWDTOList.length > 0) {
            console.log(("fase4"));
            //update
            datoJson.currentSowId = resp.proposedSOWDTOList[0].currentSowId;
            datoJson.banesco = data.banesco == null ? resp.proposedSOWDTOList[0].banesco : (Number(currencyData.getRealValue(data?.banesco)) ?? 0);
            api.updateSowProposedIGR(datoJson).then(resp => {
              if (resp != undefined) {
                initializeData(locationData);
                toggleShowModalSow(false);
              }
            })
          } else {
            console.log(("fase5"));
            //save
            datoJson.banesco = (Number(currencyData.getRealValue(data?.banesco)) ?? 0)
            api.newSowProposedIGR(datoJson).then(resp => {
              if (resp != undefined) {
                initializeData(locationData);
                toggleShowModalSow(false);
              }
            })
          }
        } else {
          console.log(("fase6"));

        }
      });

    }
    if (tipo == "ECP") {
      ////console.log("ECP", data);
      let datos = {
        "facilityType": data?.facilityType ?? "",
        "amount": Number(currencyData.getRealValue(data?.amount)) ?? 0,
        "date": data?.date ?? "",
        "expirationDate": data?.expirationDate == "" || data?.expirationDate == null || data?.expirationDate == undefined ? "" : data?.expirationDate,
        "debitBalance1": Number(currencyData.getRealValue(data?.debitBalance1)) ?? 0,
        "debitBalance2": Number(currencyData.getRealValue(data?.debitBalance2)) ?? 0,
        "debitBalance3": Number(currencyData.getRealValue(data?.debitBalance3)) ?? 0,
        "paymentHistory": data?.paymentHistory ?? "",
        "rate": Number(data?.rate) ?? 0,
        "fee": Number(currencyData.getRealValue(data?.fee)) ?? 0,
        "bail": data?.bail ?? "",
        "fundDestiny": data?.fundDestiny ?? "",
        "bank": data?.bank ?? "",
        "codigot24": "",
        "fechat24":  moment().format("YYYY-MM-DD"),
        "transactId": Number(data?.transactId) ?? 0,
        "debtId": data?.debtId ?? 0,
        "status": true,
        t24: dataSet?.t24 ?? false,
      }
      // actualizarRelacionesBancariasDeudasCP
      api.updateBankRelationsDebtsCP(datos).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalDeudasCortoPlazo(false)
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "ECL") {
      ////console.log("ECL", data);

      let datos = {
        "facilityType": data?.facilityType ?? "",
        "amount": Number(currencyData.getRealValue(data?.amount)) ?? 0,
        "date": data?.date ?? "",
        "expirationDate": data?.expirationDate == "" || data?.expirationDate == null || data?.expirationDate == undefined ? "" : data?.expirationDate,
        "debitBalance1": Number(currencyData.getRealValue(data?.debitBalance1)) ?? 0,
        "debitBalance2": Number(currencyData.getRealValue(data?.debitBalance2)) ?? 0,
        "debitBalance3": Number(currencyData.getRealValue(data?.debitBalance3)) ?? 0,
        "paymentHistory": data?.paymentHistory ?? "",
        "rate": Number(data?.rate) ?? 0,
        "fee": Number(currencyData.getRealValue(data?.fee)) ?? 0,
        "bail": data?.bail ?? "",
        "fundDestiny": data?.fundDestiny ?? "",
        "bank": data?.bank ?? "",
        "codigot24": "",
        "fechat24":  moment().format("YYYY-MM-DD"),
        "transactId": Number(data?.transactId) ?? 0,
        "debtId": data?.debtId ?? "",
        "status": true,
        t24: dataSet?.t24 ?? false,
      }
      // actualizarRelacionesBancariasDeudasLP
      api.updateBankRelationsDebtsLP(datos).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalDeudasLargoPlazo(false)
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
  function removeSowProposed(data) {
    setTipo("Propuesto");
    setDataDelete(data)
    setconfirm_alert(true);
  }
  // Sow Actual validaciones
  function editSowCurrent(data) {
    // setjsonClientes(data)
    setdataSet(data);
    setTipo("EditarActual");
    setbotonValidation(true);
    toggleShowModalSow(true);
  }
  function editShortTerm(data) {
    // setjsonClientes(data)
    setdataSet(data);
    setTipo("ECP");
    setbotonValidation(true);
    toggleShowModalDeudasCortoPlazo(true);
  }
  function editLongTerm(data) {
    // setjsonClientes(data)
    setdataSet(data);
    setTipo("ECL");
    setbotonValidation(true);
    toggleShowModalDeudasLargoPlazo(true);
  }
  function editSowProposed(data) {
    // setjsonClientes(data)
    setdataSet(data);
    setbotonValidation(true);
    setTipo("EditarPropuesto");
    toggleShowModalSow(true);
  }
  function deleteSowCurrent(data) {
    setTipo("Actual");
    setDataDelete(data)
    setconfirm_alert(true);
  }
  /* ---------------------------------------------------------------------------------------------- */
  /*                        Funciones para las cuentas a corto y largo plazo                        */
  /* ---------------------------------------------------------------------------------------------- */
  // Ventana de corto plazo validaciones
  function removeShortTerm(data) {
    setTipo("DCP");
    setDataDelete(data)
    setconfirm_alert(true);
  }
  // Ventana de largo plazo validaciones
  function removeLongTerm(data) {
    setTipo("DCL");
    setDataDelete(data)
    setconfirm_alert(true);
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalDeudasCortoPlazo(estado) {
    setShowModalDeudasCortoPlazo(estado);
    removeBodyCss()
  }
  function toggleShowModalDeudasLargoPlazo(estado) {
    setShowModalDeudasLargoPlazo(estado);
    removeBodyCss()
  }
  function toggleShowModalSow(estado) {
    setShowModalSow(estado);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  //carga las deudas de T24 de APC
  async function loadDebtsT24(debtor, transactionId) {
    if (props?.activacion) {
      setIsActiveLoading(false)
      return
    }
    setIsActiveLoading(true)
    var data = await backendServices.consultBankingRelationsDebtsCP(transactionId);
    var element = data.getBankingRelationCPDTOList.find((element) => {
      setIsActiveLoading(false)
      return element.status === true;
    })
    if (element !== undefined && element !== null) {
      setIsActiveLoading(false)
      return;
    }
    data = await backendServices.consultBankRelationsDebtsLP(transactionId);
    var element = data.bankingRelationLPDTOList.find((element) => {
      setIsActiveLoading(false)
      return element.status === true;
    })
    if (element !== undefined && element !== null) {
      setIsActiveLoading(false)
      return;
    }

    setIsActiveLoading(false)

    /*
    // var result = await coreServices.getAllTermDebts(debtor.customerNumberT24, debtor.clientDocId, debtor.idType).then(async result => {
    var result = await coreServices.getAllTermDebtsByTransaction(transactionId).then(async result => {
      setIsActiveLoading(false)
  
  
      if (result !== null && result !== undefined) {
        let shortTerm = [];
        for (var short of result.shortTermresult) {
          var dat = {
            "facilityType": short.facilityType,
            "amount": Number(short.approvedAmount.toFixed(2)),
            "date": short.startDate,
            "expirationDate": short.endDate,
            "debitBalance1": Number(short.balance.toFixed(2)),
            "debitBalance2": 0,
            "debitBalance3": 0,
            "rate": 0,
            "fee": 0,
            "bail": 0,
            "fundDestiny": "",
            status: true,
            "bank": short.bank,
            "transactId": Number(transactionId)
          }
          await backendServices.newBankingRelationsDebtsCP(dat)
        }
  
        let longTerm = [];
        for (var long of result.longTermresult) {
          var dat1 = {
            "transactId": Number(transactionId),
            "bank": long.bank,
            "facilityType": long.facilityType,
            "amount": Number(long.approvedAmount.toFixed(2)),
            "date": long.startDate,
            "expirationDate": long.endDate,
            "debitBalance1": Number(long.balance.toFixed(2)),
            "debitBalance2": 0,
            "debitBalance3": 0,
            "rate": 0,
            "fee": 0,
            "bail": " ",
            "fundDestiny": " ",
            status: true,
          }
          await backendServices.newBankingRelationsDebtsLP(dat1)
        }
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
        // initializeData(dataSession);
  
        loadSowNow(dataSession);
        uploadSowProposed(dataSession);
        loadTablesShortTerm(dataSession);
        loadLongTermTables(dataSession);
  
        setIsActiveLoading(false)
        // setloadDebtsAuto(!loadDebtsAuto);
      } else {
        setIsActiveLoading(false)
  
      }
    }).catch(err => { setIsActiveLoading(false) });
  
    */
  }

  function calculateSowData(dataReturn) {

    var sowApproved = { otherBank: 0, banesco: 0, total: 0, sow: 0 }
    var sowProposal = { otherBank: 0, banesco: 0, total: 0, sow: 0 }

    sowApproved.otherBank = 0;
    sowApproved.banesco = 0;

    sowProposal.otherBank = 0;
    sowProposal.banesco = 0;

    if (dataReturn.dataTablDeudaCorto !== null) {
      for (var short of dataReturn.dataTablDeudaCorto) {

        if (short.bank.toLowerCase().indexOf('banesco') >= 0) {

          if (short.facilityType.toLowerCase().indexOf('créd') >= 0 || short.facilityType.toLowerCase().indexOf('cred') >= 0 || short.facilityType.toLowerCase().indexOf('tdc') >= 0 || short.facilityType.toLowerCase().indexOf('tarj') >= 0 || short.facilityType.toLowerCase().indexOf('sobregiro') >= 0 || short.facilityType.toLowerCase().indexOf('sobregiros') >= 0 || short.facilityType.toLowerCase().indexOf('lc') >= 0 || short.facilityType.toLowerCase().indexOf('l.') >= 0 || short.facilityType.toLowerCase().indexOf('linea') >= 0 || short.facilityType.toLowerCase().indexOf('línea') >= 0) {
            console.log("linea short", short.facilityType)
            sowApproved.banesco += Number(short.amount)
            sowProposal.banesco += Number(short.amount)
          }
          else if (short.facilityType.toLowerCase().indexOf('nueva') >= 0 || short.facilityType.toLowerCase().indexOf('nuevo') >= 0) {
            sowProposal.banesco += Number(short.amount)
          }
          else {
            sowApproved.banesco += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
            sowProposal.banesco += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
          }
        }
        else {
          if (short.facilityType.toLowerCase().indexOf('créd') >= 0 || short.facilityType.toLowerCase().indexOf('cred') >= 0 || short.facilityType.toLowerCase().indexOf('tdc') >= 0 || short.facilityType.toLowerCase().indexOf('tarj') >= 0 || short.facilityType.toLowerCase().indexOf('sobregiro') >= 0 || short.facilityType.toLowerCase().indexOf('sobregiros') >= 0 || short.facilityType.toLowerCase().indexOf('lc') >= 0 || short.facilityType.toLowerCase().indexOf('l.') >= 0 || short.facilityType.toLowerCase().indexOf('linea') >= 0 || short.facilityType.toLowerCase().indexOf('línea') >= 0) {
            sowApproved.otherBank += Number(short.amount)
            sowProposal.otherBank += Number(short.amount)
          }
          else if (short.facilityType.toLowerCase().indexOf('nueva') >= 0 || short.facilityType.toLowerCase().indexOf('nuevo') >= 0) {
            sowProposal.otherBank += Number(short.amount)
          }
          else {
            sowApproved.otherBank += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
            sowProposal.otherBank += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
          }
          //sowApproved.otherBank += Number(short.amount)
          //sowProposal.otherBank += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
        }
      }
    }
    if (dataReturn.dataTablDeudaLargo !== null) {
      for (var long of dataReturn.dataTablDeudaLargo) {

        if (long.bank.toLowerCase().indexOf('banesco') >= 0) {

          if (long.facilityType.toLowerCase().indexOf('créd') >= 0 || long.facilityType.toLowerCase().indexOf('cred') >= 0 || long.facilityType.toLowerCase().indexOf('tdc') >= 0 || long.facilityType.toLowerCase().indexOf('tarj') >= 0 || long.facilityType.toLowerCase().indexOf('sobregiro') >= 0 || long.facilityType.toLowerCase().indexOf('sobregiros') >= 0 || long.facilityType.toLowerCase().indexOf('lc') >= 0 || long.facilityType.toLowerCase().indexOf('l.') >= 0 || long.facilityType.toLowerCase().indexOf('linea') >= 0 || long.facilityType.toLowerCase().indexOf('línea') >= 0) {
            console.log("linea long", long.facilityType)
            sowApproved.banesco += Number(long.amount)
            sowProposal.banesco += Number(long.amount)
          }
          else if (long.facilityType.toLowerCase().indexOf('nueva') >= 0 || long.facilityType.toLowerCase().indexOf('nuevo') >= 0) {
            sowProposal.banesco += Number(long.amount)
          }
          else {
            sowApproved.banesco += Number(long.debitBalance1) + Number(long.debitBalance2) + Number(long.debitBalance3)
            sowProposal.banesco += Number(long.debitBalance1) + Number(long.debitBalance2) + Number(long.debitBalance3)
          }
        }
        else {
          if (long.facilityType.toLowerCase().indexOf('créd') >= 0 || long.facilityType.toLowerCase().indexOf('cred') >= 0 || long.facilityType.toLowerCase().indexOf('tdc') >= 0 || long.facilityType.toLowerCase().indexOf('tarj') >= 0 || long.facilityType.toLowerCase().indexOf('sobregiro') >= 0 || long.facilityType.toLowerCase().indexOf('sobregiros') >= 0 || long.facilityType.toLowerCase().indexOf('lc') >= 0 || long.facilityType.toLowerCase().indexOf('l.') >= 0 || long.facilityType.toLowerCase().indexOf('linea') >= 0 || long.facilityType.toLowerCase().indexOf('línea') >= 0) {
            sowApproved.otherBank += Number(long.amount)
            sowProposal.otherBank += Number(long.amount)
          }
          else if (long.facilityType.toLowerCase().indexOf('nueva') >= 0 || long.facilityType.toLowerCase().indexOf('nuevo') >= 0) {
            sowProposal.otherBank += Number(long.amount)
          }
          else {
            sowApproved.otherBank += Number(long.debitBalance1) + Number(long.debitBalance2) + Number(long.debitBalance3)
            sowProposal.otherBank += Number(long.debitBalance1) + Number(long.debitBalance2) + Number(long.debitBalance3)
          }
          //sowApproved.otherBank += Number(short.amount)
          //sowProposal.otherBank += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
        }
      }
    }

    sowApproved.total = sowApproved.banesco + sowApproved.otherBank;
    sowProposal.total = sowProposal.banesco + sowProposal.otherBank;

    sowApproved.sow = sowApproved.total > 0 ? Number(sowApproved.banesco / sowApproved.total * 100) : 0;
    sowProposal.sow = sowProposal.total > 0 ? Number(sowProposal.banesco / sowProposal.total * 100) : 0;

    setsowApproved(sowApproved);
    setsowProposal(sowProposal);
    //Aqui consultar si hay datos en sow de BDD para guardar por primera vez
    let datoJson = {
      otherBanks: sowProposal.otherBank,
      banesco: null,
      total: sowProposal.total,
      sow: sowProposal.sow,
      status: true
    }
    // if (validacion == 0) {
    //   api.consultSowProposedIGR(locationData?.transactionId).then(resp => {
    //     if (resp != undefined) {
    //       if (resp.proposedSOWDTOList.length == 0) {
    //         console.log("CUANDO SE ACTUALIZA LA TABLA");
    //         updateData(datoJson, "EditarPropuesto")
    //         setvalidacion(() => { return 1 });
    //       }
    //     } else {
    //       console.log("CUANDO SE ACTUALIZA LA TABLA");
    //       updateData(datoJson, "EditarPropuesto")
    //       setvalidacion(() => { return 1 });
    //     }
    //   })
    // }
  }


  return (
    <React.Fragment>
      {/* <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}> */}

      <h5 className="card-title">{t("CurrentBankingRelations")}</h5>
      <p className="card-title-desc"></p>


      <Row>
        <Col md="6">
          <h5 className="card-sub-title">{t("ShortTermDebts")}</h5>
        </Col>
        {props?.activacion ? null :
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setTipo("CP"); setbotonValidation(true); setdataSet({
                transactId: 0,
                bank: null,
                facilityType: null,
                amount: 0,
                date: null,
                expirationDate: null,
                debitBalance1: 0,
                debitBalance2: 0,
                debitBalance3: 0,
                paymentHistory: "",
                rate: 0,
                fee: 0,
                bail: null,
                destinationOfFunds: null
              }); toggleShowModalDeudasCortoPlazo(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>}
      </Row>
      {/* <LoadingOverlay active={isActiveLoading || isActiveLoadingT24} spinner text={t("WaitingPlease")}> */}

      <div className="table-responsive styled-table-div">

        <Table className="table table-striped table-hover styled-table table" >
          <thead  >
            <tr>
              <th>{t("Bank")}</th>
              <th>{t("FacilityType")}</th>
              <th>{t("ApprovedAmount")}</th>
              <th>{t("GrantDate")}</th>
              <th>{t("DueDate")}</th>
              <th>{t("Debit") + " " + t("CurrentYear")}</th>
              <th> {t("Debit") + " 1 " + t("YearAgo")}</th>
              <th> {t("Debit") + " 2 " + t("YearAgo")}</th>
              <th>{t("PaymentHistory")}</th>
              <th>{t("Rate")}</th>
              <th>{t("Surety")}</th>
              <th>{t("Term of the Promissory Notes (days)")}</th>
              <th>{t("DestinationOfFunds")}</th>
              <th style={{ textAlign: "right" }}>{" "}</th>
            </tr>
          </thead>
          <tbody>
            {shorttermdebtsRows}
            <tr>
              <th>{t("Total")}</th>
              <th></th>
              <th>${currencyData.formatTable(((dataReturn?.sumatoriaDeudaCorto?.monto ?? 0)).toFixed(2))}</th>
              <th></th>
              <th></th>
              <th>${currencyData.formatTable(((dataReturn?.sumatoriaDeudaCorto?.saldo1 ?? 0)).toFixed(2))}</th>
              <th>${currencyData.formatTable(parseFloat(dataReturn?.sumatoriaDeudaCorto?.saldo2 ?? 0).toFixed(2))}</th>
              <th>${currencyData.formatTable(parseFloat(dataReturn?.sumatoriaDeudaCorto?.saldo3 ?? 0).toFixed(2))}</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </tbody>
        </Table>
      </div>
      <h5 className="card-sub-title">{""}</h5>

      <Row>
        <Col md="6">
          <h5 className="card-sub-title">{t("LongTermDebts")}</h5>
        </Col>
        {props?.activacion ? null :
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setTipo("CL"); setbotonValidation(true); setdataSet({
                transactId: 0,
                bank: null,
                facilityType: null,
                amount: 0,
                date: null,
                expirationDate: null,
                debitBalance1: 0,
                debitBalance2: 0,
                debitBalance3: 0,
                paymentHistory: "",
                rate: 0,
                fee: 0,
                bail: null,
                destinationOfFunds: null
              }); toggleShowModalDeudasLargoPlazo(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>}
      </Row>
      <div className="table-responsive styled-table-div">
        <Table className="table table-striped table-hover styled-table table" >
          <thead>
            <tr>
              <th>{t("Bank")}</th>
              <th>{t("FacilityType")}</th>
              <th>{t("ApprovedAmount")}</th>
              <th>{t("GrantDate")}</th>
              <th>{t("DueDate")}</th>
              <th>{t("Debit") + " " + t("CurrentYear")}</th>
              <th> {t("Debit") + " 1 " + t("YearAgo")}</th>
              <th> {t("Debit") + " 2 " + t("YearAgo")}</th>
              <th>{t("PaymentHistory")}</th>
              <th>{t("Rate")}</th>
              <th>{t("Surety")}</th>
              <th>{t("Quotes")}</th>
              <th>{t("DestinationOfFunds")}</th>
              <th style={{ textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>

            {longtermdebtsRows}
            <tr>
              <th>{t("Total")}</th>
              <th></th>
              <th>${currencyData.formatTable(((dataReturn?.sumatoriaDeudaLargo?.monto ?? 0)).toFixed(2))}</th>
              <th></th>
              <th></th>
              <th>${currencyData.formatTable(((dataReturn?.sumatoriaDeudaLargo?.saldo1 ?? 0)).toFixed(2))}</th>
              <th>${currencyData.formatTable(parseFloat(dataReturn?.sumatoriaDeudaLargo?.saldo2 ?? 0).toFixed(2))}</th>
              <th>${currencyData.formatTable(parseFloat(dataReturn?.sumatoriaDeudaLargo?.saldo3 ?? 0).toFixed(2))}</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </tbody>
        </Table>
      </div>
      {/* </LoadingOverlay> */}

      <h5 className="card-sub-title">{""}</h5>
      <Row>
        <Col md="6">
          <h5 className="card-sub-title">{t("ActualSow")}</h5>
        </Col>
        {/**
            <Col md="6" style={{ textAlign: "right" }}>
              <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                setdataSet({
                  transactId: 0,
                  otherBanks: 0,
                  banesco: 0,
                  total: 0,
                  sow: 0
                }); setTipo("Actual"); toggleShowModalSow(true)
              }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
            </Col> */}
      </Row>
      <div className="table-responsive styled-table-div">
        <Table className="table table-striped table-hover styled-table table" >
          <thead >
            <tr>
              <th>{t("OtherBank")}</th>
              <th>{t("Banesco")}</th>
              <th>{t("Total")}</th>
              <th>{t("Sow")}</th>
            </tr>
          </thead>
          <tbody>
            {sowApproved ?
              <tr key={uniq_key() + "6"}>
                <td data-label={t("OtherBank")}>${currencyData.formatTable((sowApproved.otherBank ?? 0).toFixed(2))}</td>
                <td data-label={t("Banesco")}>${currencyData.formatTable((sowApproved.banesco ?? 0).toFixed(2))}</td>
                <td data-label={t("Total")}>${currencyData.formatTable((sowApproved.total ?? 0).toFixed(2))}</td>
                <td data-label={t("Sow")}>{currencyData.format((sowApproved.sow ?? 0).toFixed(2))}%</td>
              </tr> : null}
            {/*sowactualRows*/}
          </tbody>
        </Table>
      </div>
      <h5 className="card-sub-title">{""}</h5>
      <Row>
        <Col md="6">
          <h5 className="card-sub-title">{t("ProposedSow")}</h5>
        </Col>
        {/**
            <Col md="6" style={{ textAlign: "right" }}>
              <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                setdataSet({
                  transactId: 0,
                  otherBanks: 0,
                  banesco: 0,
                  total: 0,
                  sow: 0
                }); setTipo("Propuesto"); toggleShowModalSow(true)
              }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
            </Col> */}
      </Row>
      <div className="table-responsive styled-table-div">
        <Table className="table table-striped table-hover styled-table table">
          <thead>
            <tr>
              <th>{t("OtherBank")}</th>
              <th>{t("Banesco")}</th>
              <th>{t("Total")}</th>
              <th>{t("Sow")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sowproposedRows == null && sowProposal ?
              <tr key={uniq_key() + "5"}>
                <td data-label={t("OtherBank")}>${currencyData.formatTable((sowProposal?.otherBank ?? 0).toFixed(2))}</td>
                <td data-label={t("Banesco")}>${currencyData.formatTable((sowProposal?.banesco ?? 0).toFixed(2))}</td>
                <td data-label={t("Total")}>${currencyData.formatTable((sowProposal?.total ?? 0).toFixed(2))}</td>
                <td data-label={t("Sow")}>{currencyData.format((sowProposal?.sow ?? 0).toFixed(2))}%</td>
                <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                  {props?.activacion ? null :
                    <Button type="button" color="link" onClick={(resp) => { editSowProposed({ otherBanks: parseFloat(sowProposal?.otherBank).toFixed(2), banesco: parseFloat(sowProposal?.banesco).toFixed(2), total: parseFloat(sowProposal?.total).toFixed(2), sow: parseFloat(sowProposal?.sow).toFixed(2) }) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                  }
                </td>
              </tr> : sowproposedRows}
          </tbody>
        </Table>
      </div>
      {props?.activacion ? null :
        <>
          <h5 className="card-sub-title">{""}</h5>
          <AvForm id="frmRelacionesBancaria" className="needs-validation" onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <h5 className="card-sub-title">{t("Details")}</h5>
              </Col>
            </Row>
            <div className="mb-3">
              <AvField
                type="textarea"
                name="companyHistoryDetails"
                id="companyHistoryDetails"
                maxLength="1000"
                rows="7"
                value={props.dataRelacionesBancarias.observations}
                onChange={(e) => { setdataReturn({ observations: e.target.value }) }}
              />
            </div>
          </AvForm >
        </>
      }
      <ModalDeudasCortoPlazo updateData={updateData} botones={botonValidation} jsonSow={dataSet} saveData={saveData} tipo={tipo} isOpen={showModalDeudasCortoPlazo} toggle={() => { toggleShowModalDeudasCortoPlazo(false) }} />
      <ModalDeudasLargoPlazo updateData={updateData} botones={botonValidation} jsonSow={dataSet} saveData={saveData} tipo={tipo} isOpen={showModalDeudasLargoPlazo} toggle={() => { toggleShowModalDeudasLargoPlazo(false) }} />
      <ModalSow updateData={updateData} botones={botonValidation} jsonSow={dataSet} saveData={saveData} tipo={tipo} isOpen={showModalSow} toggle={() => { toggleShowModalSow(false) }} />
      {/* LLAMADA A LOS COMPONENTES DE ALERTA PARA MENSAJES DE CONFIRMACION */}
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
              if (tipo == "Actual") {
                // eliminarSowActualIGR
                apiBack.removeSowCurrentIGR({ transactId: locationData.transactionId, currentSowId: dataDelete.currentSowId }).then(resp => {
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
              } else if (tipo == "Propuesto") {
                // eliminarSowPropuestoIGR
                apiBack.deleteSowProposedIGR({ transactId: locationData.transactionId, currentSowId: dataDelete.currentSowId, status: false }).then(resp => {
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
              } else if (tipo == "DCP") {
                // eliminarRelacionesBancariasDeudasCP
                apiBack.eliminateBankingRelationshipsDebtsCP({ transactId: locationData.transactionId, debtId: dataDelete.debtId, status: false }).then(resp => {
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
              } else if (tipo == "DCL") {
                // eliminarRelacionesBancariasDeudasLP
                apiBack.eliminateBankingRelationshipsDebtsLP({ transactId: locationData.transactionId, debtId: dataDelete.debtId, status: false }).then(resp => {
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
      {/* </LoadingOverlay> */}
    </React.Fragment >
  );
});
RelacionesBancarias.propTypes = {
  onSubmit: PropTypes.func,
}
export default RelacionesBancarias;
