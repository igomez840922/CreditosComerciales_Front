import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useLocation, useHistory } from "react-router-dom"
import {
  Row,
  Col,
  Button,
  Label,
  Table,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import ModalInformacionClientes from "./ModalInformacionClientes"
import SweetAlert from "react-bootstrap-sweetalert"
import { BackendServices } from "../../../../../services"
import * as url from "../../../../../helpers/url_helper"
import Switch from "react-switch";
import { uniq_key } from "../../../../../helpers/unq_key"
import Currency from "../../../../../helpers/currency"

const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      No
    </div>
  );
};
const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      Si
    </div>
  );
};

const InformacionClientes = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const currencyData = new Currency();
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('formClientes');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }))
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [tipo, settipo] = useState("");
  const [dataReturn, setDataReturn] = useState(props.dataInformacionClientes);
  const [dataDelete, setDataDelete] = useState([]);
  const [jsonClientes, setjsonClientes] = useState({
    transactId: 0,
    name: null,
    country: null,
    salePercentage: null,
    customerType: null,
    salesType: null,
    termDays: null,
    delayReason: null
  });
  const [formValid, setFormValid] = useState(false);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [dataClientes, setdataClientes] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const history = useHistory();
  const [dataGeneralIA, setdataGeneralIA] = useState(null);
  const [salesCycleCheck, setsalesCycleCheck] = useState(props.dataInformacionClientes.seasonalSales);

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
    if (props.activeTab == 10) {
      // Read Api Service data
      initializeData(dataSession);
      // dataReturn.observacion=props.dataInformacionClientes.description;
      // setDataReturn(dataReturn)
    }
  }, [props.activeTab == 10]);
  function initializeData(dataLocation) {
    const api = new BackendServices()
    // consultarListaClientesIGR
    api.consultListaClientesIGR(dataLocation.transactionId).then(resp => {
      if (resp.clientsInformationListDTOList.length > 0) {
        dataReturn.dataTableInformacionClientes = resp.clientsInformationListDTOList;
        setDataReturn(dataReturn)
        setdataGeneralIA(resp.clientsInformationListDTOList);
        setdataClientes(resp.clientsInformationListDTOList.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("Name")}>{data.name}</td>
            <td data-label={t("Country")}>{data.country}</td>
            <td data-label={t("SalePercent")}>{currencyData.formatTable(data.salePercentage)}%</td>
            <td data-label={t("ClientType")}>{data.customerType}</td>
            <td data-label={t("SaleType")}>{data.salesType}</td>
            <td data-label={t("Crtermindays")}>{data.creditDays}</td>
            <td data-label={t("IncasofCollectionDelayindicateReasonforCollectionDelayandStartegia")}>{data.delayReason}</td>
            <td style={{ textAlign: "right" }}>
              <Link to="#" title={t("View")} onClick={(resp) => updateData(data)}><i className="mdi mdi-border-color mdi-24px"></i></Link>
              <Link to="#" title={t("Delete")} onClick={(resp) => deleteData(data)}><i className="mdi mdi-trash-can-outline mdi-24px"></i></Link>
            </td>
          </tr>)
        ));
      } else {
        setdataClientes(
          <tr key={uniq_key()}>
            <td colSpan="8" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });

  }
  function updateData(data) {
    settipo("editar")
    setjsonClientes(data)
    setbotonValidation(true);
    abrirModal()
  }
  function deleteData(data) {
    setDataDelete(data)
    setconfirm_alert(true);
  }
  function cerrarModal() {
    setShowModelAttachment(false);
    removeBodyCss()
  }
  function abrirModal() {
    setShowModelAttachment(true);
    removeBodyCss()
  }
  function addCliente(values, tipo1) {
    values.transactId = Number(locationData?.transactionId ?? 0);
    values.salePercentage = Number(values.salePercentage)
    const apiBack = new BackendServices();
    let datoSet = {
      transactId: values.transactId,
      name: values?.name ?? " ",
      country: values?.country ?? " ",
      salePercentage: values?.salePercentage ?? 0,
      customerType: values?.customerType ?? " ",
      salesType: values?.salesType ?? " ",
      delayReason: values?.delayReason ?? " ",
      // termDays: values?.termDays ?? 0,
      termDays: 0,
      creditDays: values?.termDays ?? "",
      status: true
    }
    if (tipo1 == "guardar") {
      // nuevoClienteIGR
      apiBack.newClientIGR(datoSet).then(resp => {
        if (resp !== null && resp !== undefined) {
          initializeData(locationData);
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(error => {
        seterror_dlg(false);
      })
    } else {
      datoSet.customerInfoId = jsonClientes.customerInfoId
      // actualizarClienteIGR
      apiBack.updateIGRClient(datoSet).then(resp => {
        if (resp !== null && resp !== undefined) {
          initializeData(locationData);
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(error => {
        seterror_dlg(false);
      })
    }
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
    //console.log("InformacionClientes", values);
    values.seasonalSales = dataReturn.seasonalSales;
    values.description = values.observacion;
    values.percSeasonalPeriodSales = values.percSeasonalPeriodSales;
    // values.observacion = dataReturn.observacion;
    setDataReturn(values)
    setFormValid(true)
  }

  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla === 45) {
      e.preventDefault();
      return true;
    }

    return false;
  }

  return (
    <React.Fragment>
      <h5 className="card-title">
        {t("ClientsInfo")}
      </h5>

      <Row>
        <Col md="12" style={{ textAlign: "right" }}>
          <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
            setbotonValidation(true); setjsonClientes({
              trasactId: 0,
              name: null,
              country: null,
              salePercentage: null,
              customerType: null,
              salesType: null,
              termDays: null,
              delayReason: null
            }); settipo("guardar"); abrirModal();
          }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
        </Col>
        <Col md="12">
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table">
              <thead>
                <tr>
                  <th>{t("Name")}</th>
                  <th>{t("Country")}</th>
                  <th>{t("SalePercent")}</th>
                  <th>{t("ClientType")}</th>
                  <th>{t("SaleType")}</th>
                  <th>{t("Crtermindays")}</th>
                  <th>{t("IncaseofCollectionDelayindicateReasonforCollectionDelayandStartegia")}</th>
                  <th style={{ width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {dataClientes !== null && dataClientes !== undefined && dataClientes.length > 0 ?
                  dataClientes :
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
      <AvForm id="formClientes" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="observacion">{t("Description")}</Label>
              <AvField
                className="form-control"
                name="observacion"
                type="textarea"
                value={props.dataInformacionClientes.description}
                onChange={(e) => { dataReturn.description = e.target.value; setDataReturn(dataReturn); }}
                id="observacion"
                rows="7" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <AvGroup className="mb-3">
              <Label htmlFor="percentageSalesSeasonalPeriods">{t("PercentageSalesSeasonalPeriods")}</Label>
              <AvField
                className="form-control"
                name="percSeasonalPeriodSales"
                min={0}
                type="number"
                onKeyPress={(e) => { return check(e) }}
                max="100"
                validate={{
                  number: { value: true, errorMessage: t("InvalidField") },
                  min: { value: 0, errorMessage: t("InvalidField") }
                }}
                value={props.dataInformacionClientes.percSeasonalPeriodSales}
                onChange={(e) => { dataReturn.percSeasonalPeriodSales = e.target.value; setDataReturn(dataReturn); }}
                id="percSeasonalPeriodSales" />
            </AvGroup>
          </Col>
          <Col md="4">
            <div className="mb-3">
              <Label htmlFor="salesCycle">{t("SalesCycle")}</Label>
              <div className="kt-checkbox-list">
                <label className="kt-checkbox">
                  <Switch name="preapproval"
                    uncheckedIcon={<Offsymbol />}
                    checkedIcon={<OnSymbol />}
                    onColor="#007943"
                    className="form-label"
                    onChange={(e) => { dataReturn.seasonalSales = !salesCycleCheck; setDataReturn(dataReturn); setsalesCycleCheck(!salesCycleCheck) }}
                    checked={salesCycleCheck}
                  />
                  <span></span>
                </label>
              </div>
            </div>
          </Col>

        </Row>
      </AvForm>
      {
        successSave_dlg ? (
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
        ) : null
      }

      {
        error_dlg ? (
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
        ) : null
      }
      {
        confirm_alert ? (
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
              // eliminarClienteIGR
              apiBack.removeClientIGR({ transactId: dataDelete.transactId, customerIdentification: dataDelete.customerInfoId }).then(resp => {
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
        ) : null
      }
      <ModalInformacionClientes dataGeneralIA={dataGeneralIA} tipo={tipo} jsonClientes={jsonClientes} botones={botonValidation} addCliente={addCliente} isOpen={showModelAttachment} toggle={() => { cerrarModal() }} />
    </React.Fragment >
  );
})
InformacionClientes.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
export default InformacionClientes;

