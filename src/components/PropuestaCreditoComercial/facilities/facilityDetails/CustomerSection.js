import React from "react"
import PropTypes from 'prop-types';
import { formatCurrency, translationHelper } from '../../../../helpers';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';


const CustomerSection = (props) => {

  const t = translationHelper('commercial_credit');
  const facility = props.facility;

  return (
    <Card>
      <CardHeader>
        <h5>{t("General Data")}</h5>
      </CardHeader>
      <CardBody>
        <Row>
          <label htmlFor="facilityNumber" className="col-sm-3 col-form-label">{t("Number")}</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="facilityNumber" value={facility.facilityNumber} readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="facilityCR" className="col-sm-3 col-form-label">{t("CR")}</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="facilityCR" value={facility.facilityCR} readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="amount" className="col-sm-3 col-form-label">{t("Amount")}</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="amount" value={formatCurrency('$', facility.proposedRisk, 2)} readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="debtor" className="col-sm-3 col-form-label">{t("Debtor")}</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="debtor" value={facility.cliente.name} readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="customerIdType" className="col-sm-3 col-form-label">{t("Customer ID Type")}</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="customerIdType" value={facility.cliente.idType} readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="customerid" className="col-sm-3 col-form-label">{t("ID Number")}</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="customerid" value={facility.cliente.id} readOnly />
          </div>
        </Row>
        <Row>
          <label htmlFor="balance" className="col-sm-3 col-form-label">{t("Balance")}</label>
          <div className="col-sm-9">
            <input type="text" className="form-control-plaintext" id="balance" value={formatCurrency('$', facility.balance, 2)} readOnly />
          </div>
        </Row>
      </CardBody>
    </Card>

  );
};

CustomerSection.propTypes = {
  facility: PropTypes.object.isRequired
};

export default CustomerSection;
