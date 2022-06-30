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

const DatosPropuesta = (props) => {

  
  return (
     
    <React.Fragment>
        <Row>
        <Col md="12">
            <h4 className="card-title">{ props.t("ProposalDetail") }</h4>
        </Col>        
        </Row>
     
      <Row>
        <Col md="12">
<AvForm id="frmSearch" className="needs-validation">
      <Row>
        <Col md="6">
          <div className="mb-3">
            <Label htmlFor="proposalType">{ props.t("ProposalType") }</Label>
            <AvField
              className="form-control"
              name="proposalType"
              type="text"
              id="proposalType" value="Refinanciamiento" disabled={true}/>
          </div>
        </Col>     
        <Col md="6">
          <div className="mb-3">
            <Label htmlFor="proposalSubType">{ props.t("ProposalSubType") }</Label>
            <AvField
              className="form-control"
              name="proposalSubType"
              type="text"
              id="proposalSubType" value="Disminución de Ventas" disabled={true}/>
          </div>
        </Col>     
      </Row>
      <Row>
        <Col md="12">
          <div className="mb-3">
            <Label htmlFor="facilityType">{ props.t("FacilityType") }</Label>
            <AvField
              className="form-control"
              name="facilityType"
              type="text"
              id="facilityType" value="Préstamo Comercial Decreciente Reestructurado" disabled={true}/>
          </div>
        </Col>             
      </Row>
      <Row>
        <Col md="12">
          <div className="mb-3">
            <Label htmlFor="purpose">{ props.t("Purpose") }</Label>
            <AvField
              className="form-control"
              name="purpose"
              type="text"
              id="purpose" value="Utilizable para todo tipo de cartas de crédito, cobranzas, pago a proveedores, adelantos y capital de trabajo." disabled={true}/>
          </div>
        </Col>             
      </Row>
      <Row>
        <Col md="12">
          <div className="mb-3">
            <Label htmlFor="subLimit">{ props.t("SubLimit") }</Label>
            <AvField
              className="form-control"
              name="subLimit"
              type="text"
              id="subLimit" value="Sub-límite de Sobregiro Contratado hasta $3MM." disabled={true}/>
          </div>
        </Col>             
      </Row>
</AvForm>

        </Col>               
      </Row>
      
      </React.Fragment>
    
    
  );

}

{/*DatosGenerales.propTypes = {
    onSelectIdPropuesta: PropTypes.func.isRequired
}*/}

export default (withTranslation()(DatosPropuesta))
