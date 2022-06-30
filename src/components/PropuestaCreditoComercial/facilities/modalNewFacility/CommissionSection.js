import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';
import { Link, useLocation } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import {
  Row,
  Col,
  Table,
  Button,
} from "reactstrap"

import ModalNewCommission from "../ModalNewCommission";
import { BackendServices } from "../../../../services";



const CommissionSection = (props) => {
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
    api.consultCommissionPropCred(2).then(resp => {
      if (resp != undefined) {
        setdatacOMISION(resp.map((data) => (
          data[5] ?
            <tr key={data[0]}>
              <td>{data[2]}</td>
              <td>{data[3]}</td>
              <td>{data[4]}</td>
              <td style={{ textAlign: "right" }}>
                {/* <Button type="button" color="link" onClick={(resp) => {
                  verDatos({
                    "facilityId": data[0],
                    "commissionId": data[1],
                    "commissionType": data[2],
                    "amount": data[3],
                    "observation": data[4]
                  }, "COMISION")
                }} className="btn btn-link" ><i className="mdi mdi-eye mdi-24px"></i></Button> */}
                <Button type="button" color="link" onClick={(resp) => {
                  editarDatos({
                    "facilityId": data[0],
                    "commissionId": data[1],
                    "commissionType": data[2],
                    "amount": data[3],
                    "observation": data[4]
                  }, "ECOMISION")
                }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => {
                  EliminarDatos({
                    "facilityId": data[0],
                    "commissionId": data[1],
                    "commissionType": data[2],
                    "amount": data[3],
                    "observation": data[4]
                  }, "DCOMISION")
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
    values.facilityId = 2;
    if (tipo2 == "COMISION") {
      api.newCommissionPropCred(values).then(resp => {
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
      values.commissionId = dataSet.commissionId;
      api.updateComisionPropCred(values).then(resp => {
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
  return (
    <React.Fragment>

      <h5>{t("Commission")}</h5>

      <Row className="mb-3">
        <Col md="12">
          <Table className="table" responsive>
            <thead className="table-light">
              <tr>
                <th>{t("Commission Type")}</th>
                <th>{t("Amount")}</th>
                <th>{t("Description")}</th>
                <th className="text-end">
                  <Link to="#" className="float-end" onClick={() => {
                    setbotonValidation(true); setdataSet({
                      "facilityId": 0,
                      "commissionType": "",
                      "amount": 0,
                      "observation": ""
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

      <ModalNewCommission guardarDatos={guardarDatos} botones={botonValidation} tipo={tipo} dataSet={dataSet} isOpen={displayModal} toggle={toggleModal} onSave={props.onSaveItem} />
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
            apiBack.deleteComisionPropCred(dataSet.facilityId, dataSet.commissionId).then(resp => {
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

CommissionSection.propTypes = {
  onSaveItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired
};

export default CommissionSection;
