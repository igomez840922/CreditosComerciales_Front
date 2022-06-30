import PropTypes from 'prop-types';
import { translationHelpers } from "../../../../helpers"
import { Link } from "react-router-dom"

import {
  Table,
  Card,
  CardBody,
  Row,
  Col
} from "reactstrap"


const SearchResults = (props) => {

  const [t, c] = translationHelpers('environmental_risk', 'common');

  if (!props.items) {
    return null;
  }

  const dataRows = props.items.map((item, index) => (
    <tr key={'row-' + item.id}>
      <th>{ item.order }</th>
      <td>{ item.date }</td>
      <td>{ item.procedure }</td>
      <td>{ item.client.id }</td>
      <td>{ item.client.name }</td>
      <td>{ item.economicGroup }</td>
      <td>{ item.autonomy }</td>
      <td>{ item.facilityType }</td>
      <td>{ item.proposalType }</td>
      <td>
        <Link to={ "ver/" + item.id }>{ c("View") }</Link>
      </td>
    </tr>)
  );

  return (
    
    <Row>
      <Col lg="12">
      <h4 className="card-title">{ c("Results") }</h4>
        <p className="card-title-desc"></p>
        <Row>
          <Col lg="12">
            <div className="table-responsive">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{ t("Order") }</th>
                    <th>{ t("Date") }</th>
                    <th>{ t("Procedure #") }</th>
                    <th>{ t("Client Number") }</th>
                    <th>{ t("Client Name") }</th>
                    <th>{ t("Economic Group") }</th>
                    <th>{ t("Autonomy") }</th>
                    <th>{ t("Facility Type") }</th>
                    <th>{ t("Proposal Type") }</th>
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
      </Col>
    </Row>
  );
};


SearchResults.propTypes = {
  items: PropTypes.array.isRequired,
}

export default SearchResults;
