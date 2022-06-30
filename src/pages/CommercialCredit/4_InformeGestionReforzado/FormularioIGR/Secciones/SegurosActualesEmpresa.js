import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useLocation, useHistory } from "react-router-dom"
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  CardHeader,
  Table,
  CardFooter
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import ModalSegurosActualesEmpresa from "./ModalSegurosActualesEmpresa"
import { BackendServices } from "../../../../../services"
import SweetAlert from "react-bootstrap-sweetalert"
import moment from "moment";
import * as url from "../../../../../helpers/url_helper"
import Currency from "../../../../../helpers/currency";
import { uniq_key } from "../../../../../helpers/unq_key"

const dataReciprocity = [
  { id: 1, insuranceCompany: "120", insuranceType: "Incendio", amount: '200', expiration: '' },
  { id: 2, insuranceCompany: "120", insuranceType: "Incendio", amount: '200', expiration: '' },
  { id: 3, insuranceCompany: "120", insuranceType: "Incendio", amount: '200', expiration: '' },
  { id: 4, insuranceCompany: "120", insuranceType: "Incendio", amount: '200', expiration: '' },
];
const SegurosActualesEmpresa = React.forwardRef((props, ref) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  const location = useLocation()
  /* ---------------------------------------------------------------------------------------------- */
  /*                        Variables de estados para los mensajes de alerta                        */
  /* ---------------------------------------------------------------------------------------------- */
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [dataDelete, setDataDelete] = useState([]);
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [dataSeguros, setdataSeguros] = useState({
    "transactId": 0,
    "company": "",
    "insuranceType": {
      "code": "",
      "name": ""
    },
    "amount": 0,
    "dueDate": ""
  });
  const [tipo, settipo] = useState("");

  const [formValid, setFormValid] = useState(false);
  const [dataReciprocityRows, setdataReciprocityRows] = useState(null);

  const [locationData, setLocationData] = useState(null);
  const history = useHistory();

  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmProveedores');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }
  }));
  const [showModalModalSegurosActualesEmpresa, setShowModalModalSegurosActualesEmpresa] = useState(false);
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
    if (props.activeTab == 20) {
      initializeData(dataSession);
    }
  }, [props.activeTab == 20]);
  function formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }
  function initializeData(dataLocation) {
    const api = new BackendServices();
    // consultarSegurosEmpresaIGR

    api.consultInsuranceCompanyIGR(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        setdataReciprocityRows(resp.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("InsuranceCompany")}>{data.company}</td>
              <td data-label={t("InsuranceType")}>{data.insuranceType.code}</td>
              <td data-label={t("Amount")}>{currencyData.formatTable(data.amount ?? 0)}</td>
              <td data-label={t("Expiration")}>{formatDate(data.dueDate)}</td>
              <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                <Button type="button" color="link" onClick={(resp) => { updateDataSegure(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => { deleteData(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setdataReciprocityRows(
          <tr key={uniq_key()}>
            <td colSpan="7" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
  }
  function updateDataSegure(data) {
    settipo("editar")
    setdataSeguros(data)
    setbotonValidation(true);
    abrirModal()
  }
  function dataManagament(data, tipo) {
    //console.log(data);
    const api = new BackendServices()
    data.transactId = locationData.transactionId;
    data.amount = Number(currencyData.getRealValue(data?.amount ?? 0))
    if (tipo == "guardar") {
      // nuevoSegurosEmpresaIGR
      api.newInsuranceCompanyIGR(data).then(resp => {
        if (resp !== null && resp !== undefined) {
          initializeData(locationData);
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      })
    } else {
      // actualizarSegurosEmpresaIGR
      api.updateInsuranceCompanyIGR(data).then(resp => {
        if (resp !== null && resp !== undefined) {
          initializeData(locationData);
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      })
    }
  }
  function deleteData(data) {
    setDataDelete(data)
    setconfirm_alert(true);
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalSegurosActualesEmpresa() {
    setShowModalModalSegurosActualesEmpresa(!showModalModalSegurosActualesEmpresa);
    removeBodyCss()
  }
  function cerrarModal() {
    setShowModalModalSegurosActualesEmpresa(false);
    removeBodyCss()
  }
  function abrirModal() {
    setShowModalModalSegurosActualesEmpresa(true);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
  }
  return (
    <React.Fragment>
      {/* <h5>
        {t("CurrentCompanyInsurance")}
      </h5> */}
      <p className="card-title-desc"></p>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("CurrentCompanyInsurance")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              settipo("guardar");
              setbotonValidation(true); setdataSeguros({
                "transactId": 0,
                "company": "",
                "insuranceType": {
                  "code": "",
                  "name": ""
                },
                "amount": 0,
                "dueDate": ""
              }); abrirModal();
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("InsuranceCompany")}</th>
                  <th>{t("InsuranceType")}</th>
                  <th>{t("Amount")}</th>
                  <th>{t("Expiration")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataReciprocityRows}
              </tbody>
            </Table>
          </Col>
        </Row>
      </AvForm>
      <ModalSegurosActualesEmpresa dataSeguros={dataSeguros} dataManagament={dataManagament} tipo={tipo} botones={botonValidation} isOpen={showModalModalSegurosActualesEmpresa} toggle={() => { cerrarModal() }} />
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
            // eliminarSegurosEmpresaIGR
            apiBack.deleteInsuranceCompanyIGR({ transactId: locationData.transactionId, InsuranceId: dataDelete.insuranceId }).then(resp => {
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
          }}
          onCancel={() => setconfirm_alert(false)}
        >
          {t("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
    </React.Fragment>
  );
});
export default SegurosActualesEmpresa;
