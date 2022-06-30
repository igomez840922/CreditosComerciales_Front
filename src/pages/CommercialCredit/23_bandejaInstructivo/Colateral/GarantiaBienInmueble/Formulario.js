import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Row, Col, Card, CardBody, Button, Label, Table } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { Select } from 'antd';

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation";
import ApiServicesCommon from "../../../../../services/Common/ApiServicesCommon";
import { BackendServices, CoreServices } from "../../../../../services";
import Switch from "react-switch";
import Breadcrumb from "../../../../../components/Common/Breadcrumb";
import { withTranslation, useTranslation } from "react-i18next";
import ModalDatosPoliza from "./ModalDatosPoliza";
import SweetAlert from "react-bootstrap-sweetalert";


import * as OPTs from "../../../../../helpers/options_helper"
import moment from "moment";
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
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
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
  const [garantiaTypeSet, setgarantiaTypeSet] = useState(null);
  const [garantiaTypeSetRequerido, setgarantiaTypeSetRequerido] = useState(false);
  const backendServices = new BackendServices();
  const coreServices = new CoreServices();
  const { t, i18n } = useTranslation();
  //abrimos modal para adjunar archivos
  useEffect(() => {
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        location.data.transactionId = 0;
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        if (location.data?.dataGeneral) {
          setgarantiaTypeSet(result.dataGeneral.guaranteeId)
          setdataGeneral(location.data.dataGeneral);
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
          setgarantiaTypeSet(result.dataGeneral.guaranteeId)
          setdataGeneral(result.dataGeneral);
          settypeGarantia("editar")
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
    coreServices.getBancaCatalogo().then(resp => {
      setbanca(resp.Records)
    });
    coreServices.getBancosCatalogo().then(resp => {
      setbanco(resp.Records)
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
    backendServices.getGuaranteeUsedNewEquipments(data?.transactionId ?? 0).then(resp => {
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
      data.guaranteeId = garantiaTypeSet;
      data.guaranteeType = garantiaTipe.find(x => x.Code === garantiaTypeSet)?.Description;
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

  return (
    <React.Fragment>
      <h5>{t("Datos Generales")}</h5>
      <p className="card-title-desc"></p>

      <AvForm id="frmGarantiasMuebles" className="needs-validation">
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="IDGarantia">{t("ID de Garantia ")}</Label>
            <AvField
              className="form-control"
              type="text"
              name="searchfield"
              id="searchfield"
            />
          </div>
        </Col>
        <Row>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="NumerodeArrachment">
                {t("Numero de Adjunto ")}
              </Label>
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
              <Label htmlFor="Numerodeprestamo">
                {t("Numero de Prestamo")}
              </Label>
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
              <Label>{t("Moneda")}</Label>
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
              <Label htmlFor="Numerodecliente">{t("Numero de cliente")}</Label>
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
              <Label htmlFor="MontoGarantia">{t("Monto de la Garantia")}</Label>
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
              <Label>{t("Tipos de Garantia")}</Label>
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
              <Label>{t("Banco")}</Label>
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
              <Label>{t("Agencia(Banca)")}</Label>
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
              <Label htmlFor="MontoGarantia">
                {t("Codigo del Bien Mueble")}
              </Label>
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
              <Label>{t("Fecha de Vencimiento transacción")}</Label>

              <Flatpickr
                id="estimatedDate"
                name="estimatedDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  //defaultDate: proposedExpirationDate !== undefined ? new Date(moment(proposedExpirationDate, 'YYYY-MM-DD').format()) : new Date()
                }}
                //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                />

            </div>
          </Col>
        </Row>

        <Row>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="NoFideicomiso">{t("No. Fideicomiso")}</Label>
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
              <Label htmlFor="NoFideicomiso">
                {t("Fecha Emision Del Fideicomiso")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
              />
            </div>
          </Col>

          <Row></Row>

          <Col md="3">
            <div className="mb-3">
              <Label>{t("Finca")}</Label>
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
              <Label htmlFor="Nfinca">{t("Numero de Finca")}</Label>
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
              <Label htmlFor="CodigoUbicacion">
                {t("Codigo de Ubicacion")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
              />
            </div>
          </Col>
          <Row></Row>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Pais")}</Label>
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
              <Label>{t("Distrito")}</Label>
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
              <Label htmlFor="PtoReferencia">{t("Pto. de Referencia")}</Label>
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
              <Label>{t("Corregimiento")}</Label>
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
              <Label htmlFor="Hectareas">{t("Hectareas")}</Label>
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
              <Label htmlFor="AvaluofechaInscrip">
                {t("Avaluo Fecha de Inscripccion")}
              </Label>
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
              <Label htmlFor="AvaluoFechaVencimiento">
                {t("Avaluo Fecha de Vencimiento")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
              />
            </div>
          </Col>
          <Row></Row>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="NombreDeCasaAvaluadora">
                {t("Nombre de Casa Avaluadora")}
              </Label>
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
              <Label htmlFor="CompañiaSeguro">{t("Compañia de Seguro")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
              />
            </div>
          </Col>
        </Row>
      </AvForm>

      <h5>{t("Datos de la Poliza")}</h5>
      <p className="card-title-desc"></p>
      <AvForm id="frmDatosPoliza" className="needs-validation">
        <Row>
          <Col md="12">
            <Table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>{t("Tipo de garantía")}</th>
                  <th>{t("Monto")}</th>
                  <th>{t("Compañia aseguradora")}</th>
                  <th>{t("Numero de poliza")}</th>
                  <th>{t("Tipo de poliza")}</th>
                  <th>{t("Compañia Corredora")}</th>
                  <th>{t("Fecha de Emison de la Poliza")}</th>
                  <th>{t("Fecha de vencimineto de la Poliza")}</th>
                  <th>
                    {garantiaTypeSet != null ? <Link
                      className="float-end"
                      onClick={() => {
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
                      }}
                    >
                      <i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i>
                    </Link> : <p className="message-error-parrafo">{t("Select a guarantee to be able to generate a policy")}</p>}
                  </th>
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
