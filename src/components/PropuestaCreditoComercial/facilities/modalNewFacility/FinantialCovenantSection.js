import { translationHelper } from '../../../../helpers/translation-helper';

import {
  Row,
  Col,
  Label,
} from "reactstrap"

import { AvField, AvGroup } from "availity-reactstrap-validation"
import React from 'react';


const FinantialCovenantSection = (props) => {

  const t = translationHelper('commercial_credit');

  return (
    <React.Fragment>
      <h5>{ t("FinantialCovenant") }</h5>
    <Row>
      <Col md="12">
        <AvGroup className="mb-3">
          
          <AvField
            className="form-control"
            name="finantialCovenant"
            value={props.dataSet.finantialCovenant}
            type="textarea"
            id="finantialCovenant"
            rows="4" />
        </AvGroup>
      </Col>
    </Row>
</React.Fragment>
  );
};

export default FinantialCovenantSection;
