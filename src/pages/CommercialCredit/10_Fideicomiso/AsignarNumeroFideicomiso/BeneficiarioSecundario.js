/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { BackendServices, CoreServices } from "../../../../services";
import { useLocation, useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Label,
  Table
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
//i18n
import { withTranslation } from "react-i18next";
import ModalBeneficiosFideicomiso from "./ModalBeneficiosFideicomiso";
import * as url from "../../../../helpers/url_helper"
import { PersonModel } from "../../../../models/Common/PersonModel";

const BeneficiarioSecundario = (props) => {
  const apiBack = new BackendServices();
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [showModalFideicomitente, setShowModalFideicomitente] = useState(false);
  const [type, settype] = useState("");
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  const [dataFideicomitenteRows, setdataFideicomitenteRows] = useState(null)
  const [dataSet, setdataSet] = useState({
    "transactId": 0,
    "firstName": "",
    "secondName": "",
    "firstLastName": "",
    "secondLastName": "",
    "nationality": "",
    "personType": "",
    "documentType": "",
    "documentNumber": "",
    "address": "",
    "telephone": "",
    "relationship": "",
    "percentage": 0
  });

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


    // Read Api Service data
    initializeData(dataSession);
  }, []);
  function initializeData(dataLocation) {
    apiBack.consultarListaBeneficiarioSecundario(dataLocation.transactionId).then(resp => {
      console.log(resp);
      if (resp != undefined || resp.length > 0) {
        const api = new CoreServices();
        api.getPaisesCatalogo()
          .then(response => {
            if (response === null) { return; }
            let jsonPais = [];
            for (let i = 0; i < response.Records.length; i++) {
              jsonPais.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
            }
            const apiServiceBackend = new BackendServices();
            apiServiceBackend.consultarCatalogoTipoIdentificacion()
              .then((data) => {
                if (data !== null && data !== undefined) {
                  let json = [];
                  for (let i = 0; i < data.length; i++) {
                    json.push({ label: props.t(data[i]["description"]), value: data[i]["id"] })
                  }
                  let jspm = [{ label: props.t("Legal"), value: "1" }, { label: props.t("Natural"), value: "2" }]
                  setdataFideicomitenteRows(resp.map((data) => (
                    <tr key={data.beneficiaryId}>
                      <td>{data.firstName + " " + data.secondName + " " + data.firstLastName + " " + data.secondLastName}</td>
                      <td>{jsonPais.find(x => x.value === data.nationality)?.label}</td>
                      <td>{jspm.find(x => x.value === data.personType)?.label}</td>
                      <td>{json.find(x => x.value === data.documentType)?.label}</td>
                      <td>{data.documentNumber}</td>
                      <td>{data.address}</td>
                      <td>{data.telephone}</td>
                      <td>{data.relationship}</td>
                      <td>{data.percentage}</td>
                      <td style={{ textAlign: "right" }}>
                        <Button type="button" color="link" onClick={(resp) => { editarDatosClientes(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                        <Button type="button" color="link" onClick={(resp) => { EliminarCliente(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                        <Button type="button" color="link" onClick={(resp) => { surveillanceList(data) }} className="btn btn-link" ><i className="mdi mdi-shield-account mdi-24px"></i></Button>
                      </td>
                    </tr>)
                  ));
                }
              })
              .catch((error) => {
                console.error('api error: ', error);
              });
          });


      } else {
        setdataFideicomitenteRows(
          <tr key={1}>
            <td colSpan="9" style={{ textAlign: 'center' }}><h5>{props.t("NoData")}</h5></td>
          </tr>);
      }
    })
  }
  function surveillanceList(data) {
    let model = new PersonModel()
    data = { ...model, ...data }
    props.showBlackListFormModal(data)
  }
  function editarDatosClientes(data) {
    settype("editar")
    setdataSet(data)
    setbotonValidation(true);
    abrirModal()
  }
  function EliminarCliente(data) {
    setdataSet(data)
    setconfirm_alert(true);
  }
  function gestionDatos(values, tipo) {
    values.transactId = Number(locationData.transactionId);
    values.telephone = Number(values.telephone);
    let dataSend = {
      "transactId": Number(locationData.transactionId),
      "firstName": values.firstName ? values.firstName : " ",
      "secondName": values.secondName ? values.secondName : " ",
      "firstLastName": values.firstLastName ? values.firstLastName : " ",
      "secondLastName": values.secondLastName ? values.secondLastName : " ",
      "nationality": values?.codigoPais?.value ?? "",
      "personType": values?.personType ?? "",
      "documentType": values?.documentType ?? "",
      "documentNumber": values?.documentNumber ?? "",
      "address": values?.address ?? "",
      "telephone": values?.telephone ?? "",
      "relationship": values?.relationship ?? "",
      "percentage": Number(values.percentage)
    }
    if (tipo == "guardar") {
      apiBack.nuevaListaBeneficiarioSecundario(dataSend).then(resp => {
        if (resp !== null && resp !== undefined) {
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
        initializeData(locationData);

      }).catch(error => {
        seterror_dlg(false);
      })
    } else {

      dataSend.beneficiaryId = dataSet.beneficiaryId;
      // dataSend.personId = dataSet.beneficiaryId;
      apiBack.actualizarListaBeneficiarioSecundario(dataSend).then(resp => {
        if (resp !== null && resp !== undefined) {
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
        initializeData(locationData);
      }).catch(error => {
        seterror_dlg(false);
      })
    }
  }
  //abrimos modal para adjunar archivos
  function abrirModal() {
    setShowModalFideicomitente(true);
    removeBodyCss()
  }
  function cerrarModal() {
    setShowModalFideicomitente(false);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  return (
    <React.Fragment>
      <Row>
        <Col lg="12">
          <p className="card-title-desc"></p>
          <p className="card-title-desc"></p>
          <div className="d-flex flex-row justify-content-between my-3">
            <h4 className="card-title">{props.t("SecondaryBeneficiary")}</h4>
            {/* <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              abrirModal(); settype("guardar"); setdataSet({
                "transactId": 0,
                "firstName": "",
                "secondName": "",
                "firstLastName": "",
                "secondLastName": "",
                "nationality": "",
                "personType": "",
                "documentType": "",
                "documentNumber": "",
                "address": "",
                "telephone": "",
                "relationship": "",
                "percentage": 0
              })
            }} title={props.t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button> */}
          </div>
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table mb-0">
              <thead>
                <tr>
                  <th>{props.t("Name")}</th>
                  <th>{props.t("Nationality")}</th>
                  <th>{props.t("Documenttype")}</th>
                  <th>{props.t("PersonType")}</th>
                  <th>{props.t("Documentnumber")}</th>
                  <th>{props.t("Address")}</th>
                  <th>{props.t("Phone")}</th>
                  <th>{props.t("Relationship")}</th>
                  <th>{props.t("Percent")}</th>
                  <th style={{ textAlign: "right" }}>
                    {props.t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataFideicomitenteRows}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <ModalBeneficiosFideicomiso tipo={type} dataSet={dataSet} botones={botonValidation} gestionDatos={gestionDatos} isOpen={showModalFideicomitente} toggle={() => { cerrarModal() }} />
      {successSave_dlg ? (
        <SweetAlert
          success
          title={props.t("SuccessDialog")}
          confirmButtonText={props.t("Confirm")}
          cancelButtonText={props.t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            initializeData(locationData);
          }}
        >
          {props.t("SuccessSaveMessage")}
        </SweetAlert>
      ) : null}

      {error_dlg ? (
        <SweetAlert
          error
          title={props.t("ErrorDialog")}
          confirmButtonText={props.t("Confirm")}
          cancelButtonText={props.t("Cancel")}
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
          title={props.t("Areyousure")}
          warning
          showCancel
          confirmButtonText={props.t("Yesdeleteit")}
          cancelButtonText={props.t("Cancel")}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            apiBack.eliminarListaBeneficiarioSecundario(locationData.transactionId, dataSet.beneficiaryId).then(resp => {
              if (resp.statusCode == "500") {
                setconfirm_alert(false)
                seterror_dlg(false)
              } else {
                setconfirm_alert(false)
                setsuccessSave_dlg(true)
              }
            }).catch(error => {
              setconfirm_alert(false)
              seterror_dlg(false)
            })
          }}
          onCancel={() => setconfirm_alert(false)}
        >
          {props.t("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
    </React.Fragment>
  );
}
export default (withTranslation()(BeneficiarioSecundario))
