import React, { useState, useImperativeHandle, forwardRef, useContext, useEffect } from 'react';

import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';
import RiesgoAmbientalContext from '../RiesgoAmbientalContext';

import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Label
} from "reactstrap"
import Switch from "react-switch";

import { AvForm, AvField, AvGroup, AvInput } from "availity-reactstrap-validation"
import { BackendServices, CoreServices } from "../../../../services"
import { useTranslation } from 'react-i18next'

import moment from "moment";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import * as OPTs from "../../../../helpers/options_helper"

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

const FormDetalles = forwardRef((props, ref) => {

  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmDetalleAmbiental');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn, fechaSet
  }))
  const { t, i18n } = useTranslation();

  const [displayCovenantDetails, setDisplayCovenantDetails] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [isUpdatingRecord, setUpdatingRecord] = useState(false);
  const [environmentCovenant, setEnvironemntCovenant] = useState(false);
  const [detail, setDetail] = useState('');
  const [compliance, setCompliance] = useState('');
  const [detected, setDetected] = useState('');
  const [term, setTerm] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [conclusions, setConclusions] = useState('');
  const [dataReturn, setdataReturn] = useState('');
  const [locationData, setLocationData] = useState(props.locationData);

  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  //const [bpmServices, setbpmServices] = useState(new BpmServices());
  //const [coreServices, setcoreServices] = useState(new CoreServices());
  const [fechaSet, setfechaSet] = useState('');
  const [validationTransactId, setValidationTransactId] = useState('');

  useEffect(() => {
    // load data        
    backendServices.getEnvironmentalRiskInfo(locationData.transactionId)
      .then((info) => {
        console.log(info)
        if (info.serviceStatus.statusCode == "204") {
          setUpdatingRecord(true);
          setEnvironemntCovenant(info.environmentCovenant);
          setDetail(info.detail);
          setCompliance(info.compliance);
          setDetected(info.detected);
          setTerm(info.term);
          setRecommendations(info.recommendations);
          setConclusions(info.conclusions);
          setfechaSet("")
          setValidationTransactId(locationData.transactionId)
        } else {
          setUpdatingRecord(true);
          setEnvironemntCovenant(info.environmentCovenant);
          setDetail(info.detail);
          setCompliance(info.compliance);
          setDetected(info.detected);
          setTerm(info.term);
          setRecommendations(info.recommendations);
          setConclusions(info.conclusions);
          info.complianceDate && setfechaSet(moment(info.complianceDate).format("DD-MM-YYYY"))
          setValidationTransactId(locationData.transactionId)
        }
      })
      .catch((error) => {
        console.log('error fetch detalles', error);
      })

  }, []);

  function handleCovenantChange(event) {
    setDisplayCovenantDetails(event.target.value === 'Si' ? true : false);
  }

  function handleSubmit(event, errors, values) {
    values.environmentCovenant = environmentCovenant;
    event.preventDefault();
    if (errors.length > 0) {
      setFormValid(false);
      return;
    }
    setdataReturn(values)
    event.preventDefault();
    const isValid = errors.length === 0;
    setFormValid(isValid);
  }

  return (
    <React.Fragment>

      <Card>
        <h5 className="card-sub-title">{t("OtherDetails")}</h5>

        <CardBody>
          <AvForm id="frmDetalleAmbiental" className="needs-validation" onSubmit={handleSubmit}>
            <Row className="my-3">
              <Col md="12">
                <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Covenants Ambientales")}</Label>
                <AvGroup check className="mb-3">
                  <Switch name="isProjectLocatedProtectedNaturalArea"
                    uncheckedIcon={<Offsymbol />}
                    checkedIcon={<OnSymbol />}
                    onColor="#007943"
                    id="check1"
                    disabled={props?.previsualizarHistoria ? true : false}
                    className="form-label"
                    onChange={() => {
                      setEnvironemntCovenant(!environmentCovenant);
                    }}
                    checked={environmentCovenant}
                  />
                  {'   '}
                </AvGroup>
                {/* <AvGroup>
                  <Label htmlFor="environmentCovenant">{t("Covenants Ambientales")}</Label>
                  <AvField
                    className="form-control"
                    name="environmentCovenant"
                    type="select"
                    id="environmentCovenant"
                    value={environmentCovenant}
                    onChange={handleCovenantChange}>
                    <option value={true}>{t("Yes")}</option>
                    <option value={false}>{t("No")}</option>
                  </AvField>
                </AvGroup> */}
              </Col>
            </Row>
            {environmentCovenant && (
              <>
                <Row>
                  <Col md="3">
                    <AvGroup className="mb-3">
                      <Label htmlFor="birthDate">{t("Compliance Date")}</Label>
                      {validationTransactId && <><Flatpickr
                        id="issuedDate"
                        name="issuedDate"
                        className="form-control d-block"
                        placeholder={OPTs.FORMAT_DATE_SHOW}
                        disabled={props?.previsualizarHistoria ? true : false}
                        options={{
                          dateFormat: OPTs.FORMAT_DATE,
                          //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                          defaultDate: fechaSet
                        }}
                        onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                      />
                        {fechaSet == " " ? <p className="message-error-parrafo">{t("Required")}</p> : null}</>
                      }

                    </AvGroup>
                  </Col>

                </Row>
                <Row className="my-3">
                  <Col md="4">
                    <AvGroup>
                      <Label htmlFor="detail">{t("Detalle")}</Label>
                      <AvField className="form-control"
                        name="detail"
                        type="text"
                        id="detail"
                        disabled={props?.previsualizarHistoria ? true : false}
                        value={detail} />
                    </AvGroup>
                  </Col>
                  <Col md="4">
                    <AvGroup>
                      <Label htmlFor="compliance">{t("Cumplimiento")}</Label>
                      <AvField className="form-control"
                        name="compliance"
                        type="text"
                        id="compliance"
                        disabled={props?.previsualizarHistoria ? true : false}
                        value={compliance} />
                    </AvGroup>
                  </Col>
                  <Col md="4">
                    <AvGroup>
                      <Label htmlFor="term">{t("Plazo")}</Label>
                      <AvField className="form-control"
                        name="term"
                        type="text"
                        id="term"
                        disabled={props?.previsualizarHistoria ? true : false}
                        value={term} />
                    </AvGroup>
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col md="12">
                    <AvGroup>
                      <Label htmlFor="detected">{t("Situacion Detectada")}</Label>
                      <AvField className="form-control"
                        name="detected"
                        type="textarea"
                        id="detected"
                        disabled={props?.previsualizarHistoria ? true : false}
                        value={detected}
                        rows="7" />
                    </AvGroup>
                  </Col>
                </Row>
              </>
            )}

            <Row className="my-3">
              <Col md="12">
                <AvGroup>
                  <Label htmlFor="recommendations">{t("Recomendaciones")}</Label>
                  <AvField className="form-control"
                    name="recommendations"
                    type="textarea"
                    id="recommendations"
                    disabled={props?.previsualizarHistoria ? true : false}
                    value={recommendations}
                    rows="7" />
                </AvGroup>
              </Col>
            </Row>

            <Row className="my-3">
              <Col md="12">
                <AvGroup>
                  <Label htmlFor="conclusions">{t("Conclusiones")}</Label>
                  <AvField className="form-control"
                    name="conclusions"
                    type="textarea"
                    id="conclusions"
                    disabled={props?.previsualizarHistoria ? true : false}
                    value={conclusions}
                    rows="7" />
                </AvGroup>
              </Col>
            </Row>

          </AvForm>

        </CardBody>
      </Card>


    </React.Fragment>
  );
});


FormDetalles.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  locationData: PropTypes.any,
};

export default FormDetalles;
