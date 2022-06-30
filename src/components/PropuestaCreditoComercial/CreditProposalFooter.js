import PropTypes from 'prop-types';
import { translationHelper } from '../../helpers';

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap"



const CreditProposalFooter = (props) => {

  const t = translationHelper('commercial_credit');

  return (
    <Card>
      <CardBody>
        <Row className="mt-2">
          <Col lg="12">
            <div className="table-responsive">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th width="33.3%">{ t("Document Owner") }</th>
                    <th width="33.3%">{ t("Relationships Manager") }</th>
                    <th>{ t("Sector Manager") }</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{ props.authors.owner ? props.authors.owner.name : '' }</td>
                    <td>{ props.authors.relationshipsManager ? props.authors.relationshipsManager.name : '' }</td>
                    <td>{ props.authors.sectorManager ? props.authors.relationshipsManager.sectorManager : '' }</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg="12">
            <div className="table-responsive">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th width="25%">{ t("CEO") }</th>
                    <th width="25%">{ t("VP Credit and Central Services") }</th>
                    <th width="25%">{ t("VP Business / International") }</th>
                    <th width="25%">{ t("VP Credit") }</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{ props.authors.ceo ? props.authors.ceo.name : '' }</td>
                    <td>{ props.authors.vpCredit ? props.authors.vpCredit.sectorManager : '' }</td>
                    <td>{ props.authors.vpBusiness ? props.authors.vpBusiness.name : '' }</td>
                    <td>{ props.authors.vpCredit ? props.authors.vpCredit.name : '' }</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );

};

CreditProposalFooter.propTypes = {
  authors: PropTypes.object.isRequired
};

export default CreditProposalFooter;
