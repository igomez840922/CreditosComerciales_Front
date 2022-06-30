import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';

import {
  Table,
  Card,
  CardBody,
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

  function handleSelect(analyst) {
    console.log('select analyst', analyst);
  }

  const dataRows = props.items.map((item, index) => (
    <tr key={'row-' + index}>
      <th>{ (index+1) }</th>
      <td>{ item.name }</td>
      <td>{ item.taskCount }</td>
      <td style={{textAlign:"right"}}>
        <Button color="link"  className="btn btn-link" style={{ margin: '5px' }} onClick={ () => { handleSelect(item) }}>{ c("Select") }</Button>
      </td>
    </tr>)
  );

  return (

      <Row>
        <Col lg="12">
        <h4 className="card-title">{ c("Results") }</h4>
        <div className="table-responsive">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{ t("Order") }</th>
                    <th>{ t("Analyst Name") }</th>
                    <th>{ t("Task Count") }</th>
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
}

export default SearchResults;
