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
import ModalPrincipalesCompetidores from "./ModalPrincipalesCompetidores"
import SweetAlert from "react-bootstrap-sweetalert"
import { BackendServices } from "../../../../../services"
import * as url from "../../../../../helpers/url_helper"
import { uniq_key } from "../../../../../helpers/unq_key"

const PrincipalesCompetidores = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const [formValid, setFormValid] = useState(false);
  const location = useLocation()
  const [dataReturn, setDataReturn] = useState(props.dataPrincipalesCompetidores);
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [tipo, settipo] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dataDelete, setDataDelete] = useState([]);
  const [dataAccionistasDataRows, setdataAccionistasDataRows] = useState(null);
  const [jsonCompetidores, setjsonCompetidores] = useState({
    transactId: 0,
    name: "",
    description: ""
  });
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmProveedores');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const dataAccionistas = [
    { id: 1, name: "Salvador Carbone", description: "Prueba de descrpcion 234" },
    { id: 2, name: "Salvador Carbone", description: "Prueba de descrpcion 234" },
    { id: 3, name: "Salvador Carbone", description: "Prueba de descrpcion 234" },
    { id: 4, name: "Salvador Carbone", description: "Prueba de descrpcion 234" },
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
    if (props.activeTab == 12) {
      // Read Api Service data
      initializeData(dataSession);
    }
  }, [props.activeTab == 12]);
  function cerrarModal() {
    setShowModelAttachment(false);
    removeBodyCss()
  }
  function abrirModal() {
    setShowModelAttachment(true);
    removeBodyCss()
  }
  function initializeData(dataLocation) {

    const apiBack = new BackendServices();
    // consultarCompetidores
    apiBack.consultCompetitors(dataLocation.transactionId).then(resp => {
      if (resp.competitors.length > 0) {
        dataReturn.dataAccionistas = resp.competitors;
        setDataReturn(dataReturn);
        setdataAccionistasDataRows(resp.competitors.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Name")}>{data.name}</td>
              <td data-label={t("Description")}>{data.description}</td>

              <td style={{ textAlign: "right" }}>
                <Link to="#" onClick={(resp) => { updateComptitors(data) }}><i className="mdi mdi-border-color mdi-24px"></i></Link>
                <Link to="#" onClick={(resp) => { deleteCompetitors(data) }}><i className="mdi mdi-trash-can-outline mdi-24px"></i></Link>
              </td>
            </tr> : null)
        ));
      } else {
        setdataAccionistasDataRows(
          <tr key={uniq_key()}>
            <td colSpan="3" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
  }
  function updateComptitors(data) {
    settipo("editar")
    setjsonCompetidores(data)
    setbotonValidation(true);
    abrirModal()
  }
  function dataManagament(data, tipo2) {
    const api = new BackendServices()
    data.transactId = Number(locationData.transactionId);
    if (tipo2 == "guardar") {
      api.newCompetitorIGR(data).then(resp => {
        initializeData(locationData);
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
      data.competitorId = jsonCompetidores.competitorId;
      api.updateCompetitorIGR(data).then(resp => {
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
  function deleteCompetitors(data) {
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
  }
  return (
    <React.Fragment>
      <h5 className="card-title">
        {t("MainCompetitorsintheMarket")}
      </h5>
      <Row>
        <Col md="12" style={{ textAlign: "right" }}>
          <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
            setbotonValidation(true); setjsonCompetidores({
              transactId: 0,
              name: "",
              description: ""
            }); settipo("guardar"); abrirModal();
          }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
        </Col>
        <Col md="12">
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table">
              <thead>
                <tr>
                  <th>{t("Name")}</th>
                  <th>{t("Description")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataAccionistasDataRows !== null && dataAccionistasDataRows !== undefined && dataAccionistasDataRows.length > 0 ?
                  dataAccionistasDataRows :
                  <tr>
                    <td colSpan={6}>
                      <div className="alert alert-info" style={{ textAlign: "center" }}>{t("NoData")}</div>
                    </td>
                  </tr>
                }
              </tbody>

            </Table>

          </div>
        </Col>
      </Row>
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
            // eliminarCompetidorIGR
            apiBack.removeCompetitorIGR({ transactId: locationData.transactionId, competitorId: dataDelete.competitorId }).then(resp => {
              initializeData(locationData);
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
      <ModalPrincipalesCompetidores tipo={tipo} botones={botonValidation} jsonCompetidores={jsonCompetidores} dataManagament={dataManagament} isOpen={showModelAttachment} toggle={() => { cerrarModal() }} />
    </React.Fragment>
  );
});
/*
PrincipalesCompetidores.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
*/

export default PrincipalesCompetidores;
