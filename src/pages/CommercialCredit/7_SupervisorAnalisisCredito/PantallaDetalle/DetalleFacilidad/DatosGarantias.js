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

const DatosGarantias = (props) => {

    var dataGuarantee = [
        { guaranteeType: 'Casa', commercialValue: 200000, quickSaleValue:180000,appraisalDate:"25/03/2021",trustNumber:"AA0023",fiduciary:"Fiduciaria"},
        { guaranteeType: 'Casa', commercialValue: 200000, quickSaleValue:180000,appraisalDate:"25/03/2021",trustNumber:"AA0023",fiduciary:"Fiduciaria"},
        { guaranteeType: 'Casa', commercialValue: 200000, quickSaleValue:180000,appraisalDate:"25/03/2021",trustNumber:"AA0023",fiduciary:"Fiduciaria"},
      ];    
      
    const dataGuaranteeRows = dataGuarantee.map((item, index) => (
        <tr key={'row-' + index}>
          <th>{item.guaranteeType}</th>
          <td className="text-end">{ item.commercialValue }</td>
          <td className="text-end">{ item.quickSaleValue }</td>
          <td className="text-end">{ item.appraisalDate }</td>
          <td className="text-end">{ item.trustNumber }</td>
          <td className="text-end">{ item.fiduciary }</td>
        </tr>)
      );
    
      
  return (
     
    <React.Fragment>
        <Row>
        <Col md="12">
            <h4 className="card-title">{ props.t("Guarantee") }</h4>
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
                <th>{ props.t("GuaranteeType") }</th>
                <th className="text-end">{ props.t("CommercialValue") }</th>
                <th className="text-end">{ props.t("QuickSaleValue") }</th>
                <th className="text-end">{ props.t("AppraisalDate") }</th>
                <th className="text-end">{ props.t("TrustNumber") }</th>
                <th className="text-end">{ props.t("Fiduciary") }</th>
              </tr>
            </thead>
            <tbody>
              {dataGuaranteeRows}
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

{/*DatosGarantias.propTypes = {
    onSelectIdPropuesta: PropTypes.func.isRequired
}*/}

export default (withTranslation()(DatosGarantias))
