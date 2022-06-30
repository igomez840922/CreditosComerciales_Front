import React, { useState } from "react"
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import {
  Row,
  Col,
  Table,
  Button
} from "reactstrap"
import ModalNewWarrant from "./ModalNewWarrant";
import { BackendServices } from "../../../../services";
import { useTranslation } from "react-i18next";
import { CoreServices } from '../../../../services';
import Currency from "../../../../helpers/currency"
import moment from "moment";
import { uniq_key } from "../../../../helpers/unq_key";
const WarrantsList = (props) => {
  const currencyData = new Currency();

  const { t, i18n } = useTranslation();
  const api = new BackendServices();
  const location = useLocation()
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [displayModal, setDisplayModal] = useState(false);
  const [botonValidation, setbotonValidation] = useState(true);
  const [tipo, settipo] = useState("");
  const coreServices = new CoreServices();
  const [datacOMISION, setdatacOMISION] = useState(null);
  const [dataSet, setdataSet] = useState({
    "guaranteeId": 1,
    "guaranteeTypeName": "",
    "commercialValue": 0,
    "fastValue": 0,
    "observations": "",
    "ltv": 0,
    "appraisalDate": "",
    "signature": "",
    "trustNumber": "",
    "fiduciary": "",
    "status": true
  });

  React.useEffect(() => {
    // Read Api Service data
    initializeData();
  }, []);
  function formatDate(date) {
    return date === '0001-01-01' || date === '' || date === null ? '' : moment(date).format("DD/MM/YYYY");
  }
  function initializeData() {
    // getTipoGarantiaCatalogo
    coreServices.getTipoGarantiaCatalogo().then(response => {
      console.log("getTipoGarantiaCatalogo",response);
      api.consultarGarantiaPropCred(props.dataSet.facilityId).then(resp => {
        if (resp != undefined) {
          setdatacOMISION(resp.map((data) => (

            <tr key={uniq_key()}>
              <td>{response.Records.find(x => x.Code === data.guaranteeTypeName)?.Description}</td>
              <td>{currencyData.formatTable(data.commercialValue ?? 0)}</td>
              <td>{currencyData.formatTable(data.fastValue ?? 0)}</td>
              <td>{data.observations}</td>
              <td>{currencyData.formatTable(data.ltv)}%</td>
              <td>{formatDate(data.appraisalDate)}</td>
              <td style={{ textAlign: "right" }}>
                <Button type="button" color="link" onClick={(resp) => {
                  updateData(data, "ECOMISION")
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => {
                  deleteData(data, "DCOMISION")
                }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr>)
          ));
        } else {
          setdatacOMISION(
            <tr key={1}>
              <td colSpan="10" style={{ textAlign: 'center' }}></td>
            </tr>);
        }
      }).catch(err => {
        console.log(err)
      });
    });

  }
  function updateData(data, tipo2) {
    data.appraisalDate = data.appraisalDate === '' ? '' : data.appraisalDate;
    setdataSet(data)
    setbotonValidation(true);
    settipo(tipo2);
    setDisplayModal(true);
  }
  function deleteData(data, tipo2) {
    setdataSet(data)
    settipo(tipo2);
    setconfirm_alert(true);
  }
  function toggleModal() {
    setDisplayModal(!displayModal);
  }
  if (!props.items) {
    return null;
  }
  function saveData(values, tipo2) {
    values.requestId = props.dataSet.facilityId;
    values.commercialValue = Number(currencyData.getRealValue(values.commercialValue));
    values.fastValue = Number(currencyData.getRealValue(values.fastValue));
    values.ltv = Number(values.ltv);
    values.signature = " ";
    values.trustNumber = " ";
    values.fiduciary = " ";
    values.appraisalDate = values?.appraisalDate == "" || values?.appraisalDate == null || values?.appraisalDate == undefined ? "" : values?.appraisalDate;
    if (tipo2 == "COMISION") {
      api.nuevoGarantiaPropCred(values).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg(true)
          toggleModal();
        } else {
          toggleModal();
          seterror_dlg(false);
        }
        initializeData();
      }).catch(err => {
        seterror_dlg(false);
      })
    }
    if (tipo2 == "ECOMISION") {
      values.guaranteeId = dataSet.guaranteeId;
      values.appraisalDate = values?.appraisalDate == "" || values?.appraisalDate == null || values?.appraisalDate == undefined ? "" : values?.appraisalDate;
      values.status = true;
      api.actualizarGarantiaPropCred(values).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg(true)
          toggleModal();
        } else {
          toggleModal();
          seterror_dlg(false);
        }
        initializeData();
      }).catch(err => {
        seterror_dlg(false);
      })
    }

  }
  function toggleModal() {
    setDisplayModal(!displayModal);
  }

  return (
    <>
      {/* <h5>{t("Warrants")}</h5> */}
      <Row className="mb-3">
        <Col md="6">
          <h5 className="card-sub-title">{t("Warrants")}</h5>
        </Col>
        <Col md="6" style={{ textAlign: "right" }}>
          <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
            setbotonValidation(true); setdataSet({
              "guaranteeId": 1,
              "guaranteeTypeName": "",
              "commercialValue": 0,
              "fastValue": 0,
              "observations": "",
              "ltv": 0,
              "appraisalDate": "",
              "signature": "",
              "trustNumber": "",
              "fiduciary": "",
              "status": true
            }); settipo("COMISION"); toggleModal()
          }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
        </Col>
        <Col md="12" className="table-responsive styled-table-div">
          <Table className="table table-striped table-hover styled-table table" >
            <thead  >
              <tr>
                <th>{t("Warrant Type")}</th>
                <th>{t("Commercial Value")}</th>
                <th>{t("Quick V-Value")}</th>
                <th>{t("Description")}</th>
                <th>{t("LTV%")}</th>
                <th>{t("Appraisal Date")}</th>
                <th className="text-end">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {datacOMISION}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ModalNewWarrant saveData={saveData} botones={botonValidation} tipo={tipo} dataSet={dataSet} isOpen={displayModal} toggle={toggleModal} />
      {/* {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText= {t("Confirm")}
          cancelButtonText= {t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            initializeData();
          }}
        >
          {t("SuccessSaveMessage")}
        </SweetAlert>
      ) : null} */}

      {error_dlg ? (
        <SweetAlert
          error
          title={t("ErrorDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            seterror_dlg(false)
            initializeData();
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
            // eliminarGarantiaPropCred
            apiBack.eliminarGarantiaPropCred(props.dataSet.facilityId, dataSet.guaranteeId).then(resp => {
              if (resp.statusCode == "500") {
                setconfirm_alert(false)
                seterror_dlg(false)
              } else {
                setconfirm_alert(false)
                setsuccessSave_dlg(true)
              }
              initializeData();
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
    </>
  );
};
const WarrantsSection = (props) => {
  return (
    <WarrantsList dataSet={props.dataSet} items={props.warrants} />
  );
};
WarrantsSection.propTypes = {
  warrants: PropTypes.array.isRequired,
  onSaveItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};
export default WarrantsSection;
