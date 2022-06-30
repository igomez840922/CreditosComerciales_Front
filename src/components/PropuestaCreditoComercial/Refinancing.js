import PropTypes from 'prop-types';
import { translationHelper, formatCurrency, formatDate } from '../../helpers';


import {
  Table,
  Row,
  Col
} from "reactstrap"
import React from 'react';


const Refinancing = (props) => {

  if( !props.items ) {
    return null;
  }

  const dataRows = props.items.map((item, index) => (
    <tr key={'row-' + index}>
      <td>{ item.cliente.nombre }</td>
      <td>{ item.facilidad.nombre }</td>
      <td className="text-end">{ formatCurrency('$', item.prestamo, 0 ) }</td>
      <td>{ item.status }</td>
      <td>{ item.clasificacion }</td>
      <td className="text-end">{ formatCurrency('$', item.monto, 0 ) }</td>
      <td className="text-end">{ formatCurrency('$', item.saldo, 0 ) }</td>
      <td className="text-end">{ formatCurrency('$', item.cuota, 0 ) }</td>
      <td className="text-end">{ formatCurrency('$', item.capital, 0 ) }</td>
      <td className="text-end">{ formatCurrency('$', item.interest, 0 ) }</td>
      <td className="text-end">{ formatCurrency('$', item.otherCharges, 0 ) }</td>
      <td>{ formatDate(item.fechaVencimiento, 'dd-mmm-yyyy') }</td>
      <td>{ item.refi }</td>
    </tr>)
  );

  const t = translationHelper('commercial_credit');

  return (
    <React.Fragment>
      <h5>{props.title}</h5>
        <p className="card-title-desc">
        </p>
        <Row>
          <Col lg="12 text-end">
            <div className="table-responsive">
            <Table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>{ t("Debtor") }</th>
                  <th>{ t("Facility") }</th>
                  <th>{ t("Loan") }</th>
                  <th>{ t("Status") }</th>
                  <th>{ t("Classification") }</th>
                  <th className="text-end">{ t("Original Amount") }</th>
                  <th className="text-end">{ t("Balance") }</th>
                  <th className="text-end">{ t("Fee") }</th>
                  <th className="text-end">{ t("Capital") }</th>
                  <th className="text-end">{ t("Interest") }</th>
                  <th className="text-end">{ t("Other Charges") }</th>
                  <th>{ t("Expiration Date Facility") }</th>
                  <th>{ t("Refi") }</th>
                </tr>
              </thead>
              <tbody>
                {dataRows}
              </tbody>
            </Table>
          </div>
          </Col>
        </Row>
    </React.Fragment>
  );
};

Refinancing.propTypes = {
  items: PropTypes.array
};

Refinancing.defaultProps = {
  items: []
};

export default Refinancing;
