/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Table
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

//i18n
import { withTranslation } from "react-i18next"

const DatosCondicionesFinanciera = (props) => {

    return (
     
        <React.Fragment>
            <Row>
            <Col md="12">
                <h4 className="card-title">{ props.t("FinancialConditions") }</h4>
            </Col>        
            </Row>
         
          <Row>
            <Col md="12">
    <AvForm id="frmSearch" className="needs-validation">
          <Row>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="details">{ props.t("Details") }</Label>
                <AvField
                  className="form-control"
                  name="details"
                  type="textarea" rows={7}
                  id="details" value="" disabled={true}/>
              </div>
            </Col>                 
          </Row>      
    </AvForm>
    
            </Col>               
          </Row>
          
          </React.Fragment>
        
        
      );

}

{/*DatosCondicionesFinanciera.propTypes = {
    onSelectIdPropuesta: PropTypes.func.isRequired
}*/}

export default (withTranslation()(DatosCondicionesFinanciera))
