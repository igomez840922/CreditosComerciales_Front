import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';
import { Link, useLocation } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import { BackendServices } from "../../../../services";
import {
  Row,
  Col,
  Table,
  Button
} from "reactstrap"
import ModalNewDisbursementTerm from "./ModalNewDisbursementTerm";
import ModalNewPaymentProgram from "./ModalNewPaymentProgram";
import ModalNewDisbursementMethod from "./ModalNewDisbursementMethod";
import { useTranslation } from "react-i18next";
const api = new BackendServices();
const DisbursementTerms = (props) => {
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [displayModal, setDisplayModal] = useState(false);
  const { t, i18n } = useTranslation();
  const [botonValidation, setbotonValidation] = useState(true);
  const [tipo, settipo] = useState("");
  const [dataDesembolso, setdataDesembolso] = useState(null);
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
    // consultarListaDesembolsoPropCred
    api.consultDisbursementListPropCred(props.dataSet.facilityId).then(resp => {
      if (resp != undefined) {
        setdataDesembolso(resp.map((data) => (
          data.status ?
            <tr key={data[0]}>
              <td>{data.disbursementTypeId}</td>
              <td>{data.observations}</td>
              <td style={{ textAlign: "right" }}>
                <Button type="button" color="link" onClick={(resp) => {
                  updateData(data, "EDESEMBOLSO")
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => {
                  deleteData(data, "DDESEMBOLSO")
                }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setdataDesembolso(
          <tr key={1}>
            <td colSpan="2" style={{ textAlign: 'center' }}></td>
          </tr>);
      }
    })
  }
  function updateData(data, tipo2) {
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
  function saveData(values, tipo2) {
    values.facilityId = props.dataSet.facilityId;
    if (tipo2 == "DESEMBOLSO") {
      // nuevoDesembolsoPropCred
      api.newDisbursementPropCred(values).then(resp => {
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
    if (tipo2 == "EDESEMBOLSO") {
      values.disbursementId = dataSet.disbursementId;
      values.status = true;
      // actualizarDesembolsoPropCred
      api.actualizarDesembolsoPropCred(values).then(resp => {
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

  if (!props.items) {
    return null;
  }
  return (
    <React.Fragment>
      {/* <h5>{t("Disbursement")}</h5> */}
      <Row className="mb-3">
        <Col md="6">
          <h5 className="card-sub-title">{t("Disbursement")}</h5>
        </Col>
        <Col md="6" style={{ textAlign: "right" }}>
          <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
            setbotonValidation(true); setdataSet({
              "facilityId": "",
              "disbursementTypeId": "",
              "observations": ""
            }); settipo("DESEMBOLSO"); toggleModal()
          }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
        </Col>
        <Col md="12" className="table-responsive styled-table-div">
          <Table className="table table-striped table-hover styled-table table" >
            <thead  >
              <tr>
                <th><strong>{t("Disbursement Type")}</strong></th>
                <th><strong>{t("Description")}</strong></th>
                <th className="text-end"><strong>{t("Actions")}</strong></th>
              </tr>
            </thead>
            <tbody>
              {dataDesembolso}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ModalNewDisbursementTerm saveData={saveData} botones={botonValidation} tipo={tipo} dataSet={dataSet} isOpen={displayModal} toggle={toggleModal} onSave={props.onSaveItem} />
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
            const api = new BackendServices();
            // eliminarDesembolsoPropCred
            api.deleteDisbursementPropCred(dataSet.facilityId, dataSet.disbursementId).then(resp => {
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
    </React.Fragment>
  );

};
const PaymentPrograms = (props) => {
  // const api = new BackendServices();
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  // Variables para alertas 
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  // Variables para el componente
  const [displayModal, setDisplayModal] = useState(false);
  const { t, i18n } = useTranslation();
  const [botonValidation, setbotonValidation] = useState(true);
  const [tipo, settipo] = useState("");
  const [dataDesembolso, setdataProgramas] = useState(null);
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
    api.consultListProgramPagoPropCred(props.dataSet.facilityId).then(resp => {
      if (resp != undefined) {
        setdataProgramas(resp.map((data) => (
          data.status ?
            <tr key={data[0]}>
              <td>{data.paymentProgram}</td>
              <td>{data.observations}</td>
              <td style={{ textAlign: "right" }}>
                <Button type="button" color="link" onClick={(resp) => {
                  updateData(data, "EPROGRAMA")
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => {
                  deleteData(data, "DPROGRAMA")
                }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setdataProgramas(
          <tr key={1}>
            <td colSpan="2" style={{ textAlign: 'center' }}></td>
          </tr>);
      }
    })
  }
  function updateData(data, tipo2) {
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
  function saveData(values, tipo2) {
    values.facilityId = props.dataSet.facilityId;
    if (tipo2 == "PROGRAMA") {
      // nuevoProgramaPagoPropCred
      api.newProgramPagoPropCred(values).then(resp => {
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
    if (tipo2 == "EPROGRAMA") {
      values.paymentProgramId = dataSet.paymentProgramId;
      values.status = true;
      // actualizarProgramaPagoPropCred
      api.updateProgramPagoPropCred(values).then(resp => {
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
  if (!props.items) {
    return null;
  }

  return (
    <React.Fragment>
      {/* <h5>{t("Payment Program")}</h5> */}
      <Row className="mb-3">
        <Col md="6">
          <h5 className="card-sub-title">{t("Payment Program")}</h5>
        </Col>
        <Col md="6" style={{ textAlign: "right" }}>
          <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
            setbotonValidation(true); setdataSet({
              "facilityId": 0,
              "paymentProgram": "",
              "observations": "",
              "status": true
            }); settipo("PROGRAMA"); toggleModal()
          }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
        </Col>
        <Col md="12" className="table-responsive styled-table-div">
          <Table className="table table-striped table-hover styled-table table" >
            <thead  >
              <tr>
                <th>{t("Payment Program Type")}</th>
                <th>{t("Description")}</th>
                <th className="text-end">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {dataDesembolso}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ModalNewPaymentProgram saveData={saveData} botones={botonValidation} tipo={tipo} dataSet={dataSet} isOpen={displayModal} toggle={toggleModal} onSave={props.onSaveItem} />
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
          cancelButtonText={t("Cancel")}
          warning
          showCancel
          confirmButtonText={t("Yesdeleteit")}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            const api = new BackendServices();
            // eliminarProgramaPagoPropCred
            api.deleteProgramPagoPropCred(dataSet.facilityId, dataSet.paymentProgramId).then(resp => {
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
    </React.Fragment>
  );

};
const DisbursementSection = (props) => {

  const { t, i18n } = useTranslation();

  return (
    <>
      <DisbursementTerms dataSet={props.dataSet} items={props.disbursementTerms} onSaveItem={props.onSaveDisbursementTerm} onDeleteItem={props.onDeleteDisbursementTerm} t={t} />
      <PaymentPrograms dataSet={props.dataSet} items={props.paymentPrograms} onSaveItem={props.onSavePaymentProgram} onDeleteItem={props.onDeletePaymentProgram} t={t} />
    </>
  );
};
DisbursementSection.propTypes = {
  disbursementTerms: PropTypes.array.isRequired,
  onSaveDisbursementTerm: PropTypes.func.isRequired,
  onDeleteDisbursementTerm: PropTypes.func.isRequired,
  paymentPrograms: PropTypes.array.isRequired,
  onSavePaymentProgram: PropTypes.func.isRequired,
  onDeletePaymentProgram: PropTypes.func.isRequired,
  disbursementMethods: PropTypes.array.isRequired,
  onSaveDisbursementMethod: PropTypes.func.isRequired,
  onDeleteDisbursementMethod: PropTypes.func.isRequired,
};
export default DisbursementSection;
