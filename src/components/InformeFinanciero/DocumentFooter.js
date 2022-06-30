import PropTypes from 'prop-types';
import { translationHelper } from '../../helpers/translation-helper';

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap"



const DocumentFooter = (props) => {

  const t = translationHelper('financial_report');

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
                    <th width="33.3%">{ t("Code") }</th>
                    <th>{ t("Date") }</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{ props.document.owner ? props.document.owner.name : '' }</td>
                    <td>{ props.document.code ? props.document.code : '' }</td>
                    <td>{ props.document.date ? props.document.date : '' }</td>
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

DocumentFooter.propTypes = {
  document: PropTypes.object.isRequired
};

export default DocumentFooter;
