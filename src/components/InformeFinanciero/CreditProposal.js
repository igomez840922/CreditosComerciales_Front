import PropTypes from 'prop-types';
import { translationHelpers } from '../../helpers/translation-helper';
import { formatCurrency } from '../../helpers';

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap"



const CreditProposal = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  if (!props.products) {
    return null;
  }

  const dataRows = props.products.map((product, index) => (
    <tr key={'row-' + product.id}>
      <th>{product.product}</th>
      <td>{product.debtor.name}</td>
      <td>{product.rate}%</td>
      <td>{product.safi}</td>
      <td className="text-end">{formatCurrency('$', product.currentApprovedRisk, 0)}</td>
      <td className="text-end">{formatCurrency('$', product.usedBalance, 0)}</td>
      <td className="text-end">{formatCurrency('$', product.proposedRisk, 0)}</td>
    </tr>)
  );

  return (
    // <Card>
    <CardBody>
      <h4 className="card-title">{t("Credit Proposal")}</h4>
      <p className="card-title-desc"></p>
      <Row>
        <Col lg="12">
          <div className="table-responsive">
            <Table className="table mb-0">
              <thead className="table-light">
                <tr key='Proposal'>
                  <th>{t("Product")}</th>
                  <th>{t("Debtor")}</th>
                  <th>{t("Rate")}</th>
                  <th>{t("SAFI Classification")}</th>
                  <th className="text-end">{t("Current Approved Risk")}</th>
                  <th className="text-end">{t("Used Balance")}</th>
                  <th className="text-end">{t("Proposed Risk")}</th>
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
    // </Card>
  );
};

CreditProposal.propTypes = {
  products: PropTypes.array
};

export default CreditProposal;
