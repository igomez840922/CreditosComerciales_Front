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

import ModalNewDisbursementTerm from "../ModalNewDisbursementTerm";
import ModalNewPaymentProgram from "../ModalNewPaymentProgram";
import ModalNewDisbursementMethod from "../ModalNewDisbursementMethod";


const api = new BackendServices();
const DisbursementTerms = (props) => {
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
    api.consultDisbursementListPropCred(2).then(resp => {
      if (resp != undefined) {
        setdataDesembolso(resp.map((data) => (
          data.status ?
            <tr key={data[0]}>
              <td>{data.disbursementTypeId}</td>
              <td>{data.observations}</td>
              <td style={{ textAlign: "right" }}>
                <Button type="button" color="link" onClick={(resp) => {
                  editarDatos(data, "EDESEMBOLSO")
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => {
                  EliminarDatos(data, "DDESEMBOLSO")
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
  function guardarDatos(values, tipo2) {
    values.facilityId = 2;
    if (tipo2 == "DESEMBOLSO") {
      api.newDisbursementPropCred(values).then(resp => {
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
    if (tipo2 == "EDESEMBOLSO") {
      values.disbursementId = dataSet.disbursementId;
      values.status = true;
      api.actualizarDesembolsoPropCred(values).then(resp => {
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
  function toggleModal() {
    setDisplayModal(!displayModal);
  }

  if (!props.items) {
    return null;
  }
  return (
    <React.Fragment>
      <h5>{t("Disbursement")}</h5>
      <Row className="mb-3">
        <Col md="12">
          <Table className="table" responsive>
            <thead className="table-light">
              <tr>
                <th><strong>{t("Disbursement Type")}</strong></th>
                <th><strong>{t("Description")}</strong></th>
                <th className="text-end">
                  <Link className="float-end" onClick={() => {
                    setbotonValidation(true); setdataSet({
                      "facilityId": "",
                      "disbursementTypeId": "",
                      "observations": ""
                    }); settipo("DESEMBOLSO"); toggleModal()
                  }}><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i></Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataDesembolso}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ModalNewDisbursementTerm guardarDatos={guardarDatos} botones={botonValidation} tipo={tipo} dataSet={dataSet} isOpen={displayModal} toggle={toggleModal} onSave={props.onSaveItem} />
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
            const api = new BackendServices();
            api.deleteDisbursementPropCred(dataSet.facilityId, dataSet.disbursementId).then(resp => {
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

const PaymentPrograms = (props) => {
  // const api = new BackendServices();
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
    api.consultListProgramPagoPropCred(2).then(resp => {
      if (resp != undefined) {
        setdataProgramas(resp.map((data) => (
          data.status ?
            <tr key={data[0]}>
              <td>{data.paymentProgram}</td>
              <td>{data.observations}</td>
              <td style={{ textAlign: "right" }}>
                <Button type="button" color="link" onClick={(resp) => {
                  editarDatos(data, "EPROGRAMA")
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => {
                  EliminarDatos(data, "DPROGRAMA")
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
  function guardarDatos(values, tipo2) {
    values.facilityId = 2;
    if (tipo2 == "PROGRAMA") {
      api.newProgramPagoPropCred(values).then(resp => {
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
    if (tipo2 == "EPROGRAMA") {
      values.paymentProgramId = dataSet.paymentProgramId;
      values.status = true;
      api.updateProgramPagoPropCred(values).then(resp => {
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
      <h5>{t("Payment Program")}</h5>
      <Row className="mb-3">
        <Col md="12">
          <Table className="table" responsive>
            <thead className="table-light">
              <tr>
                <th>{t("Payment Program Type")}</th>
                <th>{t("Description")}</th>
                <th className="text-end">
                  <Link className="float-end" onClick={() => {
                    setbotonValidation(true); setdataSet({
                      "facilityId": 0,
                      "paymentProgram": "",
                      "observations": "",
                      "status": true
                    }); settipo("PROGRAMA"); toggleModal()
                  }}><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i></Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataDesembolso}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ModalNewPaymentProgram guardarDatos={guardarDatos} botones={botonValidation} tipo={tipo} dataSet={dataSet} isOpen={displayModal} toggle={toggleModal} onSave={props.onSaveItem} />
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
            const api = new BackendServices();
            api.deleteProgramPagoPropCred(dataSet.facilityId, dataSet.paymentProgramId).then(resp => {
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

const DisbursementMethods = (props) => {
  // const api = new backendServices();
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
  const [dataDesembolso, setdataProgramas] = useState(null);
  const [dataSet, setdataSet] = useState({
    "facilityId": 0,
    "formOfDisbursement": "",
    "observation": ""
  });
  React.useEffect(() => {
    // Read Api Service data
    initializeData();
  }, []);
  function initializeData() {
    api.consultDisbursementFormPropCred(2).then(resp => {
      if (resp != undefined) {
        setdataProgramas(resp.map((data) => (
          data.status ?
            <tr key={data.disbursementFormId}>
              <td>{data.formOfDisbursement}</td>
              <td>{data.observations}</td>
              <td style={{ textAlign: "right" }}>
                <Button type="button" color="link" onClick={(resp) => {
                  editarDatos(data, "EFDESEMBOLSO")
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => {
                  EliminarDatos(data, "DFDESEMBOLSO")
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
  function guardarDatos(values, tipo2) {
    values.facilityid = 2;
    if (tipo2 == "FDESEMBOLSO") {
      api.newFormDisbursementPropCred(values).then(resp => {
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
    if (tipo2 == "EFDESEMBOLSO") {
      values.disbursementid = dataSet.commissionId;
      values.status = true;
      api.updateFormDisbursementPropCred(values).then(resp => {
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
      <h5>{t("Disbursement Method")}</h5>
      <Row className="mb-3">
        <Col md="12">
          <Table className="table" responsive>
            <thead className="table-light">
              <tr>
                <th>{t("Disbursement Method")}</th>
                <th>{t("Description")}</th>
                <th className="text-end">
                  <Link className="float-end" onClick={() => {
                    setbotonValidation(true); setdataSet({
                      "facilityId": 0,
                      "paymentProgram": "",
                      "observations": "",
                      "status": true
                    }); settipo("FDESEMBOLSO"); toggleModal()
                  }}><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i></Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataDesembolso}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ModalNewDisbursementMethod guardarDatos={guardarDatos} botones={botonValidation} tipo={tipo} dataSet={dataSet} isOpen={displayModal} toggle={toggleModal} onSave={props.onSaveItem} />
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
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            api.deleteDisbursementFormPropCred(2, dataSet.commissionId).then(resp => {
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

const DisbursementSection = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  return (
    <>
      <DisbursementTerms items={props.disbursementTerms} onSaveItem={props.onSaveDisbursementTerm} onDeleteItem={props.onDeleteDisbursementTerm} t={t} c={c} />
      <PaymentPrograms items={props.paymentPrograms} onSaveItem={props.onSavePaymentProgram} onDeleteItem={props.onDeletePaymentProgram} t={t} c={c} />
      <DisbursementMethods items={props.disbursementMethods} onSaveItem={props.onSaveDisbursementMethod} onDeleteItem={props.onDeleteDisbursementMethod} t={t} c={c} />
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
