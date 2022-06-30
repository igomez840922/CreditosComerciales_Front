import PropTypes from 'prop-types';
import { formatCurrency, translationHelpers } from '../../helpers';

import {
  Table,
  Card,
  CardBody, Row, Col
} from "reactstrap"
import { BackendServices, CoreServices, BpmServices, } from "../../services";
import React, { useEffect, useState } from "react"

import { useTranslation } from 'react-i18next';
import HeaderSections from '../Common/HeaderSections';

const CorporateExposure = (props) => {
  const backendServices = new BackendServices();

  const { t, i18n } = useTranslation();
  const [dataRows, setdataRows] = React.useState(null);
  const [ExposicionCorportativa, setExposicionCorportativa] = useState(null);

  const [customerNumberT24, setcustomerNumberT24] = React.useState(props.customerNumberT24);

  useEffect(() => {
    getExposicionCorporativa();
  }, []);


  function getExposicionCorporativa() {
    backendServices.getExposicionCorporativaBD(props.transactId).then(resp => {
      if (resp === undefined) {
        return;
      }
      setExposicionCorportativa(resp.length > 0 ? resp : null);
      setdataRows(resp.map((item, index) => (
        <tr key={'row-' + index}>
          <td scope="row" width="30%">{item.name}</td>
          <td scope="row" className="table-right">{formatCurrency('$', item.approved, 0)}</td>
          <td scope="row" className="table-right">{formatCurrency('$', item.balance, 0)}</td>
          <td scope="row" className="table-right">{formatCurrency('$', item.proposal, 0)}</td>
          <td scope="row" className="table-right">{formatCurrency('$', item.variation, 0)}</td>
        </tr>
      )
      ));
    });
  }

  return (
    <React.Fragment>

      <Card>
        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{props.title}</h5>
          </Col>
        </Row>
        <CardBody>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th></th>
                  <th className="table-right">{t("ApprovedRisk")}</th>
                  <th className="table-right">{t("Balance")}</th>
                  <th className="table-right">{t("ProposalRisk")}</th>
                  <th className="table-right">{t("Variation")}</th>
                </tr>
              </thead>
              <tbody>
                {dataRows}

              </tbody>
            </Table>
          </Col>
        </CardBody>
      </Card>

    </React.Fragment >
  );

};

CorporateExposure.propTypes = {
  title: PropTypes.string,
  customerNumberT24: PropTypes.string,
  transactId: PropTypes.any,
};

export default CorporateExposure;
