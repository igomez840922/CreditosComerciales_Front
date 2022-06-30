import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';
import { Link, useLocation } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"

import {
  Row,
  Col,
  Table,
  Button
} from "reactstrap"


import ModalNewWarrant from "../ModalNewWarrant";
import { BackendServices } from "../../../../services";



const WarrantsList = (props) => {

  const api = new BackendServices();
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  // Variables para alertas 
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  // Variables para el componente
  const [displayModal, setDisplayModal] = useState(false);
  const [t, c] = translationHelpers('commercial_credit', 'common');
  const [botonValidation, setbotonValidation] = useState(true);
  const [tipo, settipo] = useState("");
  const [datacOMISION, setdatacOMISION] = useState(null);
  const [dataSet, setdataSet] = useState({
    "guaranteeId": 1,
    "guaranteeTypeName": "",
    "commercialValue": 0,
    "fastValue": 0,
    "observations": "",
    "ltv": 0,
    "appraisalDate": "2021-12-22",
    "signature": "",
    "trustNumber": "",
    "fiduciary": "",
    "status": true
  });
  React.useEffect(() => {
    // Read Api Service data
    initializeData();
  }, []);
  function initializeData() {
    api.consultarGarantiaPropCred(2).then(resp => {
      if (resp != undefined) {
        setdatacOMISION(resp.map((data) => (
          data.status ?
            <tr key={data[0]}>
              <td>{data.guaranteeTypeName}</td>
              <td>{data.commercialValue}</td>
              <td>{data.fastValue}</td>
              <td>{data.observations}</td>
              <td>{data.ltv}</td>
              <td>{data.appraisalDate}</td>
              <td>{data.signature}</td>
              <td>{data.trustNumber}</td>
              <td>{data.fiduciary}</td>
              <td style={{ textAlign: "right" }}>
                <Button type="button" color="link" onClick={(resp) => {
                  editarDatos(data, "ECOMISION")
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => {
                  EliminarDatos(data, "DCOMISION")
                }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setdatacOMISION(
          <tr key={1}>
            <td colSpan="10" style={{ textAlign: 'center' }}></td>
          </tr>);
      }
    })
  }
  function verDatos(data, tipo2) {
    setdataSet(data)
    setbotonValidation(false);
    settipo(tipo2);
    setDisplayModal(true);
  }
  function editarDatos(data, tipo2) {
    setdataSet(data)
    setbotonValidation(true);
    settipo(tipo2);
    setDisplayModal(true);
  }
  function EliminarDatos(data, tipo2) {
    setdataSet(data)
    settipo(tipo2);
    setconfirm_alert(true);
  }
  function handleAdd() {
    setDisplayModal(true);
  }

  function toggleModal() {
    setDisplayModal(!displayModal);
  }

  if (!props.items) {
    return null;
  }

  function guardarDatos(values, tipo2) {
    values.requestId = 2;
    values.commercialValue = Number(values.commercialValue);
    values.fastValue = Number(values.fastValue);
    values.ltv = Number(values.ltv);
    if (tipo2 == "COMISION") {
      api.nuevoGarantiaPropCred(values).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg(true)
          toggleModal();
        } else {
          toggleModal();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      })
    }
    if (tipo2 == "ECOMISION") {
      values.guaranteeId = dataSet.guaranteeId;
      values.status = true;
      api.actualizarGarantiaPropCred(values).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg(true)
          toggleModal();
        } else {
          toggleModal();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      })
    }

  }
  function handleAdd() {
    setDisplayModal(true);
  }

  function toggleModal() {
    setDisplayModal(!displayModal);
  }

  if (!props.items) {
    return null;
  }



  return (
    <React.Fragment>
      <h5>{t("Warrants")}</h5>
      <Row className="mb-3">
        <Col md="12">
          <Table className="table" responsive>
            <thead className="table-light">
              <tr>
                <th>{t("Warrant Type")}</th>
                <th>{t("Commercial Value")}</th>
                <th>{t("Quick V-Value")}</th>
                <th>{t("Description")}</th>
                <th>{t("LTV%")}</th>
                <th>{t("Appraisal Date")}</th>
                <th>{t("Signature")}</th>
                <th>{t("Escrow")}</th>
                <th>{t("Fiduciary")}</th>
                <th className="text-end">
                  <Link className="float-end" onClick={() => {
                    setbotonValidation(true); setdataSet({
                      "guaranteeId": 1,
                      "guaranteeTypeName": "",
                      "commercialValue": 0,
                      "fastValue": 0,
                      "observations": "",
                      "ltv": 0,
                      "appraisalDate": "2021-12-22",
                      "signature": "",
                      "trustNumber": "",
                      "fiduciary": "",
                      "status": true
                    }); settipo("COMISION"); toggleModal()
                  }}><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i></Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {datacOMISION}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ModalNewWarrant guardarDatos={guardarDatos} botones={botonValidation} tipo={tipo} dataSet={dataSet} isOpen={displayModal} toggle={toggleModal} onSave={props.onSaveItem} />
      {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            initializeData();
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
            apiBack.eliminarGarantiaPropCred(2, dataSet.guaranteeId).then(resp => {
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

const WarrantsSection = (props) => {
  return (
    <WarrantsList items={props.warrants} onSaveItem={props.onSaveItem} onDeleteItem={props.onDeleteItem} />
  );
};

WarrantsSection.propTypes = {
  warrants: PropTypes.array.isRequired,
  onSaveItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

export default WarrantsSection;
