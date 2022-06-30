import { translationHelper } from '../../../../helpers/translation-helper';

import {
  Row,
  Col,
  Label,
} from "reactstrap"

import { AvField, AvGroup } from "availity-reactstrap-validation"
import React from 'react';


const LegalDocumentationSection = (props) => {

  const t = translationHelper('commercial_credit');

  return (
    <React.Fragment>
      <h5>{ t("LegalDocumentation") }</h5>
    
    <Row>
      <Col md="12">
        <AvGroup className="mb-3">
          
          <AvField
            className="form-control"
            name="legalDocumentation"
            value={props.dataSet.legalDocumentation}
            type="textarea"
            id="legalDocumentation"
            rows="4" />
        </AvGroup>
      </Col>
    </Row>
    </React.Fragment>
  );
};

export default LegalDocumentationSection;
