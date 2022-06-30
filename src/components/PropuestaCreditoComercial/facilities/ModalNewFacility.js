import React, { useState } from "react"
import PropTypes from 'prop-types'
import { translationHelpers } from '../../../helpers';

import {
  Modal,
  ModalHeader,
  ModalBody,
  TabContent,
  TabPane,
  Button
} from "reactstrap"

import { Link } from "react-router-dom"
import { AvForm } from "availity-reactstrap-validation"

import WizardSteps from "../../UI/WizardSteps";
import CustomerSection from "./modalNewFacility/CustomerSection";
import ProposalSection from "./modalNewFacility/ProposalSection"
import InterestRateSection from "./modalNewFacility/InterestRateSection"
import CommissionSection from "./modalNewFacility/CommissionSection"
import TermsSection from "./modalNewFacility/TermsSection"
import DisbursementSection from "./modalNewFacility/DisbursementSection"
import WarrantsSection from "./modalNewFacility/WarrantsSection"
import SuretiesSection from "./modalNewFacility/SuretiesSection"
import FinancialConditionsSection from "./modalNewFacility/FinancialConditionsSection"
import LtvSection from "./modalNewFacility/LtvSection"
import AmbientalRiskSection from "./modalNewFacility/AmbientalRiskSection"
import FinantialCovenantSection from "./modalNewFacility/FinantialCovenantSection"
import LegalDocumentationSection from "./modalNewFacility/LegalDocumentationSection"
import ProvisionSection from "./modalNewFacility/ProvisionSection"
import CreditRiskSection from "./modalNewFacility/CreditRiskSection"
import OtherConditionsSection from "./modalNewFacility/OtherConditionsSection"


const ModalNewFacility = (props) => {

  const [currentTab, setCurrentTab] = useState('general');
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [commissions, setCommissions] = useState([]);
  const [disbursementTerms, setDisbursementTerms] = useState([]);
  const [paymentPrograms, setPaymentPrograms] = useState([]);
  const [disbursementMethods, setDisbursementMethods] = useState([]);
  const [warrants, setWarrants] = useState([]);
  const [sureties, setSureties] = useState([]);
  const [otherconditions, setOtherconditions] = useState([]);

  const [t, c] = translationHelpers('commercial_credit', 'common');

  const modalTabs = [
    { key: 'general', label: t('General') },
    { key: 'proposal', label: t('Proposal') },
    { key: 'interest_rate', label: t('Interest Rate') },
    { key: 'commission', label: t('Commission') },
    { key: 'terms', label: t('Terms') },
    { key: 'disbursement', label: t('Disbursement') },
    { key: 'warrants', label: t('Warrants') },
    { key: 'ltv', label: t('LTV') },
    { key: 'sureties', label: t('Sureties') },
    { key: 'financialconditions', label: t('FinancialConditions') },
    { key: 'ambientalrisk', label: t('AmbientalRisk') },
    { key: 'finantialcovenant', label: t('FinantialCovenant') },
    { key: 'legaldocumentation', label: t('LegalDocumentation') },
    { key: 'otherconditions', label: t('OtherConditions') },
    { key: 'creditrisk', label: t('CreditRisk') },
    { key: 'provision', label: t('Provision') },
  ];


  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    console.log('submit new facility', values);
    props.onSave(values);
    props.toggle();
  }

  function handleCancel() {
    props.toggle();
  }

  function selectTab(key) {
    const currentItem = modalTabs.find(section => section.key === key);
    if( !currentItem ) {
      return;
    }
    const currentIndex = modalTabs.indexOf(currentItem);
    setCurrentTabIndex(currentIndex);
    setCurrentTab(currentItem.key);
  }

  function prevSection() {
    if( currentTabIndex === 0 ) {
      return;
    }
    const currentItem = modalTabs[currentTabIndex - 1];
    selectTab(currentItem.key);
  }

  function nextSection() {
    if( currentTabIndex === modalTabs.length - 1 ) {
      return;
    }
    const currentItem = modalTabs[currentTabIndex + 1];
    selectTab(currentItem.key);
  }

  function handleNewCommission(newItem) {
    const newCommissions = [...commissions, newItem];
    setCommissions(newCommissions);
  }

  function handleNewDisbursementTerm(newItem) {
    const newDisbursementTerms = [...disbursementTerms, newItem];
    setDisbursementTerms(newDisbursementTerms);
  }

  function handleNewPaymentProgram(newItem) {
    const newPaymentPrograms = [...paymentPrograms, newItem];
    setPaymentPrograms(newPaymentPrograms);
  }

  function handleNewDisbursementMethod(newItem) {
    const newDisbursementMethods = [...disbursementMethods, newItem];
    setDisbursementMethods(newDisbursementMethods);
  }

  function handleNewWarrant(newItem) {
    const newWarrants = [...warrants, newItem];
    setWarrants(newWarrants);
  }

  function handleNewSurety(newItem) {
    const newSureties = [...sureties, newItem];
    setSureties(newSureties);
  }

  function handleNewOtherCondition(newItem) {
    const newOtherConditions = [...otherconditions, newItem];
    setOtherconditions(newOtherConditions);
  }

  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === modalTabs.length - 1;

  return (
    <Modal isOpen={ props.isOpen }
      toggle={ props.toggle }
      centered={true}
      size="lg">
        <ModalHeader toggle={ props.toggle } color="primary">{ t("New Facility") }</ModalHeader>
        <ModalBody>
          <AvForm className="needs-validation" onSubmit={ handleSubmit }>
            <div className="form-wizard-wrapper wizard clearfix">
              <WizardSteps tabs={ modalTabs }
                activeTab={ currentTab }
                setActiveTab={ selectTab }
                displaySectionNumber={ false } />
              <div className="content clearfix">
                <TabContent className="body" activeTab={ currentTab }>
                  <TabPane tabId={'general'}>
                    <CustomerSection />
                  </TabPane>
                  <TabPane tabId={'proposal'}>
                    <ProposalSection />
                  </TabPane>
                  <TabPane tabId={'interest_rate'}>
                    <InterestRateSection />
                  </TabPane>
                  <TabPane tabId={'commission'}>
                    <CommissionSection items={ commissions } onSave={ handleNewCommission } />
                  </TabPane>
                  <TabPane tabId={'terms'}>
                    <TermsSection />
                  </TabPane>
                  <TabPane tabId={'disbursement'}>
                    <DisbursementSection disbursementTerms={ disbursementTerms } onSaveDisbursementTerm={ handleNewDisbursementTerm }
                      paymentPrograms={ paymentPrograms } onSavePaymentProgram={ handleNewPaymentProgram }
                      disbursementMethods={ disbursementMethods } onSaveDisbursementMethod={ handleNewDisbursementMethod } />
                  </TabPane>
                  <TabPane tabId={'warrants'}>
                    <WarrantsSection warrants={ warrants } onSaveWarrant={ handleNewWarrant }/>
                  </TabPane>
                  <TabPane tabId={'ltv'}>
                    <LtvSection/>
                  </TabPane>
                  <TabPane tabId={'sureties'}>
                    <SuretiesSection sureties={ sureties } onSaveSurety={ handleNewSurety } />
                  </TabPane>
                  <TabPane tabId={'financialconditions'}>
                    <FinancialConditionsSection/>
                  </TabPane>
                  <TabPane tabId={'ambientalrisk'}>
                    <AmbientalRiskSection/>
                  </TabPane>
                  <TabPane tabId={'finantialcovenant'}>
                    <FinantialCovenantSection/>
                  </TabPane>
                  <TabPane tabId={'legaldocumentation'}>
                    <LegalDocumentationSection/>
                  </TabPane>
                  <TabPane tabId={'otherconditions'}>
                    <OtherConditionsSection otherconditions={ otherconditions } onSaveOtherConditions={ handleNewOtherCondition }/>
                  </TabPane>
                  <TabPane tabId={'creditrisk'}>
                    <CreditRiskSection/>
                  </TabPane>

                  <TabPane tabId={'provision'}>
                    <ProvisionSection/>
                  </TabPane>

                </TabContent>
              </div>
              <div className="actions clearfix">
                <ul>
                  <li className={ "next" }>
                    <Link to="#" className="btn btn-dark"
                      onClick={ handleCancel }>
                      { c("Cancel") }
                    </Link>
                  </li>
                  <li className={ isFirstTab ? "previous disabled" : "previous" }>
                    <Link to="#" className="btn btn-primary"
                      onClick={ prevSection }>
                      { c("Previous") }
                    </Link>
                  </li>
                  <li className={ isLastTab ? "next disabled" : "next" }>
                    <Link to="#" className="btn btn-primary"
                      onClick={ nextSection }>
                      { c("Next") }
                    </Link>
                  </li>
                  <li className={ "next" }>
                    <Button to="#" className="btn btn-primary" type="submit" color="success">
                      { c("Save") }
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </AvForm>
        </ModalBody>
    </Modal>
  )
};

ModalNewFacility.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onSave: PropTypes.func
};


export default ModalNewFacility;
