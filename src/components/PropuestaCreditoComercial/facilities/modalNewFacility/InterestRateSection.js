import React from "react"
import { translationHelpers } from '../../../../helpers';

import {
  Row,
  Col,
  Label
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"


const InterestRateSection = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla === 45) {
      e.preventDefault();
      return true;
    }

    return false;
  }

  return (
    <React.Fragment>
      <h5>{t("Proposed Interest Rate")}</h5>
      <Row>

        <Col md="3">
          <AvGroup className="mb-3">
            <Label htmlFor="proposalRate">{t("Amount")}</Label>
            <AvField
              className="form-control"
              name="proposalRate"
              min={0}
              type="number"
              onKeyPress={(e) => { return check(e) }}
              id="proposalRate"
              value={props.dataSet.proposalRate}
              max="100" />
          </AvGroup>
        </Col>

        <Col md="3">
          <AvGroup className="mb-3">
            <Label htmlFor="noSubsidyRate">{t("Rate without Subsidy")}</Label>
            <AvField
              className="form-control"
              name="noSubsidyRate"
              min={0}
              type="number"
              onKeyPress={(e) => { return check(e) }}
              id="noSubsidyRate"
              value={props.dataSet.noSubsidyRate}
              max="100" />
          </AvGroup>
        </Col>

        <Col md="3">
          <AvGroup className="mb-3">
            <Label htmlFor="effectiveRate">{t("Effective Interest Rate")}</Label>
            <AvField
              className="form-control"
              name="effectiveRate"
              value={props.dataSet.effectiveRate}
              min={0}
              type="number"
              onKeyPress={(e) => { return check(e) }}
              id="effectiveRate"
              max="100" />
          </AvGroup>
        </Col>

        <Col md="3">
          <AvGroup className="mb-3">
            <Label htmlFor="feci">{t("FECI")}</Label>
            <AvField id="feci"
              className="form-control"
              name="feci"
              type="select"
              value={props.dataSet.feci}
              required>
              <option value={true}>Si</option>
              <option value={false}>No</option>
            </AvField>
          </AvGroup>
        </Col>

      </Row>
    </React.Fragment>);

};

export default InterestRateSection;
