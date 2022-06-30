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


const SuretiesSection = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  const facility = props.facility;

  const dataRows = facility.fianzas.map((item, index) => {
    return (<tr key={ 'row-surety-' + index }>
      <td>{ item.type }</td>
      <td>{ item.description }</td>
    </tr>)
  });


  return (
    <Card>
      <CardHeader>
        <h5>{ t("Sureties") }</h5>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xl={12}>
            <Table className="table" responsive>
              <thead className="table-light">
                <tr>
                  <th>{ t("Surety Type") }</th>
                  <th>{ t("Description") }</th>
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

SuretiesSection.propTypes = {
  facility: PropTypes.object.isRequired
};

export default SuretiesSection;
