import React from "react"
import { PropTypes } from 'prop-types';
import { translationHelper } from '../../../../helpers';

import {
  Row,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap"


const TermsSection = (props) => {

  const t = translationHelper('commercial_credit');
  const facility = props.facility;

  return (
    <Card>
      <CardHeader>
        <h5>{ t("Terms") }</h5>
      </CardHeader>
      <CardBody>
        <Row>
          <label htmlFor="termDays" className="col-sm-3 col-form-label">{ t("Term in days") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="termDays" value={ facility.terminos.days } readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="termsDescription" className="col-sm-3 col-form-label">{ t("Terms Description") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="termsDescription" value={ facility.terminos.description } readOnly />
          </div>
        </Row>
      </CardBody>
    </Card>
  );
};

TermsSection.propTypes = {
  facility: PropTypes.object.isRequired
};

export default TermsSection;
