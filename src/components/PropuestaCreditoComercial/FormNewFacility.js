import React, { useContext, useState, useEffect, useRef } from "react"
import PropTypes from 'prop-types'
import { translationHelpers } from '../../helpers';
import { Link, useLocation } from "react-router-dom"
import {
  Button,
  Row,
  Col,
} from "reactstrap"
import { AvForm } from "availity-reactstrap-validation"
import CustomerSection from "./facilities/modalNewFacility/CustomerSection";
import ProposalSection from "./facilities/modalNewFacility/ProposalSection"
import InterestRateSection from "./facilities/modalNewFacility/InterestRateSection"
import CommissionSection from "./facilities/modalNewFacility/CommissionSection"
import TermsSection from "./facilities/modalNewFacility/TermsSection"
import DisbursementSection from "./facilities/modalNewFacility/DisbursementSection"
import WarrantsSection from "./facilities/modalNewFacility/WarrantsSection"
import SuretiesSection from "./facilities/modalNewFacility/SuretiesSection"
import FinancialConditionsSection from "./facilities/modalNewFacility/FinancialConditionsSection"
import LtvSection from "./facilities/modalNewFacility/LtvSection"
import AmbientalRiskSection from "./facilities/modalNewFacility/AmbientalRiskSection"
import FinantialCovenantSection from "./facilities/modalNewFacility/FinantialCovenantSection"
import LegalDocumentationSection from "./facilities/modalNewFacility/LegalDocumentationSection"
import ProvisionSection from "./facilities/modalNewFacility/ProvisionSection"
import CreditRiskSection from "./facilities/modalNewFacility/CreditRiskSection"
import OtherConditionsSection from "./facilities/modalNewFacility/OtherConditionsSection"
import { BackendServices, CoreServices } from "../../services";
import CreditProposalContext from "./CreditProposalContext";


const FormNewFacility = React.forwardRef((props, ref) => {
  const [dataSet, setdataSet] = useState({
    "requestId": "XYZ892022",
    "cr": "",
    "amount": 0,
    "debtor": "",
    "clientTypeId": 0,
    "balance": 0,
    "proposalTypeId": "",
    "proposalTypeName": "",
    "facilityTypeId": "",
    "purpose": "",
    "sublimits": "",
    "proposalRate": 0,
    "noSubsidyRate": 0,
    "effectiveRate": 0,
    "feci": true,
    "termDays": 0,
    "termDescription": "",
    "ltv": 0,
    "finantialConditions": "",
    "environmentRiskCategory": 0,
    "covenant": "",
    "environmentRiskOpinion": "",
    "finantialCovenant": "",
    "legalDocumentation": "",
    "creditRiskOpinion": "",
    "provision": "",
    "numero": "",
    "otherConditions": "",
  });

  const [dataValidation, setdataValidation] = useState({
    tipoPropuestaRequerido: false,
    subPropuestaRequerido: false,
    tipoFacilidadRequerido: false,
  });

  const context = useContext(CreditProposalContext);
  const propostalSectionRef = useRef();
  const [formValid, setFormValid] = useState(false);

  const location = useLocation();
  const [dataLocation, setData] = useState(location.data);
  const [commissions, setCommissions] = useState([]);
  const [disbursementTerms, setDisbursementTerms] = useState([]);
  const [paymentPrograms, setPaymentPrograms] = useState([]);
  const [disbursementMethods, setDisbursementMethods] = useState([]);
  const [warrants, setWarrants] = useState([]);
  const [sureties, setSureties] = useState([]);
  const [otherconditions, setOtherconditions] = useState([]);
  const [t, c] = translationHelpers('commercial_credit', 'common');
  React.useImperativeHandle(ref, () => ({
    submit: (validate = true) => {
      const form = document.getElementById('formNewFacility');
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
  // services
  const backendServices = new BackendServices();

  useEffect(() => {
    // Read Api Service Data
    const { transactionId } = context;
    backendServices.consultPrincipalDebtor(transactionId).then(resp => {
      dataSet.numero = resp.clientDocId
      setdataSet(dataSet);
    });
    backendServices.consultFacilidadPropCred(12, "XYZ432022").then(resp => {
      if (resp != undefined) {
        dataSet.cr = resp.cr;
        dataSet.amount = resp.amount;
        dataSet.debtor = resp.debtor;
        dataSet.clientTypeId = resp.clientTypeId;
        dataSet.balance = resp.balance;
        dataSet.proposalTypeId = resp.proposalTypeId;
        dataSet.proposalTypeName = resp.proposalTypeName;
        dataSet.facilityTypeId = resp.facilityTypeId;
        dataSet.purpose = resp.purpose;
        dataSet.sublimits = resp.sublimits;
        dataSet.proposalRate = resp.proposalRate;
        dataSet.noSubsidyRate = resp.noSubsidyRate;
        dataSet.effectiveRate = resp.effectiveRate;
        dataSet.feci = resp.feci;
        dataSet.termDays = resp.termDays;
        dataSet.termDescription = resp.termDescription;
        dataSet.ltv = resp.ltv;
        dataSet.finantialConditions = resp.finantialConditions;
        dataSet.environmentRiskCategory = resp.environmentRiskCategory;
        dataSet.covenant = resp.covenant;
        dataSet.environmentRiskOpinion = resp.environmentRiskOpinion;
        dataSet.finantialCovenant = resp.finantialCovenant;
        dataSet.legalDocumentation = resp.legalDocumentation;
        dataSet.creditRiskOpinion = resp.creditRiskOpinion;
        dataSet.provision = resp.provision;
        dataSet.otherConditions = resp.provision;
        setdataSet(dataSet);
      }
    })
  }, []);

  function handleSubmit(event, errors, values) {
    if (propostalSectionRef.current.dataReturn.proposalTypeId == null) {
      dataValidation.tipoPropuestaRequerido = true;
      setdataValidation(dataValidation);
      return;
    } else {
      values.proposalTypeId = propostalSectionRef.current.dataReturn.proposalTypeId;
      dataValidation.tipoPropuestaRequerido = false;
      setdataValidation(dataValidation);
    }
    if (propostalSectionRef.current.dataReturn.proposalTypeName == null) {
      dataValidation.subPropuestaRequerido = true;
      setdataValidation(dataValidation);
      return;
    } else {
      values.proposalTypeName = propostalSectionRef.current.dataReturn.proposalTypeName;
      dataValidation.subPropuestaRequerido = false;
      setdataValidation(dataValidation);
    }
    if (propostalSectionRef.current.dataReturn.facilityTypeId == null) {
      dataValidation.tipoFacilidadRequerido = true;
      setdataValidation(dataValidation);
      return;
    } else {
      values.facilityTypeId = propostalSectionRef.current.dataReturn.facilityTypeId;
      dataValidation.tipoFacilidadRequerido = false;
      setdataValidation(dataValidation);
    }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    if (event.target.id !== 'formNewFacility') {
      return;
    }
    values.amount = Number(values.amount);
    values.clientTypeId = Number(1);
    values.balance = Number(values.balance);
    values.proposalRate = Number(values.proposalRate);
    values.noSubsidyRate = Number(values.noSubsidyRate);
    values.effectiveRate = Number(values.effectiveRate);
    values.feci = values.feci == "true" ? true : false;
    values.termDays = Number(values.termDays);
    values.environmentRiskCategory = Number(values.environmentRiskCategory);
    console.log('submit new facility', values);
    saveNewFacility(values)
      .then((result) => {
        // props.onSave(values);
        props.onDismiss();
      });
  }

  function saveNewFacility(values) {
    const { requestId } = context;
    const data = Object.assign({
      requestId
    }, values);
    return backendServices.newFacilityPropCred(data);
  }

  function handleCancel() {
    props.onDismiss();
  }

  function handleNewCommission(newItem) {
    const newCommissions = [...commissions, newItem];
    setCommissions(newCommissions);
  }

  function handleDeleteCommission(item) {
    const itemIndex = commissions.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newCommissions = [...commissions];
    newCommissions.splice(itemIndex, 1);
    setCommissions(newCommissions);
  }

  function handleNewDisbursementTerm(newItem) {
    const newDisbursementTerms = [...disbursementTerms, newItem];
    setDisbursementTerms(newDisbursementTerms);
  }

  function handleDeleteDisbursementTerm(item) {
    const itemIndex = disbursementTerms.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newDisbursementTerms = [...disbursementTerms];
    newDisbursementTerms.splice(itemIndex, 1);
    setDisbursementTerms(newDisbursementTerms);
  }

  function handleNewPaymentProgram(newItem) {
    const newPaymentPrograms = [...paymentPrograms, newItem];
    setPaymentPrograms(newPaymentPrograms);
  }

  function handleDeletePaymentProgram(item) {
    const itemIndex = paymentPrograms.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newPaymentPrograms = [...paymentPrograms];
    newPaymentPrograms.splice(itemIndex, 1);
    setPaymentPrograms(newPaymentPrograms);
  }

  function handleNewDisbursementMethod(newItem) {
    const newDisbursementMethods = [...disbursementMethods, newItem];
    setDisbursementMethods(newDisbursementMethods);
  }

  function handleDeleteDisbursementMethod(item) {
    const itemIndex = disbursementMethods.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newDisbursementMethods = [...disbursementMethods];
    newDisbursementMethods.splice(itemIndex, 1);
    setDisbursementMethods(newDisbursementMethods);
  }

  function handleNewWarrant(newItem) {
    const newWarrants = [...warrants, newItem];
    setWarrants(newWarrants);
  }

  function handleDeleteWarrant(item) {
    const itemIndex = warrants.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newWarrants = [...warrants];
    newWarrants.splice(itemIndex, 1);
    setWarrants(newWarrants);
  }

  function handleNewSurety(newItem) {
    const newSureties = [...sureties, newItem];
    setSureties(newSureties);
  }

  function handleDeleteSurety(item) {
    console.log('delete surety', item);
    const itemIndex = sureties.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newSureties = [...sureties];
    newSureties.splice(itemIndex, 1);
    setSureties(newSureties);
  }

  function handleNewOtherCondition(newItem) {
    const newOtherConditions = [...otherconditions, newItem];
    setOtherconditions(newOtherConditions);
  }

  return (
    <React.Fragment>
      <h5>{t("Facility")}</h5>
      <p className="card-title-desc"></p>

      <AvForm id="formNewFacility" className="needs-validation" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md="12">
            <CustomerSection dataLocation={dataLocation} validation={dataValidation} dataSet={dataSet} identificationList={props.identificationList} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <ProposalSection validation={dataValidation} dataSet={dataSet} ref={propostalSectionRef} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <InterestRateSection validation={dataValidation} dataSet={dataSet} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <CommissionSection validation={dataValidation} dataSet={dataSet} items={commissions}
              onSaveItem={handleNewCommission}
              onDeleteItem={handleDeleteCommission} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <TermsSection validation={dataValidation} dataSet={dataSet} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <DisbursementSection validation={dataValidation} dataSet={dataSet} disbursementTerms={disbursementTerms}
              onSaveDisbursementTerm={handleNewDisbursementTerm}
              onDeleteDisbursementTerm={handleDeleteDisbursementTerm}
              paymentPrograms={paymentPrograms}
              onSavePaymentProgram={handleNewPaymentProgram}
              onDeletePaymentProgram={handleDeletePaymentProgram}
              disbursementMethods={disbursementMethods}
              onSaveDisbursementMethod={handleNewDisbursementMethod}
              onDeleteDisbursementMethod={handleDeleteDisbursementMethod} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <WarrantsSection validation={dataValidation} dataSet={dataSet} warrants={warrants}
              onSaveItem={handleNewWarrant}
              onDeleteItem={handleDeleteWarrant} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <LtvSection validation={dataValidation} dataSet={dataSet} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <SuretiesSection validation={dataValidation} dataSet={dataSet} sureties={sureties}
              onSaveItem={handleNewSurety}
              onDeleteItem={handleDeleteSurety} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <FinancialConditionsSection validation={dataValidation} dataSet={dataSet} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <AmbientalRiskSection validation={dataValidation} dataSet={dataSet} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <FinantialCovenantSection validation={dataValidation} dataSet={dataSet} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <LegalDocumentationSection validation={dataValidation} dataSet={dataSet} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <OtherConditionsSection validation={dataValidation} dataSet={dataSet} otherconditions={otherconditions} onSaveOtherConditions={handleNewOtherCondition} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <CreditRiskSection validation={dataValidation} dataSet={dataSet} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="12">
            <ProvisionSection validation={dataValidation} dataSet={dataSet} />
          </Col>
        </Row>

        <Row className="my-2">
          <Col xl="12 text-end">
            <Link to="#" className="btn btn-dark"
              onClick={handleCancel} style={{ margin: '5px' }}>
              {c("Cancel")}
            </Link>
            <Button className="btn btn-primary" type="submit" color="success" style={{ margin: '5px' }}>
              {c("Save")}
            </Button>
          </Col>
        </Row>
      </AvForm>

    </React.Fragment>
  )
});

FormNewFacility.propTypes = {
  isOpen: PropTypes.bool,
  onDismiss: PropTypes.func,
  onSave: PropTypes.func
};


export default FormNewFacility;
