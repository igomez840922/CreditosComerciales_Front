import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { Row, Col, Card, CardBody, Button, Label, Table } from "reactstrap";
import { Link, useHistory } from "react-router-dom";

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation";
import ApiServicesCommon from "../../../../../services/Common/ApiServicesCommon";
import { BackendServices, CoreServices } from "../../../../../services";
import { Select } from 'antd';
import Currency from "../../../../../helpers/currency";
import { useLocation } from "react-router-dom";
import Switch from "react-switch";
import Breadcrumb from "../../../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import ModalDatosPoliza from "./ModalDatosPoliza";
import SweetAlert from "react-bootstrap-sweetalert"


import moment from "moment";
import { saveLogProcess } from "../../../../../helpers/logs_helper";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import * as OPTs from "../../../../../helpers/options_helper";


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
  const currencyData = new Currency()
  const location = useLocation();
  const [dataLocation, setdataLocation] = useState(undefined);
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayClienteModal, setDisplayClienteModal] = useState(false);
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [monedas, setmonedas] = useState(null);
  const [monedasSet, setmonedasSet] = useState(null);
  const [garantiaTipe, setgarantiaTipe] = useState(null);
  const [usuarioProspecto, setusuarioProspecto] = useState(null);

  const [dataGeneral, setdataGeneral] = useState({
    "transactId": 0,
    "facilityId": 0,
    "guaranteeId": "",
    "guaranteeNumber": "",
    "attachedNumber": "",
    "loanNumber": "",
    "currency": "",
    "customerNumber": "",
    "guaranteeAmount": 0,
    "guaranteeType": "",
    "bank": "",
    "agency": "",
    "assetCode": "",
    "dueDate": "2000-01-01",
    "trust": "",
    "trustDate": "2000-01-01",
    "equipmentType": "",
    "engine": "",
    "serie": "",
    "model": "",
    "year": 0
  });
  const [garantiaid, setGarantiaid] = useState(null);
  const [garantiaTypeSet, setgarantiaTypeSet] = useState(null);
  const [garantiaTypeSetRequerido, setgarantiaTypeSetRequerido] = useState(false);
  const [banco, setbanco] = useState(null);
  const [type, settype] = useState("new");
  const [typeGarantia, settypeGarantia] = useState("nuevo");
  const [bancoSet, setbancoSet] = useState(null);
  const [banca, setbanca] = useState(null);
  const [bancaSet, setbancaSet] = useState(null);
  const [dataPolizas, setdataPolizas] = useState(null);
  const [dataPolizas2, setdataPolizas2] = useState(null);
  const [dataTemporaly, setdataTemporaly] = useState([]);
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

  const [dynamic_description, setdynamic_description] = useState("")
  const backendServices = new BackendServices();
  const coreServices = new CoreServices();
  const { t, i18n } = useTranslation();

  const [fechaSet, setfechaSet] = useState(null)
  const [fechaSet2, setfechaSet2] = useState(null)


  //abrimos modal para adjunar archivos
  useEffect(() => {
    let data;
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        location.data.transactionId = 0;
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        if (location.data?.dataGeneral) {
          setGarantiaid(location.data.dataGeneral.guaranteeId)
          setdataGeneral(location.data.dataGeneral);
          data = location.data.dataGeneral;
          settypeGarantia("editar")
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
          setGarantiaid(result.dataGeneral.guaranteeId)
          setdataGeneral(result.dataGeneral);
          settypeGarantia("editar");
          data = result.dataGeneral;
        }
        loadData(result)
      }
    }
    console.log(data)

    setmonedasSet(data?.currency ?? '')
    setgarantiaTypeSet(data?.guaranteeType ?? '');
    setbancoSet(data?.bank ?? '');
    setbancaSet(data?.agency ?? '')

    console.log(data);
    setfechaSet(data?.trustDate == "" || data?.trustDate == null || data?.trustDate == undefined ? "2000-01-01" : moment(data?.trustDate).format("DD-MM-YYYY"))
    setfechaSet2(data?.dueDate == "" || data?.dueDate == null || data?.dueDate == undefined ? "2000-01-01" : moment(data?.dueDate).format("DD-MM-YYYY"))


  }, []);
  function loadData(data) {
    cargarPolizas(data)
    coreServices.getMonedaCatalogo().then(resp => {
      setmonedas(resp.Records)
    });
    coreServices.getBancaCatalogo().then(resp => {
      setbanca(resp.Records)
    });
    coreServices.getBancosCatalogo().then(resp => {
      setbanco(resp.Records)
    });
    // coreServices.getTipoGarantiaCatalogo().then(resp => {
    //   setgarantiaTipe(resp.Records)
    // });
    backendServices.consultPrincipalDebtor(data.transactionId)
      .then((data) => {
        if (data !== undefined) {
          setusuarioProspecto(data);
        }
      });
    coreServices.getTipoGarantiaCatalogo().then(response => {
      backendServices.consultarGarantiaPropCred(data.facilityId).then(resp => {
        console.log(response, resp)
        if (resp != undefined) {
          let json = [];
          for (let i = 0; i < resp.length; i++) {
            json.push({ Description: response.Records.find(x => x.Code === resp[i].guaranteeTypeName)?.Description, Code: resp[i].guaranteeId })
          }
          setgarantiaTipe(json)
        }
      })
    });
    backendServices.getGuaranteeUsedNewEquipments(data?.transactionId ?? 0).then(resp => {
      console.log(resp);
      setgarantiasGeneradas(resp)
    });

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
    console.log(garantiaTipe, garantiaTypeSet)
    values.currency = monedasSet;
    values.guaranteeType = garantiaTipe.find(x => x.Code === garantiaTypeSet || x.Description === garantiaTypeSet)?.Description;
    values.bank = bancoSet;
    values.agency = bancaSet;
    values.transactId = Number(dataLocation.transactionId ?? 0);
    values.facilityId = Number(dataLocation.facilityId ?? 0);
    values.equipmentType = " ";
    values.engine = " ";
    values.serie = " ";
    values.model = " ";
    values.year = 0;
    values.guaranteeId = garantiaid;
    values.guaranteeAmount = Number(currencyData.getRealValue(values?.guaranteeAmount ?? 0))

    values.trustDate = moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD"));;
    values.dueDate = moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet2 : (moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD"));;

    const datosSet = {
      transactId: values?.transactId ?? 0,
      facilityId: values?.facilityId ?? 0,
      guaranteeId: values?.guaranteeId ?? 0,
      guaranteeNumber: values?.guaranteeNumber ?? " ",
      attachedNumber: values?.attachedNumber ?? " ",
      loanNumber: values?.loanNumber ?? " ",
      currency: values?.currency ?? " ",
      customerNumber: values?.customerNumber ?? " ",
      guaranteeAmount: values?.guaranteeAmount ?? 0,
      guaranteeType: values?.guaranteeType ?? " ",
      bank: values?.bank ?? " ",
      agency: values?.agency ?? " ",
      assetCode: values?.assetCode ?? " ",
      dueDate: values?.dueDate ?? " ",
      trust: values?.trust ?? " ",
      trustDate: values?.trustDate ?? " ",
      equipmentType: values?.equipmentType ?? " ",
      engine: values?.engine ?? " ",
      serie: values?.serie ?? " ",
      model: values?.model ?? " ",
      year: values?.year ?? " "
    }
    if (typeGarantia == "editar") {
      backendServices.updateGuaranteeUsedNewEquipments(datosSet).then(resp => {
        if (resp !== null && resp !== undefined) {
          setdataGeneral({
            "transactId": 0,
            "facilityId": 0,
            "guaranteeId": "",
            "guaranteeNumber": "",
            "attachedNumber": "",
            "loanNumber": "",
            "currency": "",
            "customerNumber": "",
            "guaranteeAmount": 0,
            "guaranteeType": "",
            "bank": "",
            "agency": "",
            "assetCode": "",
            "dueDate": "2000-01-01",
            "trust": "",
            "trustDate": "2000-01-01",
            "equipmentType": "",
            "engine": "",
            "serie": "",
            "model": "",
            "year": 0
          });
          setsuccessSave_dlg2(true)
        } else {
          seterror_dlg(false);
        }
      }).catch(err => {
      })
    } else {
      setdataGeneral({
        "transactId": 0,
        "facilityId": 0,
        "guaranteeId": "",
        "guaranteeNumber": "",
        "attachedNumber": "",
        "loanNumber": "",
        "currency": "",
        "customerNumber": "",
        "guaranteeAmount": 0,
        "guaranteeType": "",
        "bank": "",
        "agency": "",
        "assetCode": "",
        "dueDate": "2000-01-01",
        "trust": "",
        "trustDate": "2000-01-01",
        "equipmentType": "",
        "engine": "",
        "serie": "",
        "model": "",
        "year": 0
      });
      backendServices.saveGuaranteeUsedNewEquipments(datosSet).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg2(true)
        } else {
          seterror_dlg(false);
        }
      }).catch(err => {
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
              <td>${currencyData.formatTable(data?.amount ?? 0)}</td>
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
  function updateData(data) {
    setdataSet(data);
    toggleShowModelAttachment();
    settype("edit")
  }
  function deleteData(data) {
    setdataSet(data);
    setconfirm_alert(true);
  }
  function toggleShowModelAttachment() {
    setShowModelAttachment(!showModelAttachment);
    removeBodyCss();
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  function getTemporalyData(data, tipo) {
    if (garantiaTypeSet == null || garantiaTypeSet == undefined) {
      return;
    }
    if (type == "new") {
      data.transactId = Number(dataLocation.transactionId)
      data.facilityId = Number(dataLocation.facilityId)
      data.amount = Number(data.amount)
      data.guaranteeId = garantiaid;
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

      <h5>{t("Datos Generales")}</h5>
      <p className="card-title-desc"></p>

      <AvForm id="frmGarantiasMuebles" autoComplete="off" className="needs-validation" onSubmit={handleSubmit}  >
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
              <Label htmlFor="NumerodeArrachment">
                {t("Attachment Number")}
              </Label>
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
              <Label htmlFor="Numerodeprestamo">
                {t("Loan number")}
              </Label>
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
              <Label>{t("Coin")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={typeGarantia == "nuevo" ? "" : dataGeneral?.currency ?? 0}
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
              <Label htmlFor="customerNumber">{t("Client number")}</Label>
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
              <Label htmlFor="MontoGarantia">{t("Guarantee Amount")}</Label>
              <AvField
                className="form-control"
                type="text"
                onKeyPress={(e) => { return check(e) }}
                pattern="^[0-9,.]*$"
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                name="guaranteeAmount"
                value={typeGarantia == "nuevo" ? "" : currencyData.format(dataGeneral?.guaranteeAmount ?? 0)}
                id="guaranteeAmount"
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("GuaranteeType")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={typeGarantia == "nuevo" ? "" : dataGeneral?.guaranteeType ?? ""}
                  onChange={(e) => { setgarantiaTypeSet(e); }}
                  filterOption={(input, option) =>
                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {garantiaTipe != null ?
                    garantiaTipe.map((item, index) => (
                      garantiasGeneradas?.length > 0 && typeGarantia == "nuevo" ?
                        garantiasGeneradas.find(x => x.guaranteeId === item.Code) ?
                          null : <Option key={index} value={item.Description}>{item.Description}</Option> : <Option key={index} value={item.Description}>{item.Description}</Option>
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
              <Label>{t("Bank")}</Label>
              {garantiaTipe != null ?
                <Select noOptionsMessage={() => ""}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder={t("SearchtoSelect")}
                  optionFilterProp="children"
                  defaultValue={typeGarantia == "nuevo" ? "" : dataGeneral?.bank ?? ""}
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
                  defaultValue={typeGarantia == "nuevo" ? "" : dataGeneral?.agency ?? ""}
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
              <Label htmlFor="MontoGarantia">
                {t("Movable Property Code")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="assetCode"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.assetCode ?? ""}
                id="assetCode"
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Transaction Expiration Date")}</Label>
              {fechaSet2 && (<Flatpickr
                name="birthDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  defaultDate: fechaSet
                }}
                onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
              />)}


            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="NoFideicomiso">{t("TrustNumber")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="trust"
                value={typeGarantia == "nuevo" ? "" : dataGeneral?.trust ?? ""}
                id="trust"
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="NoFideicomiso">
                {t("Trust Issuance Date")}
              </Label>
              {fechaSet && (<Flatpickr
                name="birthDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  defaultDate: fechaSet2
                }}
                onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
              />)}

            </div>
          </Col>
          {/* <Col md="3">
            <div className="mb-3">
              <Label>{t("Tipo de Equipo")}</Label>
              <Select noOptionsMessage={() => ""} 
                showSearch
                style={{ width: "100%" }}
                placeholder={t("SearchtoSelect")}
                optionFilterProp="children"
                // defaultValue={props.dataCapex1.back}
                onChange={(e) => { setmonedasSet(e) }}
                filterOption={(input, option) =>
                  option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {monedas != null ?

                  monedas.map((item, index) => (
                    <Option key={index} value={item.Code}>{item.Description}</Option>
                  ))
                  : null}
              </Select>
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Motor">{t("Motor")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Serie">{t("Serie")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Modelo">{t("Modelo")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Placa">{t("Año")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
              />
            </div>
          </Col> */}
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
          </Row>
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
              data: {
                facilityId: dataLocation?.facilityId ?? 0, transactionId: dataLocation?.transactionId ?? 0,
                "containerId": dataLocation.containerId,
                "priority": dataLocation.priority ?? "",
                "infobpm": dataLocation.infobpm,
                "requestId": dataLocation.requestId ?? "",
                "facilityId": dataLocation.facilityId ?? "",
                "facilityTypeId": dataLocation.facilityTypeId ?? "",
                "customerId": dataLocation.customerId ?? "",
                "transactionId": dataLocation.transactionId ?? "",
                "processId": dataLocation.processId ?? "",
                "activityId": dataLocation.activityId ?? "",
                "instanceId": dataLocation.instanceId ?? "",
                "taskId": dataLocation.taskId ?? "",
                "taskStatus": dataLocation?.taskStatus ?? ""
              },
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
