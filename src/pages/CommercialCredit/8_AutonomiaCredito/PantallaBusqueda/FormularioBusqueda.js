import React, { useState } from "react"
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,  
  FormGroup,
  InputGroup,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const FormularioBusqueda = (props) => {

  //On Mounting (componentDidMount)
  React.useEffect(() => {   
    // Read Api Service data
    props.onSubmit(null);
  }, []);

  function handleSubmit(event, errors, values) {
    event.preventDefault();
    /*if (errors.length > 0) {
      return;
    }*/
    props.onSubmit(values);
  }
  
  return (
    <Row>
      <Col lg="12">
      <h4 className="card-title">{props.t("CreditAutonomy")}</h4>
        <p className="card-title-desc">
          {props.t("Search Documents")}
        </p>
        <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
          <Row>
            <Col lg="4">
              <div className="mb-3">
                <Label htmlFor="searchfield">{props.t("Search Criteria")}</Label>
                <AvField
                  className="form-control"
                  type="text"
                  name="searchfield"
                  id="searchfield"
                  title={props.t("Customer No., Customer Name, Identification No., No. Procedure")}
                                  />
              </div>              
            </Col>              
          </Row>
          <Row>
            <Col lg="12" style={{ textAlign: "right" }}>
              <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}>
                {props.t("Search")}
              </Button>
            </Col>
          </Row>
        </AvForm>
      </Col>
    </Row>);

};

FormularioBusqueda.propTypes = {
  onSubmit: PropTypes.func.isRequired, //Submitimos la forma para buscar IGRs
}

export default (withTranslation()(FormularioBusqueda));
