import React, { useState } from "react"
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Table,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

//i18n
import { withTranslation } from "react-i18next"

const Facilidades = (props) => {
    
    var data = [
        {
            customername:'Ruben Oscar',
            facilitytype:'Prestamo Hipotecario Comercial',
            proposaltype:'Nueva',
            approvedRisk: 0,
            balance: 0,
            proposedRisk: 129000,
            variation: 129000
          },
          {
            customername:'Ruben Oscar',
            facilitytype:'Prestamo Hipotecario Comercial',
            proposaltype:'Nueva',
            approvedRisk: 0,
            balance: 0,
            proposedRisk: 129000,
            variation: 129000
          },
          {
            customername:'Ruben Oscar',
            facilitytype:'Prestamo Hipotecario Comercial',
            proposaltype:'Nueva',
            approvedRisk: 0,
            balance: 0,
            proposedRisk: 129000,
            variation: 129000
          },
        
      ];    
      
    const dataRows = data.map((item, index) => (
        <tr key={'row-' + index}>
          <th scope="row">{item.customername}</th>
          <td className="text-end">{ item.facilitytype }</td>
          <td className="text-end">{ item.proposaltype }</td>
          <td className="text-end">{ item.approvedRisk }</td>
          <td className="text-end">{ item.proposedRisk }</td>
          <td className="text-end">{item.variation}</td>
          <td style={{textAlign:"right"}}>
                    <Button type="button" color="link" className="btn btn-link" onClick={() => props.onSelectFacilidad()} ><i className="mdi mdi-eye mdi-16px"></i>{" "}</Button>
              </td>
        </tr>)
      );
      
  return (
     
    <CardBody>
        <h4 className="card-title">{ props.t("FacilitiesList") }</h4>
        <p className="card-title-desc"></p>
        <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-end"></th>
                <th className="text-end">{ props.t("FacilityType") }</th>
                <th className="text-end">{ props.t("ProposalType") }</th>
                <th className="text-end">{ props.t("ApprovedRisk") }</th>
                <th className="text-end">{ props.t("ProposedRisk") }</th>
                <th className="text-end">{ props.t("Variation") }</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataRows}
            </tbody>
          </Table>
        </div>
      </CardBody>    
    
  );

}

Facilidades.propTypes = {
  onSelectFacilidad: PropTypes.func.isRequired
}

export default (withTranslation()(Facilidades))
