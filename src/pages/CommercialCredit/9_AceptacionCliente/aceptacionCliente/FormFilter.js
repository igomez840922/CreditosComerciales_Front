import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next"
import React, { useState } from "react"


import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Label
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"


const FormFilter = (props) => {

  
  //On Mounting (componentDidMount)
  React.useEffect(() => {   
    // Read Api Service data
    props.onSubmit(null);
  }, []);
  
  function handleSubmit(event, errors, values) {
    event.preventDefault();
   
    props.onSubmit(values);
  }

  return (
    <Row>
      <Col lg="12">
      <h4 className="card-title">{props.t("ClientAcceptance")}</h4>
        <p className="card-title-desc">
          {props.t("Search Documents")}
        </p>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={ handleSubmit }>
        <Row>
          <Col md="4">
            <AvGroup className="mb-3">
            <Label htmlFor="searchfield">{props.t("Search Criteria")}</Label>
              <AvField
                className="form-control"
                name="customer"
                type="text"
                id="customer" title={props.t("Customer No., Customer Name, Identification No., No. Procedure")}/>
            </AvGroup>
          </Col>


          <Col lg="12" style={{ textAlign: "right" }}>

            <Button id="btnSave" color="success" type="submit" style={{ margin: '5px' }}>
             <i className="mdi mdi-file-find mdi-12px"></i> {props.t("Search")}
               
              </Button>
          </Col>
        </Row>
        </AvForm>
      </Col>
    </Row>
  );
};

FormFilter.propTypes = {
    onSubmit: PropTypes.func.isRequired

}

export default (withTranslation()(FormFilter));
