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

const DatosDesembolso = (props) => {

    var dataDisbursement = [
        { disbursementType: 'Tipo de Desembolso 1', description: ""},
        { disbursementType: 'Tipo de Desembolso 2', description: ""},
        { disbursementType: 'Tipo de Desembolso 3', description: ""},
      ];    
      
    const dataDisbursementRows = dataDisbursement.map((item, index) => (
        <tr key={'row-' + index}>
          <th>{item.disbursementType}</th>
          <td className="text-end">{ item.description }</td>
        </tr>)
      );
    
      var dataPaymentProgram = [
        { paymentType: 'Tipo de Pago 1', description: ""},
        { paymentType: 'Tipo de Pago 2', description: ""},
        { paymentType: 'Tipo de Pago 3', description: ""},
      ];    
      
    const dataPaymentProgramRows = dataPaymentProgram.map((item, index) => (
        <tr key={'row-' + index}>
          <th>{item.paymentType}</th>
          <td className="text-end">{ item.description }</td>
        </tr>)
      );

      var dataDisbursementForm = [
        { disbursementForm: 'Forma de Desembolso 1', description: ""},
        { disbursementForm: 'Forma de Desembolso 2', description: ""},
        { disbursementForm: 'Forma de Desembolso 3', description: ""},
      ];    
      
    const dataDisbursementFormRows = dataDisbursementForm.map((item, index) => (
        <tr key={'row-' + index}>
          <th>{item.disbursementForm}</th>
          <td className="text-end">{ item.description }</td>
        </tr>)
      );
  
  return (
     
    <React.Fragment>
        <Row>
        <Col md="12">
            <h4 className="card-title">{ props.t("Disbursements") }</h4>
        </Col>        
        </Row>
     
      <Row>
        <Col md="12">
<AvForm id="frmSearch" className="needs-validation">
<Row>
        <Col md="12">
        <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>{ props.t("DisbursementDeadlines") }</th>
                <th className="text-end">{ props.t("Description") }</th>
              </tr>
            </thead>
            <tbody>
              {dataDisbursementRows}
            </tbody>
          </Table>
        </div>
        </Col>             
      </Row>
      
</AvForm>

        </Col>               
      </Row>

      <Row>
        <Col md="12">
            <br></br>
        </Col>        
        </Row>
     
      <Row>
        <Col md="12">
<AvForm id="frmSearch" className="needs-validation">
<Row>
        <Col md="12">
        <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>{ props.t("PaymentProgram") }</th>
                <th className="text-end">{ props.t("Description") }</th>
              </tr>
            </thead>
            <tbody>
              {dataPaymentProgramRows}
            </tbody>
          </Table>
        </div>
        </Col>             
      </Row>
      
</AvForm>

        </Col>               
      </Row>

      <Row>
        <Col md="12">
        <br></br>
        </Col>        
        </Row>
     

      <Row>
        <Col md="12">
<AvForm id="frmSearch" className="needs-validation">
<Row>
        <Col md="12">
        <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>{ props.t("DisbursementForm") }</th>
                <th className="text-end">{ props.t("Description") }</th>
              </tr>
            </thead>
            <tbody>
              {dataDisbursementFormRows}
            </tbody>
          </Table>
        </div>
        </Col>             
      </Row>
      
</AvForm>

        </Col>               
      </Row>
      
      </React.Fragment>
    
    
  );

}

{/*DatosDesembolso.propTypes = {
    onSelectIdPropuesta: PropTypes.func.isRequired
}*/}

export default (withTranslation()(DatosDesembolso))
