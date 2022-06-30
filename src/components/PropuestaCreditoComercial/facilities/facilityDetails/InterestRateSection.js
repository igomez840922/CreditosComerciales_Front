import React from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';

import {
  Row,
  Col,
  Label,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap"


const InterestRateSection = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');
  const facility = props.facility;

  return (

    <Card>
      <CardHeader>
        <h5>{ t("Proposed Interest Rate") }</h5>
      </CardHeader>
      <CardBody>
        <Row>
          <label htmlFor="interestRateAmount" className="col-sm-3 col-form-label">{ t("Amount") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="interestRateAmount" value={ facility.tasaInteresPropuesta + '%' } readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="interestRateNoSubsidy" className="col-sm-3 col-form-label">{ t("Rate without Subsidy") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="interestRateNoSubsidy" value={ facility.tasaInteresSinSubsidio + '%' } readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="interestRateEffective" className="col-sm-3 col-form-label">{ t("Effective Interest Rate") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="interestRateEffective" value={ facility.tasaInteresEfectiva + '%' } readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="feci" className="col-sm-3 col-form-label">{ t("FECI") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="feci" value={ facility.feci ? c("Yes") : c("No") } readOnly />
          </div>
        </Row>
      </CardBody>
    </Card>
  );

};

InterestRateSection.propTypes = {
  facility: PropTypes.object.isRequired
};

export default InterestRateSection;
