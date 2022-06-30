import React from "react"
import PropTypes from 'prop-types';

import { formatCurrency, translationHelper } from '../../../../helpers';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap'


const ProposalSection = (props) => {

  const t = translationHelper('commercial_credit');
  const facility = props.facility;

  return (
    <Card>
      <CardHeader>
        <h5>{ t("Proposal") }</h5>
      </CardHeader>
      <CardBody>
        <Row>
          <label htmlFor="proposalType" className="col-sm-3 col-form-label">{ t("Proposal Type") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="proposalType" value={ facility.propuesta.type } readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="subproposalType" className="col-sm-3 col-form-label">{ t("SubProposal Type") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="subproposalType" value={ facility.propuesta.subtype } readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="facilityType" className="col-sm-3 col-form-label">{ t("Facility Type") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="facilityType" value={ facility.facilidad.type } readOnly />
          </div>
        </Row>
      </CardBody>
    </Card>
  );

}

export default ProposalSection;
