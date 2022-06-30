import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import { Link, useLocation, useHistory } from "react-router-dom"
import {
  Row,
  Col,
  Button,
  Table,
  Card,
  CardBody,
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import ModalCuentasCobrar from "./ModalCuentasCobrar.js"
import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';
import { BackendServices } from "../../../../../services/index.js";
import SweetAlert from "react-bootstrap-sweetalert";
import * as url from "../../../../../helpers/url_helper"
import Currency from "../../../../../helpers/currency";
import { uniq_key } from "../../../../../helpers/unq_key.js";
const estiloTotales = { backgroundColor: "lightgrey", color: "black" }
const CuentasCobrar = React.forwardRef((props, ref) => {
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
  const [dataDelete, setDataDelete] = useState([]);
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [tipo, settipo] = useState("")
  const [dataCuentas, setdataCuentas] = useState({
    "transactId": 0,
    "countryCustomer": "",
    "days30": 0,
    "days60": 0,
    "days90": 0,
    "days120": 0,
    "days150": 0,
    "days180": 0,
    "days210": 0,
    "days240": 0,
    "days270": 0,
    "days300": 0,
    "days330": 0,
    "days331": 0,
    "total": 0,
    "percentage": 0
  })
  const [dataCuentasCobrarRows, setdataCuentasCobrarRows] = useState(null);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmProveedores');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }
  }));
  const [showModalCuentasCobrar, setShowModalCuentasCobrar] = useState(false);
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
    if (props.activeTab == 22) {
      // Read Api Service databhhh
      initializeData(dataSession);
    }
  }, [props.activeTab == 22]);
  function initializeData(dataLocation) {
    const api = new BackendServices();
    // consultarCuentasCobrarIGR
    api.consultAccountsReceivableIGR(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        setdataCuentasCobrarRows(resp.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("CountryClient")}>{data.countryCustomer}</td>
            <td data-label={"30" + t("Days")}>${currencyData.formatTable(data.days30 ?? 0)}</td>
            <td data-label={"60" + t("Days")}>${currencyData.formatTable(data.days60 ?? 0)}</td>
            <td data-label={"90" + t("Days")}>${currencyData.formatTable(data.days90 ?? 0)}</td>
            <td data-label={"120" + t("Days")}>${currencyData.formatTable(data.days120 ?? 0)}</td>
            <td data-label={"150" + t("Days")}>${currencyData.formatTable(data.days150 ?? 0)}</td>
            <td data-label={"180" + t("Days")}>${currencyData.formatTable(data.days180 ?? 0)}</td>
            <td data-label={"210" + t("Days")}>${currencyData.formatTable(data.days210 ?? 0)}</td>
            <td data-label={"240" + t("Days")}>${currencyData.formatTable(data.days240 ?? 0)}</td>
            <td data-label={"270" + t("Days")}>${currencyData.formatTable(data.days270 ?? 0)}</td>
            <td data-label={"300" + t("Days")}>${currencyData.formatTable(data.days300 ?? 0)}</td>
            <td data-label={"330" + t("Days")}>${currencyData.formatTable(data.days330 ?? 0)}</td>
            <td data-label={"+331" + t("Days")}>${currencyData.formatTable(data.days331 ?? 0)}</td>
            <td data-label={t("Total")}>${currencyData.formatTable(data.total ?? 0.00)}</td>
            <td data-label={t("Percent")}>{currencyData.formatTable(data.percentage)}%</td>
            <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
              <Button type="button" color="link" onClick={(resp) => { updateDatosCxc(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { deleteDataCxc(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)));
      } else {
        setdataCuentasCobrarRows(
          <tr key={uniq_key()}>
            <td colSpan="14" style={{ textAlign: 'center' }}></td>
          </tr>);
      }
    });
  }
  function cerrarModal() {
    setShowModalCuentasCobrar(false);
    removeBodyCss()
  }
  function abrirModal() {
    setShowModalCuentasCobrar(true);
    removeBodyCss()
  }

  //abrimos modal para adjunar archivos
  function toggleShowModalCuentasCobrar() {
    setShowModalCuentasCobrar(!showModalCuentasCobrar);
    removeBodyCss()
  }
  function dataManagament(data, tipo) {
    const api = new BackendServices()
    data.transactId = Number(locationData.transactionId);
    data.days30 = Number(currencyData.getRealValue(data?.days30 ?? 0));
    data.days60 = Number(currencyData.getRealValue(data?.days60 ?? 0));
    data.days90 = Number(currencyData.getRealValue(data?.days90 ?? 0));
    data.days120 = Number(currencyData.getRealValue(data?.days120 ?? 0));
    data.days150 = Number(currencyData.getRealValue(data?.days150 ?? 0));
    data.days180 = Number(currencyData.getRealValue(data?.days180 ?? 0));
    data.days210 = Number(currencyData.getRealValue(data?.days210 ?? 0));
    data.days240 = Number(currencyData.getRealValue(data?.days240 ?? 0));
    data.days270 = Number(currencyData.getRealValue(data?.days270 ?? 0));
    data.days300 = Number(currencyData.getRealValue(data?.days300 ?? 0));
    data.days330 = Number(currencyData.getRealValue(data?.days330 ?? 0));
    data.days331 = Number(currencyData.getRealValue(data?.days331 ?? 0));
    data.total = Number(currencyData.getRealValue(data?.total ?? 0));
    data.percentage = Number(data.percentage);
    if (tipo == "guardar") {
      api.newAccountsReceivableIGR(data).then(resp => {
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
      api.updateAccountsReceivableIGR(data).then(resp => {
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
  function verDatosCxc(data) {
    setdataCuentas(data)
    settipo("ver")
    setbotonValidation(false);
    toggleShowModalCuentasCobrar()
  }
  // Actualiza datos de cxc
  function updateDatosCxc(data) {
    setdataCuentas(data)
    settipo("editar")
    setbotonValidation(true);
    abrirModal()
  }
  // elimina los datos de la cxc
  function deleteDataCxc(data) {
    setDataDelete(data)
    setconfirm_alert(true);
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
        {t("AccountsReceivable")}
      </h5> */}
      <p className="card-title-desc"></p>


      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <Card>
          <CardBody>
            <Row>
              <Col md="6">
                <h5 className="card-sub-title">{t("AccountsReceivable")}</h5>
              </Col>
              <Col md="6" style={{ textAlign: "right" }}>
                <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                  settipo("guardar"); setdataCuentas({
                    "transactId": 0,
                    "countryCustomer": "",
                    "days30": 0,
                    "days60": 0,
                    "days90": 0,
                    "days120": 0,
                    "days150": 0,
                    "days180": 0,
                    "days210": 0,
                    "days240": 0,
                    "days270": 0,
                    "days300": 0,
                    "days330": 0,
                    "days331": 0,
                    "total": 0,
                    "percentage": 0
                  }); abrirModal()
                }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
              </Col>
              <Col md="12" className="table-responsive styled-table-div">
                <Table className="table table-striped table-hover styled-table table" >
                  <thead>
                    <tr>
                      <th>{t("CountryClient")}</th>
                      <th>30 {t("Days")}</th>
                      <th>60 {t("Days")}</th>
                      <th>90 {t("Days")}</th>
                      <th>120 {t("Days")}</th>
                      <th>150 {t("Days")}</th>
                      <th>180 {t("Days")}</th>
                      <th>210 {t("Days")}</th>
                      <th>240 {t("Days")}</th>
                      <th>270 {t("Days")}</th>
                      <th>300 {t("Days")}</th>
                      <th>330 {t("Days")}</th>
                      <th>+331 {t("Days")}</th>
                      <th>{t("Total")}</th>
                      <th>{t("Percent")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCuentasCobrarRows}
                  </tbody>
                </Table>

              </Col>
            </Row>
          </CardBody>
        </Card>
        {locationData ? (props?.activeTab == 22 ?
          <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_CUENTASPORCOBRAR)} />
          : null) : null}

      </AvForm>

      <ModalCuentasCobrar dataManagament={dataManagament} botones={botonValidation} tipo={tipo} dataCuentas={dataCuentas} isOpen={showModalCuentasCobrar} toggle={() => { cerrarModal() }} />
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
            // eliminarCuentasCobrarIGR
            apiBack.deleteAccountsReceivableIGR({ transactId: locationData.transactionId, accountReceivableId: dataDelete.idCollectionAccount }).then(resp => {
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

CuentasCobrar.propTypes = {
  locationData: PropTypes.any,
}
export default CuentasCobrar;
