import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
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
import AvInput from 'availity-reactstrap-validation/lib/AvInput'
import ModalGarantes from "./ModalGarantes"
import SweetAlert from "react-bootstrap-sweetalert"
import { BackendServices } from "../../../../../services"
import * as url from "../../../../../helpers/url_helper"
import { uniq_key } from "../../../../../helpers/unq_key"
const InformacionGarante = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [dataDelete, setDataDelete] = useState([]);
  const [dataFixedGarantesRows, setdataFixedGarantesRows] = useState(null)
  const [tipo, settipo] = useState("")
  const [jsonGarante, setjsonGarante] = useState({
    "transactId": 0,
    "id": 0,
    "type": false,
    "typeId": "",
    "docIdCustomer": "",
    "customerNumberT24": "",
    "firstName": "",
    "secondName": "",
    "firstLastName": "",
    "secondLastName": "",
    "nationality": "",
    "birthDate": "2022-03-01",
    "relationship": null,
    "fundsAssets": null,
    "debtorCommitment": null,
    "guaranteeReason": null
  });
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmProveedores');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }
  }));
  const [showModalGarantes, setShowModalGarantes] = useState(false);
  const dataFixedGarantes = [
    { id: 1, idtype: 'RUC', idnumber: '321321', fullname: 'Empresas Carbone, S.A' },
    { id: 2, idtype: 'RUC', idnumber: '654654', fullname: 'Empresas Carbone, S.A' },
    { id: 3, idtype: 'Cedula', idnumber: '987654321', fullname: 'Pedro Rojas Fuentes' },
    { id: 4, idtype: 'Pasaporte', idnumber: '321654987', fullname: 'Aroldis Chapman' },
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
    if (props.activeTab == 19) {
      // Read Api Servi
      initializeData(dataSession);
    }
  }, [props.activeTab == 19]);
  function initializeData(dataLocation) {
    const api = new BackendServices();
    // consultarGaranteBD
    // consultarCatalogoTipoIdentificacion
    api.consultarCatalogoTipoIdentificacion()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["description"]), value: data[i]["id"] })
          }

          api.consultarGaranteBD(dataLocation.transactionId).then(resp => {
            if (resp.length > 0) {
              setdataFixedGarantesRows(resp.map((data, index) => (
                <tr key={uniq_key()}>
                  <td data-label={t("ID Type")}>{json.find(x => x.value == data.typeId)?.label}</td>
                  <td data-label={t("ID Number")}>{data.docIdCustomer}</td>
                  <td data-label={t("FullName")}>{data.type == "2" ? data.firstName : data.firstName + " " + data.secondName + " " + data.firstLastName + " " + data.secondLastName}</td>
                  {props?.validacion ? <>
                    <td data-label={t("ID Number")}>{data.isGuarantor ? "Si" : "No"}</td>
                    <td data-label={t("ID Number")}>{data.relationship}</td>
                    <td data-label={t("ID Number")}>{data.fundsAssets}</td>
                    <td data-label={t("ID Number")}>{data.debtorCommitment}</td>
                    <td data-label={t("ID Number")}>{data.guaranteeReason}</td></> : null}
                  <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
                    {props?.validacion ? null :
                      <Button type="button" color="link" onClick={(resp) => { updateWarrant(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                    }
                  </td>
                </tr>)
              ));
            } else {
              setdataFixedGarantesRows(
                <tr key={uniq_key()}>
                  <td colSpan="7" style={{ textAlign: 'center' }}></td>
                </tr>);
            }
          });
        }
      })
  }
  function updateWarrant(data) {
    settipo("editar");
    setjsonGarante(data)
    setbotonValidation(true);
    abrirModal()
  }
  function cerrarModal() {
    setShowModalGarantes(false);
    removeBodyCss()
  }
  function abrirModal() {
    setShowModalGarantes(true);
    removeBodyCss()
  }
  function addWarrant(data, tipo2) {
    let datos = jsonGarante;
    datos.transactId = Number(locationData.transactionId);
    datos.type = data.type;
    datos.documentType = data.type;
    datos.relationship = data.relationship;
    datos.fundsAssets = data.fundsAssets;
    datos.debtorCommitment = data.debtorCommitment;
    datos.guaranteeReason = data.guaranteeReason;
    const dataSet = {
      "transactId": Number(locationData.transactionId),
      "id": jsonGarante.id,
      "relationship": data.relationship,
      "fundsAssets": data.fundsAssets,
      "debtorCommitment": data.debtorCommitment,
      "guaranteeReason": data.guaranteeReason,
      "isGuarantor": data.isGuarantor ?? false,
      "status": true
    }
    if (jsonGarante.isGuarantor == null) {
      const apiBack = new BackendServices();
      apiBack.nuevoGaranteBD(dataSet).then(resp => {
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
      const apiBack = new BackendServices();
      datos.guarantorId = jsonGarante.id;
      // actualizarGaranteBD
      apiBack.actualizarGaranteBD(dataSet).then(resp => {
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
  function toggleShowModalGarantes() {
    setShowModalGarantes(!showModalGarantes);
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
      <h5>
        {t("GuarantorInformation")}
      </h5>
      <p className="card-title-desc"></p>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col lg="12" className="table-responsive styled-table-div" >
            <Table className="table table-striped table-hover styled-table table" >
              <thead >
                <tr>
                  <th>{t("ID Type")}</th>
                  <th>{t("ID Number")}</th>
                  <th>{t("FullName")}</th>
                  {props?.validacion ? <>
                    <th>{t("The Debtor is the Guarantor of the property to be assigned as Guarantee")}</th>
                    <th>{t("Direct relationship between the debtor and the guarantor")}</th>
                    <th>{t("How and with what funds was the asset to be sold as collateral acquired")}</th>
                    <th>{t("Does the debtor have any commitment or credit obligation with the guarantor")}</th>
                    <th>{t("Why do you pledge your property as collateral")}</th></> : null}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataFixedGarantesRows}
              </tbody>
            </Table>

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
            // eliminarGarante
            apiBack.removeGuarantor({ transactId: locationData.transactionId, guarantorId: dataDelete.guarantorId }).then(resp => {
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
      <ModalGarantes jsonGarante={jsonGarante} tipo={tipo} botones={botonValidation} addWarrant={addWarrant} isOpen={showModalGarantes} toggle={() => { cerrarModal() }} />
    </React.Fragment>
  );
});
export default InformacionGarante;
