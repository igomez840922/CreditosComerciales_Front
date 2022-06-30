import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';

import {
  Row,
  Col,
  Table,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap"


const CommissionSection = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  const facility = props.facility;


  return (
    <Card>
      <CardHeader>
        <h5>{ t("Commission") }</h5>
      </CardHeader>
      <CardBody>
        <Row>
          <label htmlFor="commissionType" className="col-sm-3 col-form-label">{ t("Commission Type") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="commissionType" value={ facility.comision.type } readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="amount" className="col-sm-3 col-form-label">{ t("Amount") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="amount" value={ facility.comision.amount } readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="description" className="col-sm-3 col-form-label">{ t("Description") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="description" value={ facility.comision.description } readOnly />
          </div>
        </Row>
      </CardBody>
    </Card>
  );
};

CommissionSection.propTypes = {
  facility: PropTypes.object.isRequired
};

export default CommissionSection;
