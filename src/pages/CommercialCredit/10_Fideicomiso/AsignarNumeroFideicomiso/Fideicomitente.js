/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types';


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
import { AvForm, AvField } from "availity-reactstrap-validation"

//i18n
import { withTranslation } from "react-i18next"

import ModalFideicomitente from "./ModalFideicomitente"
import ModalBeneficiosFideicomiso from "./ModalBeneficiosFideicomiso"
import { BackendServices } from "../../../../services";
import { useLocation, useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert"
import * as url from "../../../../helpers/url_helper"
import { PersonModel } from "../../../../models/Common/PersonModel";

const Fideicomitente = (props) => {
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
    "trustorId": 0,
    "name": "",
    "address": "",
    "email": "",
    "telephone": 0,
    "personId": 0,
    "status": true
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
    apiBack.consultarFideiComitentesBD(dataLocation.transactionId).then(resp => {
      if (resp != undefined || resp.length > 0) {
        setdataFideicomitenteRows(resp.map((data) => (
          <tr key={data.trustorId}>
            <td>{data.name + " " + data.secondName + " " + data.lastName + " " + data.secondSurname}</td>
            <td>{data.address}</td>
            <td>{data.email}</td>
            <td>{data.phone}</td>
            <td style={{ textAlign: "right" }}>
              <Button type="button" color="link" onClick={(resp) => { surveillanceList(data) }} className="btn btn-link" ><i className="mdi mdi-shield-account mdi-24px"></i></Button>
              {/* <Button type="button" color="link" onClick={(resp) => { EliminarCliente(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button> */}
            </td>
          </tr>)
        ));

      } else {
        setdataFideicomitenteRows(
          <tr key={1}>
            <td colSpan="4" style={{ textAlign: 'center' }}><h5>{props.t("NoData")}</h5></td>
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
    toggleShowModalFideicomitente()
  }
  function EliminarCliente(data) {
    setdataSet(data)
    setconfirm_alert(true);
  }
  function gestionDatos(data, tipo) {
    data.transactId = Number(dataLocation.transactionId);
    data.telephone = Number(data.telephone);
    if (tipo == "guardar") {
      apiBack.nuevaListaFideicomitentes(data).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg(true)
          toggleShowModalFideicomitente();
        } else {
          toggleShowModalFideicomitente();
          seterror_dlg(false);
        }
      }).catch(error => {
        seterror_dlg(false);
      })
    } else {
      data.trustorId = dataSet.trustorId;
      data.personId = dataSet.personId;
      apiBack.actualizarListaFideicomitentes(data).then(resp => {
        if (resp !== null && resp !== undefined) {
          setsuccessSave_dlg(true)
          toggleShowModalFideicomitente();
        } else {
          toggleShowModalFideicomitente();
          seterror_dlg(false);
        }
      }).catch(error => {
        seterror_dlg(false);
      })
    }
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalFideicomitente() {
    setShowModalFideicomitente(!showModalFideicomitente);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  return (
    <React.Fragment>
      <Row>
        <Col md="12">
          <p className="card-title-desc"></p>
          <h4 className="card-title">{props.t("Settlors")}</h4>
          <p className="card-title-desc"></p>
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table mb-0">
              <thead>
                <tr>
                  <th>{props.t("Name")}</th>
                  <th>{props.t("Address")}</th>
                  <th>{props.t("Email")}</th>
                  <th>{props.t("Phone")}</th>
                  <th>{props.t("Actions")}</th>
                  {/* <th style={{ textAlign: "right" }}>
                  <Button type="button" color="link" className="btn btn-link" onClick={() => {
                    toggleShowModalFideicomitente(); settype("guardar"); setdataSet({
                      "transactId": 0,
                      "trustorId": 0,
                      "name": "",
                      "address": "",
                      "email": "",
                      "telephone": 0,
                      "status": true
                    })
                  }} title={props.t("Add")}> <i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i>
                  </Button>
                </th> */}
                </tr>
              </thead>
              <tbody>
                {dataFideicomitenteRows}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <ModalFideicomitente tipo={type} dataSet={dataSet} botones={botonValidation} gestionDatos={gestionDatos} isOpen={showModalFideicomitente} toggle={() => { toggleShowModalFideicomitente() }} />
      {successSave_dlg ? (
        <SweetAlert
          success
          title={props.t("SuccessDialog")}
          confirmButtonText={props.t("Confirm")}
          cancelButtonText={props.t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            initializeData();
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
            initializeData();
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

            apiBack.eliminarListaFideicomitentes(dataLocation.transactionId, dataSet.personId).then(resp => {
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


Fideicomitente.propTypes = {
  results: PropTypes.array.isRequired, //Resultado de la busqueda
}

export default (withTranslation()(Fideicomitente))
