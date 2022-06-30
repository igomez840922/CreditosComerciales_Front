import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useLocation, useHistory } from "react-router-dom"
import {
  Row,
  Col,
  Button,
  Table,
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import ModalCapex1 from "./ModalCapex1.js"
import ModalCapex2 from "./ModalCapex2.js"
import ModalCapex3 from "./ModalCapex3.js"
import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';
import SweetAlert from "react-bootstrap-sweetalert"
import { BackendServices } from "../../../../../services/index.js"
import * as url from "../../../../../helpers/url_helper"
import Currency from "../../../../../helpers/currency";
import HeaderSections from "../../../../../components/Common/HeaderSections.js"
import { uniq_key } from "../../../../../helpers/unq_key.js"
const Capex = React.forwardRef((props, ref) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  // const { locationData } = props;
  const location = useLocation()
  /* ---------------------------------------------------------------------------------------------- */
  /*                        Variables de estados para los mensajes de alerta                        */
  /* ---------------------------------------------------------------------------------------------- */
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [dataCapex1, setdataCapex1] = useState({
    "transactId": 0,
    "personId": 0,
    "capexId": 0,
    "observations": "",
    "thousandUse": 0,
    "shareholder": "",
    "back": "",
    "status": true
  });
  const [dataCapex2, setdataCapex2] = useState({
    "transactId": 0,
    "capexId": 0,
    "budget": "",
    "amount": 0,
    "status": true
  });
  const [dataCapex3, setdataCapex3] = useState({
    "transactId": 0,
    "capexDetailsId": 0,
    "observations": "",
    "amount": 0,
    "status": true
  });
  const [tipo, setTipo] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [dataCapex1Rows, setdataCapex1Rows] = useState(null);
  const [dataCapex2Rows, setdataCapex2Rows] = useState(null);
  const [dataCapex3Rows, setdataCapex3Rows] = useState(null);
  const [usuarioData, setusuarioData] = useState(null);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmProveedores');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }
  }));
  const [showModalCapex1, setShowModalCapex1] = useState(false);
  const [showModalCapex2, setShowModalCapex2] = useState(false);
  const [showModalCapex3, setShowModalCapex3] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const history = useHistory();
  React.useEffect(() => {
    let dataSession;
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        dataSession = location.data;
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        dataSession = result;
      }
    }
    // Read Api Service data
    initializeData(dataSession);
  }, [props.activeTab == 23]);
  const api = new BackendServices();
  function initializeData(dataLocation) {
    api.consultarListaCapexAC(dataLocation.transactionId).then(resp => {
      if (resp != undefined && resp.length > 0) {
        setdataCapex1Rows(resp.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Description")}>{data.observations}</td>
              <td data-label={t("UsesInMiles")}>${currencyData.formatTable(data.thousandUse ?? 0)}</td>
              <td data-label={t("Shareholder")}>{data.shareholder}</td>
              <td data-label={t("Bank")}>{data.back}</td>
              <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                <Button type="button" color="link" onClick={(resp) => { updateData(data, "ECAPEX1") }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => { deleteData(data, "DCAPEX1") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setdataCapex1Rows(
          <tr key={uniq_key()}>
            <td colSpan="5" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    api.consultarListaCapexPresupuestoAC(dataLocation.transactionId).then(resp => {
      if (resp != undefined && resp.length > 0) {
        setdataCapex2Rows(resp.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("Budget")}>{data.budget}</td>
            <td data-label={t("Amount")}>${currencyData.formatTable(data.amount ?? 0)}</td>
            <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
              <Button type="button" color="link" onClick={(resp) => { updateData(data, "ECAPEX2") }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { deleteData(data, "DCAPEX2") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)
        ));
      } else {
        setdataCapex2Rows(
          <tr key={uniq_key()}>
            <td colSpan="4" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    api.consultarListaCapexDetallesAC(dataLocation.transactionId).then(resp => {
      if (resp != undefined && resp.length > 0) {
        setdataCapex3Rows(resp.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("ProjectDetails")}>{data.details}</td>
            <td data-label={t("Amount")}>${currencyData.formatTable(data.amount ?? 0)}</td>
            <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
              <Button type="button" color="link" onClick={(resp) => { updateData(data, "ECAPEX3") }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { deleteData(data, "DCAPEX3") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)
        ));
      } else {
        setdataCapex3Rows(
          <tr key={uniq_key()}>
            <td colSpan="4" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
    /* ---------------------------------------------------------------------------------------------- */
    /*                                   Consultar deudor principal                                   */
    /* ---------------------------------------------------------------------------------------------- */
    api.consultPrincipalDebtor(dataLocation.transactionId).then(resp => {
      setusuarioData(resp);
    })
  }
  /* ---------------------------------------------------------------------------------------------- */
  /*                                     actualizamos los datos                                     */
  /* ---------------------------------------------------------------------------------------------- */
  function updateData(data, tipo2) {
    setTipo(tipo2);
    if (tipo2 == "ECAPEX1") {
      setdataCapex1(data);
      toggleShowModalCapex1(true)
    }
    if (tipo2 == "ECAPEX2") {
      setdataCapex2(data);
      toggleShowModalCapex2(true)
    }
    if (tipo2 == "ECAPEX3") {
      setdataCapex3(data);
      toggleShowModalCapex3(true)
    }
    setbotonValidation(true);
  }
  function deleteData(data, tipo2) {
    setTipo(tipo2);
    if (tipo2 == "DCAPEX1") {
      setdataCapex1(data);
    }
    if (tipo2 == "DCAPEX2") {
      setdataCapex2(data);
    }
    if (tipo2 == "DCAPEX3") {
      setdataCapex3(data);
    }
    setconfirm_alert(true);
  }
  function SaveData(data, tipo) {
    data.transactId = Number(locationData.transactionId);
    data.personId = usuarioData?.personId;
    /* ---------------------------------------------------------------------------------------------- */
    /*                                  Guardamos los datos del cash                                  */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "CAPEX1") {
      data.thousandUse = Number(currencyData.getRealValue(data?.useInMiles ?? 0));
      data.observations = data.description;
      data.back = data.bank;
      let jsonSet = {
        transactId: Number(data?.transactId) ?? 0,
        personId: Number(data?.personId) ?? 0,
        observations: data?.observations ?? "",
        thousandUse: Number(currencyData.getRealValue(data?.thousandUse)) ?? 0,
        shareholder: data?.shareholder ?? "",
        back: data?.back ?? ""
      }
      // guardarListaCapexAC
      api.guardarListaCapexAC(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalCapex1(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "CAPEX2") {
      data.thousandUse = Number(currencyData.getRealValue(data?.useInMiles ?? 0));
      data.observations = data.description;
      data.back = data.bank;
      // guardarListaCapexPresupuestoAC
      let jsonSet = {
        transactId: Number(data?.transactId) ?? 0,
        personId: Number(data?.personId) ?? 0,
        budget: data?.budget ?? '',
        amount: Number(currencyData.getRealValue(data?.amount ?? 0)) ?? 0
      }
      api.guardarListaCapexPresupuestoAC(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalCapex2(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "CAPEX3") {
      data.details = data.observations;
      // guardarListaCapexDetallesAC
      let jsonSet = {
        transactId: Number(data?.transactId) ?? 0,
        personId: Number(data?.personId) ?? 0,
        details: data?.details ?? " ",
        amount: Number(currencyData.getRealValue(data?.amount ?? 0)) ?? 0
      }
      api.guardarListaCapexDetallesAC(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalCapex3(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
  }
  function UpdateData(data, tipo) {
    data.transactId = Number(locationData.transactionId);
    data.personId = usuarioData?.personId;
    /* ---------------------------------------------------------------------------------------------- */
    /*                                    Editita el flujo de caja                                    */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "ECAPEX1") {
      data.thousandUse = Number(currencyData.getRealValue(data?.useInMiles ?? 0));
      data.observations = data.description;
      data.back = data.bank;
      let jsonSet = {
        transactId: Number(data?.transactId) ?? 0,
        personId: Number(data?.personId) ?? 0,
        capexId: Number(data?.capexId) ?? 0,
        observations: data?.observations ?? " ",//
        thousandUse: Number(currencyData.getRealValue(data?.thousandUse ?? 0)) ?? 0,
        shareholder: data?.shareholder ?? " ",//
        back: data?.back ?? " ",//
        status: true
      }
      // actualizarListaCapexAC
      api.actualizarListaCapexAC(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalCapex1(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "ECAPEX2") {
      data.thousandUse = Number(currencyData.getRealValue(data?.useInMiles ?? 0));
      data.observations = data.description;
      data.back = data.bank;
      let jsonSet = {
        transactId: Number(data?.transactId) ?? 0,
        capexId: Number(data?.capexId) ?? 0,
        personId: Number(data?.personId) ?? 0,
        budget: data?.budget ?? " ",//
        amount: Number(currencyData.getRealValue(data?.amount ?? 0)) ?? 0,
        status: true
      }
      // actualizarListaCapexPresupuestoAC
      api.actualizarListaCapexPresupuestoAC(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalCapex2(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "ECAPEX3") {
      data.details = data.observations;
      let jsonSet = {
        transactId: Number(data?.transactId) ?? 0,
        personId: Number(data?.personId) ?? 0,
        capexDetailId: Number(data?.capexDetailId) ?? 0,
        details: data?.details ?? "",
        amount: Number(currencyData.getRealValue(data?.amount ?? 0)) ?? 0,
        status: true
      }
      // actualizarListaCapexDetallesAC
      api.actualizarListaCapexDetallesAC(jsonSet).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          initializeData(locationData);
          toggleShowModalCapex3(false);
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalCapex1(estado) {
    setShowModalCapex1(estado);
    removeBodyCss()
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalCapex2(estado) {
    setShowModalCapex2(estado);
    removeBodyCss()
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalCapex3(estado) {
    setShowModalCapex3(estado);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
  }
  return (
    <React.Fragment>
      {/* <h5>
        {t("Capex")}
      </h5> */}
      <p className="card-title-desc"></p>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("Capex")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setbotonValidation(true); setdataCapex1({
                "transactId": 1,
                "personId": 1,
                "capexId": 0,
                "observations": "",
                "thousandUse": 0,
                "shareholder": "",
                "back": "",
                "status": true
              }); setTipo("CAPEX1"); toggleShowModalCapex1(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr colSpan="5">

                </tr>
                <tr>
                  <th>{t("Description")}</th>
                  <th>{t("UsesInMiles")}</th>
                  <th>{t("Shareholder")}</th>
                  <th>{t("Bank")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataCapex1Rows}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("Budget")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setbotonValidation(true); setdataCapex2({
                "transactId": 0,
                "capexId": 0,
                "budget": "",
                "amount": 0,
                "status": true
              }); setTipo("CAPEX2"); toggleShowModalCapex2(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("Budget")}</th>
                  <th>{t("Amount")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataCapex2Rows}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("Details")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setbotonValidation(true); setdataCapex3({
                "transactId": 0,
                "capexDetailsId": 0,
                "observations": "",
                "amount": 0,
                "status": true
              }); setTipo("CAPEX3"); toggleShowModalCapex3(true)
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>

          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("ProjectDetails")}</th>
                  <th>{t("Amount")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataCapex3Rows}
              </tbody>
            </Table>
          </Col>
        </Row>
        {locationData ? (props?.activeTab == 23 ?
          <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_CAPEX)} />
          : null) : null}

      </AvForm>
      <ModalCapex1 SaveData={SaveData} botones={botonValidation} tipo={tipo} UpdateData={UpdateData} dataCapex1={dataCapex1} isOpen={showModalCapex1} toggle={() => { toggleShowModalCapex1(false) }} />
      <ModalCapex2 SaveData={SaveData} botones={botonValidation} tipo={tipo} UpdateData={UpdateData} dataCapex2={dataCapex2} isOpen={showModalCapex2} toggle={() => { toggleShowModalCapex2(false) }} />
      <ModalCapex3 SaveData={SaveData} botones={botonValidation} tipo={tipo} UpdateData={UpdateData} dataCapex3={dataCapex3} isOpen={showModalCapex3} toggle={() => { toggleShowModalCapex3(false) }} />
      {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            initializeData(locationData);
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
            initializeData(locationData);
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
            if (tipo == "DCAPEX1") {
              // eliminarListaCapexAC
              apiBack.eliminarListaCapexAC(locationData?.transactionId ?? 0, usuarioData?.personId, dataCapex1.capexId).then(resp => {
                if (resp.statusCode == "500") {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  initializeData(locationData);
                }
              }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
            if (tipo == "DCAPEX2") {
              // eliminarListaCapexPresupuestoAC
              apiBack.eliminarListaCapexPresupuestoAC(locationData?.transactionId ?? 0, usuarioData?.personId, dataCapex2.capexId).then(resp => {
                if (resp.statusCode == "500") {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  initializeData(locationData);
                }
              }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
            if (tipo == "DCAPEX3") {
              // eliminarListaCapexDetallesAC
              apiBack.eliminarListaCapexDetallesAC(locationData?.transactionId ?? 0, usuarioData?.personId, dataCapex3.capexDetailId).then(resp => {
                if (resp.statusCode == "500") {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  initializeData(locationData);
                }
              }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
          }}
          onCancel={() => setconfirm_alert(false)}
        >
          {t("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
    </React.Fragment>
  );

});
Capex.propTypes = {
  locationData: PropTypes.any,
}
export default Capex;
