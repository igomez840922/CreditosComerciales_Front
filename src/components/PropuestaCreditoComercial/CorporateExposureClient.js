import PropTypes from 'prop-types';
import { formatCurrency, translationHelpers } from '../../helpers';

import {
  Table,
  Card, Row, Col,
  CardBody,
} from "reactstrap"
import React, { useEffect, useState } from "react"
import { BackendServices, CoreServices, BpmServices, } from "../../services";
import { useTranslation } from 'react-i18next';
import HeaderSections from '../Common/HeaderSections';

const CorporateExposureClient = (props) => {
  const coreServices = new CoreServices();

  const { t, i18n } = useTranslation();
  const [dataRows, setdataRows] = React.useState(null);
  const [CorporateExposure, setCorporateExposure] = useState(null);
  const [customerNumberT24, setcustomerNumberT24] = React.useState(props.customerNumberT24);

  useEffect(() => {
    getCoporateExhibitionClient();
  }, []);

  function getCoporateExhibitionClient() {
    console.log("getCoporateExhibitionClient", customerNumberT24);
    return;
    coreServices.getCorporateExhibitionByClients(customerNumberT24).then(resp => {
      if (resp === undefined) {
        return;
      }

      setCorporateExposure(resp.length > 0 ? resp : null);
      setdataRows(resp.map((item, index) => (
        <>
          <tr key={'row-' + index}>
            <th scope="row" width="30%">{item.clinteId}</th>
            <th scope="row" className="text-end"></th>
            <th scope="row" className="text-end"></th>
            <th scope="row" className="text-end"></th>
          </tr>
          {item.data.map((item2, index2) => (
            <tr key={'subrow-' + index2}>
              <td scope="row" width="30%"></td>
              <td scope="row" className="text-start">{formatCurrency('$', item2.approvalRisk, 0)}</td>
              <td scope="row" className="text-start">{formatCurrency('$', item2.variationRisk, 0)}</td>
              <td scope="row" className="text-start">{formatCurrency('$', item2.proposalRisk, 0)}</td>
            </tr>
          ))}
        </>
      )
      ));
    });
  }

  function formatTotal(item) {
    return formatCurrency('$', CorporateExposure?.reduce((acu, crr) => {
      let data1 = (acu.data?.reduce((acu2, crr2) => ((acu2.item ?? acu2) + crr2.item)) ?? acu);
      let data2 = crr.data?.reduce((acu2, crr2) => ((acu2.item ?? acu2) + crr2.item));
      return (data1 + data2)
    }), 0)
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
                  <th className="table-right">{t("ProposedRisk")}</th>
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
    </React.Fragment>
  );

};

CorporateExposureClient.propTypes = {
  title: PropTypes.string,
  customerNumberT24: PropTypes.string,
};


export default CorporateExposureClient;