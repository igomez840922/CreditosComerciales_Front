import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';


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

  const [t, c] = translationHelpers('environmental_risk', 'common');

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
    <React.Fragment>

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
              <Label htmlFor="preclassification">{ t("Pre Classification") }</Label>
              <AvField
                className="form-control"
                name="preclassification"
                type="select"
                id="preclassification"
                value="Todos">
                <option>Todos</option>
                <option>Bajo</option>
                <option>Medio</option>
                <option>Alto</option>
              </AvField>
            </AvGroup>
          </Col>
          <Col md="5 text-end mt-4">
            <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}>
              { c("Apply") }
            </Button>
          </Col>
        </Row>
        </AvForm>
    </React.Fragment>
    
  );
};


FormFilter.propTypes = {
  onSearch: PropTypes.func
};

export default FormFilter;
