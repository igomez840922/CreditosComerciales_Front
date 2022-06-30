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

const DatosGenerales = (props) => {

  
  return (
     
    <React.Fragment>
        <Row>
        <Col md="12">
            <h4 className="card-title">{ props.t("GeneralData") }</h4>
        </Col>        
        </Row>
     
      <Row>
        <Col md="12">
<AvForm id="frmSearch" className="needs-validation">
      <Row>
        <Col md="6">
          <div className="mb-3">
            <Label htmlFor="debtor">{ props.t("Debtor") }</Label>
            <AvField
              className="form-control"
              name="debtor"
              type="text"
              id="debtor" value="Tova, SA" disabled={true}/>
          </div>
        </Col>     
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="idType">{ props.t("ID Type") }</Label>
            <AvField
              className="form-control"
              name="idType"
              type="text"
              id="idType" value="RUC" disabled={true}/>
          </div>
        </Col>
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="idnumber">{ props.t("ID Number") }</Label>
            <AvField
              className="form-control"
              name="idnumber"
              type="text"
              id="idnumber" value="0065219-0068-00360495"  disabled={true}/>
          </div>
        </Col>           
      </Row>
      <Row>
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="amount">{ props.t("Amount") }</Label>
            <AvField
              className="form-control"
              name="amount"
              type="text"
              id="amount" value="60000000" disabled={true}/>
          </div>
        </Col>     
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="debit">{ props.t("Debit") }</Label>
            <AvField
              className="form-control"
              name="debit"
              type="text"
              id="debit" value="0.00" disabled={true}/>
          </div>
        </Col>           
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="number">{ props.t("Number") }</Label>
            <AvField
              className="form-control"
              name="number"
              type="text"
              id="number" value="321321" disabled={true}/>
          </div>
        </Col>
        <Col md="3">
          <div className="mb-3">
            <Label htmlFor="cr">{ props.t("CR") }</Label>
            <AvField
              className="form-control"
              name="cr"
              type="text"
              id="cr" value="N"  disabled={true}/>
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

export default (withTranslation()(DatosGenerales))
