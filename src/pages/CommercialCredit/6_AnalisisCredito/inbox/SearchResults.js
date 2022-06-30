import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';
import { Link } from "react-router-dom"

import {
  Table,
  Row,
  Col,
  Button
} from "reactstrap"
import React from 'react';


const SearchResults = (props) => {

  const [t, c] = translationHelpers('credit_analysis', 'common');

  if (!props.items) {
    return null;
  }

  const dataRows = props.items.map((item, index) => (
    <tr key={'row-' + item.id}>
      <th>{ (index+1) }</th>
      <td>{ item.date }</td>
      <td>{ item.bank.name }</td>
      <td>{ item.proposal.type }</td>
      <td>{ item.analyst.name }</td>
      <td>{ item.status }</td>
      <td>{ item.preapproved ? c('Yes') : c('No') }</td>
      <td>{ item.client.name }</td>
      <td style={{textAlign:"right"}}>
        <Link to={ "asignar/" + item.id }>{ c("Assign") }</Link> | <Link to={ "ver/" + item.id }>{ c("Open") }</Link>
      </td>
    </tr>)
  );

  return (
      <Row>
        <Col lg="12">
        <h4 className="card-title">{ c("Results") }</h4>
        <p className="card-title-desc"></p>
        <div className="table-responsive">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{ t("Order") }</th>
                    <th>{ t("Date") }</th>
                    <th>{ t("Bank") }</th>
                    <th>{ t("Proposal Type") }</th>
                    <th>{ t("Analyst") }</th>
                    <th>{ t("Status") }</th>
                    <th>{ t("Pre Approved") }</th>
                    <th>{ t("Client") }</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  { dataRows }
                </tbody>
              </Table>
            </div>

        </Col>
      </Row>

  );
};


SearchResults.propTypes = {
  items: PropTypes.array.isRequired,
};

export default SearchResults;
