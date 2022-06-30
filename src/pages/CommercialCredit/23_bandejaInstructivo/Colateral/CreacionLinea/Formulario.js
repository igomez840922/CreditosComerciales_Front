import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Tabs, Tab } from 'react-bootstrap';

import moment from "moment";
import * as OPTs from "../../../../../helpers/options_helper"
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

import { Row, Col, Card, CardBody, Button, Label, Table, Alert } from "reactstrap";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation";
import ApiServicesCommon from "../../../../../services/Common/ApiServicesCommon";
import { BackendServices, CoreServices } from "../../../../../services";
// import Select from "react-select";
import Switch from "react-switch";
import Breadcrumb from "../../../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { Select } from 'antd';
import { Link, useLocation } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import Currency from "../../../../../helpers/currency";
import LoadingOverlay from "react-loading-overlay";
import HeaderSections from "../../../../../components/Common/HeaderSections";
import Productos from "./productos/productos";
import LineaHija from "./lineasHija/lineaHija";
import { uniq_key } from "../../../../../helpers/unq_key";

const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      No
    </div>
  );
};

const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      Si
    </div>
  );
};
const modeloData = {
  "idTramite": "",
  "idDeudor": "",
  "nombreDeudor": "",
  "tipoPropuesta": "",
  "descTipoPropuesta": "",
  "tipoCambio": "",
  "descTipoCambio": "",
  "montoAprobado": "",
  "maximoAprobado": "",
  "montoModificado": "",
  "moneda": "",
  "descMoneda": "",
  "tipoFacilidad": "",
  "descTipoFacilidad": "",
  "numeroCuentaCorriente": "",
  "tasa": "",
  "lineaRotativa": "",
  "subCupoPrendario": "",
  "montoSubcupoPrendario": "",
  "prendario": "",
  "otroNumeroCuenta": "",
  "numeroAN": "",
  "montoPignorar": "",
  "cuentaClidebitar": "",
  "riesgoPais": "",
  "descriesgoPais": "",
  "riesgoProvincia": "",
  "descReiesgoProvincia": "",
  "fechaPropuesta": "",
  "fechaAprobada": "",
  "fechaRevision": "",
  "fechaVencimiento": "",
  "actividadEconomica": "",
  "descActividadEconomica": "",
  "actividadEconomicacinu": "",
  "descactividadEconomicacinu": "",
  "tipoComision": "",
  "montoComision": "",
  "montoITBMS": "",
  "diferido": "",
  "instruccionesEspeciales": "",
  "gastosNotaria": "",
  "gastosTimbres": "",
  "tipoLimite": "",
  "descTipoLimite": "",
  "tipoLinea": "",
  "descTipoLinea": "",
  "numeroLinea": "",
  "informacionAdicional": "",
  "comentariosAdicionales": "",
  "permiteCompensacion": "",
  "rechazarLimite": "",
  "contabiliza": "",
  "marcadorDisponible": "",
  "frecuenciaRevision": "",
  "autonomia": "",
  "descAutonomia": "",
  "usuarioAutonomia": "",
  "tipoAutorizacion": "",
  "porcentajeRiesgo": "",
  "fechadeFrecuencia": "",
  "tipoFrecuencia": "",
  "montoFrecuencia": "",
  "diaFrecuencia": "",
  "idcClientet24": "",
  "facilityId": "",
  "creditLineDgs": [],
  "creditLineProds": []
}
const PantallaBusqueda = (props) => {
  const currencyData = new Currency();
  const { Option } = Select;
  const [lineRotating, setlineRotating] = useState(false);
  const [diferir, setdiferir] = useState(false);
  const [subCupo, setsubCupo] = useState(false);
  const [prendatario, setprendatario] = useState(false);
  const [switch1, setswitch1] = useState(false);
  const [switch2, setswitch2] = useState(false);
  const [switch3, setswitch3] = useState(false);
  const [switch5, setswitch5] = useState(true);
  const [dataProduct, setdataProduct] = useState([]);
  const [dataLinea, setdataLinea] = useState([]);
  const location = useLocation();
  const [dataLocation, setdataLocation] = useState(undefined);
  const [tipoFacilidad, settipoFacilidad] = useState({ Description: "", Code: "" });
  const [dataList, setDataList] = useState(modeloData);
  const [loading, setLoading] = useState(false);
  const [isActiveLoading, setisActiveLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [actividadEconomicaSet, setactividadEconomicaSet] = useState({ Description: "", Code: "" });
  const [typeGarantia, settypeGarantia] = useState("nuevo");
  const [dataPropuestaSelect, setdataPropuestaSelect] = useState({ Description: "", Code: "" });
  const [dataCambioSelect, setdataCambioSelect] = useState({ label: "", value: "" });
  const [idFacilidad, setidFacilidad] = useState(null);
  const [dataFacilidadSet, setdataFacilidadSet] = useState(null);
  const [monedas, setmonedas] = useState(null);
  const [typeLine, settypeLine] = useState(null);
  const [error_dlgT24, seterror_dlgT24] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [monedasSet, setmonedasSet] = useState(null);
  const [typeLineSet, settypeLineSet] = useState(null);
  const [TipoFrecuencia, setTipoFrecuencia] = useState(null);
  const [tipoLimiteSet, settipoLimiteSet] = useState(null);
  const [successSave_dlg2, setsuccessSave_dlg2] = useState(false);
  const [paises, setpaises] = useState(null);
  const [usuarioProspecto, setusuarioProspecto] = useState(null);
  const [paisesSet, setpaisesSet] = useState(null);
  const [provincias, setprovincias] = useState(null);
  const [provinciasSet, setprovinciasSet] = useState(null);
  const [ActividadEmpresa, setActividadEmpresa] = useState(null);
  const [ActividadEmpresaSet, setActividadEmpresaSet] = useState(null);
  const [requestDate, setRequestDate] = useState('');
  const [lastRequestDate, setLastRequestDate] = useState('');
  const [dataPropuesta, setdataPropuesta] = useState(null);
  const [dataIGR, setdataIGR] = useState(null);
  const [numeroLinea, setnumeroLinea] = useState(null);
  const [proposedExpirationDate, setProposedExpirationDate] = useState('');
  const [nextRevisionDate, setNextRevisionDate] = useState('');
  const [datosVacios, setdatosVacios] = useState(false);
  const [fechaSet, setfechaSet] = useState(moment().format("DD-MM-YYYY"));
  const [fechaSet2, setfechaSet2] = useState(moment().format("DD-MM-YYYY"));
  const [fechaSet3, setfechaSet3] = useState(moment().format("DD-MM-YYYY"));
  const [fechaSet4, setfechaSet4] = useState(moment().format("DD-MM-YYYY"));
  const [fechaSet5, setfechaSet5] = useState(moment().format("DD-MM-YYYY"));
  const [fechaSet6, setfechaSet6] = useState(moment().format("DD-MM-YYYY"));
  const [campoTasa2, setcampoTasa2] = useState(false);
  const [typeAuthorization, setTypeAuthorization] = useState(undefined);
  const [typeAuthorizationSet, setTypeAuthorizationSet] = useState(undefined);
  const [autonomy, setAutonomy] = useState(undefined);
  const [totalRate, setTotalRate] = useState(false);
  const [autonomySet, setAutonomySet] = useState(undefined);
  const [proposalType, setProposalType] = useState(undefined)
  const [facilityType, setFacilityType] = useState(undefined);
  const [branchCatalogue, setbranchCatalogue] = useState({ label: "", value: "" });
  const [activityTypeCatalogue, setactivityTypeCatalogue] = useState(undefined);
  const [validacionTabla, setvalidacionTabla] = useState(false);

  const [creditLines, setcreditLines] = useState(null);
  const tipoCambioRecords = [
    { label: "Tasa", value: "Tasa" },
    { label: "Disminución", value: "Disminución" },
    { label: "Extensión", value: "Extensión" },
    { label: "Otro", value: "Otro" },
    { label: "Ninguno", value: "Ninguno" }
  ]
  const backendServices = new BackendServices();
  const coreServices = new CoreServices();
  useEffect(() => {
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        location.data.transactionId = 0;
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setdataLocation(location.data);
        loadData(location.data)
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setdataLocation(result);
        loadData(result)
      }
    }

  }, []);
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      setdatosVacios(true)
      return;
    }
    if (campoTasa2) {
      return;
    }
    let fechaaa = (moment(fechaSet6, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet6 : (moment(fechaSet6, "DD/MM/YYYY").format("YYYY-MM-DD")))
    let frecuencia = moment(fechaaa).format("YYYY") + moment(fechaaa).format("MM") + moment(fechaaa).format("DD") + TipoFrecuencia + values?.freqAmount4 + values?.freqDay4;
    values.riskCountry = paises.find(x => x.Description == paisesSet)?.Code;
    values.province = provinciasSet ?? " ";
    values.economicActivity = ActividadEmpresaSet ?? " ";
    values.currency = monedasSet ?? " ";
    values.amount = Number(currencyData.getRealValue(values?.amount ?? 0));
    values.maxTotal = Number(currencyData.getRealValue(values?.maxTotal ?? 0));
    values.modifiedAmount = Number(currencyData.getRealValue(values?.modifiedAmount ?? 0));
    values.countryRiskPercent = Number(currencyData.getRealPercent(values?.countryRiskPercent ?? 0))
    let datosJson = {
      "idTramite": Number(dataLocation.transactionId ?? 0),
      "idDeudor": Number(values?.idDeudor) ?? 1,
      "nombreDeudor": values?.nombreDeudor ?? "",
      "tipoPropuesta": dataPropuestaSelect?.Code ?? "",
      "descTipoPropuesta": dataPropuestaSelect?.Description ?? "",
      "tipoCambio": dataCambioSelect.value,
      "descTipoCambio": dataCambioSelect.label,
      "montoAprobado": Number(currencyData.getRealValue(values?.montoAprobado ?? 0) || 0),
      "maximoAprobado": Number(currencyData.getRealValue(values?.maximoAprobado ?? 0) || 0),
      "montoModificado": Number(currencyData.getRealValue(values?.montoModificado ?? 0) || 0),
      "moneda": monedas.find(x => x.Description == monedasSet)?.Code ?? "",
      "descMoneda": monedasSet,
      "tipoFacilidad": tipoFacilidad.Code,
      "descTipoFacilidad": tipoFacilidad.Description,
      "numeroCuentaCorriente": values?.numeroCuentaCorriente ?? "",
      "tasa": currencyData.getRealPercent(values?.tasa ?? 0),
      "lineaRotativa": lineRotating,
      "subCupoPrendario": subCupo,
      "montoSubcupoPrendario": Number(currencyData.getRealValue(values?.montoSubcupoPrendario ?? 0) || 0),
      "prendario": prendatario,
      "otroNumeroCuenta": values?.otroNumeroCuenta ?? "",
      "numeroAN": values?.numeroAN ?? "",
      "montoPignorar": Number(currencyData.getRealValue(values?.montoPignorar ?? 0) || 0),
      "cuentaClidebitar": values?.otroNumeroCuenta ?? "",
      "riesgoPais": paises.find(x => x.Description == paisesSet)?.Code ?? "",
      "descriesgoPais": paisesSet,
      "riesgoProvincia": provincias.find(x => x.Description == provinciasSet)?.Code ?? "",
      "descReiesgoProvincia": provinciasSet,
      "fechaPropuesta": moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD")),
      "fechaAprobada": moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet2 : (moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD")),
      "fechalimite": moment(fechaSet3, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet3 : (moment(fechaSet3, "DD/MM/YYYY").format("YYYY-MM-DD")),
      "fechaRevision": moment(fechaSet3, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet3 : (moment(fechaSet3, "DD/MM/YYYY").format("YYYY-MM-DD")),
      "fechaVencimiento": moment(fechaSet4, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet4 : (moment(fechaSet4, "DD/MM/YYYY").format("YYYY-MM-DD")),
      "actividadEconomica": actividadEconomicaSet.Code,
      "descActividadEconomica": actividadEconomicaSet.Description,
      "actividadEconomicacinu": values?.actividadEconomicacinu,
      "descactividadEconomicacinu": values?.descactividadEconomicacinu,
      "tipoComision": values?.tipoComision,
      "montoComision": Number(currencyData.getRealValue(values?.montoComision ?? 0) || 0),
      "montoITBMS": Number(currencyData.getRealValue(values?.montoComision ?? 0)),
      "diferido": diferir,
      "instruccionesEspeciales": values?.instruccionesEspeciales ?? "",
      "gastosNotaria": Number(currencyData.getRealValue(values?.gastosNotaria ?? 0)),
      "gastosTimbres": Number(currencyData.getRealValue(values?.gastosTimbres ?? 0)),
      "tipoLimite": tipoLimiteSet,
      "descTipoLimite": tipoLimiteSet,
      "tipoLinea": typeLineSet && typeLineSet?.Code,
      "descTipoLinea": typeLineSet && typeLineSet?.Description,
      "numeroLinea": values?.numeroLinea ?? "",
      "informacionAdicional": values?.informacionAdicional ?? "",
      "comentariosAdicionales": values?.comentariosAdicionales ?? "",
      "permiteCompensacion": switch1,
      "rechazarLimite": switch2,
      "contabiliza": switch3,
      "marcadorDisponible": switch5,
      "frecuenciaRevision": frecuencia,
      "autonomia": autonomySet && autonomySet.Code,
      "descAutonomia": autonomySet && autonomySet.Description,
      "usuarioAutonomia": values?.usuarioAutonomia ?? "",
      "tipoAutorizacion": typeAuthorizationSet,
      "porcentajeRiesgo": Number(currencyData.getRealPercent(values?.porcentajeRiesgo) ?? 0),
      "fechadeFrecuencia": moment(fechaSet6, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet6 : (moment(fechaSet6, "DD/MM/YYYY").format("YYYY-MM-DD")),
      "tipoFrecuencia": TipoFrecuencia ?? " ",
      "montoFrecuencia": Number(values?.freqAmount4 ?? 0),
      "diaFrecuencia": Number(values?.freqDay4 ?? 0),
      "idcClientet24": "800142024",
      "facilityId": 2150,
      lineId: dataList?.idLineaSec ?? "",
      idLineaSec: dataList?.idLineaSec ?? "",
      estado: true,
      status: true,
      creditLineProds: dataProduct,
      creditLineDgs: dataLinea,
    }
    //   "freqCodeType": TipoFrecuencia ?? " ",
    //   "freqAmount": Number(values?.freqAmount4 ?? 0),
    //   "freqDay": Number(values?.freqDay4 ?? 0),
    //   "clientNumber": usuarioProspecto?.customerNumberT24 ?? "",

    // let datosJson = {
    //   transactId: Number(dataLocation.transactionId ?? 0),
    //   lineId: values?.lineId ?? " ",
    //   currency: values?.currency ?? " ",
    //   riskCountry: values?.riskCountry ?? " ",
    //   province: values?.province ?? " ",
    //   proposalDate: moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD")),
    //   approvalDate: moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet2 : (moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD")),
    //   revisionFrequency: frecuencia,
    //   dueDate: moment(fechaSet3, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet3 : (moment(fechaSet3, "DD/MM/YYYY").format("YYYY-MM-DD")),
    //   limitDate: moment(fechaSet4, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet4 : (moment(fechaSet4, "DD/MM/YYYY").format("YYYY-MM-DD")),
    //   amount: Number(values?.amount) ?? 0,
    //   maxTotal: Number(values?.maxTotal) ?? 0,
    //   modifiedAmount: Number(values?.modifiedAmount) ?? 0,
    //   additionalInfo: values?.additionalInfo ?? " ",
    //   economicActivity: values?.economicActivity ?? " ",
    //   autonomy: autonomySet.Description ?? " ",
    //   autonomyUser: values.autonomyUser,
    //   "status": true,
    //   "facilityId": Number(props?.facilityId ?? 0),
    //   "autonomyCode": autonomySet.Code ?? ' ',//Le pasamos 0 porque no tenemos el codigo
    //   "authType": typeAuthorizationSet ?? "",
    //   "productCode": props?.facilityType?.facilityTypeId ?? " ",
    //   "countryRiskPercent": Number(values?.countryRiskPercent ?? 0),
    //   "creditLimitId": values?.lineId ?? " ", // Se pasara este numero hasta que Israel pase el servicio
    //   "limitAmtType": tipoLimiteSet ?? "",
    //   "lineTypeCode": typeLineSet.Code ?? "",
    //   "lineTypeDesc": typeLineSet.Description ?? "",
    //   "freqDate": moment(fechaSet6, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet6 : (moment(fechaSet6, "DD/MM/YYYY").format("YYYY-MM-DD")),
    //   "freqCodeType": TipoFrecuencia ?? " ",
    //   "freqAmount": Number(values?.freqAmount4 ?? 0),
    //   "freqDay": Number(values?.freqDay4 ?? 0),
    //   "clientNumber": usuarioProspecto?.customerNumberT24 ?? "",
    // }
    // console.log(datosJson);
    // let arr = Object.keys(datosJson);
    // let indice = arr.some(($$) => datosJson[$$] == '' || datosJson[$$] == null);
    // if (indice) {
    //   setdatosVacios(true)
    //   return
    // } else {
    //   setdatosVacios(false)
    // }
    // setisActiveLoading(true)
    // datosJson.allowNetting = switch1;
    // datosJson.limitReject = switch2;
    // datosJson.accounts = switch3 ? "Si" : "No";
    // datosJson.availMarker = switch5;

    // let datoSetCore = {
    //   "CreditLine": {
    //     "Activity": {
    //       "Cod": dataIGR.subeconomicActivity.code.toString()
    //     },
    //     "AuthType": datosJson?.authType.toString() ?? "",
    //     "AutonomyCode": {
    //       "Cod": datosJson?.autonomyCode.toString() ?? "",
    //       "Desc": datosJson?.autonomy.toString() ?? "",
    //     },
    //     "AutonomyUser": datosJson?.autonomyUser.toString() ?? "",
    //     "CreditLimit": {
    //       "AdviseAmt": {
    //         "Amt": datosJson?.amount.toString() ?? "0", //-> Monto de La Linea
    //         "CurCode": datosJson?.currency.toString() ?? "" //-> Codigo Moneda
    //       },
    //       "Allow": {
    //         "CurrencyData": {
    //           "CurAmt": {
    //             "Amt": {
    //               "-self-closing": "true"
    //             },
    //             "CurCode": {
    //               "-self-closing": "true"
    //             }
    //           }
    //         },
    //         "Party": {
    //           "PartyId": {
    //             "-self-closing": "true"
    //           }
    //         },
    //         "ProductData": [
    //           {
    //             "Product": {
    //               // "Cod":1000
    //               "Cod": datosJson?.lineTypeCode.toString() ?? ""// Preguntar a Yamari, parce que no es el mismo del tipo de linea
    //             }
    //           }
    //         ]
    //       },
    //       "AllowNetting": datosJson?.allowNetting ? "Y" : "N", // -> ?? FIJO
    //       "ApprovalDt": datosJson?.approvalDate.toString() ?? "", // -> Fecha de Aprobacion
    //       "AvailDt": datosJson?.proposalDate.toString() ?? "",    // -> Fecha de Propuesta
    //       "AvailMarker": datosJson?.availMarker.toString() ? "Y" : "N", // -> ?? FIJO
    //       "CountryRisk": {
    //         "Country": {
    //           "CountryCode": datosJson?.riskCountry.toString() ?? "",
    //           "CountryName": {
    //             "-self-closing": "true"
    //           }
    //         },
    //         "Percent": datosJson?.countryRiskPercent.toString() ?? "0"
    //       },
    //       "CreditLimitKey": {
    //         "CreditLimitId": datosJson?.lineId.toString() ?? ""
    //       },
    //       "CurCode": datosJson?.currency.toString() ?? "",
    //       "DeadLineDt": moment().format("YYYY-MM-DD"),
    //       "DueDt": datosJson?.dueDate.toString() ?? "",
    //       "LimitAmt": {
    //         "Amt": datosJson?.amount.toString() ?? "0",
    //         "CurCode": datosJson?.currency.toString() ?? ""
    //       },
    //       "LimitAmtType": datosJson?.limitAmtType.toString() ?? "",
    //       "LimitReject": datosJson?.limitReject.toString() ? "Y" : "N",
    //       "MaxCurAmt": {
    //         "Amt": datosJson?.amount.toString() ?? "0",
    //         "CurCode": datosJson?.currency.toString() ?? ""
    //       },
    //       "ProposalDt": datosJson?.proposalDate.toString() ?? "",
    //       "ReviewFreq": {
    //         "FreqValue": datosJson?.revisionFrequency.toString() ?? ""
    //       },
    //       "Signatories": {
    //         "Signatory": {
    //           "PartyKey": {
    //             "PartyId": usuarioProspecto?.customerNumberT24
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    console.log("saveCreditLine",datosJson);
    backendServices.saveCreditLine(datosJson).then(resp => {
      setsuccessSave_dlg2(true)
      loadData(dataLocation)
      setDataList(modeloData)
      setvalidacionTabla(false)

    }).catch(err => {
      seterror_dlg(false);
    })
    // coreServices.newline(datoSetCore).then(resCore => {
    //   setisActiveLoading(false)
    //   console.log("coreServices.newline", resCore);
    //   if (resCore !== null && resCore !== undefined) {
    //   } else {
    //     seterror_dlgT24(true);
    //   }
    // })
  }
  async function loadData(data) {
    setisActiveLoading(true)
    coreServices.getAuthorityTypeCatalogo().then(resp => {
      setTypeAuthorization(resp?.Records)
    }).catch(err => { console.log(err) });

    coreServices.getAutonomiaCatalogo().then(resp => {
      setAutonomy(resp?.Records)
    }).catch(err => { console.log(err) });

    await coreServices.getMonedaCatalogo().then(resp => {
      setmonedas(resp.Records)
    });
    coreServices.getActividadEconomicaCatalogo().then(data => {
      setactivityTypeCatalogue(data?.Records);
    }).catch(err => {
    });
    await coreServices.getPaisesCatalogo().then(resp => {
      setpaises(resp.Records)
    });
    setbranchCatalogue(tipoCambioRecords)
    await coreServices.getTypeOfCreditLimitsCatalog().then(resp => {
      console.log(resp);
      settypeLine(resp.Records)
    });
    await backendServices.retrieveProposalType().then(resp => {
      let json = [];
      for (let i = 0; i < resp.length; i++) {
        json.push({ Description: resp[i]["description"], Code: resp[i]["id"] })
      }
      setProposalType(json);
    })
    await backendServices.retrieveFacilityType().then(resp => {
      let json = [];
      for (let i = 0; i < resp.length; i++) {
        json.push({ Description: resp[i]["description"], Code: resp[i]["id"] })
      }
      setFacilityType(json);

    })
    await backendServices.consultPrincipalDebtor(data.transactionId)
      .then((data) => {
        if (data !== undefined) {
          // setisActiveLoading(true)
          setusuarioProspecto(data);
          // coreServices.getLineSerial(data.customerNumberT24, props.facilityType.facilityTypeId).then(resp => {
          //   // setisActiveLoading(false)
          //   setnumeroLinea(resp)
          // });
        }
      });
    await coreServices.getActividadEconomicaCatalogo().then(response => {
      if (response === null) { return; }
      let json = [];
      for (let i = 0; i < response.Records.length; i++) {
        json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
      }
      setActividadEmpresa(json);
    })
    await backendServices.consultGeneralDataIGR(data?.transactionId ?? 0).then(resp => {
      setActividadEmpresaSet(resp?.economicActivity?.name ?? "")
      setdataIGR(resp)
    })

    await backendServices.consultGeneralDataPropCred(data?.transactionId ?? 0).then(async resp => {
      setRequestDate(resp[0]?.requestDate ?? '');
      setLastRequestDate(resp[0]?.lastRequestDate ?? '');
      setdataPropuesta(resp[0]);
      setNextRevisionDate(resp[0]?.nextRevisionDate ?? '');
      setProposedExpirationDate(resp[0]?.proposedExpirationDate ?? '');
      setpaisesSet(resp[0]?.countryRisk ?? '');
      await coreServices.getPaisesCatalogo().then(pais => {
        coreServices.getProvinciasCatalogo(pais.Records.find(x => x.Description === resp[0]?.countryRisk ?? '')?.Code).then(resp => {
          setprovincias(resp.Records)
        });
      });
      // changeCountry(resp[0]?.countryRisk ?? '')
    })
    await backendServices.getCreditLine(data?.transactionId, 2150).then(async resp => {
      if (resp?.creditLine.length > 0) {
        resp = resp?.creditLine;
        setcreditLines(resp.map((data, index) => (
          <>
            <tr key={uniq_key()}>
              <td>{data.tipoLinea + "--" + data.descTipoLinea}</td>
              <td>{data.numeroLinea}</td>
              <td>{data.creditLineDgs?.length ?? 0}</td>
              <td>{data.creditLineProds?.length ?? 0}</td>
              <td>${currencyData.formatTable(data.montoAprobado ?? 0)}</td>
              <td><Link to="#" title={t("View")} onClick={() => {
                loadDataTable(data)
              }}><i className="mdi mdi-circle-edit-outline mdi-24px"></i></Link></td>
            </tr>
          </>
        )))
        setisActiveLoading(false)
      }
    }).catch(err => {
      setisActiveLoading(false)
    })
  }
  function loadDataTable(data) {
    setisActiveLoading(true)
    setdataProduct(data.creditLineProds?.length > 0 ? data.creditLineProds : [] ?? []);
    setdataLinea(data.creditLineDgs?.length > 0 ? data.creditLineDgs : [] ?? []);
    setDataList(data);
    setdataPropuestaSelect({ Description: data.descTipoPropuesta, Code: data.tipoPropuesta })
    setdataCambioSelect({ label: data.descTipoCambio, value: data.tipoCambio })
    setmonedasSet(data.moneda)
    settipoFacilidad({ Description: data.descTipoFacilidad, Code: data.tipoFacilidad })
    setlineRotating(data.lineaRotativa ?? false)
    setsubCupo(data.subCupoPrendario ?? false)
    setprendatario(data.prendario ?? false)
    changeCountry(data.descriesgoPais)
    setpaisesSet(data.descriesgoPais)
    setprovinciasSet(data.descReiesgoProvincia)
    setfechaSet(moment(data.fechaPropuesta).format("DD-MM-YYYY"))
    setfechaSet2(moment(data.fechaAprobada).format("DD-MM-YYYY"))
    setfechaSet3(moment(data.fechalimite).format("DD-MM-YYYY"))
    setfechaSet4(moment(data.fechaVencimiento).format("DD-MM-YYYY"))
    setfechaSet6(moment(data.fechadeFrecuencia).format("DD-MM-YYYY"))
    setactividadEconomicaSet({ Description: data.descActividadEconomica, Code: data.actividadEconomica })
    setdiferir(data.diferido ?? false)
    settipoLimiteSet(data.tipoLimite)
    settypeLineSet({ Description: data.descTipoLinea, Code: data.tipoLinea })
    setswitch1(data.permiteCompensacion ?? false)
    setswitch2(data.rechazarLimite ?? false)
    setswitch3(data.contabiliza ?? false)
    setswitch5(data.marcadorDisponible ?? false)
    setAutonomySet({ Description: data.descAutonomia, Code: data.autonomia })
    setTypeAuthorizationSet(data.tipoAutorizacion)
    setTipoFrecuencia(data.tipoFrecuencia)
    setTimeout(() => {
      setisActiveLoading(false)
      setvalidacionTabla(true);
    }, 1000);
  }
  function changeCountry(code) {
    coreServices.getPaisesCatalogo().then(resp2 => {
      coreServices.getProvinciasCatalogo(resp2.Records.find(x => x.Description === code)?.Code).then(resp => {
        setprovincias(resp.Records)
      });
    });
  }
  function handleSelect(key) {
    setidFacilidad(dataFacilidadSet[key].facilityId);
  }
  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 45) {
      e.preventDefault();
      return true;
    }

    return false;
  }
  function dataProductFunction(data) {
    console.log(data);
    setdataProduct(data)
  }
  function dataLineaFunction(data) {
    console.log(data);
    setdataLinea(data)
  }
  return (
    <React.Fragment>
      <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
        {validacionTabla == false ? <>
          <Card>
            <CardBody>
              <Row>
                <Col md="6">
                </Col>
                <Col md="6" style={{ textAlign: "right" }}>
                  <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                    setvalidacionTabla(true)
                  }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <Table className="table table-striped table-hover styled-table table" >
                    <thead>
                      <tr>
                        <th><strong>{t("Tipo de línea")}</strong></th>
                        <th><strong>{t("Número de línea")}</strong></th>
                        <th><strong>{t("Líneas hijas")}</strong></th>
                        <th><strong>{t("Productos")}</strong></th>
                        <th><strong>{t("Monto aprobado")}</strong></th>
                        <th><strong>{t("Actions")}</strong></th>
                      </tr>
                    </thead>
                    <tbody>
                      {creditLines}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </> :
          <AvForm id="frmGarantiasMuebles" className="needs-validation" onSubmit={handleSubmit}>
            <HeaderSections title={t("Datos Generales")} t={t}></HeaderSections>
            <Row>
              <Col md="4">
                <Label htmlFor="Frecuebnciarevi">{t("Número de trámite")}</Label>
                <AvField
                  className="form-control"
                  type="text"
                  name="lineId"
                  id="lineId"
                />
              </Col>
              <Col md="4">
                <Label htmlFor="Frecuebnciarevi">{t("Número de facilidad")}</Label>
                <AvField
                  className="form-control"
                  type="text"
                  name="lineId"
                  id="lineId"
                />
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <Label htmlFor="idDeudor ">{t("Numero Deudor")}</Label>
                <AvField
                  className="form-control"
                  defaultValue={dataList?.idDeudor}
                  name="idDeudor"
                  type="text"
                />
              </Col>
              <Col md="4">
                <Label htmlFor="nombreDeudor ">{t("Nombre del Cliente Deudor")}</Label>
                <AvField
                  className="form-control"
                  defaultValue={dataList?.nombreDeudor}
                  name="nombreDeudor"
                  type="text"
                />
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <div className="mb-4">
                  <Label htmlFor="facilityType">{t("Facility Type")}</Label>
                  {validacionTabla == false ? null :
                    <Select noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      placeholder={t("Select")}
                      optionFilterProp="children"
                      defaultValue={JSON.stringify(tipoFacilidad)}
                      onChange={(e) => {
                        let facility = JSON.parse(e)
                        settipoFacilidad(facility)
                        // setDataGeneral({ ...DataGeneral, facilityTypeCode: facility.Code, facilityTypeDesc: facility.Description })
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {facilityType?.length > 0 ?

                        facilityType?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>
                  }
                </div>
              </Col>
              <Col md="4">
                <div className="mb-4">
                  <Label htmlFor="proposalType">{t("Proposal Type")}</Label>
                  {/* {proposalType != null ? */}
                  {validacionTabla == false ? null :
                    <Select noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      placeholder={t("Select")}
                      optionFilterProp="children"
                      defaultValue={JSON.stringify(dataPropuestaSelect)}
                      onChange={(e) => {
                        let porposal = JSON.parse(e);
                        setdataPropuestaSelect(porposal)
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {proposalType?.length > 0 ?
                        proposalType?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>
                  }
                </div>
              </Col>
              <Col md="4">
                <div className="mb-4">
                  <Label>{t("Tipo de cambio")}</Label>
                  {validacionTabla == false ? null :
                    <Select noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      placeholder={t("Select")}
                      optionFilterProp="children"
                      defaultValue={dataCambioSelect?.value ?? ""}
                      onChange={(e) => {
                        let branch = JSON.parse(e)
                        setdataCambioSelect(branch)
                        // setDataGeneral({ ...DataGeneral, branchCode: branch.Code, branchDesc: branch.Description })
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {branchCatalogue && branchCatalogue?.length > 0 ?
                        branchCatalogue?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.label}</Option>
                        ))
                        : null}
                    </Select>
                  }
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <Label htmlFor="montoAprobado">{t("Monto aprobado")}</Label>
                <AvField
                  className="form-control"
                  defaultValue={dataList?.montoAprobado}
                  name="montoAprobado"
                  type="text"
                  id="montoAprobado"
                  onChange={(e) => { return check(e) }}
                  pattern="^[0-9,.]*$"
                  onKeyUp={(e) => {
                    let x = currencyData.getRealValue(e.target.value);
                    e.target.value = currencyData.format(x);
                  }}
                />
              </Col>
              <Col md="4">
                <Label htmlFor="maximoAprobado">{t("Monto máximo aprobado")}</Label>
                <AvField
                  className="form-control"
                  defaultValue={dataList?.maximoAprobado}
                  name="maximoAprobado"
                  type="text"
                  id="maximoAprobado"
                  onChange={(e) => { return check(e) }}
                  pattern="^[0-9,.]*$"
                  onKeyUp={(e) => {
                    let x = currencyData.getRealValue(e.target.value);
                    e.target.value = currencyData.format(x);
                  }}
                />
              </Col>
              <Col md="4">
                <Label htmlFor="montoModificado">{t("Monto modificado")}</Label>
                <AvField
                  className="form-control"
                  defaultValue={dataList?.montoModificado}
                  name="montoModificado"
                  type="text"
                  id="montoModificado"
                  onChange={(e) => { return check(e) }}
                  pattern="^[0-9,.]*$"
                  onKeyUp={(e) => {
                    let x = currencyData.getRealValue(e.target.value);
                    e.target.value = currencyData.format(x);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <div className="mb-2">
                  <Label>{t("Coin")}</Label>
                  {validacionTabla == false ? null :
                    <Select noOptionsMessage={() => ""}
                      showSearch
                      style={{ width: "100%" }}
                      placeholder={t("SearchtoSelect")}
                      optionFilterProp="children"
                      defaultValue={monedasSet}
                      onChange={(e) => { setmonedasSet(e) }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {monedas != null ?
                        monedas.map((item, index) => (
                          <Option key={index} value={item.Description}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>
                  }
                </div>
              </Col>
              {/* <Col md="4">
              <Label htmlFor="advancementAmount">{t("Línea de crédito sobregiro")}</Label>
              <AvField
                className="form-control"
                defaultValue={dataList?.advancementAmount}
                name="advancementAmount"
                type="text"
                id="advancementAmount"
              />
            </Col> */}
              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="tasa">{t("Tasa Total")}</Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.tasa}
                    name="tasa"
                    type="text"
                    onKeyUp={(e) => {
                      let x = currencyData.getRealPercent(e.target.value);
                      e.target.value = currencyData.formatPercent(x || 0, e);
                    }}
                    onChange={(e) => {
                      let totalRate = +currencyData.getRealPercent(e.target.value || 0);
                      parseFloat(totalRate) > 100 ? setTotalRate(true) : setTotalRate(false);
                    }}
                    value="0%" />
                  {totalRate ?
                    <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                    : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <div className="mb-3">
                  <Label>{t("Línea de crédito rotativa")}</Label>
                  <AvGroup check className="mb-3">
                    <Switch name="isProjectLocatedProtectedNaturalArea"
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      id="check1"
                      className="form-label"
                      onChange={() => {
                        setlineRotating(!lineRotating);
                      }}
                      checked={lineRotating}
                    />
                    {'   '}
                    {/* <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Is the project located or adjacent to a protected natural area")}</Label> */}
                  </AvGroup>
                </div>
              </Col>
              <Col md="2">
                <div className="mb-3">
                  <Label>{t("Subcupo prendario")}</Label>
                  <AvGroup check className="mb-3">
                    <Switch name="isProjectLocatedProtectedNaturalArea"
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      id="check1"
                      className="form-label"
                      onChange={() => {
                        setsubCupo(!subCupo);
                      }}
                      checked={subCupo}
                    />
                    {'   '}
                    {/* <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Is the project located or adjacent to a protected natural area")}</Label> */}
                  </AvGroup>
                </div>
              </Col>
              <Col md="2">
                <Label htmlFor="montoSubcupoPrendario">{t("Monto del subcupo")}</Label>
                <AvField
                  className="form-control"
                  defaultValue={dataList?.montoSubcupoPrendario}
                  name="montoSubcupoPrendario"
                  type="text"
                  id="montoSubcupoPrendario"
                  onChange={(e) => { return check(e) }}
                  pattern="^[0-9,.]*$"
                  onKeyUp={(e) => {
                    let x = currencyData.getRealValue(e.target.value);
                    e.target.value = currencyData.format(x);
                  }}
                />
              </Col>
              <Col md="2">
                <div className="mb-3">
                  <Label>{t("Prendario")}</Label>
                  <AvGroup check className="mb-3">
                    <Switch name="isProjectLocatedProtectedNaturalArea"
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      id="check1"
                      className="form-label"
                      onChange={() => {
                        setprendatario(!prendatario);
                      }}
                      checked={prendatario}
                    />
                    {'   '}
                    {/* <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Is the project located or adjacent to a protected natural area")}</Label> */}
                  </AvGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <Label htmlFor="numeroCuentaCorriente">{t("DPF/Ahorro/# Cta Corriente")}</Label>
                <AvField
                  className="form-control"
                  defaultValue={dataList?.numeroCuentaCorriente}
                  name="numeroCuentaCorriente"
                  type="text"
                  id="numeroCuentaCorriente"
                />
              </Col>
              <Col md="4">
                <Label htmlFor="numeroAN">{t("A/N")}</Label>
                <AvField
                  className="form-control"
                  defaultValue={dataList?.numeroAN}
                  name="numeroAN"
                  type="text"
                  id="numeroAN"
                />
              </Col>
              <Col md="4">
                <Label htmlFor="montoPignorar">{t("Monto a pignorar")}</Label>
                <AvField
                  className="form-control"
                  defaultValue={dataList?.montoPignorar}
                  name="montoPignorar"
                  type="text"
                  id="montoPignorar"
                  onChange={(e) => { return check(e) }}
                  pattern="^[0-9,.]*$"
                  onKeyUp={(e) => {
                    let x = currencyData.getRealValue(e.target.value);
                    e.target.value = currencyData.format(x);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Proposal Date")}</Label>
                  <Flatpickr
                    id="proposalDate"
                    name="proposalDate"
                    className="form-control d-block"
                    placeholder={OPTs.FORMAT_DATE_SHOW}
                    options={{
                      dateFormat: OPTs.FORMAT_DATE,
                      //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                      defaultDate: moment().format("DD-MM-YYYY")
                    }}
                    onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Approval date")}</Label>
                  <Flatpickr
                    id="approvalDate"
                    name="approvalDate"
                    className="form-control d-block"
                    placeholder={OPTs.FORMAT_DATE_SHOW}
                    options={{
                      dateFormat: OPTs.FORMAT_DATE,
                      //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                      defaultDate: moment().format("DD-MM-YYYY")
                    }}
                    onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("DueDate")}</Label>
                  <Flatpickr
                    id="dueDate"
                    name="dueDate"
                    className="form-control d-block"
                    placeholder={OPTs.FORMAT_DATE_SHOW}
                    options={{
                      dateFormat: OPTs.FORMAT_DATE,
                      //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                      defaultDate: moment().format("DD-MM-YYYY")
                    }}
                    onChange={(selectedDates, dateStr, instance) => { setfechaSet3(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Fecha revisión")}</Label>
                  <Flatpickr
                    id="limitDate"
                    name="limitDate"
                    className="form-control d-block"
                    placeholder={OPTs.FORMAT_DATE_SHOW}
                    options={{
                      dateFormat: OPTs.FORMAT_DATE,
                      //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                      defaultDate: moment().format("DD-MM-YYYY")
                    }}
                    onChange={(selectedDates, dateStr, instance) => { setfechaSet4(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="otroNumeroCuenta">
                    {t("Cuenta del cliente")}
                  </Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.otroNumeroCuenta}
                    type="text"
                    name="otroNumeroCuenta"
                  />
                </div>
              </Col>
            </Row>
            <Productos dataList={dataList} dataProduct={dataProduct} dataProductFunction={dataProductFunction} />
            <Row>
              <Col md="4">
                <div className="mb-2">
                  <Label>{t("Risk Country")}</Label>
                  {validacionTabla == false ? null : <>
                    {paisesSet != null ?
                      <Select noOptionsMessage={() => ""}
                        showSearch
                        style={{ width: "100%" }}
                        placeholder={t("SearchtoSelect")}
                        optionFilterProp="children"
                        defaultValue={paisesSet}
                        onChange={(e) => { setpaisesSet(e); changeCountry(e); }}
                        filterOption={(input, option) =>
                          option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {paises != null ?

                          paises.map((item, index) => (
                            <Option key={index} value={item.Description}>{item.Description}</Option>
                          ))
                          : null}
                      </Select>
                      : null}</>
                  }
                </div>
              </Col>
              <Col md="4">
                <Label>{t("Province")}</Label>
                {validacionTabla == false ? null :
                  <Select noOptionsMessage={() => ""}
                    showSearch
                    id="province"
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    defaultValue={provinciasSet}
                    onChange={(e) => { setprovinciasSet(e) }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {provincias != null ?
                      provincias.map((item, index) => (
                        <Option key={index} value={item.Description}>{item.Description}</Option>
                      ))
                      : null}
                  </Select>
                }
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <div className="mb-4">
                  <Label>{t("Actividad Econommica")}</Label>
                  {validacionTabla == false ? null :
                    <Select noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={actividadEconomicaSet?.Description ?? ""}
                      onChange={(e) => {
                        let economicActivityType = JSON.parse(e)
                        setactividadEconomicaSet(economicActivityType)
                        // setDataGeneral({ ...DataGeneral, economicActivityTypeCode: economicActivityType.Code, economicActivityTypeDesc: economicActivityType.Description });
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {activityTypeCatalogue && activityTypeCatalogue?.length > 0 ?
                        activityTypeCatalogue?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>
                  }
                </div>
              </Col>
              <Col md="4">
                <div className="mb-4">
                  <Label>{t("Actividad CINU")}</Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.actividadEconomicacinu}
                    name="actividadEconomicacinu"
                    type="text"
                    id="actividadEconomicacinu" />

                </div>
              </Col>
              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="descactividadEconomicacinu">{t("Descripción")}</Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.descactividadEconomicacinu}
                    name="descactividadEconomicacinu"
                    type="text"
                    id="descactividadEconomicacinu"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <div className="mb-4">
                  <Label>{t("Tipo de comision del desembolso")}</Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.tipoComision}
                    name="tipoComision"
                    type="text"
                    id="tipoComision" />

                </div>
              </Col>
              <Col md="4">
                <Label htmlFor="montoComision">{t("Monto comisión del desembolso")}</Label>
                <AvField
                  className="form-control"
                  defaultValue={dataList?.montoComision}
                  name="montoComision"
                  type="text"
                  id="montoComision"
                  onChange={(e) => { return check(e) }}
                  pattern="^[0-9,.]*$"
                  onKeyUp={(e) => {
                    let x = currencyData.getRealValue(e.target.value);
                    e.target.value = currencyData.format(x);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <div className="mb-4">
                  <Label>{t("ITBMS")}</Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.montoITBMS}
                    name="montoITBMS"
                    type="text"
                    onChange={(e) => { return check(e) }}
                    pattern="^[0-9,.]*$"
                    onKeyUp={(e) => {
                      let x = currencyData.getRealValue(e.target.value);
                      e.target.value = currencyData.format(x);
                    }}
                    id="montoITBMS" />
                </div>
              </Col>
              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="authType">{t("Diferir")}</Label>
                  <AvGroup check className="">
                    <Switch name="preapproval"
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      className="form-label"
                      onChange={() => {
                        setdiferir(!diferir);
                      }}
                      checked={diferir}
                    />
                  </AvGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <div className="mb-4">
                  <Label>{t("Instrucciones especiales de la Banca")}</Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.instruccionesEspeciales}
                    name="instruccionesEspeciales"
                    type="textarea"
                    rows="4"
                    id="instruccionesEspeciales" />

                </div>
              </Col>
            </Row>
            <HeaderSections title={t("Administración")} t={t}></HeaderSections>
            <Row>
              <Col md="4">
                <div className="mb-4">
                  <Label>{t("Notarias")}</Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.gastosNotaria}
                    name="gastosNotaria"
                    type="text"
                    onChange={(e) => { return check(e) }}
                    pattern="^[0-9,.]*$"
                    onKeyUp={(e) => {
                      let x = currencyData.getRealValue(e.target.value);
                      e.target.value = currencyData.format(x);
                    }}
                    id="gastosNotaria" />

                </div>
              </Col>
              <Col md="4">
                <div className="mb-4">
                  <Label>{t("Timbres")}</Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.gastosTimbres}
                    name="gastosTimbres"
                    type="text"
                    onChange={(e) => { return check(e) }}
                    pattern="^[0-9,.]*$"
                    onKeyUp={(e) => {
                      let x = currencyData.getRealValue(e.target.value);
                      e.target.value = currencyData.format(x);
                    }}
                    id="gastosTimbres" />

                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <div className="mb-4">
                  <Label>{t("Comentarios adicionales de ADMCRED")}</Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.comentariosAdicionales}
                    name="comentariosAdicionales"
                    type="textarea"
                    rows="4"
                    id="comentariosAdicionales" />

                </div>
              </Col>
            </Row>
            <HeaderSections title={t("Instrucciones para creación de línea")} t={t}></HeaderSections>
            <p className="card-title-desc"></p>
            {datosVacios ? <Alert show={true} color="danger" dismissible onClose={() => { }}>
              {t("There are empty fields")}
            </Alert> : null}
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="Frecuebnciarevi">
                    {t("Número de Línea")}
                  </Label>
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.numeroLinea}
                    type="text"
                    name="numeroLinea"
                    id="numeroLinea"
                    readOnly={true}
                    value={numeroLinea}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-2">
                  <Label>{t("Type of line")}</Label>
                  {validacionTabla == false ? null :
                    <Select noOptionsMessage={() => ""}
                      showSearch
                      style={{ width: "100%" }}
                      placeholder={t("SearchtoSelect")}
                      defaultValue={typeLineSet?.Code ?? ""}
                      optionFilterProp="children"
                      onChange={(e) => { settypeLineSet(typeLine.find(x => x.Code === e)); setisActiveLoading(true); coreServices.getLineSerial(usuarioProspecto?.customerNumberT24, e).then(resp => { setisActiveLoading(false); document.getElementById("numeroLinea").value = resp }) }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {typeLine != null ?
                        typeLine.map((item, index) => (
                          <Option key={index} value={item.Code}>{item.Code}</Option>
                        ))
                        : null}
                    </Select>
                  }
                </div>
              </Col>
              <Col md="3">
                <div className="mb-2">
                  <Label>{t("Limit type")}</Label>
                  {validacionTabla == false ? null :
                    <Select noOptionsMessage={() => ""}
                      showSearch
                      style={{ width: "100%" }}
                      placeholder={t("SearchtoSelect")}
                      optionFilterProp="children"
                      defaultValue={tipoLimiteSet}
                      onChange={(e) => { settipoLimiteSet(e) }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value={"FIXED"}>FIXED</Option>
                      <Option value={"VARIABLE"}>VARIABLE</Option>
                    </Select>
                  }
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="MontoModificado">
                    {t("Percent")}
                  </Label>
                  {/* {ActividadEmpresaSet} */}
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.porcentajeRiesgo}
                    name="porcentajeRiesgo"
                    type="text"
                    value={0}
                    onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e); }}
                    onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa2(true) : setcampoTasa2(false); }}
                    id="porcentajeRiesgo"
                  />
                  {campoTasa2 ?
                    <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                    : null}
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Marker Available")}</Label>
                  <AvGroup check className="mb-3">
                    <Switch name="isProjectLocatedProtectedNaturalArea"
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      id="check1"
                      className="form-label"
                      onChange={() => {
                        setswitch5(!switch5);
                      }}
                      checked={switch5}
                    />
                    {'   '}
                    {/* <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Is the project located or adjacent to a protected natural area")}</Label> */}
                  </AvGroup>
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Allow compensation")}</Label>
                  <AvGroup check className="mb-3">
                    <Switch name="isProjectLocatedProtectedNaturalArea"
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      id="check1"
                      className="form-label"
                      onChange={() => {
                        setswitch1(!switch1);
                      }}
                      checked={switch1}
                    />
                    {'   '}
                    {/* <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Is the project located or adjacent to a protected natural area")}</Label> */}
                  </AvGroup>
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Reject limit")}</Label>
                  <AvGroup check className="mb-3">
                    <Switch name="isProjectLocatedProtectedNaturalArea"
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      id="check1"
                      className="form-label"
                      onChange={() => {
                        setswitch2(!switch2);
                      }}
                      checked={switch2}
                    />
                    {'   '}
                    {/* <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Is the project located or adjacent to a protected natural area")}</Label> */}
                  </AvGroup>
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Accounts")}</Label>
                  <AvGroup check className="mb-3">
                    <Switch name="isProjectLocatedProtectedNaturalArea"
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      id="check1"
                      className="form-label"
                      onChange={() => {
                        setswitch3(!switch3);
                      }}
                      checked={switch3}
                    />
                    {'   '}
                    {/* <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Is the project located or adjacent to a protected natural area")}</Label> */}
                  </AvGroup>
                </div>
              </Col>
              <Col md="6" className="table-responsive styled-table-div">
                <span>{t("Review Frequency")}</span>
                <Table className="table table-striped table-hover styled-table table" >
                  <thead>
                    <tr>
                      <th>{t("Date")}</th>
                      <th>{t("Type")}</th>
                      <th>{t("Quantity")}</th>
                      <th>{t("Day")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Flatpickr
                          id="freqDate"
                          name="freqDate"
                          className="form-control d-block"
                          placeholder={OPTs.FORMAT_DATE_SHOW}
                          options={{
                            dateFormat: OPTs.FORMAT_DATE,
                            //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                            defaultDate: moment().format("DD-MM-YYYY")
                          }}
                          onChange={(selectedDates, dateStr, instance) => { setfechaSet6(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                        />
                      </td>
                      <td>
                        {validacionTabla == false ? null :
                          <Select noOptionsMessage={() => ""}
                            showSearch
                            style={{ width: "100%" }}
                            placeholder={t("Search")}
                            optionFilterProp="children"
                            defaultValue={TipoFrecuencia}
                            onChange={(e) => { setTipoFrecuencia(e) }}
                            filterOption={(input, option) =>
                              option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value={"A"}>A</Option>
                            <Option value={"M"}>M</Option>
                            <Option value={"D"}>D</Option>
                          </Select>
                        }
                      </td>
                      <td>
                        <AvField
                          className="form-control"
                          defaultValue={dataList?.montoFrecuencia}
                          type="number"
                          name="freqAmount4"
                          id="freqAmount4"
                        />
                      </td>
                      <td>
                        <AvField
                          className="form-control"
                          defaultValue={dataList?.diaFrecuencia}
                          type="number"
                          name="freqDay4"
                          id="freqDay4"
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md="6">
                <Row>
                  <Col md="6">
                    <div className="mb-2">
                      <Label>{t("Authorization type")}</Label>
                      {validacionTabla == false ? null :
                        <Select noOptionsMessage={() => ""}
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={t("SearchtoSelect")}
                          optionFilterProp="children"
                          defaultValue={typeAuthorizationSet}
                          onChange={(e) => { setTypeAuthorizationSet(e) }}
                          filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {typeAuthorization != null ?
                            typeAuthorization.map((item, index) => (
                              <Option key={index} value={item.Code}>{item.Description}</Option>
                            ))
                            : null}
                        </Select>
                      }
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-2">
                      <Label>{t("Autonomía")}</Label>
                      {validacionTabla == false ? null :
                        <Select noOptionsMessage={() => ""}
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={t("SearchtoSelect")}
                          optionFilterProp="children"
                          defaultValue={autonomySet?.Description ?? ""}
                          onChange={(e) => { setAutonomySet(JSON.parse(e)) }}
                          filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {autonomy != null ?
                            autonomy.map((item, index) => (
                              <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                            ))
                            : null}
                        </Select>
                      }
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-3">
                      <Label htmlFor="usuarioAutonomia">
                        {t("Usuario de Autonomía")}
                      </Label>
                      <AvField
                        className="form-control"
                        defaultValue={dataList?.usuarioAutonomia}
                        name="usuarioAutonomia"
                        type="text"
                        id="usuarioAutonomia"
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <Label htmlFor="informacionAdicional">
                    {t("Additional Information")}
                  </Label>
                  {dataList?.informacionAdicional}
                  <AvField
                    className="form-control"
                    defaultValue={dataList?.informacionAdicional}
                    type="textarea"
                    rows="3"
                    name="informacionAdicional"
                    id="informacionAdicional"
                  />
                </div>
              </Col>
            </Row>
            <LineaHija dataList={dataList} dataLinea={dataLinea} dataLineaFunction={dataLineaFunction} />
            <Row>
              <Col md={12} style={{ textAlign: "right", marginTop: "10px" }}>
                <Button
                  id="btnNew"
                  color="danger"
                  type="button"
                  style={{ margin: "5px" }}
                  data-dismiss="modal"
                  onClick={() => { setvalidacionTabla(false) }}
                >
                  <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}
                  {t("Cancel")}
                </Button>
                <Button id="btnSearch" type="submit" color="success" style={{ margin: '5px' }}>
                  <i className="mdi mdi-content-save mdi-12px"></i>
                  {" "} {typeGarantia == "nuevo" ? t("Save") : t("Edit")}</Button>
              </Col>
            </Row>
          </AvForm>
        }
        {
          successSave_dlg2 ? (
            <SweetAlert
              success
              title={t("SuccessDialog")}
              confirmButtonText={t("Confirm")}
              cancelButtonText={t("Cancel")}
              onConfirm={() => {
                setsuccessSave_dlg2(false)
                // window.location.reload();
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
              }}
            >
              {error_msg}
            </SweetAlert>
          ) : null
        }
        {
          error_dlgT24 ? (
            <SweetAlert
              error
              title={t("ErrorDialog")}
              confirmButtonText={t("Confirm")}
              cancelButtonText={t("Cancel")}
              onConfirm={() => {
                seterror_dlgT24(false)
              }}
            >
              {"La Línea no pudo ser creada en T24"}
            </SweetAlert>
          ) : null
        }
      </LoadingOverlay>

    </React.Fragment >
  );
};

export default withTranslation()(PantallaBusqueda);
