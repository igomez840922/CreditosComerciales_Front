import React from "react"
import PropTypes from 'prop-types'
import { translationHelpers } from '../../../helpers';


import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Row,
  Col,
  Button
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { useEffect, useState } from 'react';
import { CoreServices } from '../../../services';
import Select from "react-select";

import * as OPTs from "../../../helpers/options_helper";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";

const ModalNewWarrant = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');
  const [tipoGaranteSelect, settipoGaranteSelect] = useState(undefined);
  // state
  const [campoRequeridoGarantia, setcampoRequeridoGarantia] = useState(false);
  const [codigoGarantia, setcodigoGarantia] = useState(null);
  const [tiposGarantia, setTiposGarantia] = useState([]);

  const [fechaSet, setfechaSet] = useState(null);


  // services
  const coreServices = new CoreServices();
  React.useEffect(() => {

    setfechaSet(props.dataSet.appraisalDate ? moment(props.dataSet.appraisalDate).format("DD-MM-YYYY") : " ")

    // Read Api Service data
    var defaultVal = null;
    settipoGaranteSelect(undefined)
    try {
      if (tiposGarantia.length > 0 && props.dataSet.guaranteeTypeName !== null && tipoGaranteSelect === undefined) {
        defaultVal = tiposGarantia.find(x => x.label === props.dataSet.guaranteeTypeName);
        if (defaultVal !== undefined) {
          settipoGaranteSelect(defaultVal);
        }
      }
    }
    catch (err) { }

  }, [props, tiposGarantia]);
  useEffect(() => {
    cargarCatalogoGarantias();
  }, []);

  function cargarCatalogoGarantias() {
    coreServices.getTipoGarantiaCatalogo()
      .then((response) => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        const optionGroup1 = [
          {
            label: t("SelectGroup"),
            options: json,
          },

        ];
        setTiposGarantia(json);
      });
  }

  function handleSubmit(event, errors, value) {
    if (codigoGarantia == null) {
      setcampoRequeridoGarantia(true);
      return;
    } else {
      setcampoRequeridoGarantia(false);
    }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    value.guaranteeTypeName = codigoGarantia;
    props.guardarDatos(value, props.tipo);
    props.toggle();
  }

  function handleCancel() {
    props.toggle();
  }

  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla === 45) {
      e.preventDefault();
      return true;
    }

    return false;
  }

  return (
    <Modal isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
      size="md">
      <ModalHeader toggle={props.toggle} color="primary">{t("Warrants")}</ModalHeader>
      <ModalBody>
        <AvForm className="needs-validation" onSubmit={handleSubmit}>
          <Row>
            <Col lg="12">
              <AvGroup className="mb-3">
                <Label htmlFor="type">{t("Warrant Type")}</Label>
                <Select noOptionsMessage={() => ""}
                  onChange={(e) => {
                    settipoGaranteSelect(tiposGarantia.find(x => x.label === e.label)); setcodigoGarantia(e.label);
                  }}
                  options={tiposGarantia}
                  value={tipoGaranteSelect}
                  classNamePrefix="select2-selection"
                  placeholder={t("SelectGroup")}
                />
                {campoRequeridoGarantia ?
                  <p className="message-error-parrafo">{t("Required")}</p>
                  : null}
              </AvGroup>
            </Col>
            <Col lg="6">
              <AvGroup className="mb-3">
                <Label htmlFor="commercialValue">{t("Commercial Value")}</Label>
                <AvField
                  className="form-control"
                  name="commercialValue"
                  min={0}
                  type="number"
                  onKeyPress={(e) => { return check(e) }}
                  value={props.dataSet.commercialValue}
                  id="commercialValue" />
              </AvGroup>

            </Col>
            <Col lg="6">
              <AvGroup className="mb-3">
                <Label htmlFor="fastValue">{t("Quick V-Value")}</Label>
                <AvField
                  className="form-control"
                  name="fastValue"
                  min={0}
                  type="number"
                  onKeyPress={(e) => { return check(e) }}
                  value={props.dataSet.fastValue}
                  id="fastValue" />
              </AvGroup>

            </Col>
            <Col lg="12">
              <AvGroup className="mb-3">
                <Label htmlFor="observations">{t("Description")}</Label>
                <AvField
                  className="form-control"
                  name="observations"
                  type="textarea"
                  value={props.dataSet.observations}
                  id="observations"
                  rows="4" />
              </AvGroup>

            </Col>
            <Col lg="6">
              <AvGroup className="mb-3">
                <Label htmlFor="ltv">{t("LTV%")}</Label>
                <AvField
                  className="form-control"
                  name="ltv"
                  type="number"
                  onKeyPress={(e) => { return check(e) }}
                  value={props.dataSet.ltv}
                  id="ltv"
                  min={0}
                  max="100" />
              </AvGroup>

            </Col>
            <Col lg="6">
              <AvGroup className="mb-3">
                <Label htmlFor="appraisalDate">{t("Appraisal Date")}</Label>
                
                {fechaSet &&
                  (<Flatpickr
                    name="estimatedDate"
                    id="estimatedDate"
                    className="form-control d-block"
                    placeholder={OPTs.FORMAT_DATE_SHOW}
                    options={{
                      dateFormat: OPTs.FORMAT_DATE,
                      defaultDate: fechaSet,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                    }}
                    onChange={(selectedDates, dateStr, instance) => {
                      setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD"))
                    }}
                  // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}

                  // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr).format("YYYY-MM-DD") } }) }}
                  />)}
              </AvGroup>
            </Col>
          </Row>
          <AvGroup className="mb-3">
            <Label htmlFor="signature">{t("Signature")}</Label>
            <AvField
              className="form-control"
              name="signature"
              type="text"
              value={props.dataSet.signature}
              id="signature" />
          </AvGroup>
          <AvGroup className="mb-3">
            <Label htmlFor="trustNumber">No. {t("Escrow")}</Label>
            <AvField
              className="form-control"
              name="trustNumber"
              type="text"
              value={props.dataSet.trustNumber}
              id="trustNumber" />
          </AvGroup>
          <AvGroup className="mb-3">
            <Label htmlFor="fiduciary">{t("Fiduciary")}</Label>
            <AvField
              className="form-control"
              name="fiduciary"
              type="text"
              value={props.dataSet.fiduciary}
              id="fiduciary" />
          </AvGroup>
          <Row className="my-2">
            <Col xl="12 text-end">
              <Button id="btnCancel" color="danger" type="button" style={{ margin: '5px' }} onClick={handleCancel}>
                {c("Cancel")}
              </Button>
              {props.botones ?
                <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                  {" "} {props.tipo == "COMISION" ? c("Save") : c("Edit")}
                </Button> : null}
            </Col>
          </Row>
        </AvForm>
      </ModalBody>
    </Modal>
  )
};

ModalNewWarrant.propTypes = {
  onSave: PropTypes.func.isRequired,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool
};


export default ModalNewWarrant;
