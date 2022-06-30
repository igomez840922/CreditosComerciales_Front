import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import { Link, useLocation, useHistory } from "react-router-dom"
import {
  Row,
  Col,
  Button,
  Label,
  Table,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import ModalEmpresasRelacionadas from "./ModalEmpresasRelacionadas"
import { BackendServices } from "../../../../../services"
import SweetAlert from "react-bootstrap-sweetalert"
import * as url from "../../../../../helpers/url_helper"
import { uniq_key } from "../../../../../helpers/unq_key"

const EmpresasRelacionadas = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmEmpresaRelacionada');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn2
  }));
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [dataAccionistasDataRows, setdataAccionistasDataRows] = useState([]);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [tipo, settipo] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [formValid, setFormValid] = useState(false);
  const [dataReturn2, setDataReturn2] = useState(props.dataEmpresaRelacionada);
  const [jsonEmpresaRelacionada, setjsonEmpresaRelacionada] = useState({
    trasactId: 0,
    name: null,
    activity: null,
    sectorExperience: null,
    relationship: null
  });
  const [dataDelete, setDataDelete] = useState([]);
  const [dataReturn, setDataReturn] = useState({
    trasactId: 0,
    name: null,
    activity: null,
    sectorExperience: null,
    relationship: null
  });
  const { t, i18n } = useTranslation();
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
    if (props.activeTab == 9) {
      // Read Api Service data   
      initializeData(dataSession);
    }
  }, [props.activeTab == 9]);
  function initializeData(dataLocation) {
    const api = new BackendServices()
    // consultarDatosEmpresaRelacionada
    api.consultRelatedCompanyData(dataLocation.transactionId).then(resp => {
      if (resp.relatedCompanies.length > 0) {
        dataReturn2.dataTableEmpresaRelacionada = resp.relatedCompanies;
        setDataReturn2(dataReturn2)
        setdataAccionistasDataRows(resp.relatedCompanies.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("Name")}>{data.name}</td>
            <td data-label={t("Activity")}>{data.activity}</td>
            <td data-label={t("asYearsInTheSectord")}>{data.sectorExperience}</td>
            <td data-label={t("Relation")}>{data.relationship}</td>
            <td style={{ textAlign: "right" }}>
              <Link to="#" title={t("View")} onClick={(resp) => updateDataBusinnes(data)}><i className="mdi mdi-border-color mdi-24px"></i></Link>
              <Link to="#" title={t("Delete")} onClick={(resp) => deleteBusines(data)}><i className="mdi mdi-trash-can-outline mdi-24px"></i></Link>
            </td>
          </tr>)
        ))
      } else {
        setdataAccionistasDataRows(
          <tr key={uniq_key()}>
            <td colSpan="5" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });

  }
  function updateDataBusinnes(data) {
    settipo("editar")
    setjsonEmpresaRelacionada(data)
    setbotonValidation(true);
    abrirModal()
    document.body.classList.add("modal-open")
  }
  function deleteBusines(data) {
    setDataDelete(data)
    setconfirm_alert(true);
  }
  //abrimos modal para adjunar archivos
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
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    dataReturn2.observations = values.informacionAccionistaDetails ?? "";
    dataReturn2.informacionAccionistaDetails = values.informacionAccionistaDetails ?? " ";
    setDataReturn2(dataReturn2)
    setFormValid(true)
  }
  function addRelationBusinnes(values, tipo0) {
    dataReturn.name = values.name;
    dataReturn.activity = values.activity;
    dataReturn.sectorExperience = Number(values.sectorExperience);
    dataReturn.relationship = values.relationship;
    dataReturn.trasactId = Number(locationData.transactionId);
    setDataReturn(dataReturn);
    const apiBack = new BackendServices();
    if (tipo0 == "guardar") {
      apiBack.newCompanyRelated(dataReturn).then(resp => {
        cerrarModal();
        initializeData(locationData);
        setsuccessSave_dlg(false)
      })
    } else {
      dataReturn.companyId = values.companyId;
      apiBack.updateCompanyRelated(dataReturn).then(resp => {
        cerrarModal();
        // toggleShowModelAttachment();
        initializeData(locationData);
        setsuccessSave_dlg(false)
      })
    }
  }
  return (
    <React.Fragment>
      <h5 className="card-title">
        {t("RelatedCompanies")}
      </h5>
      <Row>
        <Col md="12" style={{ textAlign: "right" }}>
          <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
            setbotonValidation(true); setjsonEmpresaRelacionada({
              trasactId: 0,
              name: null,
              activit: null,
              sectorExperience: null,
              relationship: null
            }); settipo("guardar"); abrirModal();
          }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
        </Col>
        <Col md="12">
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table">
              <thead>
                <tr>
                  <th>{t("Name")}</th>
                  <th>{t("Activity")}</th>
                  <th>{t("YearsInTheSector")}</th>
                  <th>{t("Relation")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataAccionistasDataRows !== null && dataAccionistasDataRows !== undefined && dataAccionistasDataRows.length > 0 ?
                  dataAccionistasDataRows :
                  <tr>
                    <td colSpan={5}>
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
      <AvForm id="frmEmpresaRelacionada" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="companyHistoryDescription">{t("Description")}</Label>
              <AvField onChange={(e) => { dataReturn2.description = e.target.value; dataReturn2.observations = e.target.value; setDataReturn2(dataReturn2); }}
                className="form-control"
                name="informacionAccionistaDetails"
                id="informacionAccionistaDetails"
                type="textarea"
                value={props.dataEmpresaRelacionada.observations ?? ' '}
                rows="7"
              />
            </div>
          </Col>
        </Row>
      </AvForm>
      <ModalEmpresasRelacionadas tipo={tipo} jsonEmpresaRelacionada={jsonEmpresaRelacionada} botones={botonValidation} addRelationBusinnes={addRelationBusinnes} isOpen={showModelAttachment} toggle={() => { cerrarModal() }} />
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
            // eliminarEmpresaRelacionada
            apiBack.removeRelatedCompany({ trasactId: dataDelete.trasactId, companyId: dataDelete.companyId }).then(resp => {
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
export default EmpresasRelacionadas;
