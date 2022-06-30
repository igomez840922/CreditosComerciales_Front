import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next"
import { translationHelpers } from '../../../../helpers';
import { Link } from "react-router-dom"

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
  Button
} from "reactstrap"


const SearchResults = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  if (!props.items) {
    return null;
  }

  const dataRows = props.items.map((item, index) => (
    <tr key={'row-' + index}>
      <th>{ (index+1) }</th>
      <td>{ item.date }</td>
      <td>{ item.procedure }</td>
      <td>{ item.client.id }</td>
      <td>{ item.client.name }</td>
      <td>{ item.proposal.type }</td>
      <td>{ item.preclassification }</td>
      <td>{ item.classification }</td>
      <td>{ item.analyst.name }</td>
      <td>
        <Link to="/view">{ c("View") }</Link>
      </td>
    </tr>)
  );

  return (
    <Card>
      <CardBody>
        <h4 className="card-title">{ t("Results") }</h4>
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
                    <th>{ t("Client ID") }</th>
                    <th>{ t("Client Name") }</th>
                    <th>{ t("Proposal Type") }</th>
                    <th>{ t("Pre Classification") }</th>
                    <th>{ t("Classification") }</th>
                    <th>{ t("Analyst") }</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {dataRows}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

SearchResults.propTypes = {
  items: PropTypes.array.isRequired,
}

export default (withTranslation(['inbox', 'common'])(SearchResults));
