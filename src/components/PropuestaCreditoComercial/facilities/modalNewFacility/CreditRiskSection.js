import { translationHelper } from '../../../../helpers/translation-helper';

import {
  Row,
  Col,
  Label,
} from "reactstrap"

import { AvField, AvGroup } from "availity-reactstrap-validation"
import React from 'react';


const CreditRiskSection = (props) => {

  const t = translationHelper('commercial_credit');

  return (
    <React.Fragment>
      <h5>{ t("CreditRisk") }</h5>
    <Row>
      <Col md="12">
        <AvGroup className="mb-3">
          <Label htmlFor="creditrisk">{ t("Opinion") }</Label>
          <AvField
            className="form-control"
            name="creditRiskOpinion"
            type="textarea"
            value={props.dataSet.creditRiskOpinion}
            id="creditRiskOpinion"
            rows="4" />
        </AvGroup>
      </Col>
    </Row>
    </React.Fragment>
  );
};

export default CreditRiskSection;
