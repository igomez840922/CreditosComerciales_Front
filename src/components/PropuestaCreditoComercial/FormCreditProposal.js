import React, { useState, useEffect, useContext } from "react";
import { PropTypes } from 'prop-types';
import { translationHelpers } from '../../helpers';
import Select from "react-select";
import './FormCreditProposal.scss';


import {
  Row,
  Col,
  Label,
} from "reactstrap"

import { AvForm, AvGroup, AvField, AvFeedback } from "availity-reactstrap-validation"
import { BackendServices, CoreServices } from "../../services";
import ServicioPropuestaCredito from "../../services/PropuestaCredito/PropuestaCredito";
import CreditProposalContext from "./CreditProposalContext";
import Switch from "react-switch";
import { useLocation } from "react-router-dom";

import * as OPTs from "../../helpers/options_helper"
import moment from "moment";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

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

const FormCreditProposal = React.forwardRef((props, ref) => {

  const location = useLocation();
  const [locationData, setLocationData] = useState(location.data);
  const [formValid, setFormValid] = useState(false);
  const [gruposEconomicos, setGruposEconomicos] = useState([]);
  const [actividadEmpresa, setActividadEmpresa] = useState([]);
  const [actividadEmpresaSet, setActividadEmpresaSet] = useState(null);
  const [actividadEmpresaSelect, setActividadEmpresaSelect] = useState(undefined);
  const [paises, setPais] = useState([]);
  const [paisesRiesgo, setPaisRiesgo] = useState([]);
  const [listaRevisionSet, setlistaRevisionSet] = useState(null);
  const [listaRevision, setlistaRevision] = useState(null);
  const [datosIGR, setdatosIGR] = useState(null);
  const [datosAmbientales, setdatosAmbientales] = useState(null);
  const [listaRevisionSelect, setlistaRevisionSelect] = useState(undefined);
  const [listaRevisionRequerido, setlistaRevisionRequerido] = useState(null);
  const [preapprovalSwitch, setpreapprovalSwitch] = useState(false);
  const [relatedPartSwitch, setrelatedPartSwitch] = useState(false);
  // form control state
  const [transactId, setTransactId] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [revisionType, setRevisionType] = useState('');
  const [preapproval, setPreapproval] = useState(false);
  const [economicGroupSelect, seteconomicGroupSelect] = useState(null);
  const [economicGroup, setEconomicGroup] = useState(null);
  const [country, setCountry] = useState(null);
  const [countrySelect, setCountrySelect] = useState(undefined);
  const [activityCompany, setActivityCompany] = useState('');
  const [riskClassification, setRiskClassification] = useState('');
  const [minimumProvisionSIB, setMinimunProvisionSIB] = useState('');
  const [relatedPart, setRelatedPart] = useState(false);
  const [accountExecutive, setAccountExecutive] = useState('');
  const [approvalLevel, setApprovalLevel] = useState('');
  const [responsibleUnit, setResponsibleUnit] = useState('');
  const [countryRisk, setCountryRisk] = useState(null);
  const [countryRiskSelect, setCountryRiskSelect] = useState(undefined);
  const [requestDate, setRequestDate] = useState('');
  const [lastRequestDate, setLastRequestDate] = useState('');
  const [proposedExpirationDate, setProposedExpirationDate] = useState('');
  const [nextRevisionDate, setNextRevisionDate] = useState('');
  const [flow, setFlow] = useState('');


  const [t, c] = translationHelpers('commercial_credit', 'common');

  // services
  const context = useContext(CreditProposalContext);
  const propCredService = new ServicioPropuestaCredito();

  React.useImperativeHandle(ref, () => ({
    submit: (validate = true) => {
      const form = document.getElementById('formCreditProposal');
      if (validate) {
        if (formValid) {
          form.requestSubmit();
          return true;
        }
        return false;
      }
      else {
        form.requestSubmit();
        return true;
      }
    },
    getFormValidation: () => {
      return formValid;
    }
  }));

  useEffect(() => {
    updateDefaults();
    cargarListaPaises();
    cargarListaGrupoEconomico();
    cargarActividadEconomica();
    cargarListaRevision();
  }, []);

  // useEffect(() => {

  // }, [gruposEconomicos]);

  useEffect(() => {
    updateDefaults();
  }, [props.values, paises, gruposEconomicos, actividadEmpresa]);

  function updateDefaults() {
    // set default values
    setTransactId(props.values.transactId || context.transactionId);
    setCustomerNumber(props.values.customerNumber || context.customerId);
    setRevisionType(props.values.revisionType || 'Bimensual');
    setPreapproval(props.values.preapproval || false);
    // setRiskClassification(props.values.riskClassification || '');
    setMinimunProvisionSIB(props.values.minimumProvisionSIB || '');
    setRelatedPart(props.values.relatedPart || false);
    setAccountExecutive(props.values.accountExecutive || '');
    setApprovalLevel(props.values.approvalLevel || '');
    setResponsibleUnit(props.values.responsibleUnit || '');
    setRequestDate(props.values.requestDate || '');
    setLastRequestDate(props.values.lastRequestDate || '');
    setNextRevisionDate(props.values.nextRevisionDate || '');
    setProposedExpirationDate(props.values.proposedExpirationDate || '');
    setFlow(props.values.flow || '');
    cargarDatosGeneralesIGR();
    setrelatedPartSwitch(props.values.relatedPart)
    setpreapprovalSwitch(props.values.preapproval)
    try {
      var defaultVal = null;
      if (listaRevision.length > 0 && props.values.revision !== null && listaRevisionSelect === undefined) {
        defaultVal = listaRevision.find(x => x.value === props.values.revision);
        if (defaultVal !== undefined) {
          setlistaRevisionSelect(defaultVal);
        }
      }
      if (paises.length > 0 && props.values.country !== null && countrySelect === undefined) {
        defaultVal = paises.find(x => x.value === props.values.country);
        if (defaultVal !== undefined) {
          setCountrySelect(defaultVal);
        }
      }
      if (paises.length > 0 && props.values.countryRisk !== null && countryRiskSelect === undefined) {
        defaultVal = paises.find(x => x.value === props.values.countryRisk);
        if (defaultVal !== undefined) {
          setCountryRiskSelect(defaultVal);
        }
      }
    }
    catch (err) { }
    // dropdown economic group
    // if (props.values.economicGroupNumber && gruposEconomicos && gruposEconomicos.length > 0) {
    //   const selected = gruposEconomicos[0].options.find(p => p.value === props.values.economicGroupNumber);
    //   if (selected) {
    //     setEconomicGroup(selected);
    //   }
    // }
    // else {
    //   setEconomicGroup({ label: t('SelectGroup'), value: '' });
    // }

    // drodown country

    // dropdown countryRisk
    // if (props.values.countryRisk && paises.length > 0) {
    //   const selected = paises[0].options.find(p => p.value === props.values.countryRisk);
    //   if (selected) {
    //     setCountryRisk(selected);
    //   }
    // }
    // else {
    //   setCountryRisk({ label: t('Selectacountry'), value: '' });
    // }

    // dropdown activityCompany

  }

  function cargarListaPaises() {
    const api = new CoreServices();
    api.getPaisesCatalogo().then(response => {
      if (response === null) { return; }

      // sort by name
      const json = response.Records ? response.Records.map(item => ({
        label: item["Description"],
        value: item["Code"]
      })) : [];

      const optionGroup1 = [
        {
          label: t("Selectacountry"),
          options: json,
        }
      ];
      setPais(json);
      setPaisRiesgo(json);

    }).catch(err => {
      console.log(err);
    });
  }

  function cargarActividadEconomica() {
    const api = new CoreServices();
    api.getActividadEconomicaCatalogo()
      .then(response => {
        if (response === null) { return; }

        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        const optionGroup1 = [
          {
            label: t("Selectcompanyactivity"),
            options: json,
          },

        ];
        setActividadEmpresa(json);
      });
  }

  function cargarListaGrupoEconomico() {
    const api = new CoreServices();
    api.getGrupoEconomicoCatalogo()
      .then(response => {
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
        // console.log(optionGroup1);
        setGruposEconomicos(json);
      });
  }

  function cargarListaRevision() {
    const api = new BackendServices();
    api.retrieveRevisionType()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          json.push({ label: response[i]["description"], value: response[i]["id"] })
        }
        setlistaRevision(json);
      });
  }

  function cargarDatosGeneralesIGR() {
    const { transactionId } = context;
    const apiBack = new BackendServices();
    apiBack.consultGeneralDataIGR(transactionId).then(resp => {
      setdatosIGR(resp)
      try {
        var defaultVal = null;
        seteconomicGroupSelect(undefined);
        if (gruposEconomicos.length > 0 && resp.economicGroup !== null && economicGroupSelect === undefined) {
          defaultVal = gruposEconomicos.find(x => x.value === resp.economicGroup.code);
          console.log(defaultVal);
          if (defaultVal !== undefined) {
            seteconomicGroupSelect(defaultVal);
          }
        } else {
          seteconomicGroupSelect(gruposEconomicos[0])
        }
        setActividadEmpresaSet(resp.economicActivity);
        if (actividadEmpresa.length > 0 && resp.economicActivity !== null && actividadEmpresaSelect === undefined) {
          defaultVal = actividadEmpresa.find(x => x.value === resp.economicActivity.code);
          if (defaultVal !== undefined) {
            setActividadEmpresaSelect(defaultVal);
          }
        }
        else {
          setActividadEmpresaSelect(actividadEmpresa[0]);
        }
      }
      catch (err) { }
    }).catch((error) => {

    });
    apiBack.consultEnvironmentalAspectsIGR(locationData.transactionId).then(resp => {
      setdatosAmbientales(resp.environmentalAspectsDTO)
    }).catch((error) => {

    });
  }

  function handleSubmit(event, errors, values) {
    event.preventDefault();
    // if (errors.length > 0) {
    //   console.log('form is invalid');
    //   return;
    // }
    if (event.target.id !== 'formCreditProposal') {
      return;
    }
    setFormValid(true);
    // setLoading(true);
    // const date = dateFormat(new Date(), "yyyy-mm-dd");
    values.minimumProvisionSIB = Number(values.minimumProvisionSIB)
    const data = Object.assign({
      country: countrySelect != undefined ? countrySelect.value : '',
      countryRisk: countryRiskSelect != undefined ? countryRiskSelect.value : '',
      economicGroupName: economicGroupSelect != undefined ? economicGroupSelect.label : '',
      // economicGroupNumber: economicGroup ? economicGroup.value : '',
      activityCompany: actividadEmpresaSelect != undefined ? actividadEmpresaSelect.value : '',
      revision: listaRevisionSet ? listaRevisionSet.value : '',
      preapproval: preapprovalSwitch,
      relatedPart: relatedPartSwitch,
    }, values);

    propCredService.guardarDatosGenerales(context.instanceId, context.requestId, data)
      .then((response) => {
        console.log('datos generales save success', response);
      })
      .catch((error) => {
        console.log('error saving datos generales', error);
      });
  }

  function handleDropdownChange(name, event) {
    switch (name) {
      case 'country':
        setCountry(event);
        break;
      case 'countryRisk':
        setCountryRisk(event);
        break;
      case 'economicGroupName':
        setEconomicGroup(event);
        break;
      case 'activityCompany':
        setActivityCompany(event);
        break;
      default:
      // do nothing
    }
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
    <AvForm id="formCreditProposal" className="needs-validation" onSubmit={handleSubmit}>

      <h5>{props.title}</h5>
      <p className="card-title-desc"></p>

      <Row>

        <Col md="3">
          <AvGroup>
            <Label htmlFor="transactId">{t("Procedure Number")}</Label>
            <AvField
              className="form-control"
              name="transactId"
              type="number"
              onKeyPress={(e) => { return check(e) }}
              min={0}
              id="transactId"
              value={transactId}
              readOnly />
          </AvGroup>
        </Col>

        <Col md="3">
          <AvGroup>
            <Label htmlFor="customerNumber">{t("Customer ID")}</Label>
            <AvField
              className="form-control"
              name="customerNumber"
              type="number"
              onKeyPress={(e) => { return check(e) }}
              min={0}
              readOnly
              id="customerNumber"
              value={datosIGR != null ? datosIGR.customerNumberT24 : ""}
              validate={{
                required: { value: true, errorMessage: c("Required") }
              }} />
          </AvGroup>
        </Col>

        <Col md="3">
          <Label htmlFor="revisionType">{t("Revision Type")}</Label>
          <Select noOptionsMessage={() => ""}
            onChange={(e) => { setlistaRevisionSelect(listaRevision.find(x => x.value === e.value)); setlistaRevisionSet(e); }}
            options={listaRevision}
            id="revision"
            classNamePrefix="select2-selection"
            placeholder={t("Select")}
            value={listaRevisionSelect}
          />

        </Col>

        <Col md="3">
          <Label htmlFor="preapproval">{t("Pre Approved")}</Label>
          {/* <AvGroup>
            <AvField
              className="form-control"
              name="preapproval"
              type="select"
              id="preapproval"
              value={preapproval}>
              <option value={true}>{c("Yes")}</option>
              <option value={false}>{c("No")}</option>
            </AvField>
          </AvGroup> */}
          <AvGroup check className="mb-3">
            <Switch name="preapproval"
              uncheckedIcon={<Offsymbol />}
              checkedIcon={<OnSymbol />}
              onColor="#007943"
              className="form-label"
              onChange={() => {
                setpreapprovalSwitch(!preapprovalSwitch)
              }}
              checked={preapprovalSwitch}
            />
          </AvGroup>
        </Col>

        <Col md="6">
          <Label htmlFor="economicGroupName">{t("Economic Group Name")}</Label>
          <Select noOptionsMessage={() => ""}
            id="economicGroupName"
            name="economicGroupName"
            onChange={(e) => { seteconomicGroupSelect(gruposEconomicos.find(x => x.value === e.value)); handleDropdownChange('economicGroupName', e); }}
            options={gruposEconomicos}
            classNamePrefix="select2-selection"
            value={economicGroupSelect} />
        </Col>

        <Col md="6">
          <AvGroup>
            <Label htmlFor="economicGroupNumber">{t("Economic Group Number")}</Label>
            <AvField
              className="form-control"
              name="economicGroupNumber"
              type="text"
              id="economicGroupNumber"
              value={economicGroupSelect != undefined ? economicGroupSelect.value : ''}
              validate={{
                required: { value: true, errorMessage: c("Validation.Required") }
              }}
            />
          </AvGroup>
        </Col>

        <Col md="6">
          <Label htmlFor="country">{t("Country Class")}</Label>
          <Select noOptionsMessage={() => ""}
            id="country"
            name="country"
            onChange={(e) => { setCountrySelect(paises.find(x => x.value === e.value)); handleDropdownChange('country', e) }}
            placeholder={t("Select")}
            options={paises}
            classNamePrefix="select2-selection"
            value={countrySelect}
          />
          {/* <AvFeedback>{c("Validation.Required")}</AvFeedback> */}
        </Col>

        <Col md="6">
          <AvGroup>
            <Label htmlFor="riskClassification">{t("Risk Assesment")}</Label>
            <AvField
              className="form-control"
              name="riskClassification"
              type="text"
              readOnly
              id="riskClassification"
              value={datosAmbientales != null ? datosAmbientales.riskPreClassification : "1"}
            // value="1"
            />
          </AvGroup>
        </Col>

        <Col md="6">
          <Label htmlFor="activityCompany">{t("Company Activity")}</Label>
          <Select noOptionsMessage={() => ""}
            name="activityCompany"
            onChange={(e) => { setActividadEmpresaSelect(actividadEmpresa.find(x => x.value === e.value)); setActividadEmpresaSet(e); }}
            placeholder={t("Selectcompanyactivity")}
            options={actividadEmpresa}
            classNamePrefix="select2-selection"
            value={actividadEmpresaSelect}
            isDisabled={true} />
        </Col>



        <Col md="6">
          <AvGroup>
            <Label htmlFor="minimumProvisionSIB">{t("SIB Minimum Provision")}</Label>
            <AvField
              className="form-control"
              name="minimumProvisionSIB"
              type="text"
              id="minimumProvisionSIB"
              validate={{
                required: { value: true, errorMessage: c("Validation.Required") },
                number: { value: true, errorMessage: c("Validation.Numeric") },
              }}
              value={minimumProvisionSIB} />
          </AvGroup>
        </Col>

        <Col md="3">
          <Label htmlFor="relatedPart">{t("Related Part")}</Label>
          {/* <AvGroup>
            <AvField
              className="form-control"
              name="relatedPart"
              type="select"
              id="relatedPart"
              value={relatedPart}>
              <option value={true}>{c("Yes")}</option>
              <option value={false}>{c("No")}</option>
            </AvField>
          </AvGroup> */}
          <AvGroup check className="mb-3">
            <Switch name="relatedPart"
              uncheckedIcon={<Offsymbol />}
              checkedIcon={<OnSymbol />}
              onColor="#007943"
              className="form-label"
              onChange={() => {
                setrelatedPartSwitch(!relatedPartSwitch)
              }}
              checked={relatedPartSwitch}
            />
          </AvGroup>
        </Col>


        <Col md="3">
          <AvGroup>
            <Label htmlFor="approvalLevel">{t("Approval Level")}</Label>
            <AvField
              className="form-control"
              name="approvalLevel"
              type="select"
              id="approvalLevel"
              value={approvalLevel}>
              <option value="1">Nivel 1</option>
              <option value="2">Nivel 2</option>
              <option value="3">Nivel 3</option>
            </AvField>
          </AvGroup>
        </Col>

        <Col md="9">
          <AvGroup>
            <Label htmlFor="accountExecutive">{t("Account Executive")}</Label>
            <AvField
              className="form-control"
              name="accountExecutive"
              type="text"
              id="accountExecutive"
              value={accountExecutive}
              validate={{
                required: { value: true, errorMessage: c("Validation.Required") }
              }} />
          </AvGroup>
        </Col>

        <Col md="6">
          <AvGroup>
            <Label htmlFor="responsibleUnit">{t("Responsible Unit")}</Label>
            <AvField
              className="form-control"
              name="responsibleUnit"
              type="text"
              id="responsibleUnit"
              value={responsibleUnit}
              validate={{
                required: { value: true, errorMessage: c("Validation.Required") }
              }} />
          </AvGroup>
        </Col>

        <Col md="6">
          <Label htmlFor="countryRisk">{t("Country Risk")}</Label>
          <Select noOptionsMessage={() => ""} required
            onChange={(e) => { setCountryRiskSelect(paises.find(x => x.value === e.value)); handleDropdownChange('countryRisk', e) }}
            defaultValue={paisesRiesgo.value}
            placeholder={t("Selectacountry")}
            options={paisesRiesgo}
            classNamePrefix="select2-selection"
            value={countryRiskSelect} />
        </Col>

      </Row>

      <Row>

        <Col md="3">
          <AvGroup>
            <Label htmlFor="requestDate">{t("Application Date")}</Label>

            <Flatpickr
                id="requestDate"
                name="requestDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: requestDate !== undefined ? new Date(moment(requestDate, 'YYYY-MM-DD').format()) : new Date()
                }}
                //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                />

          </AvGroup>
        </Col>

        <Col md="3">
          <AvGroup>
            <Label htmlFor="lastRequestDate">{t("Last Application Date")}</Label>

            <Flatpickr
                id="lastRequestDate"
                name="lastRequestDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: lastRequestDate !== undefined ? new Date(moment(lastRequestDate, 'YYYY-MM-DD').format()) : new Date()
                }}
                //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                />

          </AvGroup>
        </Col>

        <Col md="3">
          <AvGroup>
            <Label htmlFor="nextRevisionDate">{t("Next Revision Date")}</Label>

            <Flatpickr
                id="nextRevisionDate"
                name="nextRevisionDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: nextRevisionDate !== undefined ? new Date(moment(nextRevisionDate, 'YYYY-MM-DD').format()) : new Date()
                }}
                //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                />

          </AvGroup>
        </Col>

        <Col md="3">
          <AvGroup>
            <Label htmlFor="proposedExpirationDate">{t("Expiration Date")}</Label>

            <Flatpickr
                id="proposedExpirationDate"
                name="proposedExpirationDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: proposedExpirationDate !== undefined ? new Date(moment(proposedExpirationDate, 'YYYY-MM-DD').format()) : new Date()
                }}
                //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                />

          </AvGroup>
        </Col>

        <Col md="3">
          <AvGroup>
            <Label htmlFor="flow">{t("Flow Type")}</Label>
            <AvField
              className="form-control"
              name="flow"
              type="select"
              id="flow"
              value={flow}>
              <option value="1">Normal</option>
              <option value="2">Urgente</option>
            </AvField>
          </AvGroup>
        </Col>

      </Row>

    </AvForm>
  );

});

FormCreditProposal.propTypes = {
  values: PropTypes.object
};

FormCreditProposal.defaultProps = {
  values: {}
};


export default FormCreditProposal;
