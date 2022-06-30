import React from 'react';
import { translationHelper } from '../../../../helpers';

import {
  Row,
  Col,
  Label,
} from "reactstrap"

import { AvField, AvGroup } from "availity-reactstrap-validation"


const TermsSection = (props) => {

  const t = translationHelper('commercial_credit');

  return (
    <React.Fragment>
      <h5>{t("Terms")}</h5>
      <Row>
        <Col md="12">
          <AvGroup className="mb-3">
            <Label htmlFor="termDays">{t("Term in days")}</Label>
            <AvField
              className="form-control"
              name="termDays"
              value={props.dataSet.termDays}
              type="numeric"
              id="termDays" />
          </AvGroup>
          <AvGroup className="mb-3">
            <Label htmlFor="termsDescription">{t("Terms Description")}</Label>
            <AvField
              className="form-control"
              name="termDescription"
              type="textarea"
              id="termDescription"
              value={props.dataSet.termDescription}
              rows="4" />
          </AvGroup>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default TermsSection;
