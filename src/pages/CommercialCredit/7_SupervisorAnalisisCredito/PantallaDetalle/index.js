/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types';
import { Link } from "react-router-dom"
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../../../helpers/url_helper"

import {
  Card,
  CardBody,
  CardFooter,
  Button,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"

import DatosGenerales from "./DatosGenerales"
import ExposicionCorporativa from "./ExposicionCorporativa"
import ExposicionCorporativaCliente from "./ExposicionCorporativaCliente"
import Facilidades from "./Facilidades"
import Refinanciamientos from "./Refinanciamientos"
import ModalFacilidadDetalle from "./ModalFacilidadDetalle"
import { BackendServices, CoreServices, BpmServices, } from "../../../../services";
import SweetAlert from "react-bootstrap-sweetalert";

const PantallaBusqueda = props => {
  const history = useHistory();
  const location = useLocation()
  const { selectedData } = location;
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [showModalFacilidadDetalle, setShowModalFacilidadDetalle] = useState(false);

  //nuevo informe abrimos modal para buscar y seleccionar cliente
  function toggleShowModalFacilidadDetalle() {
    console.log("toggleShowModalFacilidadDetalle");
    setShowModalFacilidadDetalle(!showModalFacilidadDetalle);
    removeBodyCss()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  function processNext() {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                      Avanzamos el proceso                                      */
    /* ---------------------------------------------------------------------------------------------- */
    const api = new BpmServices();
    let taskId = "";
    api.completedStatusTask(taskId).then(resp => {
      if (resp !== undefined) {
        setsuccessSave_dlg(true);
      }
      else {
        //Mensaje ERROR
        seterror_msg(props.t("ErrorSaveMessage"))
        seterror_dlg(false)
      }
    }).catch(err => {
      console.log(err);
    })
  }
  function closeProcess() {
    /* ---------------------------------------------------------------------------------------------- */
    /*                    Cerramos el proceso y retornamos a la bandeja de entrada                    */
    /* ---------------------------------------------------------------------------------------------- */
    const api = new BpmServices();
    // let instanceId = location.data.instanceId
    let instanceId = 0
    api.abortProcess(instanceId).then((data) => {
      if (data !== undefined) {
        history.push(url.URL_DASHBOARD);
      }
      else {
        //Mensaje ERROR
        seterror_msg(props.t("TheProcessCouldNotFinish"))
        seterror_dlg(false)
      }
    });
  }
  function devolverEjecutivo() {
    /* ---------------------------------------------------------------------------------------------- */
    /*                 Retornamos el proceso a ejecutivo para la evaluacion respectiva                */
    /* ---------------------------------------------------------------------------------------------- */
    seterror_msg(props.t("TheProcessCouldNotFinish"))
    seterror_dlg(false)
  }
  function devolverAnalista() {
    /* ---------------------------------------------------------------------------------------------- */
    /*                 Retornamos el proceso a analista para la evaluacion respectiva                 */
    /* ---------------------------------------------------------------------------------------------- */
    seterror_msg(props.t("TheProcessCouldNotFinish"))
    seterror_dlg(false)
  }
  return (
    <React.Fragment>

      <div className="page-content">

        <Breadcrumbs title={props.t("CommercialCredit")} breadcrumbItem={props.t("CreditAnalysisSupervisor")} />

        <Card>
          <DatosGenerales />
          <ExposicionCorporativa />
          <ExposicionCorporativaCliente />
          <Facilidades onSelectFacilidad={() => { toggleShowModalFacilidadDetalle() }} />
          <Refinanciamientos />

          <ModalFacilidadDetalle isOpen={showModalFacilidadDetalle} toggle={() => { toggleShowModalFacilidadDetalle() }} />

          <CardFooter style={{ textAlign: "right" }}>
            <Button id="btnSearch" color="danger" type="button" style={{ margin: '5px' }} onClick={closeProcess}><i className="mdi mdi mdi-cancel mid-12px"></i>
              {" "} {props.t("Close")}</Button>
            <Button id="btnSearch" color="negative" type="button" style={{ margin: '5px' }} onClick={devolverEjecutivo}><i className="mdi mdi-arrow-top-right-bold-outline mid-12px"></i>
              {" "} {props.t("BackToExecutive")}</Button>
            <Button id="btnSearch" color="negative" type="button" style={{ margin: '5px' }} onClick={devolverAnalista}><i className="mdi mdi-call-missed mid-12px"></i>
              {" "} {props.t("BackToAnalyst")}</Button>
            <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={processNext}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i>
              {" "} {props.t("Advance")}</Button>
          </CardFooter>
        </Card>
        {successSave_dlg ? (
          <SweetAlert
            success
            title={props.t("SuccessDialog")}
            confirmButtonText={props.t("Confirm")}
            cancelButtonText={props.t("Cancel")}
            onConfirm={() => {
              setsuccessSave_dlg(false)

              history.push(url.URL_DASHBOARD);
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
            }}
          >
            {error_msg}
          </SweetAlert>
        ) : null}
      </div>

    </React.Fragment>
  )
}

PantallaBusqueda.propTypes = {
  //    onSelectIdPropuesta: PropTypes.func.isRequired
  selectedIdPropuesta: PropTypes.any,
  onClose: PropTypes.func.isRequired
}

export default (withTranslation()(PantallaBusqueda))
