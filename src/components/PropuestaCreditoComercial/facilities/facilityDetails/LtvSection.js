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


const LtvSection = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  const facility = props.facility;


  return (
    <Card>
      <CardHeader>
        <h5>{ t("LTV") }</h5>
      </CardHeader>
      <CardBody>
        <Row>
          <label htmlFor="ltv" className="col-sm-3 col-form-label">{ t("LTV") }</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="ltv" value={ facility.ltv } readOnly />
          </div>
        </Row>
      </CardBody>
    </Card>
  );
};

LtvSection.propTypes = {
  facility: PropTypes.object.isRequired
};

export default LtvSection;
