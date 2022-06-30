/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

//i18n
import { withTranslation } from "react-i18next"

const DatosTasa = (props) => {

  
  return (
     
    <React.Fragment>
        <Row>
        <Col md="12">
            <h4 className="card-title">{ props.t("RateDetail") }</h4>
        </Col>        
        </Row>
     
      <Row>
        <Col md="12">
<AvForm id="frmSearch" className="needs-validation">
      <Row>
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="proposalType">{ props.t("Amount") }</Label>
            <AvField
              className="form-control"
              name="amount"
              type="text"
              id="amount" value="200" disabled={true}/>
          </div>
        </Col>     
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="rateWithoutSubsidy">{ props.t("RateWithoutSubsidy") }</Label>
            <AvField
              className="form-control"
              name="rateWithoutSubsidy"
              type="text"
              id="rateWithoutSubsidy" value="20" disabled={true}/>
          </div>
        </Col>     
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="effectiveRate">{ props.t("EffectiveRate") }</Label>
            <AvField
              className="form-control"
              name="effectiveRate"
              type="text"
              id="effectiveRate" value="20" disabled={true}/>
          </div>
        </Col>     
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="feci">{ props.t("Feci") }</Label>
            <AvField
              className="form-control"
              name="feci"
              type="text"
              id="feci" value="Si" disabled={true}/>
          </div>
        </Col>     
      </Row>      
</AvForm>

        </Col>               
      </Row>
      
      </React.Fragment>
    
    
  );

}

{/*DatosTasa.propTypes = {
    onSelectIdPropuesta: PropTypes.func.isRequired
}*/}

export default (withTranslation()(DatosTasa))
