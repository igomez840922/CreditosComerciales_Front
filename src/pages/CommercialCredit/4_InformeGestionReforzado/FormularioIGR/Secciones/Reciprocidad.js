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
import ModalReciprocidad from "./ModalReciprocidad"
import { BackendServices } from "../../../../../services"
import SweetAlert from "react-bootstrap-sweetalert"
import * as url from "../../../../../helpers/url_helper"
import Currency from "../../../../../helpers/currency";
import { uniq_key } from "../../../../../helpers/unq_key"

const Reciprocidad = React.forwardRef((props, ref) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  const location = useLocation()
  const [dataReturn, setdataReturn] = useState(props.dataReciprocidad);
  const [dataLocation, setData] = useState(location.data);
  /* -------------------------------------------------------- -------------------------------------- */
  /*                        Variables de estados para los mensajes de alerta                        */
  /* ---------------------------------------------------------------------------------------------- */
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  const [tipo, setTipo] = useState("")
  const [botonValidation, setbotonValidation] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [dataDelete, setDataDelete] = useState([]);
  const [dataReciprocityRows, setdataReciprocityRows] = useState(null);
  const [dataRecipro, setdataRecipro] = useState({
    transactId: null,
    year: null,
    month: null,
    sales: null,
    deposits: null,
    averageBalance: null,
    reciprocity: null,
    sow: null
  });

  const [locationData, setLocationData] = useState(null);
  const history = useHistory();

  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmReprocididad');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
  const [showModalReciprocidad, setShowModalReciprocidad] = useState(false);
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



    // Read Api Serv ice ddasat a
    setdataReturn(props.dataReciprocidad)
    if (props.activeTab == 16) {
      initializeData(dataSession);
    }
  }, [props.activeTab == 16]);
  function cerrarModal() {
    setShowModalReciprocidad(false);
    removeBodyCss()
  }
  function abrirModal() {
    setShowModalReciprocidad(true);
    removeBodyCss()
  }
  function initializeData(dataLocation) {
    const api = new BackendServices();
    // consultarListaReciprocidadIGR
    api.consultIGRReciprocityList(dataLocation.transactionId).then(resp => {
      if (resp.reciprocity.length > 0) {
        dataReturn.dataTableReciprocidad = resp.reciprocity;
        setdataReturn(dataReturn);
        setdataReciprocityRows(resp.reciprocity.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Year")}>{data.year}</td>
              <td data-label={t("Month")}>{data.month}</td>
              <td data-label={t("Sales")}>${currencyData.formatTable(data.sales ?? 0)}</td>
              <td data-label={t("Deposits")}>${currencyData.formatTable(data.deposits.toFixed(2) ?? 0)}</td>
              {/* <td data-label={t("AverageBalance")}>${currencyData.formatTable(data.averageBalance ?? 0)}</td> */}
              <td data-label={t("Reciprocity")}>{currencyData.formatTable(data.reciprocity.toFixed(2) ?? 0)}%</td>
              <td data-label={t("Sow")}>{currencyData.formatTable(data.sow.toFixed(2) ?? 0)}%</td>
              <td>{data.description ?? ''}</td>
              <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                <Button type="button" color="link" onClick={(resp) => { updateData(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => { deleteData(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setdataReciprocityRows(
          <tr key={uniq_key()}>
            <td colSpan="8" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
  }
  // guardar y editar datos
  function dataManagament(data, tipo) {
    const api = new BackendServices()
    data.transactId = locationData.transactionId;
    let datos = {
      "transactId": locationData.transactionId,
      "year": Number(data.year),
      "month": data.month,
      "sales": Number(currencyData.getRealValue(data?.sales ?? 0)),
      "deposits": Number(currencyData.getRealValue(data?.deposits ?? 0)),
      "averageBalance": Number(currencyData.getRealValue(data?.averageBalance ?? 0)),
      "reciprocity": Number(currencyData.getRealValue(data?.reciprocity ?? 0)),
      "sow": Number(currencyData.getRealValue(data?.sow ?? 0)),
      "description": data.description
    }
    if (tipo == "guardar") {
      // nuevoReciprocidadIGR
      api.newReciprocityIGR(datos).then(resp => {
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
      datos.reciprocity_id = dataRecipro.reciprocity_id;
      // actualizarReciprocidadIGR
      api.updateReciprocityIGR(datos).then(resp => {
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
  //abrimos modal para adjunar archivos
  function toggleShowModelAttachment() {
    setShowModalReciprocidad(!showModalReciprocidad);
    removeBodyCss()
  }
  function updateData(data) {
    setdataRecipro(data);
    setTipo("editar");
    setbotonValidation(true);
    abrirModal();
  }
  function deleteData(data) {
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
    setFormValid(true)
  }
  return (
    <React.Fragment>
      {/* <h5>
        {t("Reciprocity")}
      </h5> */}
      <p className="card-title-desc"></p>
      <AvForm id="frmReprocididad" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("Reciprocity")}</h5>
          </Col>
          <Col md="6" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setbotonValidation(true); setdataRecipro({
                transactId: null,
                year: null,
                month: null,
                sales: null,
                deposits: null,
                averageBalance: null,
                reciprocity: null,
                sow: null
              }); setTipo("guardar"); abrirModal();
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("Year")}</th>
                  <th>{t("Month")}</th>
                  <th>{t("Sales")}</th>
                  <th>{t("Deposits")}</th>
                  {/* <th>{t("AverageBalance")}</th> */}
                  <th>{t("Reciprocity")}</th>
                  <th>{t("ActualSow")}</th>
                  <th>{t("Description")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataReciprocityRows}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="companyHistoryDescription">{t("Description")}</Label>
              <AvField
                type="textarea"
                name="companyHistoryDetails"
                id="companyHistoryDetails"
                maxLength="1000"
                rows="7"
                value={props.dataReciprocidad.observations}
                onChange={(e) => { dataReturn.observations = e.target.value; setdataReturn(dataReturn) }}
              />
            </div>
          </Col>
        </Row>
      </AvForm>
      <ModalReciprocidad tipo={tipo} botones={botonValidation} dataRecipro={dataRecipro} dataManagament={dataManagament} isOpen={showModalReciprocidad} toggle={() => { cerrarModal() }} />
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
            apiBack.removeReciprocityIGR({ transactId: locationData.transactionId, reciprocityId: dataDelete.reciprocity_id }).then(resp => {
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
Reciprocidad.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
export default Reciprocidad;
