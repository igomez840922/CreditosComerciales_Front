import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { Row, Col, Card, CardBody, Button, Label } from "reactstrap";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation";
import ApiServicesCommon from "../../../../../services/Common/ApiServicesCommon";
import { BackendServices, CoreServices } from "../../../../../services";
import Select from "react-select";
import Switch from "react-switch";
import Breadcrumb from "../../../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import Currency from "../../../../../helpers/currency";

import moment from "moment";
import { saveLogProcess } from "../../../../../helpers/logs_helper";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import * as OPTs from "../../../../../helpers/options_helper";

const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      No
    </div>
  );
};

const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      Si
    </div>
  );
};

const PantallaBusqueda = (props) => {
  const currencyData = new Currency()
  const history = useHistory();
  const location = useLocation();
  const [successSave_dlg2, setsuccessSave_dlg2] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [dataLocation, setdataLocation] = useState(undefined);
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);
  const backendServices = new BackendServices();
  const [loading, setLoading] = useState(false);
  const [typeGarantia, settypeGarantia] = useState("nuevo");
  const [displayClienteModal, setDisplayClienteModal] = useState(false);
  const [dataGeneral, setdataGeneral] = useState({
    "transactId": 0,
    "lineId": "",
    "revisionFrequency": "",
    "dueDate": "2022-03-09",
    "limitDate": "2022-03-09",
    "amount": 0,
    "maxTotal": 0,
    "modifiedAmount": 0,
    "status": true
  });
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        location.data.transactionId = 0;
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        if (location.data?.dataGeneral) {
          setdataGeneral(location.data.dataGeneral);
          settypeGarantia("editar")
        }
        setdataLocation(location.data);
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        if (result?.dataGeneral) {
          setdataGeneral(result.dataGeneral);
          settypeGarantia("editar")
        }
        setdataLocation(result);
      }
    }

  }, []);
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    const datosJson = {
      "transactId": Number(dataLocation.transactionId),
      "lineId": dataGeneral.lineId,
      "revisionFrequency": values.revisionFrequency,
      "dueDate": values.dueDate,
      "limitDate": values.limitDate,
      "amount": Number(currencyData.getRealValue(values?.amount ?? 0)),
      "maxTotal": Number(currencyData.getRealValue(values?.maxTotal ?? 0)),
      "modifiedAmount": Number(currencyData.getRealValue(values?.modifiedAmount ?? 0)),
      "status": true
    }
    backendServices.updateCreditLine(datosJson).then(resp => {
      if (resp !== null && resp !== undefined) {
        setsuccessSave_dlg2(true)
      } else {
        seterror_dlg(false);
      }
    }).catch(err => {
    })

  }

  return (
    <React.Fragment>
      <h5>{t("Datos Generales")}</h5>
      <p className="card-title-desc"></p>

      <AvForm id="frmGarantiasMuebles" className="needs-validation" onSubmit={handleSubmit} autoComplete="off">
        <Row>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Frecuebnciarevi">
                {t("Line Number or Limit")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="revisionFrequency"
                value={dataGeneral?.revisionFrequency ?? ""}
                id="revisionFrequency"
                title={t("Mensual")}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("DueDate")}</Label>

              <Flatpickr
                id="dueDate"
                name="dueDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: dataGeneral !== undefined ? new Date(moment(dataGeneral.dueDate, 'YYYY-MM-DD').format()) : new Date()
                }}
              //onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Deadline")}</Label>

              <Flatpickr
                id="limitDate"
                name="limitDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: dataGeneral !== undefined ? new Date(moment(dataGeneral.limitDate, 'YYYY-MM-DD').format()) : new Date()
                }}
              //onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
              />

            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Monto">
                {t("Amount")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="amount"
                value={currencyData.format(dataGeneral?.amount ?? 0)}
                id="amount"
                pattern="^[0-9,.]*$"
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                title={t("")}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Totmaximo">
                {t("Total Maximum")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="maxTotal"
                value={currencyData.format(dataGeneral?.maxTotal ?? 0)}
                id="maxTotal"
                title={t("")}
                pattern="^[0-9,.]*$"
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="MontoModificado">
                {t("Modified Amount")}
              </Label>
              <AvField
                className="form-control"
                type="text"
                name="modifiedAmount"
                value={currencyData.format(dataGeneral?.modifiedAmount ?? 0)}
                id="modifiedAmount"
                pattern="^[0-9,.]*$"
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                title={t("")}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} style={{ textAlign: "right", marginTop: "10px" }}>
            <Link
              to={{
                pathname: '/creditocomercial/garantias/',
                data: { facilityId: dataLocation?.facilityId ?? 0, transactionId: dataLocation?.transactionId ?? 0 },
              }}
            >
              <Button
                id="btnNew"
                color="danger"
                type="button"
                style={{ margin: "5px" }}
                onClick={props.toggle}
                data-dismiss="modal"
              >
                <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}
                {t("Cancel")}
              </Button>
            </Link>
            <Button id="btnSearch" type="submit" color="success" style={{ margin: '5px' }}>
              <i className="mdi mdi-content-save mdi-12px"></i>
              {" "} {t("Edit")}</Button>
          </Col>
        </Row>
      </AvForm>
      {error_dlg ? (
        <SweetAlert
          error
          title={t("ErrorDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            seterror_dlg(false)
          }}
        >
          {error_msg}
        </SweetAlert>
      ) : null}
      {successSave_dlg2 ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg2(false)
            history.push({
              pathname: '/creditocomercial/garantias/',
              data: {
                facilityId: dataLocation?.facilityId ?? 0, transactionId: dataLocation?.transactionId ?? 0,
                "containerId": dataLocation.containerId,
                "priority": dataLocation.priority ?? "",
                "infobpm": dataLocation.infobpm,
                "requestId": dataLocation.requestId ?? "",
                "facilityId": dataLocation.facilityId ?? "",
                "facilityTypeId": dataLocation.facilityTypeId ?? "",
                "customerId": dataLocation.customerId ?? "",
                "transactionId": dataLocation.transactionId ?? "",
                "processId": dataLocation.processId ?? "",
                "activityId": dataLocation.activityId ?? "",
                "instanceId": dataLocation.instanceId ?? "",
                "taskId": dataLocation.taskId ?? "",
                "taskStatus": dataLocation?.taskStatus ?? ""
              }
            });
          }}
        >
          {t("SuccessSaveMessage")}
        </SweetAlert>
      ) : null}
    </React.Fragment>
  );
};

export default withTranslation()(PantallaBusqueda);
