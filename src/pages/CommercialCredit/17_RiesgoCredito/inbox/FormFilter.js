import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from "../../../../helpers/translation-helper"

import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Label
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"



const FormFilter = (props) => {

  const [t, c] = translationHelpers('credit_risk', 'common');

   //On Mounting (componentDidMount)
   React.useEffect(() => {   
    // Read Api Service data
    props.onSearch(null);
  }, []);

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
            <Label htmlFor="searchfield">{t("Search Criteria")}</Label>
              <AvField
                className="form-control"
                name="client"
                type="text"
                id="client" />
            </AvGroup>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="preclassification">{ t("Proposal Type") }</Label>
              <AvField
                className="form-control"
                name="proposalType"
                type="select"
                id="proposalType"
                value="Todos">
                <option>Todos</option>
                <option>Analisis</option>
              </AvField>
            </AvGroup>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="facilityType">{ t("Facility Type") }</Label>
              <AvField
                className="form-control"
                name="facilityType"
                type="select"
                id="facilityType"
                value="Todos">
                <option>Todos</option>
                <option>Línea de Crédito Rotativa</option>
              </AvField>
            </AvGroup>
          </Col>
          <Col md="2 text-end mt-4">
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
