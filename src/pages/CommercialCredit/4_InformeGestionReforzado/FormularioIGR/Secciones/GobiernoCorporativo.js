import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useLocation, useHistory } from "react-router-dom"
import * as url from "../../../../../helpers/url_helper"
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
import moment from "moment";

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import ModalGobiernoCorporativo from "./ModalGobiernoCorporativo"
import { BackendServices } from "../../../../../services"
import SweetAlert from "react-bootstrap-sweetalert"
import GobiernoCorporativoJunta from "./GobiernoCorporativoJunta"
import { uniq_key } from "../../../../../helpers/unq_key"

const GobiernoCorporativo = React.forwardRef((props, ref) => {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [botonValidation, setbotonValidation] = useState(true);
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [dataAccionistasDataRows, setdataAccionistasDataRows] = useState(null);
  const [dataReturn, setDataReturn] = useState(props.jsonCorporativo);
  const [dataDelete, setDataDelete] = useState([]);
  const [jsonCorporativo, setjsonCorporativo] = useState(props.jsonCorporativo);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [tipo, settipo] = useState("")
  const [formValid, setFormValid] = useState(false);
  const [dataReturn2, setdataReturn2] = useState(props.dataGobiernoCorporativoInformation);

  const [locationData, setLocationData] = useState(null);


  React.useImperativeHandle(ref, () => (
    {
      validateForm: () => {
        const form = document.getElementById('frmGobiernoCorporativo');
        form.requestSubmit();
      },
      getFormValidation: () => {
        return formValid;
      }, dataReturn2
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
    if (props.activeTab == 6) {
      // Read Api Service data
      setdataReturn2(props.dataGobiernoCorporativoInformation)
      initializeData(dataSession);
    }
  }, [props.activeTab == 6, props.dataGobiernoCorporativoInformation]);
  function addGobierno(values, tipo2) {
    dataReturn.name = values.name;
    dataReturn.position = values.position;
    dataReturn.birthDate = values.birthDate;
    dataReturn.transactId = locationData?.transactionId ?? 0;
    setDataReturn(dataReturn);
    let datos = {
      transactId: Number(locationData?.transactionId ?? 0),
      name: jsonCorporativo.name,
      position: values.position,
      birthDate: values.birthDate
    }
    const apiBack = new BackendServices();
    if (tipo2 == "guardar") {
      // nuevoGobiernoCorporativo
      apiBack.newCorporateGovernance(datos).then(resp => {
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
      let jsonSet = {
        "transactId": Number(datos.transactId),
        "personId": Number(jsonCorporativo.personId),
        "position": datos.position,
      }
      // actualizarGobiernoCorporativo
      apiBack.saveCorporateGovernance(jsonSet).then(resp => {
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
  function calculate(fecha) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var today2 = new Date(fecha);
    var yyyy2 = today2.getFullYear();
    return (parseInt(yyyy) - parseInt(yyyy2));
  }
  function initializeData(dataLocation) {

    const api = new BackendServices()
    // consultarGobiernoCorpBD
    api.consultarRolPersona(dataLocation.transactionId).then(respRoles => {
      let roles = [];
      for (let i = 0; i < respRoles.length; i++) {
        let roles1 = "";
        for (let j = 0; j < respRoles[i].roles.length; j++) {
          roles1 = roles1 + " - " + respRoles[i].roles[j].roleDescription + ", "
        }
        roles.push({ personId: respRoles[i].personId, roles: roles1 })
      }
      api.consultarGobiernoCorpBD(dataLocation.transactionId).then(resp => {
        if (resp.length > 0) {
          let arr = [];
          setdataAccionistasDataRows(resp.map((data, index) => {
            if (!arr.includes(data.personId)) {
              arr.push(data.personId);
              return (
                <tr key={uniq_key()}>
                  <td data-label={t("Name")}>{data.name + " " + data.secondName + " " + data.lastName + " " + data.secondSurname}</td>
                  <td data-label={t("Charge")}>{roles.find(x => x.personId === data.personId).roles}{data.position}</td>
                  <td>{formatDate(data.birthDate)}</td>
                  <td>{calculateYear(
                    moment(data.birthDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                  )}</td>
                  <td style={{ textAlign: "right" }}>
                    <Link to="#" title={t("View")} onClick={(resp) => updateData(data)}><i className="mdi mdi-border-color mdi-24px"></i></Link>
                  </td>
                </tr>)
            } else {
              return null;
            }
          }
          ));
        } else {
          setdataAccionistasDataRows(
            <tr key={uniq_key()}>
              <td colSpan="5" style={{ textAlign: 'center' }}></td>
            </tr>);
        }
      })
    })
  }
  function formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }
  function updateData(data) {
    settipo("editar")
    setjsonCorporativo(data)
    setbotonValidation(true);
    abrirModal()
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
      setFormValid(false)
      return;
    }
    setdataReturn2({ ...values, transactId: dataReturn2.transactId })
    setFormValid(true)
  }


  // recibe fecha actual y fecha de nacimiento
  function calculateYear(fecha_nac) {
    var a = moment(moment().format('YYYY-MM-DD'));
    var b = moment(fecha_nac);

    var years = a.diff(b, 'year');
    b.add(years, 'years');

    var months = a.diff(b, 'months');
    b.add(months, 'months');

    var days = a.diff(b, 'days');

    if (isNaN(years) || isNaN(months) || isNaN(days))
      return t('InvalidDate');

    let date;

    if (years == 0) {
      if (months <= 1) {
        if (days <= 1) {
          date = `${months} ${t("month")} ${days} ${t("day")}`;
        } else {
          date = `${months} ${t("month")} ${days} ${t("days")}`;
        }
      } else {
        if (days <= 1) {
          date = `${months} ${t("months")} ${days} ${t("day")}`;
        } else {
          date = `${months} ${t("months")} ${days} ${t("days")}`;
        }
      }

    } else {
      if (years == 1) {
        date = `${years} ${t("year")}`;
      } else {
        date = `${years} ${t("years")}`;
      }
    }
    return date;
  }

  function changeAll(e) {
    dataReturn2.description = e.target.value;
    setdataReturn2(dataReturn2);
  }


  return (
    <React.Fragment>
      <h5 className="card-title">
        {t("CorporateGovernance")}
      </h5>
      <Row>
        <Col md="12">
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table">
              <thead>
                <tr>
                  <th>{t("Name")}</th>
                  <th>{t("Charge")}</th>
                  <th>{t("DBO")}</th>
                  <th>{t("Age")}</th>
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

      {/* <Row className="mt-4">
        <GobiernoCorporativoJunta />
      </Row> */}

      <Row className="mt-4">
        <AvForm id="frmGobiernoCorporativo" className="needs-validation" onSubmit={handleSubmit}>
          <Row>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="description">{t("Description")}</Label>
                <AvField
                  className="form-control"
                  name="description"
                  type="textarea"
                  rows="7"
                  value={props?.dataGobiernoCorporativoInformation?.description ?? ''}
                  id="description"
                  onChange={(e) => { changeAll(e) }}
                />
              </div>
            </Col>
          </Row>
        </AvForm>
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
            // eliminarGobiernoCoporativo
            apiBack.deleteCorporateGovernment({ transactId: dataDelete.transactId, corporateIdentification: dataDelete.corporateIdentification }).then(resp => {
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
      <ModalGobiernoCorporativo tipo={tipo} jsonCorporativo={jsonCorporativo} botones={botonValidation} addGobierno={addGobierno} isOpen={showModelAttachment} toggle={() => { cerrarModal() }} />
    </React.Fragment>
  );

});

/*
GobiernoCorporativo.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
*/

export default GobiernoCorporativo;
