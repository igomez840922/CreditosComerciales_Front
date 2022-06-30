import React, { useState } from "react"
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Button,
  Label,
  InputGroup,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
const IgrFormularioBusqueda = (props) => {
  //On Mounting (componentDidMount)
  React.useEffect(() => {
    // Read Api Service data
    props.onSubmit(null);
  }, []);
  // Submitimos formulario para busqueda de IGRs
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    props.onSubmit(values);
  }
  return (
    <React.Fragment>
      <h4 className="card-title">{props.t("CreditProposal")}</h4>
      <p className="card-title-desc">
        {props.t("Search Documents")}
      </p>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="searchfield">{props.t("Search Criteria")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
                title={props.t("Customer No., Customer Name, Identification No.")}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="form-group mb-3">
              <Label>{props.t("From")}</Label>
              <InputGroup>
                <Flatpickr
                  className="form-control d-block"
                  placeholder="dd/MM/yyyy"
                  options={{
                    dateFormat: "d/m/Y",
                  }}
                  name="dateFrom"
                  id="dateFrom"
                />
              </InputGroup>
            </div>
          </Col>
          <Col md="3">
            <div className="form-group mb-3">
              <Label>{props.t("To")}</Label>
              <InputGroup>
                <Flatpickr
                  className="form-control d-block"
                  placeholder="dd/MM/yyyy"
                  options={{
                    dateFormat: "d/m/Y",
                  }}
                  name="dateTo"
                  id="dateTo"
                />
              </InputGroup>
            </div>
          </Col>
          <Col md="3">
            <div className="form-group mb-3">
              <Label htmlFor="sla">{props.t("SLA")}</Label>
              <AvField
                className="form-control"
                name="sla"
                type="select"
                id="sla"
                value="Todos">
                <option>Todos</option>
                <option>Atraso</option>
                <option>Por Vencer</option>
                <option>A Tiempo</option>
              </AvField>
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

    </React.Fragment>
  );

};

IgrFormularioBusqueda.propTypes = {
  onSubmit: PropTypes.func.isRequired, //Submitimos la forma para buscar
}
export default (withTranslation()(IgrFormularioBusqueda));
