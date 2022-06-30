import PropTypes from 'prop-types';
import { useTranslation, withTranslation } from "react-i18next"
import React, { useEffect, useState } from "react"

import {
  Row,
  Col,
  Label,
  Card,
  CardBody,
  Button,
} from "reactstrap"

import { FormGroup } from '@material-ui/core';
import { BackendServices, CoreServices, BpmServices, } from "../../services";
import { useLocation, useHistory, Link } from 'react-router-dom'
import ModalCreditProposal from "../../pages/CommercialCredit/7_SupervisorAnalisisCredito/ModalSupervisor/ModalCreditProposal";
import HeaderSections from '../Common/HeaderSections';
import { translationHelpers, formatCurrency } from '../../helpers';
import ModalPrevisualizarPropCred from '../../pages/CommercialCredit/5_PropuestaCredito/previsualizarPropCred';
import ModalPrevicualizarIGR from "../../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/previsualizarIGR";

const GeneralSection = (props) => {

  const { t, i18n } = useTranslation();

  const { proposal, client, economicGroup, risk, accountExecutive, responsibleUnit } = props.proposal ?? { proposal: '', client: '', economicGroup: '', risk: '', accountExecutive: '', responsibleUnit: '' };
  const location = useLocation();
  const [dataLocation, setDataLocation] = useState(location.data)
  const fields = [
    { id: 'proposalId', label: t("Procedure Number"), value: proposal.id },
    { id: 'clientNumber', label: t("Client Number"), value: client.number },
    { id: 'revisionType', label: t("Revision Type"), value: proposal.revisionType },
    { id: 'preapproved', label: t("Pre Approved"), value: proposal.preapproved ? t("Yes") : t("No") },
    { id: 'economicGroupNumber', label: t("Economic Group Number"), value: economicGroup.number },
    { id: 'economicGroupName', label: t("Economic Group Name"), value: economicGroup.name },
    { id: 'countryClass', label: t("Country Class"), value: risk.countryClass },
    { id: 'companyActivity', label: t("Company Activity"), value: economicGroup.business },
    { id: 'riskAssesment', label: t("Risk Assesment"), value: risk.classification },
    { id: 'sibMinimumProvision', label: t("SIB Minimum Provision"), value: proposal.minSib },
    { id: 'relatedPart', label: t("Related Part"), value: proposal.relatedPart ? t("Yes") : t("No") },
    { id: 'approvalLevel', label: t("Approval Level"), value: proposal.approvalLevel },
    { id: 'accountExecutive', label: t("Account Executive"), value: accountExecutive.name },
    { id: 'responsibleUnit', label: t("Responsible Unit"), value: responsibleUnit.name },
    { id: 'countryRisk', label: t("Country Risk"), value: risk.countryRisk },
    { id: 'flowType', label: t("Flow Type"), value: proposal.flowType },
    { id: 'applicationDate', label: t("Application Date"), value: proposal.applicationDate },
    { id: 'lastApplicationDate', label: t("Last Application Date"), value: proposal.lastApplicationDate },
    { id: 'nextRevisionDate', label: t("Next Revision Date"), value: proposal.nextRevisionDate },
    { id: 'proposalExpirationDate', label: t("Proposal Expiration Date"), value: proposal.expirationDate },
  ];

  const [ShowModelCreditProposal, setShowModelCreditProposal] = useState(false);
  const [ModalPreviewdata, settoogleModalPreview] = useState(false);

  React.useEffect(() => {
    let dataSession;
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setDataLocation(location.data);
        dataSession = location.data;
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setDataLocation(result);
        dataSession = result;
      }
    }
   
  }, []);


  const fieldCols = fields.map((field) => {
    return (<Col key={field.id} md={field.cols || 3} className="mb-3">
      <FormGroup>
        <strong htmlFor={field.id}>{field.label}</strong>
        <div>{field.value}</div>
      </FormGroup>
    </Col>);
  });



  function toogleModalPreview() {
    settoogleModalPreview(!ModalPreviewdata);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }


  function toggleShowModelCreditProposal() {
    setShowModelCreditProposal(!ShowModelCreditProposal)
  }

  return (
    <>
      <CardBody>

        <Row>
          <div className="d-flex flex-row justify-content-between">
            {/* <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toogleModalPreview() }}>
                  {" "} {t("ConsultManagementReport")} <i className="mdi mdi-eye-outline mid-12px"></i></Button>

                <Button id="btnSearch" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelCreditProposal() }}>
                  {" "} {t("ConsultCreditProposal")} <i className="mdi mdi-eye-outline mid-12px"></i></Button> */}
            <Link
              style={{ margin: '5px', border: "1px", backgroundColor: "#1C8464", color: "#fff" }}
              className="btn"
              color="success"
              type="button"
              to={{
                pathname: '/creditocomercial/previsualizarIGR/' + btoa(dataLocation?.transactionId),
              }}
              target="_blank"
            >{" "} {t("ConsultManagementReport")} <i className="mdi mdi-eye mdi-12px"></i></Link>
            <Link
              style={{ margin: '5px', border: "1px", backgroundColor: "#1C8464", color: "#fff" }}
              className="btn"
              color="success"
              type="button"
              to={{
                pathname: '/creditocomercial/previsualizarPropCred/' + btoa(dataLocation?.transactionId),
              }}
              target="_blank"
            >{" "} {t("ConsultCreditProposal")} <i className="mdi mdi-eye mdi-12px"></i></Link>
            {/* <Link
              style={{ margin: '5px', border: "1px", backgroundColor: "#1C8464", color: "#fff" }}
              className="btn"
              color="success"
              type="button"
              to={{
                pathname: '/creditocomercial/previsualizarAIF/' + btoa(dataLocation?.transactionId),
              }}
              target="_blank"
            >{" "} {t("ConsultFinancialReport")} <i className="mdi mdi-eye mdi-12px"></i></Link> */}
          </div>
        </Row>



      </CardBody>
      {/* <ModalPrevicualizarIGR isOpen={ModalPreviewdata} toggle={() => { toogleModalPreview() }} /> */}
      {/* <ModalPrevisualizarPropCred isOpen={ShowModelCreditProposal} toggle={() => { toggleShowModelCreditProposal() }} /> */}
    </>
  );
};

GeneralSection.propTypes = {
  proposal: PropTypes.object
};

export default GeneralSection;
