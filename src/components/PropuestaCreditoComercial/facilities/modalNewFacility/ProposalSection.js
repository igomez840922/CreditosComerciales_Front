import React, { useState } from 'react';
import { translationHelper } from '../../../../helpers';
import Select from "react-select";
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Label
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"
import AvGroup from "availity-reactstrap-validation/lib/AvGroup"
import { BackendServices, CoreServices } from "../../../../services";


const ProposalSection = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmFacilidades');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }))
  const api = new BackendServices();
  const apiCoreServices = new CoreServices();
  const [dataReturn, setdataReturn] = useState({
    proposalTypeId: null,
    proposalTypeName: null,
    facilityTypeId: null,
  });
  const [formValid, setFormValid] = useState(false);

  const [tipoPropuesta, settipoPropuesta] = useState(null);
  const [tipoPropuestaSelect, settipoPropuestaSelect] = useState(undefined);
  const [propuestaSet, setpropuestaSet] = useState(null);
  const [tipoPropuestaRequerido, settipoPropuestaRequerido] = useState(false);

  const [subPropuesta, setsubPropuesta] = useState(null);
  const [subPropuestaSelect, setsubPropuestaSelect] = useState(undefined);
  const [subPropuestaSet, setsubPropuestaSet] = useState(null);
  const [subPropuestaRequerido, setsubPropuestaRequerido] = useState(false);

  const [tipoFacilidad, settipoFacilidad] = useState(null);
  const [tipoFacilidadSelect, settipoFacilidadSelect] = useState(undefined);
  const [tipoFacilidadSet, settipoFacilidadSet] = useState(null);
  const [tipoFacilidadRequerido, settipoFacilidadRequerido] = useState(false);
  const t = translationHelper('commercial_credit');
  function handleSubmit() {
    // if (propuestaSet == "" || propuestaSet == null) {
    //   settipoPropuestaRequerido(true);
    //   return;
    // } else {
    //   settipoPropuestaRequerido(false);
    // }
    // if (subPropuestaSet == "" || subPropuestaSet == null) {
    //   setsubPropuestaRequerido(true);
    //   return;
    // } else {
    //   setsubPropuestaRequerido(false);
    // }
    // if (tipoFacilidadSet == "" || tipoFacilidadSet == null) {
    //   settipoFacilidadRequerido(true);
    //   return;
    // } else {
    //   settipoFacilidadRequerido(false);
    // }
    dataReturn.proposalTypeId = propuestaSet;
    dataReturn.proposalTypeName = subPropuestaSet;
    dataReturn.facilityTypeId = tipoFacilidadSet;
    setdataReturn(dataReturn);
    setFormValid(true);
  }
  React.useEffect(() => {
    // Read Api Service data
    initializeData();
  }, []);
  React.useEffect(() => {
    console.log(props);
    // Read Api Service data
    settipoPropuestaRequerido(props.validation.tipoPropuestaRequerido);
    setsubPropuestaRequerido(props.validation.subPropuestaRequerido);
    settipoFacilidadRequerido(props.validation.tipoFacilidadRequerido);
  }, [props]);
  React.useEffect(() => {
    // Read Api Service data 
    var defaultVal = null;
    settipoPropuestaSelect(undefined);
    setsubPropuestaSelect(undefined);
    settipoFacilidadSelect(undefined);
    try {
      if (tipoPropuesta.length > 0 && props.dataSet.proposalTypeId !== null && tipoPropuestaSelect === undefined) {
        defaultVal = tipoPropuesta.find(x => x.value === props.dataSet.proposalTypeId);
        if (defaultVal !== undefined) {
          settipoPropuestaSelect(defaultVal);
        }
      }
      if (subPropuesta.length > 0 && props.dataSet.proposalTypeName !== null && subPropuestaSelect === undefined) {
        defaultVal = subPropuesta.find(x => x.value === props.dataSet.proposalTypeName);
        if (defaultVal !== undefined) {
          setsubPropuestaSelect(defaultVal);
        }
      }
      if (tipoFacilidad.length > 0 && props.dataSet.facilityTypeId !== null && tipoFacilidadSelect === undefined) {
        defaultVal = tipoFacilidad.find(x => x.value === props.dataSet.facilityTypeId);
        if (defaultVal !== undefined) {
          settipoFacilidadSelect(defaultVal);
        }
      }
    }
    catch (err) { }
  }, [props]);
  function initializeData() {
    api.retrieveProposalType()
      .then((response) => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          json.push({ label: response[i]["description"], value: response[i]["id"] })
        }
        settipoPropuesta(json);
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
    api.retrieveSubproposalType()
      .then((response) => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          json.push({ label: response[i]["description"], value: response[i]["id"] })
        }
        setsubPropuesta(json);
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
    api.retrieveFacilityType()
      .then((response) => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          json.push({ label: response[i]["description"], value: response[i]["id"] })
        }
        settipoFacilidad(json);
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
  }
  return (
    <React.Fragment>
      <h5>{t("Proposal")}</h5>
      {/* <AvForm id="frmFacilidades" className="needs-validation" onSubmit={handleSubmit}> */}
      <Row>
        <Col md="4">
          <Label htmlFor="proposalType">{t("Proposal Type")}</Label>
          <Select noOptionsMessage={() => ""} 
            onChange={(e) => {
              settipoPropuestaSelect(tipoPropuesta.find(x => x.value === e.value))
              setpropuestaSet(e.value);
              dataReturn.proposalTypeId = e.value;
              setdataReturn(dataReturn);
            }}
            options={tipoPropuesta}
            placeholder={t("Select")}
            value={tipoPropuestaSelect}
          />
          {props.validation.tipoPropuestaRequerido ?
            <p className="message-error-parrafo">{t("Required")}</p>
            : null}
        </Col>
        <Col md="4">
          <Label htmlFor="subproposalType">{t("SubProposal Type")}</Label>
          <Select noOptionsMessage={() => ""} 
            onChange={(e) => {
              setsubPropuestaSelect(subPropuesta.find(x => x.value === e.value))
              setsubPropuestaSet(e.value);
              dataReturn.proposalTypeName = e.value;
              setdataReturn(dataReturn);
            }}
            options={subPropuesta}
            placeholder={t("Select")}
            value={subPropuestaSelect}
          />
          {props.validation.subPropuestaRequerido ?
            <p className="message-error-parrafo">{t("Required")}</p>
            : null}

        </Col>
        <Col md="4">
          <Label htmlFor="facilityType">{t("Facility Type")}</Label>
          <Select noOptionsMessage={() => ""} 
            onChange={(e) => {
              settipoFacilidadSelect(tipoFacilidad.find(x => x.value === e.value))
              settipoFacilidadSet(e.value);
              dataReturn.facilityTypeId = e.value;
              setdataReturn(dataReturn);
            }}
            options={tipoFacilidad}
            placeholder={t("Select")}
            value={tipoFacilidadSelect}
          />
          {props.validation.tipoFacilidadRequerido ?
            <p className="message-error-parrafo">{t("Required")}</p>
            : null}
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <AvGroup className="mb-3">
            <Label htmlFor="purpose">{t("Purpose")}</Label>
            <AvField id="purpose"
              className="form-control"
              name="purpose"
              validate={{
                required: { value: true, errorMessage: t("Required") }
              }}
              type="textarea"
              value={props.dataSet.purpose}
              rows="4" />
          </AvGroup>
        </Col>
        <Col md="6">
          <AvGroup className="mb-3">
            <Label htmlFor="sublimits">{t("Sub Limits")}</Label>
            <AvField id="sublimits"
              className="form-control"
              name="sublimits"
              value={props.dataSet.sublimits}
              validate={{
                required: { value: true, errorMessage: t("Required") }
              }}
              type="textarea"
              rows="4" />
          </AvGroup></Col>
      </Row>
      {/* </AvForm> */}
    </React.Fragment>
  );

});
ProposalSection.propTypes = {
  onSubmit: PropTypes.func,
}

export default ProposalSection;
