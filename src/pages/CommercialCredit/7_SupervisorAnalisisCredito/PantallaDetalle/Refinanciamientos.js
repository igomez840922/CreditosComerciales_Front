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

const Refinanciamientos = (props) => {

    
    var data = [
        {
            customername:'Ruben Oscar',
            facility: 'LCR',
            loan: 309000260,
            status: 'Moroso',
            classification: 'Mencion Especial',
            amount: 480000,
            balance: 480000,
            fee: 502449,
            capital: 480000,
            interest: 22499,
            otherCharges: 0,
            expirationDate: '07/09/2020',
            refi: 'Mayo - Junio 2020'
          },
          {
            customername:'Ruben Oscar',
            facility: 'LCR',
            loan: 309000260,
            status: 'Moroso',
            classification: 'Mencion Especial',
            amount: 480000,
            balance: 480000,
            fee: 502449,
            capital: 480000,
            interest: 22499,
            otherCharges: 0,
            expirationDate: '07/09/2020',
            refi: 'Mayo - Junio 2020'
          },
          {
            customername:'Ruben Oscar',
            facility: 'LCR',
            loan: 309000260,
            status: 'Moroso',
            classification: 'Mencion Especial',
            amount: 480000,
            balance: 480000,
            fee: 502449,
            capital: 480000,
            interest: 22499,
            otherCharges: 0,
            expirationDate: '07/09/2020',
            refi: 'Mayo - Junio 2020'
          },
        
      ];    
      
    const dataRows = data.map((item, index) => (
        <tr key={'row-' + index}>
          <th scope="row">{item.customername}</th>
          <td className="text-end">{ item.facility }</td>
          <td className="text-end">{ item.loan }</td>
          <td className="text-end">{ item.status }</td>
          <td className="text-end">{ item.classification }</td>
          <td className="text-end">{item.amount}</td>
          <td className="text-end">{item.balance}</td>
          <td className="text-end">{item.fee}</td>
          <td className="text-end">{item.capital}</td>
          <td className="text-end">{item.interest}</td>
          <td className="text-end">{item.otherCharges}</td>
          <td className="text-end">{item.expirationDate}</td>
          <td className="text-end">{item.refi}</td>
        </tr>)
      );
      
  return (
     
    <CardBody>
        <h4 className="card-title">{ props.t("Refinancing") }</h4>
        <p className="card-title-desc"></p>
        <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-end"></th>
                <th className="text-end">{ props.t("Facility") }</th>
                <th className="text-end">{ props.t("Loan") }</th>
                <th className="text-end">{ props.t("Status") }</th>
                <th className="text-end">{ props.t("Classification") }</th>
                <th className="text-end">{ props.t("Amount") }</th>
                <th className="text-end">{ props.t("CurrentBalance") }</th>
                <th className="text-end">{ props.t("Fee") }</th>
                <th className="text-end">{ props.t("Capital") }</th>
                <th className="text-end">{ props.t("Interest") }</th>
                <th className="text-end">{ props.t("OtherCharges") }</th>
                <th className="text-end">{ props.t("ExpirationDate") }</th>
                <th className="text-end">{ props.t("Refi") }</th>
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


{/*DatosGenerales.propTypes = {
    onSelectIdPropuesta: PropTypes.func.isRequired
}*/}

export default (withTranslation()(Refinanciamientos))
