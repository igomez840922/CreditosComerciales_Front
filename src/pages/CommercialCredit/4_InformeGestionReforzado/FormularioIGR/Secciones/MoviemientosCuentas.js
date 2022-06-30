import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import { Link, useLocation, useHistory } from "react-router-dom"
import {
  Row,
  Col,
  Button,
  Label,
  Table,
  Card, CardBody
} from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
import ModalMovimientoCuenta from "./ModalMovimientoCuentas";
import { BackendServices } from "../../../../../services";
import SweetAlert from "react-bootstrap-sweetalert";
import * as url from "../../../../../helpers/url_helper"

import AccountMovementsHistory from "../../../../../components/Common/AccountMovementsHistory";
import Currency from "../../../../../helpers/currency";
import { uniq_key } from "../../../../../helpers/unq_key";
import LoadingOverlay from "react-loading-overlay";

const MoviemientosCuentas = React.forwardRef((props, ref) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  const location = useLocation()
  const [formValid, setFormValid] = useState(false);
  const [dataReturn, setDataReturn] = useState(props.dataMoviemientosCuentas);
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [tipo, settipo] = useState("")
  const [botonValidation, setbotonValidation] = useState(false);
  const [dataLocation, setData] = useState(location.data);
  const [accionistasJSON, setAccionistasJson] = useState(props.jsonAccionistas);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [dataMovimientos, setdataMovimientos] = useState(null);
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  const [dataDelete, setDataDelete] = useState([]);
  const [dataAcciones, setdataAcciones] = useState({
    trasactId: null,
    year: null,
    month: null,
    deposits: null,
    averageBalance: null,
    observations: null
  });

  const [locationData, setLocationData] = useState(null);
  const history = useHistory();
  const [datosUsuario, setdatosUsuario] = useState(null);

  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmMovimientoCuentas');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
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
    if (props.activeTab == 15) {
      // Read Api Service data  
      loadInitialData(dataSession);
    }
  }, [props.activeTab == 15]);

  const api = new BackendServices()

  function loadInitialData(dataLocation) {

    // consultarMovimientosCuentasIGR
    api.consultMovementsBank(dataLocation.transactionId).then(resp => {
      if (resp.bankOthersBank.length > 0) {
        resp = resp.bankOthersBank;
        setdataMovimientos(resp.map((data, index, arr) => {
          let movementsYear = resp?.filter(movement => movement.year === data.year && movement.status && movement.accountNumber === data.accountNumber);
          return (
            data.status ?
              <>
                <tr key={uniq_key() + "1"}>
                  <td data-label={t("Year")}>{data.year}</td>
                  <td data-label={t("Month")}>{data.month}</td>
                  <td data-label={t("Deposits")}>{currencyData.formatTable(data.deposits ?? 0)}</td>
                  <td data-label={t("AverageBalance")}>{currencyData.formatTable(data.averageBalance ?? 0)}</td>
                  <td data-label={t("Observation")}>{data.observations}</td>
                  <td data-label={t("Actions")} className="d-flex">
                    {props?.validacion ? null :
                      <>
                        <Button type="button" color="link" onClick={(resp) => { updateDataAccount(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                        <Button type="button" color="link" onClick={(resp) => { deleteDataAccount(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                      </>
                    }
                  </td>
                </tr>
                {
                  (data.year !== arr[index + 1]?.year || data.accountNumber !== arr[index + 1]?.accountNumber) && (
                    <>
                      <tr key={uniq_key() + "2"}>
                        <th><b>{t("Total")}</b></th>
                        <th></th>
                        <th>${currencyData.formatTable(movementsYear?.reduce((acu, crr) => acu + crr.deposits, 0).toFixed(2) ?? 0)}</th>
                        <th>${currencyData.formatTable(movementsYear?.reduce((acu, crr) => acu + crr.averageBalance, 0).toFixed(2) ?? 0)}</th>
                        <th></th>
                        <th></th>
                      </tr>
                      <tr key={uniq_key() + "3"}>
                        <th><b>{t("Average")}</b></th>
                        <th></th>
                        <th>${currencyData.formatTable(movementsYear?.reduce((acu, crr) => acu + crr.deposits / movementsYear.length, 0).toFixed(2) ?? 0)}</th>
                        <th>${currencyData.formatTable(movementsYear?.reduce((acu, crr) => acu + crr.averageBalance / movementsYear.length, 0).toFixed(2) ?? 0)}</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </>
                  )
                }
              </>
              : null)
        }
        ));
      } else {
        setdataMovimientos(
          <tr key={uniq_key() + "2"}>
            <td colSpan="6" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });

    api.consultPrincipalDebtor(dataLocation.transactionId).then(resp => {
      setdatosUsuario(resp)
    })
  }

  React.useEffect(() => {
    setDataReturn(props.dataMoviemientosCuentas)
    dataReturn.dataTableMovimientoCuentas = []
    setDataReturn(dataReturn);
  }, [props.activeTab == 15]);
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    setFormValid(true)
  }
  function toggleShowModelAttachment() {
    setShowModelAttachment(!showModelAttachment);
    removeBodyCss()
  }
  function updateDataAccount(data) {
    setdataAcciones(data)
    settipo("editar");
    setbotonValidation(true);
    abrirModal()
  }
  function deleteDataAccount(data) {
    setDataDelete(data)
    setconfirm_alert(true)

  }
  function cerrarModal() {
    setShowModelAttachment(false);
    removeBodyCss()
  }
  function abrirModal() {
    setShowModelAttachment(true);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  function dataManagament(values, tipo) {
    values.trasactId = Number(locationData.transactionId);
    values.averageBalance = Number(values?.averageBalance ?? 0);
    values.deposits = Number(values?.deposits ?? 0);
    values.accountNumber = 0;
    let jsonSet = {
      "trasactId": Number(locationData.transactionId),
      "year": values.year,
      "month": values.month,
      "deposits": values.deposits,
      "averageBalance": values.averageBalance,
      "observations": values.observations,
      "accountNumber": "",
      "t24": false
    }
    if (tipo == "guardar") {
      // nuevoMovimientosCuentasIGR
      api.newMovementsAccountsIGR(jsonSet).then(resp => {
        if (resp !== null && resp !== undefined) {
          loadInitialData(locationData);
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      });
    } else {
      // actualizarMovimientosCuentasIGR
      jsonSet.movementId = values.movementId;
      api.updateMovementsAccountsIGR(jsonSet).then(resp => {
        if (resp !== null && resp !== undefined) {
          loadInitialData(locationData);
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      });
    }
  }
  return (
    <React.Fragment>

      {datosUsuario && locationData != null ? //clientDocId
        props?.validacion ?
          <AccountMovementsHistory validacion={props?.validacion} customerNumberT24={datosUsuario.customerNumberT24} transactionId={locationData.transactionId} />
          :
          <AccountMovementsHistory customerNumberT24={datosUsuario.customerNumberT24} transactionId={locationData.transactionId} />
        : null}

      <Card>
        {/* <h5 className="card-sub-title">
          {t("AccountMovements")}
        </h5> */}
        <CardBody>
          <AvForm id="frmMovimientoCuentas" className="needs-validation" onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <h5 className="card-sub-title">{t("AccountMovements") + " - " + t("OtherBank")}</h5>
              </Col>
              <Col md="6" style={{ textAlign: "right" }}>
                {props?.validacion ? null :
                  <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                    setbotonValidation(true); setdataAcciones({
                      trasactId: null,
                      year: null,
                      month: null,
                      deposits: null,
                      averageBalance: null,
                      observations: null
                    }); settipo("guardar"); abrirModal()
                  }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>}
              </Col>

              <Col md="12" className="table-responsive styled-table-div">
                <Table className="table table-striped table-hover styled-table table" >
                  <thead>
                    <tr>
                      <th>{t("Year")}</th>
                      <th>{t("Month")}</th>
                      <th>{t("Deposits")}</th>
                      <th>{t("AverageBalance")}</th>
                      <th>{t("Observation")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataMovimientos}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <div className="my-3"></div>
            {props?.validacion ? <Row>
              <Col xl="2">
                <strong htmlFor="clientNumber">{t("Details")}</strong>
              </Col>
              <Col xl="10">
                <Label htmlFor="clientNumber">{props.dataMoviemientosCuentas.observations == "" || props.dataMoviemientosCuentas.observations == null ? t("NoData") : props.dataMoviemientosCuentas.observations}</Label>
              </Col>
            </Row> :
              <Row>
                <Col md="12">
                  <div className="mb-3">
                    <Label htmlFor="detalleMovimientoCuenta">{t("Details")}</Label>
                    <AvField
                      type="textarea"
                      name="observations"
                      id="observations"
                      maxLength="1000"
                      rows="7"
                      value={props.dataMoviemientosCuentas.observations}
                      onChange={(e) => { dataReturn.observations = e.target.value; setDataReturn(dataReturn); }}
                    />
                  </div>
                </Col>
              </Row>
            }
          </AvForm>

        </CardBody>
      </Card>
      <ModalMovimientoCuenta tipo={tipo} dataManagament={dataManagament} botones={botonValidation} dataAcciones={dataAcciones} isOpen={showModelAttachment} toggle={() => { cerrarModal() }} />
      {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            loadInitialData(locationData);
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
            loadInitialData(locationData);
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
            // eliminarMovimientosCuentasIGR
            apiBack.deleteMovementsAccountsIGR({ transactId: dataDelete.trasactId, movementId: dataDelete.movementId }).then(resp => {
              if (resp.statusCode == "500") {
                setconfirm_alert(false)
                seterror_dlg(false)
              } else {
                setconfirm_alert(false)
                loadInitialData(locationData);
              }
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
MoviemientosCuentas.propTypes = {
  onSubmit: PropTypes.func,
}
export default MoviemientosCuentas;
