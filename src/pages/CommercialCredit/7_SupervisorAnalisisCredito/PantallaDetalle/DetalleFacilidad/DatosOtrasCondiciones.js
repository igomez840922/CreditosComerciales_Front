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

const DatosOtrasCondiciones = (props) => {

    var data = [
        { conditionType: 'Contrato Marco de Factoraje con recurso y administración', description: "Para las instituciones de gobierno o empresas estatales (Se solicita eliminar) / Cesión de Contrato a favor de Banesco para empresas privadas"},
        { conditionType: 'Contrato Marco de Factoraje con recurso y administración', description: "Para las instituciones de gobierno o empresas estatales (Se solicita eliminar) / Cesión de Contrato a favor de Banesco para empresas privadas"},
      ];    
      
    const dataRows = data.map((item, index) => (
        <tr key={'row-' + index}>
          <th>{item.conditionType}</th>
          <td className="text-end">{ item.description }</td>
        </tr>)
      );
    
  
  return (
     
    <React.Fragment>
        <Row>
        <Col md="12">
            <h4 className="card-title">{ props.t("OtherConditions") }</h4>
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
                <th>{ props.t("ConditionType") }</th>
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

{/*DatosOtrasCondiciones.propTypes = {
    onSelectIdPropuesta: PropTypes.func.isRequired
}*/}

export default (withTranslation()(DatosOtrasCondiciones))
