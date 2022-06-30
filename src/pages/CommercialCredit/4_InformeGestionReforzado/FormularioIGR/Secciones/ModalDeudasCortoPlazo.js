import React, { useState, useCallback } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
// import Select from "react-select";

import Select2 from "react-select";
import {
  Row,
  Col,
  Button,
  Label,
  Modal,
  Card,
  CardBody,
  CardFooter,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import "flatpickr/dist/themes/material_blue.css";
import { CoreServices, BackendServices } from "../../../../../services";
import 'antd/dist/antd.css';
import { Select } from 'antd';
import moment from "moment";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import * as OPTs from "../../../../../helpers/options_helper"
import Currency from "../../../../../helpers/currency";
import { uniq_key } from "../../../../../helpers/unq_key";
import checkNumber from "../../../../../helpers/checkNumber";
const ModalDeudasCortoPlazo = (props) => {
  const { Option } = Select;
  const { t, i18n } = useTranslation();
  const [options, setBancos] = useState([]);
  const [facilidadesTipoSelect, setfacilidadesTipoSelect] = useState(undefined);
  const [campoRequeridoFacilidades, setcampoRequeridoFacilidades] = useState(false);
  const [fianzaAccionistaSelect, setfianzaAccionistaSelect] = useState(undefined);
  const [campoRequeridoFianzaAccionista, setcampoRequeridoFianzaAccionista] = useState(false);
  const [codigoBanco, setCodigoBanco] = useState(null);
  const [facilidadesTipo, setfacilidadesTipo] = useState(null);
  const [fianzaAccionistaList, setfianzaAccionistaList] = useState(null);
  const [date, setdate] = useState(null);
  const [expirationDate, setexpirationDate] = useState(null);
  const [campoRequeridoBanco, setcampoRequeridoBanco] = useState(false);
  const [campoTasa, setcampoTasa] = useState(false);
  const [validateGrandExpiration, setvalidateGrandExpiration] = useState(true);
  const [fechaSet, setfechaSet] = useState(null);
  const [fechaSet2, setfechaSet2] = useState(null);

  const currencyData = new Currency();

  React.useEffect(() => {
    // Read Api Service data
    console.log("Deudas", props);
    loadCatalog()
    if (props.tipo == "ECP") {
      setCodigoBanco(props.jsonSow.bank)
      setdate(props.jsonSow.date)
      setexpirationDate(props.jsonSow.expirationDate)
      setfechaSet2(moment(props.jsonSow.date).format("DD-MM-YYYY"))
      if (props.jsonSow.expirationDate == null) {
        setfechaSet("")
      } else {
        setfechaSet(moment(props.jsonSow.expirationDate).format("DD-MM-YYYY"))
      }
    } else {
      setfechaSet2(moment().format("DD-MM-YYYY"))
      setfechaSet(null)
    }
    setcampoRequeridoFacilidades(false);
    setcampoRequeridoFianzaAccionista(false);
    setcampoRequeridoBanco(false);

    validateDate();
  }, [props.isOpen]);
  React.useEffect(() => {
    //console.log(props.jsonSow)
    setfacilidadesTipoSelect(undefined)
    setfianzaAccionistaSelect(undefined)
    // Read Api Service data
    if (props.tipo == "ECP") {
      var defaultVal = null;

      try {
        if (facilidadesTipo.length > 0 && props.jsonSow.facilityType !== null) {
          defaultVal = facilidadesTipo.find(x => (x.label).toUpperCase() === (props.jsonSow.facilityType).toUpperCase());
          if (defaultVal !== undefined) {
            setfacilidadesTipoSelect(defaultVal);
          }
        }
        if (fianzaAccionistaList.length > 0 && props.jsonSow.bail !== null) {
          defaultVal = fianzaAccionistaList.find(x => (x.label).toUpperCase() === (props.jsonSow.bail).toUpperCase());
          if (defaultVal !== undefined) {
            setfianzaAccionistaSelect(defaultVal);
          }
        }
      }
      catch (err) { }
    }
    setcampoRequeridoFacilidades(false);
    setcampoRequeridoFianzaAccionista(false);
    setcampoRequeridoBanco(false);
    validateDate();

  }, [props.isOpen, facilidadesTipo, fianzaAccionistaList]);
  function changeAll(e, tipo) {
    if (tipo == "bank") {
      setCodigoBanco(e);
    }
    if (tipo == "date") {
      setdate(e.target.value);
    }
    if (tipo == "expirationDate") {
      setexpirationDate(e.target.value);
    }
  }
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    if (campoTasa) {
      return;
    }
    if (fechaSet2 == null) {
      return;
    }
    // if (facilidadesTipoSelect == undefined) {
    //   setcampoRequeridoFacilidades(true);
    //   return;
    // } else {
    //   setcampoRequeridoFacilidades(false);
    // }
    // if (fianzaAccionistaSelect == undefined) {
    //   setcampoRequeridoFianzaAccionista(true);
    //   return;
    // } else {
    //   setcampoRequeridoFianzaAccionista(false);
    // }
    event.preventDefault();
    if (errors.length > 0 || validateGrandExpiration) {
      return;
    }
    values.bank = codigoBanco;
    values.facilityType = facilidadesTipoSelect?.label ?? " ";
    values.bail = fianzaAccionistaSelect?.label ?? " ";
    values.rate = currencyData.getRealPercent(values.rate)
    ////console.log(values);
    if (document.getElementById("expirationDate")?.value == "") {

      values.expirationDate = null;
    } else {

      values.expirationDate = moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD"));

    }
    // if (document.getElementById("date")?.value == "") {
    //   values.date = null;
    // } else {
    //   let fecha2 = document.getElementById("date")?.value.split("/").length == 1 ? document.getElementById("date")?.value.split("-") : document.getElementById("date")?.value.split("/");
    //   if (fecha2 == undefined) {
    //     values.date = null;
    //   } else {
    //     fecha2 = fecha2[2] + "-" + fecha2[1] + "-" + fecha2[0];
    //     values.date = fecha2;
    //   }
    // }
    values.date = moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet2 : (moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD"));
    if (props.tipo == "CP") {
      values.date = values.date == '' ? null : values.date;
      values.expirationDate = values.expirationDate == '' ? null : values.expirationDate;
      props.saveData(values, props.tipo);
    }
    if (props.tipo == "ECP") {
      values.debtId = props.jsonSow.debtId;
      values.status = true;
      props.updateData(values, props.tipo);
    }
  }
  function loadCatalog() {
    const api = new CoreServices();
    // getBancosCatalogo
    api.getBancosCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        setBancos(json);
      });
    const apiBack = new BackendServices();
    // retrieveFacilityType
    apiBack.retrieveFacilityType()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          json.push({ label: response[i]["description"], value: response[i]["id"] })
        }
        setfacilidadesTipo(json);
      });
    // retrieveBailType
    // apiBack.retrieveBailType()
    api.getTipoGarantiaCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response?.Records?.length; i++) {
          // json.push({ label: response[i]["description"], value: response[i]["id"] })
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        setfianzaAccionistaList(json);
      });
  }

  function validateDate() {
    let fecha = document.getElementById("expirationDate")?.value.split("/").length == 1 ? document.getElementById("expirationDate")?.value.split("-") : document.getElementById("expirationDate")?.value.split("/");
    if (fecha == undefined) {
      return
    }
    fecha = fecha[2] + "-" + fecha[1] + "-" + fecha[0];
    let fecha2 = document.getElementById("date")?.value.split("/").length == 1 ? document.getElementById("date")?.value.split("-") : document.getElementById("date")?.value.split("/");
    if (fecha2 == undefined) {
      return
    }
    fecha2 = fecha2[2] + "-" + fecha2[1] + "-" + fecha2[0];
    let expiration = moment(fecha ?? props?.jsonSow?.expirationDate);
    let grant = moment(fecha2 ?? props?.jsonSow?.date);
    if (typeof grant._i === 'number' || typeof expiration._i === 'number') {
      setvalidateGrandExpiration(false);
    } else {
      setvalidateGrandExpiration(grant >= expiration);
    }

  }



  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("ShortTermDebts")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          data-dismiss="modal"
          className="close"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#f3f5f7" }}>
        <Row>
          <Col xl="12">
            <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <div className="mb-12">
                        <Label htmlFor="idBank">{t("Bank")}</Label>
                        <Select noOptionsMessage={() => ""}
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={t("SearchtoSelect")}
                          optionFilterProp="children"
                          defaultValue={props.jsonSow.bank}
                          onChange={(e) => { changeAll(e, "bank") }}
                          filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {options.length > 0 ?
                            options.map((item, index) => (
                              <Option key={uniq_key()} value={item.label}>{item.label}</Option>
                            ))
                            : null}
                        </Select>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="facilityType">{t("FacilityType")}</Label>
                        <Select2 noOptionsMessage={() => ""}
                          onChange={(e) => { setfacilidadesTipoSelect(facilidadesTipo.find(x => x.label === e.label)); }}
                          options={facilidadesTipo}
                          id="facilityType"
                          classNamePrefix="select2-selection"
                          placeholder={t("toselect")}
                          value={facilidadesTipoSelect}
                        />
                        {campoRequeridoFacilidades ?
                          <p className="message-error-parrafo">{t("Required Field")}</p>
                          : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="amount">{t("Amount")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="amount"
                          value={currencyData.format(props?.jsonSow?.amount ?? 0)}
                          id="amount"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="date">{t("GrantDate")}</Label>
                        {fechaSet2 ?
                          <Flatpickr
                            name="date"
                            id="date"
                            className="form-control d-block"
                            placeholder={OPTs.FORMAT_DATE_SHOW}
                            options={{
                              dateFormat: OPTs.FORMAT_DATE,
                              defaultDate: fechaSet2,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                            }}
                            // onChange={(selectedDates, dateStr, instance) => {
                            //   setfechaSet2(dateStr);
                            //   let fecha = fechaSet2.split("/").length == 1 ? fechaSet2.split("-") : fechaSet2.split("/");
                            //   changeAll({ target: { value: fecha[2] + "-" + fecha[1] + "-" + fecha[0] } }, "date"); validateDate()
                            // }}
                            onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")); changeAll({ target: { value: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") } }, "expirationDate"); validateDate() }}
                          // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr).format("YYYY-MM-DD") } }) }}
                          /> : null}
                        {fechaSet2 == null ?
                          <p className="message-error-parrafo">{t("Required Field")}</p>
                          : null}
                        {validateGrandExpiration ?
                          <p className="message-error-parrafo">{t("The grant date cannot be greater than the expiration date")}</p>
                          : null}
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="expirationDate">{t("DueDate")}</Label>
                        {props.tipo == "CP" ?
                          <Flatpickr
                            name="expirationDate"
                            id="expirationDate"
                            className="form-control d-block"
                            placeholder={OPTs.FORMAT_DATE_SHOW}
                            options={{
                              // minDate:fechaSet==""?props.jsonSow.expirationDate:fechaSet,
                              dateFormat: OPTs.FORMAT_DATE,
                            }}
                            onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")); changeAll({ target: { value: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") } }, "expirationDate"); validateDate() }}
                          // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr).format("YYYY-MM-DD") } }) }}
                          /> : fechaSet != null ?
                            <Flatpickr
                              name="expirationDate"
                              id="expirationDate"
                              className="form-control d-block"
                              placeholder={OPTs.FORMAT_DATE_SHOW}
                              options={{
                                // minDate:fechaSet==""?props.jsonSow.expirationDate:fechaSet,
                                dateFormat: OPTs.FORMAT_DATE,
                                defaultDate: fechaSet
                              }}
                              onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")); changeAll({ target: { value: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") } }, "expirationDate"); validateDate() }}
                            // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr).format("YYYY-MM-DD") } }) }}
                            /> : null}

                        {validateGrandExpiration ?
                          <p className="message-error-parrafo">{t("The expiration date cannot be less than the grant date")}</p>
                          : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="debitBalance1">{t("Current Year Balance")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="debitBalance1"
                          value={currencyData.format(props?.jsonSow?.debitBalance1 ?? 0)}
                          id="debitBalance1"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="debitBalance2">{t("Balance Of The Year")} 1</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="debitBalance2"
                          value={currencyData.format(props?.jsonSow?.debitBalance2 ?? 0)}
                          id="debitBalance2"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="debitBalance3">{t("Balance Of The Year")} 2</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="debitBalance3"
                          value={currencyData.format(props?.jsonSow?.debitBalance3 ?? 0)}
                          id="debitBalance3"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="rate">{t("Rate")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="rate"
                          // onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value.replace('%', '')); e.target.value = currencyData.format(x) + "%"; }}
                          // onKeyUp={(e) => { currencyData.formatPercent(e)}}
                          onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e); }}
                          value={props.jsonSow.rate}
                          onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa(true) : setcampoTasa(false); }}
                          id="rate"
                        // pattern="^[0-9,.%]*$"
                        />

                        {campoTasa ?
                          <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                          : null}
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="fee">{t("Term of the Promissory Notes (days)")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="fee"
                          value={props.jsonSow.fee}
                          id="fee"
                          onKeyPress={(e) => { return checkNumber(e) }}
                          validate={{
                            number: { value: true, errorMessage: t("InvalidField") },
                          }}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="bail">{t("Surety")}</Label>
                        <Select2 noOptionsMessage={() => ""}
                          onChange={(e) => { setfianzaAccionistaSelect(fianzaAccionistaList.find(x => x.label === e.label)); }}
                          options={fianzaAccionistaList}
                          id="bail"
                          classNamePrefix="select2-selection"
                          placeholder={t("toselect")}
                          value={fianzaAccionistaSelect}
                        />
                        {campoRequeridoFianzaAccionista ?
                          <p className="message-error-parrafo">{t("Required Field")}</p>
                          : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="fundDestiny">{t("DestinationOfFunds")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="fundDestiny"
                          value={props.jsonSow.fundDestiny}
                          id="fundDestiny"
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter style={{ textAlign: "right" }}>
                  <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                  </Button>
                  {props.botones ?
                    <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                      {" "} {props.tipo == "CP" ? t("Save") : t("Save")}
                    </Button> : null}
                </CardFooter>
              </Card>
            </AvForm>
          </Col>
        </Row>
      </div>
    </Modal >
  );
};
ModalDeudasCortoPlazo.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};
export default ModalDeudasCortoPlazo;
