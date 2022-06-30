import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';

import {
  Row,
  Col,
  Table,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap"


const WarrantsSection = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  const facility = props.facility;

  const dataRows = facility.garantias.map((item, index) => {
    return (<tr key={ 'row-warrant-' + index }>
      <td>{ item.type }</td>
      <td className="text-end">{ item.commercialValue }</td>
      <td className="text-end">{ item.quickVValue }</td>
      <td>{ item.description }</td>
      <td className="text-end">{ item.ltv }</td>
      <td>{ item.appraisalDate }</td>
      <td>{ item.signature }</td>
      <td>{ item.escrow }</td>
      <td>{ item.fiduciary }</td>
    </tr>);
  });


  return (
    <Card>
      <CardHeader>
        <h5>{ t("Warrants") }</h5>
      </CardHeader>
      <CardBody>
        <Row className="mb-3">
          <Col md="12">
            <Table className="table" responsive>
              <thead className="table-light">
                <tr>
                  <th>{ t("Warrant Type") }</th>
                  <th>{ t("Commercial Value") }</th>
                  <th>{ t("Quick V-Value") }</th>
                  <th>{ t("Description") }</th>
                  <th>{ t("LTV%") }</th>
                  <th>{ t("Appraisal Date") }</th>
                  <th>{ t("Signature") }</th>
                  <th>{ t("Escrow") }</th>
                  <th>{ t("Fiduciary") }</th>
                </tr>
              </thead>
              <tbody>
                {dataRows}
              </tbody>
            </Table>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

WarrantsSection.propTypes = {
  facility: PropTypes.object.isRequired
};

export default WarrantsSection;
