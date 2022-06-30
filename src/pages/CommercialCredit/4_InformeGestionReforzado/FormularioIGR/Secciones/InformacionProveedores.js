import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
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
import ModalInformacionProveedores from "./ModalInformacionProveedores"
import SweetAlert from "react-bootstrap-sweetalert"
import { BackendServices } from "../../../../../services"
import * as url from "../../../../../helpers/url_helper"
import { uniq_key } from "../../../../../helpers/unq_key"
import Currency from "../../../../../helpers/currency"

const InformacionProveedores = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const [formValid, setFormValid] = useState(false);
  const location = useLocation()
  const [dataReturn, setDataReturn] = useState(props.dataInformacionProveedores);
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [dataDelete, setDataDelete] = useState([]);
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [tipoDato, settipoDato] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [dataAccionistasDataRows, setdataAccionistasDataRows] = useState(null)
  const currencyData = new Currency();
  const [jsonProveedores, setjsonProveedores] = useState({
    name: null,
    oldRelationship: 0,
    percentPurchases: 0,
    creditDays: 0,
    negotiationConditions: null,
    country: null
  });
  const dataAccionistas = [
    { id: 1, name: "Panafoto", country: "Panamá", buypercent: "10", ageofRelationship: "10", crtermindays: "30-120 días", description: '' },
    { id: 2, name: "Panafoto", country: "Panamá", buypercent: "10", ageofRelationship: "12", crtermindays: "30-120 días", description: '' },
    { id: 3, name: "Panafoto", country: "Panamá", buypercent: "10", ageofRelationship: "12", crtermindays: "30-120 días", description: '' },
    { id: 4, name: "Panafoto", country: "Panamá", buypercent: "10", ageofRelationship: "12", crtermindays: "30-120 días", description: '' },
  ];
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
    if (props.activeTab == 11) {
      // Read Api Service data
      initializeData(dataSession);
      setDataReturn(props.dataInformacionProveedores)
    }
  }, [props.activeTab == 11]);
  function cerrarModal() {
    setShowModelAttachment(false);
    removeBodyCss()
  }
  function abrirModal() {
    setShowModelAttachment(true);
    removeBodyCss()
  }
  function initializeData(dataLocation) {
    const api = new BackendServices()
    // consultarListaProveedoresIGR
    api.consultListaProvidersIGR(dataLocation.transactionId).then(resp => {
      if (resp.providers.length > 0) {
        dataReturn.dataTableInformacionProveedores = resp.providers;
        setDataReturn(dataReturn);
        setdataAccionistasDataRows(resp.providers.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Name")}>{data.name}</td>
              <td data-label={t("Country")}>{data.country}</td>
              <td data-label={t("AgeofRelationship")}>{data.antiquity}</td>
              <td data-label={t("BuyPercent")}>{currencyData.formatTable(data.percentPurchases)}%</td>
              <td data-label={t("Crtermindays")}>{data.creditDays}</td>
              <td data-label={t("sdfSpecialTradingConditionssd")}>{data.negotiationConditions}</td>


              <td style={{ textAlign: "right" }}>
                <Link to="#" onClick={(resp) => { updateData(data) }}><i className="mdi mdi-border-color mdi-24px"></i></Link>
                <Link to="#" onClick={(resp) => { EliminarProveedor(data) }}><i className="mdi mdi-trash-can-outline  mdi-24px"></i></Link>
              </td>

            </tr> : null)
        ));
      } else {
        setdataAccionistasDataRows(
          <tr key={uniq_key()}>
            <td colSpan="8" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
  }
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmProveedores');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
  function dataManagament(data, tipo) {
    const api = new BackendServices()
    data.transactId = locationData.transactionId;
    let datos = {
      "transactId": Number(data.transactId),
      "name": data?.name ?? " ",
      // "oldRelationship": Number(data?.oldRelationship ?? 0),
      "antiquity": data?.antiquity ?? "",
      "percentPurchases": Number(data?.percentPurchases ?? 0),
      "creditDays": data?.creditDays ?? "",
      "negotiationConditions": data?.negotiationConditions ?? " ",
      "country": data?.country ?? " "
    }
    if (tipo == "guardar") {
      // nuevoProveedorIGR
      api.newProviderIGR(datos).then(resp => {
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
      // actualizarProveedorIGR
      datos.providerId = Number(jsonProveedores.providerId);
      api.updateProviderIGR(datos).then(resp => {
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
  function updateData(data) {
    setjsonProveedores(data)
    settipoDato("settipoDato")
    setbotonValidation(true);
    abrirModal()
  }
  function EliminarProveedor(data) {
    setDataDelete(data)
    setconfirm_alert(true);
  }
  //abrimos modal para adjunar archivos
  function toggleShowModelAttachment() {
    setShowModelAttachment(!showModelAttachment);
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
    setFormValid(true)
  }
  return (
    <React.Fragment>
      <h5 className="card-title">
        {t("ProvidersInfo")}
      </h5>
      <Row>
        <Col md="12" style={{ textAlign: "right" }}>
          <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
            setbotonValidation(true); setjsonProveedores({
              name: null,
              oldRelationship: 0,
              percentPurchases: 0,
              creditDays: 0,
              negotiationConditions: null,
              country: null
            }); settipoDato("guardar"); abrirModal();
          }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
        </Col>
        <Col md="12">
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table">
              <thead>
                <tr>
                  <th>{t("Name")}</th>
                  <th>{t("Country")}</th>
                  <th>{t("AgeofRelationship")}</th>
                  <th>{t("BuyPercent")}</th>
                  <th>{t("Crtermindays")}</th>
                  <th>{t("SpecialTradingConditions")}</th>
                  <th style={{ width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {dataAccionistasDataRows !== null && dataAccionistasDataRows !== undefined && dataAccionistasDataRows.length > 0 ?
                  dataAccionistasDataRows :
                  <tr>
                    <td colSpan={7}>
                      <div className="alert alert-info" style={{ textAlign: "center" }}>{t("NoData")}</div>
                    </td>
                  </tr>
                }
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <br></br>
      <AvForm id="frmProveedores" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="companyHistoryDescription">{t("Description")}</Label>
              <AvField
                className="form-control"
                name="description"
                type="textarea"
                value={props.dataInformacionProveedores.description}
                onChange={(e) => { dataReturn.description = e.target.value; setDataReturn(dataReturn); }}
                id="description"
                rows="7" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <AvGroup className="mb-3">
              <Label htmlFor="purchasingCycle">{t("PurchasingCycle")}</Label>
              <AvField
                className="form-control"
                name="purchasingCycle"
                type="text"
                value={props.dataInformacionProveedores.purchasingCycle}
                onChange={(e) => { dataReturn.purchasingCycle = e.target.value; setDataReturn(dataReturn); }}
                id="purchasingCycle"
                rows="7" />
            </AvGroup>
          </Col>
        </Row>
      </AvForm>
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
            // eliminarProveedorIGR
            apiBack.removeIGRProvider({ transactId: locationData.transactionId, providerId: dataDelete.providerId }).then(resp => {
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
      <ModalInformacionProveedores tipoDato={tipoDato} jsonProveedores={jsonProveedores} dataGeneralIA={dataReturn?.dataTableInformacionProveedores??null} botones={botonValidation} dataManagament={dataManagament} isOpen={showModelAttachment} toggle={() => { cerrarModal() }} />
    </React.Fragment>
  );

});
export default InformacionProveedores;
