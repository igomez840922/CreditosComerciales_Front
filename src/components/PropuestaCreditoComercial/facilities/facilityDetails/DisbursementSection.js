import React from "react"
import { PropTypes } from 'prop-types';
import { translationHelper } from '../../../../helpers';

import {
  Row,
  Col,
  Table,
} from "reactstrap"


const PaymentProgramsSection = (props) => {

  const t = translationHelper('commercial_credit');
  const facility = props.facility;

  const termRows = facility.plazosDesembolso.map((item, index) => {
    return (<tr key={ 'row-disbursement-term-' + index }>
      <td>{ item.type }</td>
      <td>{ item.description }</td>
    </tr>)
  });

  const paymentRows = facility.pagos.map((item, index) => {
    return (<tr key={ 'row-payments-' + index }>
      <td>{ item.type }</td>
      <td>{ item.description }</td>
    </tr>)
  });

  const methodRows = facility.metodosDesembolso.map((item, index) => {
    return (<tr key={ 'row-disbursement-method-' + index }>
      <td>{ item.method }</td>
      <td>{ item.description }</td>
    </tr>)
  });

  return (
    <React.Fragment>

      <Row className="mb-3">
        <Col xl="12">
          <h5>{ t("Disbursement Terms") }</h5>
          <Table className="table" responsive>
            <thead className="table-light">
              <tr>
                <th>{ t("Disbursement Type") }</th>
                <th>{ t("Description") }</th>
              </tr>
            </thead>
            <tbody>
              {termRows}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xl="12">
          <h5>{ t("Payment Program") }</h5>
          <Table className="table" responsive>
            <thead className="table-light">
              <tr>
                <th>{ t("Payment Program Type") }</th>
                <th>{ t("Description") }</th>
              </tr>
            </thead>
            <tbody>
              {paymentRows}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xl="12">
          <h5>{ t("Disbursement Method") }</h5>
          <Table className="table" responsive>
            <thead className="table-light">
              <tr>
                <th>{ t("Disbursement Method") }</th>
                <th>{ t("Description") }</th>
              </tr>
            </thead>
            <tbody>
              {methodRows}
            </tbody>
          </Table>
        </Col>
      </Row>

    </React.Fragment>
  );
};

PaymentProgramsSection.propTypes = {
  facility: PropTypes.object.isRequired
};

export default PaymentProgramsSection;
