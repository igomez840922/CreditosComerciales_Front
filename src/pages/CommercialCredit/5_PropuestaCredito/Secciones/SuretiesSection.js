import React, { useState } from "react"
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import {
  Row,
  Col,
  Table,
  Button,
} from "reactstrap"
import ModalNewSurety from "./ModalNewSurety";
import { BackendServices } from "../../../../services";
import { useTranslation } from "react-i18next";
const SuretiesList = (props) => {
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
  const [datacOMISION, setdatacOMISION] = useState(null);
  const [dataSet, setdataSet] = useState({
    "facilityId": 0,
    "commissionType": "",
    "amount": 0,
    "observation": ""
  });
  React.useEffect(() => {
    // Read Api Service data
    initializeData();
  }, []);
  function initializeData() {
    api.retrieveBailType()
      .then((response) => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          json.push({ label: response[i]["description"], value: response[i]["id"] })
        }
        api.consultarFianzaPropCred(props.dataSet.facilityId).then(resp => {
          if (resp != undefined) {
            setdatacOMISION(resp.map((data) => (
              data.status ?
                <tr key={data.idBail}>
                  <td>{json.find(x => x.value === data.typeBail)?.label}</td>
                  <td>{data.observations}</td>
                  <td style={{ textAlign: "right" }}>
                    <Button type="button" color="link" onClick={(resp) => {
                      updateData(data, "ECOMISION")
                    }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                    <Button type="button" color="link" onClick={(resp) => {
                      dataDlete(data, "DCOMISION")
                    }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                  </td>
                </tr> : null)
            ));
          } else {
            setdatacOMISION(
              <tr key={1}>
                <td colSpan="3" style={{ textAlign: 'center' }}></td>
              </tr>);
          }
        })
      })
      .catch((error) => {
        console.error('api error: ', error);
      });

  }
  function updateData(data, tipo2) {
    setdataSet(data)
    setbotonValidation(true);
    settipo(tipo2);
    setDisplayModal(true);
  }
  function dataDlete(data, tipo2) {
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
    values.facilityId = props.dataSet.facilityId;
    values.observations = values?.observations ?? " ";
    if (tipo2 == "COMISION") {
      // nuevoFianzaPropCred
      api.nuevoFianzaPropCred(values).then(resp => {
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
      values.idBail = dataSet.idBail;
      values.status = true;
      // actualizarFianzaPropCred
      api.actualizarFianzaPropCred(values).then(resp => {
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
  return (
    <React.Fragment>
      {/* <h5>{t("Sureties")}</h5> */}
      <Row className="mb-3">
        <Col md="6">
          <h5 className="card-sub-title">{t("Sureties")}</h5>
        </Col>
        <Col md="6" style={{ textAlign: "right" }}>
          <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
            setbotonValidation(true); setdataSet({
              "facilityId": 0,
              "commissionType": "",
              "amount": 0,
              "observation": ""
            }); settipo("COMISION"); toggleModal()
          }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
        </Col>
        <Col md="12" className="table-responsive styled-table-div">
          <Table className="table table-striped table-hover styled-table table" >
            <thead  >
              <tr>
                <th>{t("Surety Type")}</th>
                <th>{t("Description")}</th>
                <th className="text-end">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {datacOMISION}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ModalNewSurety saveData={saveData} botones={botonValidation} tipo={tipo} dataSet={dataSet} isOpen={displayModal} toggle={toggleModal} onSave={props.onSaveItem} />
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
            // eliminarFianzaPropCred
            apiBack.eliminarFianzaPropCred(dataSet.facilityId, dataSet.idBail).then(resp => {
              if (resp.statusCode == "500") {
                setconfirm_alert(false)
                seterror_dlg(false)
              } else {
                setconfirm_alert(false)
                setsuccessSave_dlg(true)
                initializeData();
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
const SuretiesSection = (props) => {
  return (
    <SuretiesList dataSet={props.dataSet} items={props.sureties} onSaveItem={props.onSaveItem} onDeleteItem={props.onDeleteItem} />
  );
};
SuretiesSection.propTypes = {
  sureties: PropTypes.array.isRequired,
  onSaveItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};
export default SuretiesSection;
