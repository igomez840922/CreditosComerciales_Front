import { translationHelper } from '../../../../helpers/translation-helper';

import {
  Row,
  Col,
  Label,
} from "reactstrap"

import { AvField, AvGroup } from "availity-reactstrap-validation"
import React from 'react';


const AmbientalRiskSection = (props) => {

  const t = translationHelper('commercial_credit');

  return (
    <React.Fragment>
      <h5>{ t("AmbientalRisk") }</h5>
    
    <Row>
        <Col md="6">
        <AvGroup className="mb-3">
          <Label htmlFor="category">{ t("Category") }</Label>
          <AvField
            className="form-control"
            name="environmentRiskCategory"
            type="text"
            value={props.dataSet.environmentRiskCategory}
            id="environmentRiskCategory" />
        </AvGroup>
      </Col>
        <Col md="6">
        <AvGroup className="mb-3">
          <Label htmlFor="covenant">{ t("Covenant") }</Label>
          <AvField
            className="form-control"
            name="covenant"
            type="text"
            value={props.dataSet.covenant}
            id="covenant"/>
        </AvGroup>
      </Col>
      <Col md="12">
        <AvGroup className="mb-3">
          <Label htmlFor="opinion">{ t("Opinion") }</Label>
          <AvField
            className="form-control"
            name="environmentRiskOpinion"
            type="textarea"
            value={props.dataSet.environmentRiskOpinion}
            id="environmentRiskOpinion"
            rows="4" />
        </AvGroup>
      </Col>
    </Row>
    </React.Fragment>
  );
};

export default AmbientalRiskSection;
