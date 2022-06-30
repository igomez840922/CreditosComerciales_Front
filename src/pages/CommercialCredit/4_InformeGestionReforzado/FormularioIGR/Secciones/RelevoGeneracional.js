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
import ModalRelevoGeneracional from "./ModalRelevoGeneracional"
import SweetAlert from "react-bootstrap-sweetalert"
import { BackendServices } from "../../../../../services"
import moment from "moment";
import * as url from "../../../../../helpers/url_helper"
import { uniq_key } from "../../../../../helpers/unq_key"


const RelevoGeneracional = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [type, settype] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  const [dataAccionistasDataRows, setdataAccionistasDataRows] = useState([])
  const [dataReturn, setDataReturn] = useState(props.dataRelevoGenrencial);
  const [dataDelete, setDataDelete] = useState([]);
  const [jsonRelevo, setjsonRelevo] = useState(props.dataRelevoGenrencial);
  const [botonValidation, setbotonValidation] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const history = useHistory();

  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('formRelevoGeneracional');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }))
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
    if (props.activeTab == 7) {
      // Read Api Service data 
      initializeData(dataSession);
    }
  }, [props.activeTab == 7]);
  function calculate(fecha) {
    var today = new Date();
    var yyyy = moment().format("YYYY");
    var today2 = new Date(fecha);
    var yyyy2 = moment(fecha).format("YYYY");
    return (parseInt(yyyy) - parseInt(yyyy2));
  }
  function formatDate(date) {
    return date === '2022-01-01' || date === '' ? '' : moment(date).format("DD/MM/YYYY");
  }
  function initializeData(dataLocation) {
    const api = new BackendServices()
    // consultarDatosRelevoGeneracional
    api.consultDataRelayGenerational(dataLocation.transactionId).then(resp => {
      if (resp.getManagementRelaysResponseDTOList.length > 0) {
        dataReturn.dataTableRelevoGerencial = resp.getManagementRelaysResponseDTOList;
        setdataAccionistasDataRows(resp.getManagementRelaysResponseDTOList.map((data, index) => (
          data.status ?
            <tr key={uniq_key()}>
              <td data-label={t("Name")}>{data.name}</td>
              <td data-label={t("Charge")}>{data.position}</td>
              <td data-label={t("DBO")}>{formatDate(data.birthDate)}</td>
              <td data-label={t("Age")}>{calculate(data.birthDate)}</td>
              <td data-label={t("Relation")}>{data.relationship}</td>
              <td style={{ textAlign: "right" }}>
                <Link to="#" title={t("View")} onClick={(resp) => seeRelay(data)}><i className="mdi mdi-border-color mdi-24px"></i></Link>
                <Link to="#" title={t("Delete")} onClick={(resp) => removeRelay(data)}><i className="mdi mdi-trash-can-outline mdi-24px"></i></Link>
              </td>
            </tr> : null)
        ))
      } else {
        setdataAccionistasDataRows(
          <tr key={uniq_key()}>
            <td colSpan="6" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    });
  }
  function seeRelay(data) {
    setjsonRelevo(data)
    settype("editar")
    setbotonValidation(true);
    abrirModal()
  }
  function removeRelay(data) {
    setDataDelete(data)
    setconfirm_alert(true);
  }
  //abrimos modal para adjunar archivos
  function toggleShowModelAttachment() {
    setShowModelAttachment(!showModelAttachment);
    removeBodyCss()
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
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      setFormValid(false);
      return;
    }
    setFormValid(true);
  }
  function addRelay(values) {
    let data = {
      transactId: Number(locationData.transactionId),
      name: values.name,
      position: values.position,
      birthDate: values.birthDate ?? '2022-01-01',
      relationship: values.relationship,
      age: 0,
    }
    const apiBack = new BackendServices();
    if (type == "guardar") {
      // nuevoRelevoGeneracional
      apiBack.newGenerationalRelay(data).then(resp => {
        if (resp != undefined) {
          initializeData(locationData);
          cerrarModal();
        } else {
          seterror_dlg(false);
          cerrarModal();
        }
      }).catch(err => {
        seterror_dlg(false);
      })
    } else {
      data.managementRIdentification = jsonRelevo.managementRIdentification;
      apiBack.updateRelevoGeneracional(data).then(resp => {
        if (resp != undefined) {
          cerrarModal();
          initializeData(locationData);
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      })
    }

  }
  function changeAll(e) {
    dataReturn.observations = e.target.value;
    setDataReturn(dataReturn);
  }
  return (
    <React.Fragment>
      <h5 className="card-title">
        {t("ManagementRelays")}
      </h5>

      <Row>
        <Col md="12" style={{ textAlign: "right" }}>
          <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
            setbotonValidation(true); setjsonRelevo({
              transactId: 0,
              name: null,
              position: null,
              birthDate: null,
              relationship: null
            }); abrirModal(); settype("guardar");
          }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
        </Col>
        <Col md="12">
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table">
              <thead >
                <tr>
                  <th>{t("Name")}</th>
                  <th>{t("Charge")}</th>
                  <th>{t("DBO")}</th>
                  <th>{t("Age")}</th>
                  <th>{t("Relation")}</th>
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
      <br />
      <AvForm id="formRelevoGeneracional" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="companyHistoryDescription">{t("Description")}</Label>
              <AvField
                className="form-control"
                name="companyHistoryDescription"
                type="textarea"
                rows="7"
                value={props.dataRelevoGenrencial.observations}
                id="companyHistoryDescription"
                onChange={(e) => { changeAll(e) }}
              />
            </div>
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
            // eliminarRelevoGeneracional
            apiBack.eliminateGenerationalChange({ transactId: dataDelete.transactId, managementRIdentification: dataDelete.managementRIdentification }).then(resp => {
              if (resp.statusCode == "500") {
                setconfirm_alert(false)
                seterror_dlg(false)
              } else {
                setconfirm_alert(false)
                initializeData(locationData);
              }
            })
          }}
          onCancel={() => setconfirm_alert(false)}
        >
          {t("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
      <ModalRelevoGeneracional jsonRelevo={jsonRelevo} tipo={type} botones={botonValidation} addRelay={addRelay} isOpen={showModelAttachment} toggle={() => { cerrarModal() }} />
    </React.Fragment>
  );

});


RelevoGeneracional.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}


export default RelevoGeneracional;
