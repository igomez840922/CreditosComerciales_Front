import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Label
} from "reactstrap"

import { FormGroup } from '@material-ui/core';

const GeneralSection = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  const { proposal, client, economicGroup, risk, accountExecutive, responsibleUnit } = props.proposal;

  const fields = [
    { id: 'proposalId', label: t("Procedure Number"), value: proposal.id },
    { id: 'clientNumber', label: t("Client Number"), value: client.number },
    { id: 'revisionType', label: t("Revision Type"), value: proposal.revisionType },
    { id: 'preapproved', label: t("Pre Approved"), value: proposal.preapproved ? c("Yes") : c("No") },
    { id: 'economicGroupNumber', label: t("Economic Group Number"), value: economicGroup.number },
    { id: 'economicGroupName', label: t("Economic Group Name"), value: economicGroup.name },
    { id: 'countryClass', label: t("Country Class"), value: risk.countryClass },
    { id: 'companyActivity', label: t("Company Activity"), value: economicGroup.business },
    { id: 'riskAssesment', label: t("Risk Assesment"), value: risk.classification },
    { id: 'sibMinimumProvision', label: t("SIB Minimum Provision"), value: proposal.minSib },
    { id: 'relatedPart', label: t("Related Part"), value: proposal.relatedPart ? c("Yes") : c("No") },
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



  const fieldCols = fields.map((field) => {
    return (<Col key={ field.id } md={ field.cols || 3 } className="mt-2">
        <FormGroup>
          <Label htmlFor={ field.id }>{ field.label }</Label>
          <div>{ field.value }</div>
        </FormGroup>
      </Col>);
  });

  return (
    <Card>
      <CardBody>
        <h4 className="card-title">{ c("General Data") }</h4>
        <p className="card-title-desc"></p>
        <Row>
          { fieldCols }
        </Row>
      </CardBody>
    </Card>
  );
};

GeneralSection.propTypes = {
  proposal: PropTypes.object
};

export default GeneralSection;
