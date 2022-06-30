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

const DatosComision = (props) => {

    var data = [
        { commissionType: 'Tipo de Comisión 1', amount: 30, description: ""},
        { commissionType: 'Tipo de Comisión 2', amount: 25, description: ""},
        { commissionType: 'Tipo de Comisión 3', amount: 35, description: ""},
      ];    
      
    const dataRows = data.map((item, index) => (
        <tr key={'row-' + index}>
          <th>{item.commissionType}</th>
          <td className="text-end">{ item.amount }</td>
          <td className="text-end">{ item.description }</td>
        </tr>)
      );
    
  
  return (
     
    <React.Fragment>
        <Row>
        <Col md="12">
            <h4 className="card-title">{ props.t("Commission") }</h4>
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
                <th>{ props.t("CommissionType") }</th>
                <th className="text-end">{ props.t("Amount") }%</th>
                <th className="text-end">{ props.t("Description") }</th>
              </tr>
            </thead>
            <tbody>
              {dataRows}
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

{/*DatosGenerales.propTypes = {
    onSelectIdPropuesta: PropTypes.func.isRequired
}*/}

export default (withTranslation()(DatosComision))
