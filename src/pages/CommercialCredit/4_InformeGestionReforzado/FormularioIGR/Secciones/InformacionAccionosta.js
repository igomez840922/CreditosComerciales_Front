import React, { useState } from "react"
import { useTranslation } from 'react-i18next'
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

import ModalInfoAccionistas from "./ModalInfoAccionistas"
import moment from "moment";

import ApiServicesCommon from "../../../../../services/Common/ApiServicesCommon";
import { BackendServices, CoreServices } from "../../../../../services"
import SweetAlert from "react-bootstrap-sweetalert"
import * as url from "../../../../../helpers/url_helper"
import Alert from 'react-bootstrap/Alert'
import { uniq_key } from "../../../../../helpers/unq_key"
import Currency from "../../../../../helpers/currency"

const InformacionAccionista = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const location = useLocation()
  const history = useHistory();

  const [botonValidation, setbotonValidation] = useState(false);
  const [dataGeneralIA, setdataGeneralIA] = useState(null);
  const [dataLocation, setLocationData] = useState(location.data);
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [shareholderRows, setShareholderRows] = useState([]);
  const [accionistasJSON, setAccionistasJson] = useState(props.jsonAccionistas);
  const [dataReturn, setDataReturn] = useState(props.jsonAccionistas);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [tipo, settipo] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  const [dataDelete, setDataDelete] = useState([]);
  const [dataAcciones, setdataAcciones] = useState({
    "transactId": 0,
    "personId": 0,
    "personType": "",
    "idType": "",
    "clientDocumentId": "",
    "customerNumberT24": "",
    "name": "",
    "secondName": "",
    "lastName": "",
    "secondSurname": "",
    "nationality": "",
    "birthDate": "1998-08-17",
    "yearsExperience": 0,
    "participation": 0
  });

  const currencyData = new Currency();
  const [msgToShow, setmsgToShow] = useState({ show: false, msg: "", type: "success" })//success,info,warning,danger

  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmInformacionAccionista');
      form.requestSubmit();
    },
    getFormValidation: () => {

      //dataByYear.dataresult.reduce((total, currentValue) => total + Number(currentValue.amount),0)

      return formValid;
    }, dataReturn
  }))
  const [formValid, setFormValid] = useState(false);
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      setFormValid(false);
      return;
    }

    checkParticipationAmt(null)

    setFormValid(true);
  }
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
    if (props.activeTab == 4) {
      // Read Api Service data  
      loadInitialData(dataSession);
      setDataReturn(props.jsonAccionistas)
    }
  }, [props.activeTab == 4]);
  function formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }
  function loadInitialData(dataLocation) {
    const api = new BackendServices()
    /* ---------------------------------------------------------------------------------------------- */
    /*           Cargamos la lista de accionistas pasandole como parametro el transactionId           */
    /* ---------------------------------------------------------------------------------------------- */
    // consultarAccionistaBD
    const apiCore = new CoreServices();
    // getPaisesCatalogo
    apiCore.getPaisesCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response?.Records.length; i++) {
          json.push({ label: response?.Records[i]["Description"], value: response?.Records[i]["Code"] })
        }
        api.consultarAccionistaBD(dataLocation.transactionId).then(resp => {
          if (resp.length > 0) {
            setdataGeneralIA(resp);
            dataReturn.datosTablaAccionistas = resp;
            setDataReturn(dataReturn)
            console.log("consultarAccionistaBD",resp);
            setShareholderRows(resp.map((data, index) => (
              <tr key={uniq_key()}>
                <td data-label={t("ID Number")}>{data.clientDocumentId}</td>
                <td data-label={t("Name")}>{data.name + " " + data.secondName + " " + data.lastName + " " + data.secondSurname}</td>
                <td data-label={t("Nationality")}>{json.find(x => x.value === data.nationality).label}</td>
                <td data-label={t("DBO")}>{formatDate(data.birthDate)}</td>
                <td data-label={t("Participation")}>{currencyData.formatTable(data.participation)}%</td>
                <td data-label={t("YearsExprience")}>{data.yearsExperience} {t("Year")}s</td>
                <td style={{ textAlign: "right" }}>
                  <Link to="#" onClick={(resp) => { updateData(data) }}><i className="mdi mdi-border-color mdi-24px"></i></Link>
                </td>
              </tr>)))

            checkParticipationAmt(resp);
          } else {
            setShareholderRows(
              <tr key={uniq_key()}>
                <td colSpan="5" style={{ textAlign: 'center' }}></td>
              </tr>);
          }
        })
      });


  }
  /* ---------------------------------------------------------------------------------------------- */
  /*         Procedemos a guardar el accionista al servicio y despues renderizar esta parte         */
  /* ---------------------------------------------------------------------------------------------- */
  function addAccionist(values, tipo) {
    const dataSet = dataAcciones;
    dataSet.participation = Number(values.participation);
    dataSet.yearsExperience = Number(values.yearsExprience);
    dataSet.transactId = Number(dataLocation.transactionId);
    const datos = {
      "transactId": Number(dataLocation.transactionId),
      "participation": Number(values.participation),
      "yearsExperience": Number(values.yearsExprience),
      "status": true
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                               Procedemos a guardar el accionista                               */
    /* ---------------------------------------------------------------------------------------------- */
    const apiBack = new BackendServices();
    datos.personId = dataAcciones.personId;
    // actualizarAccionistaBD
    apiBack.salvarAccionistaBD(datos).then(resp => {
      if (resp !== null && resp !== undefined) {
        loadInitialData(dataLocation);
        cerrarModal();
      } else {
        cerrarModal();
        seterror_dlg(false);
      }
    }).catch(error => {
      // seterror_dlg(false);
    })
    /*if (tipo == "guardar") {
      // nuevoAccionista
      apiBack.salvarAccionistaBD(dataSet).then(resp => {
        if (resp !== null && resp !== undefined) {
          loadInitialData(dataLocation);
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(error => {
        seterror_dlg(false);
      })
    } else {
      datos.personId = dataAcciones.personId;
      // actualizarAccionistaBD
      apiBack.actualizarAccionistaBD(datos).then(resp => {
        if (resp !== null && resp !== undefined) {
          loadInitialData(dataLocation);
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(error => {
        // seterror_dlg(false);
      })
    }*/
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
  function updateData(data) {
    setdataAcciones(data)
    settipo("editar");
    setbotonValidation(true);
    abrirModal()
  }
  function procesarDatosTabla(option, value) {
    switch (option) {
      case 1: {
        /* ---------------------------------------------------------------------------------------------- */
        /*                       Aqui procedemos a agregar un accionista a la lista                       */
        /* ---------------------------------------------------------------------------------------------- */
        break;
      }
      case 2: {
        /* ---------------------------------------------------------------------------------------------- */
        /*                         Procedemos a eliminar el accionista de la lista                        */
        /* ---------------------------------------------------------------------------------------------- */
        break;
      }
    }
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function showMessage(data) {
    if (data !== null) {
      setmsgToShow(data)
    }
    else {
      setmsgToShow({ show: false, msg: "", type: "" })
    }
  }

  function checkParticipationAmt(data) {
    try {
      data = data !== null ? data : dataGeneralIA;
      var amtTotal = data.reduce((total, currentValue) => total + Number(currentValue.participation), 0)
      if (amtTotal < 100) {
        showMessage({ show: true, msg: "La participación total no alcanza el 100%", type: "warning" });
      }
    }
    catch (err) { }
  }

  return (
    <React.Fragment>
      <h5 className="card-title">
        {t("Shareholder Information")}
      </h5>
      <Row>
        <Col>
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table">
              <thead  >
                <tr>
                  <th>{t("ID Number")}</th>
                  <th>{t("Name")}</th>
                  <th>{t("Nationality")}</th>
                  <th>{t("DBO")}</th>
                  <th>{t("Participation")}</th>
                  <th>{t("YearsExprience")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shareholderRows !== null && shareholderRows !== undefined && shareholderRows.length > 0 ?
                  shareholderRows :
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
      <br />
      <AvForm id="frmInformacionAccionista" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="companyHistoryDetails">{t("Details")}</Label>
              <AvField onChange={(e) => { dataReturn.observations = e.target.value; setDataReturn(dataReturn); }}
                className="form-control"
                name="informacionAccionistaDetails"
                id="informacionAccionistaDetails"
                type="textarea"
                rows="7"
                value={props?.jsonAccionistas?.observations??""}
              />
            </div>
          </Col>
        </Row>
      </AvForm>

      <Row>
        <Col md="12">
          <Alert className='text-center' show={msgToShow.show} variant={msgToShow.type} dismissible onClose={() => { showMessage(null) }}>
            {msgToShow.msg}
          </Alert>
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
            loadInitialData(dataLocation);
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
            loadInitialData(dataLocation);
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
            // eliminarAccionista
            apiBack.eliminarAccionistaBD(dataDelete.transactId, dataDelete.shareholderId).then(resp => {
              if (resp.statusCode == "500") {
                setconfirm_alert(false)
                seterror_dlg(false)
              } else {
                setconfirm_alert(false)
                loadInitialData(dataLocation);
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




      <ModalInfoAccionistas dataGeneralIA={dataGeneralIA} tipo={tipo} addAccionist={addAccionist} botones={botonValidation} dataAcciones={dataAcciones} procesarDatosTabla={procesarDatosTabla} isOpen={showModelAttachment} toggle={() => { cerrarModal() }} />
    </React.Fragment>
  );

})

InformacionAccionista.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default InformacionAccionista;
