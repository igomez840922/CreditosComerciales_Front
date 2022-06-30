import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import moment from "moment";
import * as OPTs from "../../../../../helpers/options_helper"
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

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
    "guaranteeNumber": "",
    "attachedNumber": "",
    "loanNumber": "",
    "currency": "",
    "customerNumber": "",
    "asignedAmount": 0,
    "guaranteedType": 0,
    "initialValue": 0,
    "guaranteeType": "",
    "ownerAsset": "",
    "guaranteeCurrency": "",
    "bank": "",
    "agency": "",
    "instrumentType": "",
    "documentId": "",
    "trustNumber": "",
    "issuedDate": "",
    "guaranteeIdd": "",
    "guarantorName": "",
    "entityName": "",
    "organismCode": "",
    "issuedCountry": "",
    "updateDate": ""
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
  const [pais, setpais] = useState(null);
  const [paisSet, setpaisSet] = useState(null);
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
  const [fechaSet, setfechaSet] = useState(null);
  const [fechaSet2, setfechaSet2] = useState(null);
  const [garantiaId, setGarantiaId] = useState(null);
  const currencyData = new Currency();


  //abrimos modal para adjunar archivos
  useEffect(() => {
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        location.data.transactionId = 0;
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        if (location.data?.dataGeneral) {
          console.log("🚀 ~ file: Formulario.js ~ line 168 ~ useEffect ~ location.data?.dataGeneral", location.data?.dataGeneral)
          setGarantiaId(location.data.dataGeneral.guaranteeId)
          setgarantiaTypeSet(location.data.dataGeneral.guaranteeType)
          setmonedasSet(location?.data?.dataGeneral?.currency);
          setavaluadorSet(location?.data?.dataGeneral?.entityName);
          setbancoSet(location?.data?.dataGeneral?.bank);
          setbancaSet(location?.data?.dataGeneral?.agency);
          setmonedasGarantiasSet(location?.data?.dataGeneral?.guaranteeCurrency);
          setpaisSet(location?.data?.dataGeneral?.issuedCountry);
          // setavaluadorSet(location?.data?.dataGeneral?.appraiser);
          setdataGeneral(location.data.dataGeneral);
          settypeGarantia("editar")
          setfechaSet(moment(location.data.dataGeneral?.updateDate).format("DD-MM-YYYY"));
          setfechaSet2(moment(location.data.dataGeneral?.issuedDate).format("DD-MM-YYYY"));
        } else {
          setfechaSet(moment().format("DD-MM-YYYY"));
          setfechaSet2(moment().format("DD-MM-YYYY"));
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
          console.log("🚀 ~ file: Formulario.js ~ line 197 ~ useEffect ~ result?.dataGenera", result?.dataGenera)
          setavaluadorSet(result?.dataGeneral?.entityName);
          setmonedasSet(result?.dataGeneral?.currency);
          setGarantiaId(result?.dataGeneral.guaranteeId)
          setgarantiaTypeSet(result.dataGeneral.guaranteeType);
          setbancoSet(result?.dataGeneral?.bank);
          setbancaSet(result?.dataGeneral?.agency);
          setmonedasGarantiasSet(result?.dataGeneral?.guaranteeCurrency);
          setpaisSet(result?.dataGeneral?.issuedCountry);
          setdataGeneral(result.dataGeneral);
          settypeGarantia("editar");
          setfechaSet(moment(result?.dataGeneral?.updateDate).format("DD-MM-YYYY"));
          setfechaSet2(moment(result?.dataGeneral?.issuedDate).format("DD-MM-YYYY"));
        } else {
          setfechaSet(moment().format("DD-MM-YYYY"));
          setfechaSet2(moment().format("DD-MM-YYYY"));
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
    console.log(data);
    cargarPolizas(data)
    coreServices.getMonedaCatalogo().then(resp => {
      setmonedas(resp.Records)
    });
    coreServices.getCarBrandCatalog().then(resp => {
      setmarca(resp.Records)
    });
    coreServices.getPaisesCatalogo().then(resp => {
      setpais(resp.Records)
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
    backendServices.getOtherGuarantees(data?.transactionId ?? 0).then(resp => {
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
    console.log(avaluadorSet)
    values.currency = monedasSet;
    values.guaranteeType = garantiaTipe.find(x => x.Description === garantiaTypeSet || x.Code === garantiaTypeSet)?.Description;
    values.bank = bancoSet;
    values.agency = bancaSet;
    values.assetCode = bienMuebleSet;
    values.guaranteeCurrency = monedasGarantiasSet;
    values.entityName = avaluadorSet;
    values.issuedCountry = paisSet;
    values.transactId = Number(dataLocation.transactionId ?? 0);
    values.facilityId = Number(dataLocation.facilityId ?? 0);
    values.guaranteeId = garantiaId;

    values.asignedAmount = currencyData.getRealValue(values.asignedAmount);
    values.guaranteedType = currencyData.getRealValue(values.guaranteedType);
    values.initialValue = currencyData.getRealValue(values.initialValue);


    const datosSet = {
      transactId: values?.transactId ?? 0,
      facilityId: values?.facilityId ?? 0,
      guaranteeId: values?.guaranteeId ?? 0,
      guaranteeNumber: values?.guaranteeNumber ?? "",
      attachedNumber: values?.attachedNumber ?? "",
      loanNumber: values?.loanNumber ?? "",
      currency: values?.currency ?? "",
      customerNumber: values?.customerNumber ?? "",
      asignedAmount: Number(values?.asignedAmount) ?? 0,
      guaranteedType: Number(values?.guaranteedType) ?? 0,
      initialValue: Number(values?.initialValue) ?? 0,
      guaranteeType: values?.guaranteeType ?? "",
      ownerAsset: values?.ownerAsset ?? "",
      guaranteeCurrency: values?.guaranteeCurrency ?? "",
      bank: values?.bank ?? "",
      agency: values?.agency ?? "",
      instrumentType: values?.instrumentType ?? "",
      documentId: values?.documentId ?? "",
      trustNumber: values?.trustNumber ?? "",
      issuedDate: moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet2 : (moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD")),
      guaranteeIdd: values?.guaranteeIdd ?? "",
      guarantorName: values?.guarantorName ?? "",
      entityName: values?.entityName ?? "",
      organismCode: values?.organismCode ?? "",
      issuedCountry: values?.issuedCountry ?? "",
      updateDate: moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD"))
    }
    if (typeGarantia == "editar") {
      backendServices.updateOtherGuarantees(datosSet).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg2(true)
        } else {
          seterror_dlg(false);
        }
      }).catch(err => {
      })
    } else {
      backendServices.saveOtherGuarantees(datosSet).then(resp => {
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

      <h5>{t("General Data")}</h5>
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
                validate={{
                  number: { value: true, errorMessage: t("InvalidField") },
                }}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="IdCredito">{t("Credit ID")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="attachedNumber"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.attachedNumber ?? ""}
                id="attachedNumber"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Numerodeprestamo"> {t("Loan or Disbursement Number")} </Label>
              <AvField
                className="form-control"
                type="text"
                name="loanNumber"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.loanNumber ?? ""}
                id="loanNumber"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label>{t("Currency")}</Label>
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
                onKeyPress={(e) => { return check(e) }}
                pattern="^[0-9,.]*$"
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                name="asignedAmount"
                value={currencyData.format(typeGarantia == "nuevo" ? 0 : dataGeneral?.asignedAmount ?? 0)}
                id="asignedAmount"

              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="MontoGarantizado">{t("Guaranteed amount")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="guaranteedType"
                value={currencyData.format(typeGarantia == "nuevo" ? 0 : dataGeneral?.guaranteedType ?? 0)}
                onKeyPress={(e) => { return check(e) }}
                pattern="^[0-9,.]*$"
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                id="guaranteedType"

              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Valorinigarantia">
                {t("Initial Value of the Guarantee")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                onKeyPress={(e) => { return check(e) }}
                pattern="^[0-9,.]*$"
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                name="initialValue"
                value={currencyData.format(typeGarantia == "nuevo" ? 0 : dataGeneral?.initialValue ?? 0)}
                id="initialValue"

              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label>{t("Type of Guarantee")}</Label>
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
              <Label htmlFor="CodigoBien">
                {t("Asset Code (Guarantee Subtype)")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="ownerAsset"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.ownerAsset ?? ""}
                id="ownerAsset"
              />
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
              <Label>{t("Agency (Banking)")}</Label>
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
            <div className="mb-2">
              <Label>{t("Type of Financial Instrument")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="instrumentType"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.instrumentType ?? ""}
                id="instrumentType"
              />

            </div>
          </Col>

          <Col md="3">
            <div className="mb-2">
              <Label htmlFor="IdDocumento">{t("Document ID")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="documentId"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.documentId ?? ""}
                id="documentId"
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-2">
              <Label htmlFor="Nofidecomiso">{t("Trust Number")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="trustNumber"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.trustNumber ?? ""}
                id="trustNumber"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label>{t("Trust Issuance Date")}</Label>

              {fechaSet2 ?
                <Flatpickr
                  id="dueDate"
                  name="dueDate"
                  className="form-control d-block"
                  placeholder={OPTs.FORMAT_DATE_SHOW}
                  options={{
                    dateFormat: OPTs.FORMAT_DATE,
                    //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                    defaultDate: fechaSet2
                  }}
                  onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                /> : null}


            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="IdGarantia">{t("Warranty ID")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="guaranteeIdd"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.guaranteeIdd ?? ""}
                id="guaranteeIdd"
              />
            </div>
          </Col>


          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="NombreFiador">{t("Guarantor's Name")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="guarantorName"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.guarantorName ?? ""}
                id="guarantorName"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="NombreEntidad">
                {t("Appraiser")}
              </Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.entityName ?? 0}
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
              <Label htmlFor="CodigoOrganismo">
                {t("Agency Code")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="organismCode"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.organismCode ?? ""}
                id="organismCode"
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="PaisEmision">{t("Issuing Countries")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={dataGeneral?.issuedCountry ?? 0}
                  onChange={(e) => { setpaisSet(e) }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {pais != null ?

                    pais.map((item, index) => (
                      <Option key={index} value={item.Description}>{item.Description}</Option>
                    ))
                    : null}
                </Select> : null}
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Date for last update")}</Label>

              {/* <Flatpickr
                id="updateDate"
                name="updateDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: dataGeneral !== undefined && dataGeneral !== null ? new Date(moment(dataGeneral.updateDate, 'YYYY-MM-DD').format()) : new Date()
                }}
              //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
              /> */}
              {fechaSet ?
                <Flatpickr
                  id="dueDate"
                  name="dueDate"
                  className="form-control d-block"
                  placeholder={OPTs.FORMAT_DATE_SHOW}
                  options={{
                    dateFormat: OPTs.FORMAT_DATE,
                    //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                    defaultDate: fechaSet
                  }}
                  onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                /> : null}

            </div>
          </Col>

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
          warning
          showCancel
          confirmButtonText={t("Yesdeleteit")}
          cancelButtonText={t("Cancel")}
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
