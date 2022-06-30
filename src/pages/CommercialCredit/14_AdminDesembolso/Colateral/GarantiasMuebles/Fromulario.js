import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Row, Col, Card, CardBody, Button, LabelRow, Label, Table } from "reactstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation";
import ApiServicesCommon from "../../../../../services/Common/ApiServicesCommon";
import { BackendServices, CoreServices } from "../../../../../services";
import { Select } from 'antd';
import Switch from "react-switch";
import Breadcrumb from "../../../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import ModalDatosPoliza from "../GarantiaEquiposNuevosUsados/ModalDatosPoliza";
import Currency from "../../../../../helpers/currency";

import moment from "moment";
import * as OPTs from "../../../../../helpers/options_helper"
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

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

const PantallaBusqueda = (props) => {
  const { Option } = Select;
  const history = useHistory();

  const location = useLocation();
  const [dataLocation, setdataLocation] = useState(undefined);
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayClienteModal, setDisplayClienteModal] = useState(false);
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [monedas, setmonedas] = useState(null);
  const [monedasSet, setmonedasSet] = useState(null);
  const [monedasGarantiasSet, setmonedasGarantiasSet] = useState(null);
  const [garantiaTipe, setgarantiaTipe] = useState(null);
  const [dataSet, setdataSet] = useState({
    "transactId": 1,
    "facilityId": 1,
    "guaranteeId": 1,
    "guaranteeType": "",
    "insuredName": "",
    "amount": 0,
    "company": "",
    "policyNumber": "",
    "policyType": "",
    "companyCode": "",
    "issuedDate": "",
    "dueDate": ""
  })
  const [dataGeneral, setdataGeneral] = useState({
    "transactId": 0,
    "facilityId": 0,
    "guaranteeId": 0,
    "guaranteeNumber": "0",
    "creditId": "",
    "disbursementNumber": "",
    "currency": "",
    "customerNumber": "",
    "assignAmount": 1,
    "guaranteedAmount": 1,
    "initialValue": 1,
    "guaranteeType": "",
    "assetCode": "",
    "guaranteeCurrency": "",
    "bank": "",
    "agency": "",
    "brand": "",
    "model": "",
    "year": 1,
    "color": "",
    "classString": "",
    "licensePlate": "",
    "serial": "",
    "engineSerial": "",
    "assetOwner": "",
    "trust": "",
    "broadcastDate": 0,
    "issuingEntity": "",
    "appraiser": "",
    "valuedReference": "",
    "valuedAmount": "",
    "appraisalDate": 0,
    "appraisalVDate": 0,
    "observations": ""
  });
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [successSave_dlg2, setsuccessSave_dlg2] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [garantiasGeneradas, setgarantiasGeneradas] = useState(null)
  const [dynamic_description, setdynamic_description] = useState("")
  const [dataPolizas, setdataPolizas] = useState(null);
  const [banco, setbanco] = useState(null);
  const [type, settype] = useState("new");
  const [typeGarantia, settypeGarantia] = useState("nuevo");
  const [bancoSet, setbancoSet] = useState(null);
  const [banca, setbanca] = useState(null);
  const [bancaSet, setbancaSet] = useState(null);
  const [bienMueble, setbienMueble] = useState(null);
  const [bienMuebleSet, setbienMuebleSet] = useState(null);
  const [clase, setclase] = useState(null);
  const [claseSet, setclaseSet] = useState(null);
  const [avaluador, setavaluador] = useState(null);
  const [avaluadorSet, setavaluadorSet] = useState(null);
  const [marca, setmarca] = useState(null);
  const [marcaSet, setmarcaSet] = useState(null);
  const [modelos, setmodelos] = useState(null);
  const [usuarioProspecto, setusuarioProspecto] = useState(null);
  const [modelosSet, setmodelosSet] = useState(null);
  const [garantiaTypeSet, setgarantiaTypeSet] = useState(null);
  const [garantiaTypeSetRequerido, setgarantiaTypeSetRequerido] = useState(false);
  const backendServices = new BackendServices();
  const coreServices = new CoreServices();
  const { t, i18n } = useTranslation();
  const currencyData = new Currency();

  const [fechaSet, setfechaSet] = useState(null)
  const [fechaSet2, setfechaSet2] = useState(null)
  const [fechaSet3, setfechaSet3] = useState(null)
  const [garantiaId, setGarantiaId] = useState(undefined)

  //abrimos modal para adjunar archivos
  useEffect(() => {
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        location.data.transactionId = 0;
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        if (location.data?.dataGeneral) {
          console.log("🚀 ~ file: Fromulario.js ~ line 175 ~ useEffect ~ location.data?.dataGeneral", location.data?.dataGeneral)
          setGarantiaId(location.data.dataGeneral.guaranteeId)
          setgarantiaTypeSet(location.data.dataGeneral.guaranteeType)
          setmonedasSet(location?.data?.dataGeneral?.currency);
          setbancoSet(location?.data?.dataGeneral?.bank);
          setbancaSet(location?.data?.dataGeneral?.agency);
          setbienMuebleSet(location?.data?.dataGeneral?.assetCode);
          setmonedasGarantiasSet(location?.data?.dataGeneral?.guaranteeCurrency);
          setmarcaSet(location?.data?.dataGeneral?.brand);
          setmodelosSet(location?.data?.dataGeneral?.model);
          setclaseSet(location?.data?.dataGeneral?.classString);
          setavaluadorSet(location?.data?.dataGeneral?.appraiser);
          setdataGeneral(location.data.dataGeneral);
          settypeGarantia("editar")
          setfechaSet(location.data?.dataGeneral?.broadcastDate ? moment(location.data?.dataGeneral?.broadcastDate).format("DD-MM-YYYY") : " ")
          setfechaSet2(location.data?.dataGeneral?.appraisalDate ? moment(location.data?.dataGeneral?.appraisalDate).format("DD-MM-YYYY") : " ")
          setfechaSet3(location.data?.dataGeneral?.appraisalVDate ? moment(location.data?.dataGeneral?.appraisalVDate).format("DD-MM-YYYY") : " ")
        } else {
          setfechaSet(moment().format("DD-MM-YYYY"));
          setfechaSet2(moment().format("DD-MM-YYYY"));
          setfechaSet3(moment().format("DD-MM-YYYY"));

        }
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
        if (result?.dataGeneral) {

          console.log("🚀 ~ file: Fromulario.js ~ line 201 ~ useEffect ~ result?.dataGeneral", result?.dataGeneral)
          setGarantiaId(result.dataGeneral.guaranteeId);
          setgarantiaTypeSet(result.dataGeneral.guaranteeType);
          setmonedasSet(result?.dataGeneral?.currency);
          setbancoSet(result?.dataGeneral?.bank);
          setbancaSet(result?.dataGeneral?.agency);
          setbienMuebleSet(result?.dataGeneral?.assetCode);
          setmonedasGarantiasSet(result?.dataGeneral?.guaranteeCurrency);
          setmarcaSet(result?.dataGeneral?.brand);
          setmodelosSet(result?.dataGeneral?.model);
          setclaseSet(result?.dataGeneral?.classString);
          setavaluadorSet(result?.dataGeneral?.appraiser);
          setdataGeneral(result.dataGeneral);
          settypeGarantia("editar");
          setfechaSet(result.dataGeneral.broadcastDate ? moment(result.dataGeneral.broadcastDate).format("DD-MM-YYYY") : " ")
          setfechaSet2(result.dataGeneral.appraisalDate ? moment(result.dataGeneral.appraisalDate).format("DD-MM-YYYY") : " ")
          setfechaSet3(result.dataGeneral.appraisalVDate ? moment(result.dataGeneral.appraisalVDate).format("DD-MM-YYYY") : " ")
        } else {
          setfechaSet(moment().format("DD-MM-YYYY"));
          setfechaSet2(moment().format("DD-MM-YYYY"));
          setfechaSet3(moment().format("DD-MM-YYYY"));

        }
        loadData(result)
      }
    }

  }, []);
  function updateData(data) {
    setdataSet(data);
    toggleShowModelAttachment();
    settype("edit")
  }
  function deleteData(data) {
    setdataSet(data);
    setconfirm_alert(true);
  }
  function loadData(data) {
    cargarPolizas(data)
    coreServices.getMonedaCatalogo().then(resp => {
      setmonedas(resp.Records)
    });
    coreServices.getCarBrandCatalog().then(resp => {
      setmarca(resp.Records)
    });
    coreServices.getCarModelCatalog().then(resp => {
      setmodelos(resp.Records)
    });
    coreServices.getAutoClassCatalog().then(resp => {
      setclase(resp.Records)
    });
    coreServices.getAppraiserCatalog().then(resp => {
      setavaluador(resp.Records)
    });
    coreServices.getBancaCatalogo().then(resp => {
      setbanca(resp.Records)
    });
    coreServices.getSubTypeWarrantyCatalog().then(resp => {
      setbienMueble(resp.Records)
    });
    coreServices.getBancosCatalogo().then(resp => {
      setbanco(resp.Records)
    });
    backendServices.consultPrincipalDebtor(data.transactionId)
      .then((data) => {
        if (data !== undefined) {
          setusuarioProspecto(data);
        }
      });
    coreServices.getTipoGarantiaCatalogo().then(resp => {
      setgarantiaTipe(resp.Records)
    });
    coreServices.getTipoGarantiaCatalogo().then(response => {
      backendServices.consultarGarantiaPropCred(data.facilityId).then(resp => {
        if (resp != undefined) {
          let json = [];
          for (let i = 0; i < resp.length; i++) {
            json.push({ Description: response.Records.find(x => x.Code === resp[i].guaranteeTypeName)?.Description, Code: resp[i].guaranteeId })
          }
          setgarantiaTipe(json)
        }
      })
    });
    backendServices.getGuaranteeMoveableAsset(data?.transactionId ?? 0).then(resp => {
      console.log(resp);
      setgarantiasGeneradas(resp)
    });

  }
  function getTemporalyData(data, tipo) {
    if (garantiaTypeSet == null || garantiaTypeSet == undefined) {
      return;
    }
    if (type == "new") {
      data.transactId = Number(dataLocation.transactionId)
      data.facilityId = Number(dataLocation.facilityId)
      data.amount = Number(data.amount)
      data.guaranteeId = garantiaId;
      data.guaranteeType = garantiaTipe.find(x => x.Code === garantiaTypeSet || x.Description === garantiaTypeSet)?.Description;
      backendServices.saveGuaranteePolicy(data).then(poliza => {
        if (poliza !== null && poliza !== undefined) {
          setsuccessSave_dlg(true)
          toggleShowModelAttachment();
        } else {
          toggleShowModelAttachment();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      })
    } else {
      data.transactId = Number(dataLocation.transactionId)
      data.facilityId = Number(dataSet.facilityId)
      data.guaranteeId = dataSet.guaranteeId;
      data.guaranteeType = dataSet.guaranteeType;
      data.policyId = dataSet.policyId;
      backendServices.updateGuaranteePolicy(data).then(poliza => {
        if (poliza !== null && poliza !== undefined) {
          setsuccessSave_dlg(true)
          toggleShowModelAttachment();
        } else {
          toggleShowModelAttachment();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      })
    }
  }
  function cargarPolizas(data) {
    backendServices.getGuaranteePolicy(data?.transactionId ?? 0).then(resp => {
      if (resp.length > 0 && resp != undefined) {
        setdataPolizas(resp.map((data) => (
          data.status ?
            <tr key={data.guaranteeType}>
              <td>{data.guaranteeType}</td>
              <td>{data.amount}</td>
              <td>{data.company}</td>
              <td>{data.policyNumber}</td>
              <td>{data.policyType}</td>
              <td>{data.companyCode}</td>
              <td>{data.issuedDate}</td>
              <td>{data.dueDate}</td>
              <td style={{ textAlign: "right" }}>
                <Button type="button" color="link" onClick={(resp) => { updateData(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => { deleteData(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setdataPolizas(
          <tr key={1}>
            <td colSpan="12" style={{ textAlign: 'center' }}></td>
          </tr>);
      }
    })
  }
  //abrimos modal para adjunar archivos
  function toggleShowModelAttachment() {
    setShowModelAttachment(!showModelAttachment);
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  function handleSubmit(event, errors, values) {
    if (garantiaTypeSet == null) {
      setgarantiaTypeSetRequerido(true);
      return;
    }
    setgarantiaTypeSetRequerido(false);
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.currency = monedasSet;
    values.guaranteeType = garantiaTipe.find(x => x.Code === garantiaTypeSet || x.Description === garantiaTypeSet)?.Description;
    values.bank = bancoSet;
    values.agency = bancaSet;
    // values.assetCode = bienMuebleSet;
    values.guaranteeCurrency = monedasGarantiasSet;
    values.brand = marcaSet;
    values.model = modelosSet;
    values.classString = claseSet;
    values.appraiser = avaluadorSet;
    values.transactId = Number(dataLocation.transactionId ?? 0);
    values.facilityId = Number(dataLocation.facilityId ?? 0);
    values.guaranteeId = garantiaId;
    values.guaranteeAmount = Number(values.guaranteeAmount)

    values.assignAmount = currencyData.getRealValue(values.assignAmount);
    values.guaranteedAmount = currencyData.getRealValue(values.guaranteedAmount);
    values.initialValue = currencyData.getRealValue(values.initialValue);
    values.valuedAmount = currencyData.getRealValue(values.valuedAmount);

    values.broadcastDate = moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD"));
    values.appraisalDate = moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet2 : (moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD"));
    values.appraisalVDate = moment(fechaSet3, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet3 : (moment(fechaSet3, "DD/MM/YYYY").format("YYYY-MM-DD"));

    const datosSet = {
      transactId: values?.transactId ?? 0,
      facilityId: values?.facilityId ?? 0,
      guaranteeId: values?.guaranteeId ?? 0,
      guaranteeNumber: values?.guaranteeNumber ?? " ",
      creditId: values?.creditId ?? " ",
      disbursementNumber: values?.disbursementNumber ?? " ",
      currency: values?.currency ?? " ",
      customerNumber: values?.customerNumber ?? " ",
      assignAmount: Number(values?.assignAmount) ?? 0,
      guaranteedAmount: Number(values?.guaranteedAmount) ?? 0,
      initialValue: Number(values?.initialValue) ?? 0,
      guaranteeType: values?.guaranteeType ?? " ",
      assetCode: values?.assetCode ?? " ",
      guaranteeCurrency: values?.guaranteeCurrency ?? " ",
      bank: values?.bank ?? " ",
      agency: values?.agency ?? " ",
      brand: values?.brand ?? " ",
      model: values?.model ?? " ",
      year: Number(values?.year) ?? 0,
      color: values?.color ?? " ",
      classString: values?.classString ?? " ",
      licensePlate: values?.licensePlate ?? " ",
      serial: values?.serial ?? " ",
      engineSerial: values?.engineSerial ?? " ",
      assetOwner: values?.assetOwner ?? " ",
      trust: values?.trust ?? " ",
      // broadcastDate: 1646875298,
      // broadcastDate: moment(values?.broadcastDate ?? " ").valueOf(),
      broadcastDate: values.broadcastDate,
      issuingEntity: values?.issuingEntity ?? " ",
      appraiser: values?.appraiser ?? " ",
      valuedReference: values?.valuedReference ?? " ",
      valuedAmount: values?.valuedAmount ?? " ",
      // appraisalDate: 1646875298,
      // appraisalVDate: 1646875298,
      appraisalDate: values.appraisalDate,
      appraisalVDate: values.appraisalVDate,
      // appraisalDate: moment(values?.appraisalDate ?? " ").valueOf(),
      // appraisalVDate: moment(values?.appraisalVDate ?? " ").valueOf(),
      observations: values?.observations ?? " "
    }
    console.log("🚀 ~ file: Fromulario.js ~ line 436 ~ handleSubmit ~ datosSet", datosSet)
    if (typeGarantia == "editar") {
      backendServices.updateGuaranteeMoveableAsset(datosSet).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg2(true)
        } else {
          seterror_dlg(false);
        }
      }).catch(err => {
      })
    } else {
      backendServices.saveGuaranteeMoveableAsset(datosSet).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg2(true)
        } else {
          seterror_dlg(false);
        }
      }).catch(err => {
      })

    }
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

  return (
    <React.Fragment>
      <h4 className="card-title title-header">{usuarioProspecto != null ? usuarioProspecto.name + " " + usuarioProspecto.name2 + " " + usuarioProspecto.lastName + " " + usuarioProspecto.lastName2 : ""}    #{dataLocation?.transactionId ?? 0}</h4>
      {/* <h5>{t("Datos Generales")}</h5> */}
      <p className="card-title-desc"></p>
      <AvForm id="frmGarantiasMuebles" className="needs-validation" onSubmit={handleSubmit} autoComplete="off">
        <Row>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="IDGarantia">{t("Warranty ID")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="guaranteeNumber"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.guaranteeNumber ?? ""}
                id="guaranteeNumber"
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="IdCredito">{t("Credit ID")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="creditId"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.creditId ?? ""}
                id="creditId"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Numerodeprestamo">
                {t("Loan or Disbursement Number")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="disbursementNumber"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.disbursementNumber ?? ""}
                id="disbursementNumber"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-2">
              <Label>{t("Coin")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.currency ?? 0}
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
                </Select> : null}
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Numerodecliente">{t("Client number")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="customerNumber"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.customerNumber ?? ""}
                id="customerNumber"
                title={t("")}
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="MontoGarantia">
                {t("Amount Assigned in Guarantee")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                pattern="^[0-9,.]*$"
                onKeyPress={(e) => { return check(e) }}
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                name="assignAmount"
                value={currencyData.format(typeGarantia == "nuevo" ? 0 : dataGeneral?.assignAmount ?? 0)}
                id="assignAmount"
                title={t("")}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="MontoGarantizado">{t("Guaranteed amount")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="guaranteedAmount"
                pattern="^[0-9,.]*$"
                onKeyPress={(e) => { return check(e) }}
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                value={currencyData.format(typeGarantia == "nuevo" ? 0 : dataGeneral?.guaranteedAmount ?? 0)}
                id="guaranteedAmount"
                title={t("")}
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="MontoGarantia">
                {t("Initial value of the Guarantee")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="initialValue"
                pattern="^[0-9,.]*$"
                onKeyPress={(e) => { return check(e) }}
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                value={currencyData.format(typeGarantia == "nuevo" ? 0 : dataGeneral?.initialValue ?? 0)}
                id="initialValue"
                title={t("")}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Warrant Type")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.guaranteeType ?? ""}
                  onChange={(e) => { setgarantiaTypeSet(e); }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {garantiaTipe != null ?
                    garantiaTipe.map((item, index) => (
                      garantiasGeneradas?.length > 0 && typeGarantia == "nuevo" ?
                        garantiasGeneradas.find(x => x.guaranteeId === item.Code) ?
                          null : <Option key={index} value={item.Code}>{item.Description}</Option> : <Option key={index} value={item.Code}>{item.Description}</Option>
                    ))
                    : null}
                </Select>
                : null}
              {garantiaTypeSetRequerido ?
                <p className="message-error-parrafo">{t("Required Field")}</p>
                : null}
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label>{t("Movable Property Code")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="assetCode"
                value={currencyData.format(typeGarantia == "nuevo" ? "" : dataGeneral?.assetCode ?? "")}
                id="assetCode"
                title={t("")}
              />
              {/* {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.assetCode ?? 0}
                  onChange={(e) => { setbienMuebleSet(e) }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {bienMueble != null ?

                    bienMueble.map((item, index) => (
                      <Option key={index} value={item.Description}>{item.Description}</Option>
                    ))
                    : null}
                </Select> : null} */}
            </div>
          </Col>

          <Col md="3">
            <div className="mb-2">
              <Label>{t("Guarantee Currency")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.guaranteeCurrency ?? 0}
                  onChange={(e) => { setmonedasGarantiasSet(e) }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {monedas != null ?

                    monedas.map((item, index) => (
                      <Option key={index} value={item.Description}>{item.Description}</Option>
                    ))
                    : null}
                </Select> : null}
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label>{t("Bank")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.bank ?? ""}
                  onChange={(e) => { setbancoSet(e) }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {banco != null ?
                    banco.map((item, index) => (
                      <Option key={index} value={item.Description}>{item.Description}</Option>
                    ))
                    : null}
                </Select>
                : null}
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Agency(Banking)")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.agency ?? ""}
                  onChange={(e) => { setbancaSet(e) }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {banca != null ?
                    banca.map((item, index) => (
                      <Option key={index} value={item.Description}>{item.Description}</Option>
                    ))
                    : null}
                </Select>
                : null}
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Marca">{t("Brand")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.brand ?? 0}
                  onChange={(e) => { setmarcaSet(e) }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {marca != null ?

                    marca.map((item, index) => (
                      <Option key={index} value={item.Description}>{item.Description}</Option>
                    ))
                    : null}
                </Select> : null}
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Modelo">{t("Model")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.model ?? 0}
                  onChange={(e) => { setmodelosSet(e) }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {modelos != null ?

                    modelos.map((item, index) => (
                      <Option key={index} value={item.Description}>{item.Description}</Option>
                    ))
                    : null}
                </Select> : null}
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Año">{t("Year")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="year"
                validate={{
                  number: { value: true, errorMessage: t("InvalidField") },
                }}
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.year ?? ""}
                id="year"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Color">{t("Color")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="color"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.color ?? ""}
                id="color"
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Clase")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.classString ?? 0}
                  onChange={(e) => { setclaseSet(e) }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {clase != null ?

                    clase.map((item, index) => (
                      <Option key={index} value={item.Description}>{item.Description}</Option>
                    ))
                    : null}
                </Select> : null}
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Placa">{t("License plate")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="licensePlate"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.licensePlate ?? ""}
                id="licensePlate"
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Serial">{t("Serial")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="serial"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.serial ?? ""}
                id="serial"
                title={t("")}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Seriamotor">{t("Serial Engine")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="engineSerial"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.engineSerial ?? ""}
                id="engineSerial"
                title={t("")}
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="PropietarioBien">
                {t("Property Owner")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="assetOwner"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.assetOwner ?? ""}
                id="assetOwner"
                title={t("")}
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="NoFidecomiso">{t("TrustNumber")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="trust"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.trust ?? ""}
                id="trust"
                title={t("")}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Trust Issuance Date")}</Label>

              {fechaSet && (<Flatpickr
                id="broadcastDate"
                name="broadcastDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: fechaSet
                }}
                onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
              />)}

            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label>{t("Name of Issuing Entity")}</Label>
              <AvField
                className="form-control"
                name="issuingEntity"
                type="text"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.issuingEntity ?? ""}
                id="issuingEntity"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label>{t("Appraiser")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.appraiser ?? 0}
                  onChange={(e) => { setavaluadorSet(e) }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {avaluador != null ?

                    avaluador.map((item, index) => (
                      <Option key={index} value={item.Description}>{item.Description}</Option>
                    ))
                    : null}
                </Select> : null}
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="ReferenciaAvaluo">
                {t("Appraisal Reference")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="valuedReference"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.valuedReference ?? ""}
                id="valuedReference"
                title={t("")}
              />
            </div>
          </Col>
          <Col md="2">
            <div className="mb-2">
              <Label htmlFor="MontoAvaluo">{t("Appraisal Amount")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="valuedAmount"
                pattern="^[0-9,.]*$"
                onKeyPress={(e) => { return check(e) }}
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                value={currencyData.format(typeGarantia == "nuevo" ? 0 : dataGeneral?.valuedAmount ?? 0)}
                id="valuedAmount"
                title={t("")}
              />
            </div>
          </Col>
          <Col md="2">
            <div className="mb-2">
              <Label>{t("Transaction date")}</Label>

              {fechaSet2 && (<Flatpickr
                id="appraisalDate"
                name="appraisalDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: fechaSet2
                }}
                onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
              />)}

            </div>
          </Col>
          <Col md="3">
            <div className="mb-2">
              <Label>{t("Transaction Expiration Date")}</Label>

              {fechaSet3 && (<Flatpickr
                id="appraisalVDate"
                name="appraisalVDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: fechaSet3
                }}
                onChange={(selectedDates, dateStr, instance) => { setfechaSet3(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
              />)}
            </div>
          </Col>

          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="Comentario">{t("Additional Comments")}</Label>
              <AvField
                className="form-control"
                type="textarea"
                name="observations"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.observations ?? ""}
                id="observations"
                title={t("")}
                rows="6"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} style={{ textAlign: "right", marginTop: "10px" }}>
            <Link
              to={{
                pathname: '/creditocomercial/garantias/',
                data: { facilityId: dataLocation?.facilityId ?? 0, transactionId: dataLocation?.transactionId ?? 0 },
              }}
            >
              <Button
                id="btnNew"
                color="danger"
                type="button"
                style={{ margin: "5px" }}
                onClick={props.toggle}
                data-dismiss="modal"
              >
                <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}
                {t("Cancel")}
              </Button>
            </Link>
            <Button id="btnSearch" type="submit" color="success" style={{ margin: '5px' }}>
              <i className="mdi mdi-content-save mdi-12px"></i>
              {" "} {typeGarantia == "nuevo" ? t("Save") : t("Save")}</Button>
          </Col>
        </Row>
      </AvForm>
      <p className="card-title-desc"></p>
      <AvForm id="frmDatosPoliza" className="needs-validation">
        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("Policy Data")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            {garantiaTypeSet != null ?
              <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                toggleShowModelAttachment();
                setdataSet({
                  "transactId": 0,
                  "facilityId": 0,
                  "guaranteeId": 0,
                  "guaranteeType": "",
                  "insuredName": "",
                  "amount": 0,
                  "company": "",
                  "policyNumber": "",
                  "policyType": "",
                  "companyCode": "",
                  "issuedDate": "",
                  "dueDate": ""
                });
                settype("new");
              }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
              : <p className="message-error-parrafo">{t("Select a guarantee to be able to generate a policy")}</p>}
          </Col>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("Warrant Type")}</th>
                  <th>{t("Amount")}</th>
                  <th>{t("Insurance company")}</th>
                  <th>{t("Policy Number")}</th>
                  <th>{t("Policy type")}</th>
                  <th>{t("Broker Company")}</th>
                  <th>{t("Policy Issue Date")}</th>
                  <th>{t("Policy Expiration Date")}</th>
                  <th>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>{dataPolizas}</tbody>
            </Table>
          </Col>
        </Row>
      </AvForm>
      <ModalDatosPoliza
        getTemporalyData={getTemporalyData}
        isOpen={showModelAttachment}
        dataSet={dataSet}
        tipo={type}
        toggle={() => {
          toggleShowModelAttachment();
        }}
      />
      {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            cargarPolizas(dataLocation);
          }}
        >
          {t("SuccessSaveMessage")}
        </SweetAlert>
      ) : null}
      {successSave_dlg2 ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg2(false)
            history.push({
              pathname: '/creditocomercial/garantias/',
              data: { facilityId: dataLocation?.facilityId ?? 0, transactionId: dataLocation?.transactionId ?? 0 },
            });
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
            cargarPolizas(dataLocation);
          }}
        >
          {error_msg}
        </SweetAlert>
      ) : null}
      {confirm_alert ? (
        <SweetAlert
          title={t("Areyousure")}
          cancelButtonText={t("Cancel")}
          warning
          showCancel
          confirmButtonText={t("Yesdeleteit")}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            const apiBack = new BackendServices();
            // eliminarClienteIGR
            apiBack.deleteGuaranteePolicy(dataSet.transactId ?? 0, dataSet.facilityId ?? 0, dataSet.guaranteeId ?? 0, dataSet.policyId ?? 0).then(resp => {
              if (resp.statusCode == "500") {
                setconfirm_alert(false)
                seterror_dlg(false)
              } else {
                setconfirm_alert(false)
                setsuccessSave_dlg(true)
              }
            }).catch(error => {
              setconfirm_alert(false)
              seterror_dlg(false)
            })
          }}
          onCancel={() => setconfirm_alert(false)}
        >
          {t("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
    </React.Fragment>
  );
};

export default withTranslation()(PantallaBusqueda);
