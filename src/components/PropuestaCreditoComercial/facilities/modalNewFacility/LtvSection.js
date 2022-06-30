import { translationHelper } from '../../../../helpers';

import {
  Row,
  Col,
  Label,
} from "reactstrap"

import { AvField, AvGroup } from "availity-reactstrap-validation"
import React from 'react';


const LtvSection = (props) => {

  const t = translationHelper('commercial_credit');

  return (
    <React.Fragment>
      <h5>{ t("LTV")}</h5>
    <Row>
      <Col md="12">
        <AvGroup className="mb-3">
          <AvField
            className="form-control"
            name="ltv"
            value={props.dataSet.ltv}
            type="text"
            id="ltv" />
        </AvGroup>
      </Col>
    </Row>
    </React.Fragment>
  );
};

export default LtvSection;
