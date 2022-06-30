import React from 'react';
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';

import {
  Row,
  Col,
  Button,
  Label
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"




const FormFilter = (props) => {

  const [t, c] = translationHelpers('credit_analysis', 'common');

  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    props.onSearch(values);
  }

  return (

        <Row>
        <Col lg="12">
        <h4 className="card-title">{ c("Filters") }</h4>
        <p className="card-title-desc"></p>
        <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="4">
            <AvGroup className="mb-3">
              <Label htmlFor="analyst">{ t("Analyst Name") }</Label>
              <AvField
                className="form-control"
                name="analyst"
                type="text"
                id="analyst" />
            </AvGroup>
          </Col>
          <Col md="8 text-end mt-4">
            <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}>
              { c("Apply") }
            </Button>
          </Col>
        </Row>
        </AvForm>
        </Col>
        </Row>

  );
};

FormFilter.propTypes = {
  onSearch: PropTypes.func
};

export default FormFilter;
