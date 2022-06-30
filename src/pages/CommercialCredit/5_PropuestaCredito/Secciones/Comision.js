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
import ModalNuevaComision from "./ModalNuevaComision";
import { BackendServices } from "../../../../services";
import { useTranslation } from "react-i18next";
import Currency from "../../../../helpers/currency"
const ComisionSeccion = (props) => {
  const { t, i18n } = useTranslation();

  const api = new BackendServices();
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  // Variables para alertas 
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [dataGeneralComisiones, setdataGeneralComisiones] = useState(null)
  const [displayModal, setDisplayModal] = useState(false);
  const [botonValidation, setbotonValidation] = useState(true);
  const [tipo, settipo] = useState("");
  const currencyData = new Currency();
  const [datacOMISION, setdatacOMISION] = useState(null);
  const [dataSet, setdataSet] = useState({
    "facilityId": 0,
    "commissionType": "",
    "amount": 0,
    "observations": " "
  });
  React.useEffect(() => {
    console.log(props)
    initializeData();
  }, [props.dataSet.facilityId]);
  function initializeData() {
    // consultarComisionPropCred
    api.consultCommissionPropCred(props.dataSet.facilityId).then(resp => {
      console.log("🚀 ~ file: Comision.js ~ line 46 ~ api.consultCommissionPropCred ~ resp", resp)
      if (resp != undefined) {
        setdataGeneralComisiones(resp.commissions);
        setdatacOMISION(resp.commissions.map((data) => (
          data.status ?
            <tr key={data.commissionId}>
              <td>{data.comisionType.code}</td>
              <td>{currencyData.formatTable(data.amount ?? 0)}</td>
              <td style={{ textAlign: "right" }}>
                {!props?.previewProposal &&
                  <>
                    <Button type="button" color="link" onClick={(resp) => {
                      updateData(data, "ECOMISION")
                    }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                    <Button type="button" color="link" onClick={(resp) => {
                      deleteData(data, "DCOMISION")
                    }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                  </>
                }
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
  function updateData(data, tipo2) {
    console.log(data);
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
    values.facilityId = props.dataSet.facilityId;
    values.amount = Number(currencyData.getRealValue(values.amount));
    values.observations = " ";

    console.log(values, props);
    if (tipo2 == "COMISION") {
      api.newCommissionPropCred(values).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg(true)
          toggleModal();
        } else {
          toggleModal();
          seterror_dlg(false);
        }
        initializeData()
      }).catch(err => {
        seterror_dlg(false);
      })
    }
    if (tipo2 == "ECOMISION") {
      values.commissionId = dataSet.commissionId;
      values.status = true;
      api.updateComisionPropCred(values).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg(true)
          toggleModal();
        } else {
          toggleModal();
          seterror_dlg(false);
        }
        initializeData()
      }).catch(err => {
        seterror_dlg(false);
      })
    }

  }
  return (
    <React.Fragment>
      {/* <h5>{t("Commission")}</h5> */}
      <Row className="mb-3">
        {!props?.previewProposal && <>
          <Col md="6">
            <h5 className="card-sub-title">{t("Commission")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setbotonValidation(true); setdataSet({
                "facilityId": 0,
                "commissionType": "",
                "amount": 0,
                "observations": " "
              }); settipo("COMISION"); toggleModal()
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
        </>}
        <Col md="12" className="table-responsive styled-table-div">
          <Table className="table table-striped table-hover styled-table table" >
            <thead  >
              <tr>
                <th>{t("Commission Type")}</th>
                <th>{t("Amount")}</th>
                {/* <th>{t("Percent")}</th> */}
                <th className="text-end">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {datacOMISION}
            </tbody>

          </Table>
        </Col>
      </Row>

      <ModalNuevaComision MontoFacilidad={props.MontoFacilidad} dataGeneralComisiones={dataGeneralComisiones} saveData={saveData} botones={botonValidation} tipo={tipo} dataSet={dataSet} isOpen={displayModal} toggle={toggleModal} />
      {/* {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
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
            apiBack.deleteComisionPropCred(props.dataSet.facilityId, dataSet.commissionId).then(resp => {
              if (resp.statusCode == "500") {
                setconfirm_alert(false)
                seterror_dlg(false)
              } else {
                setconfirm_alert(false)
                setsuccessSave_dlg(true)
              }
              initializeData()
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

export default ComisionSeccion;
