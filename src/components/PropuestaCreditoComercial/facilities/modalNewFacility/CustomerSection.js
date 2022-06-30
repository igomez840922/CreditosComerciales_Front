import React, { useState } from 'react';
import { translationHelpers } from '../../../../helpers';

import {
  Row,
  Col,
  Label
} from "reactstrap"

import { AvField, AvGroup } from "availity-reactstrap-validation"
import { BackendServices } from "../../../../services";
import { useLocation, useHistory } from 'react-router-dom'

const CustomerSection = (props) => {
  const location = useLocation()
  const [locationData, setLocationData] = useState(location.data);

  const [t, c] = translationHelpers('commercial_credit', 'common');
  let listaIdentificacion = props.identificationList;
  const apiBack = new BackendServices();
  const [dataReturn, setdataReturn] = useState({ numero: 0 });
  //{ transactId: location.data.transactionId, processId: location.data.processId, activityId: location.data.activityId }

  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla === 45) {
      e.preventDefault();
      return true;
    }

    return false;
  }

  return (
    <React.Fragment>

      <h5>{t("General Data")}</h5>

      <Row>
        <Col lg="4">
          <AvGroup className="mb-3">
            <Label htmlFor="facilityNumber">{t("Number")}</Label>
            <AvField
              className="form-control"
              name="facilityNumber"
              min={0}
              type="number"
              onKeyPress={(e) => { return check(e) }}
              value={props.dataSet.facilityNumber}
              id="facilityNumber" />
          </AvGroup>
        </Col>
        <Col lg="4">
          <AvGroup className="mb-3">
            <Label htmlFor="cr">{t("CR")}</Label>
            <AvField
              className="form-control"
              name="cr"
              value={props.dataSet.cr}
              type="text"
              id="cr" />
          </AvGroup>
        </Col>
        <Col lg="4">
          <AvGroup className="mb-3">
            <Label htmlFor="amount">{t("Amount")}</Label>
            <AvField
              className="form-control"
              name="amount"
              min={0}
              type="number"
              onKeyPress={(e) => { return check(e) }}
              value={props.dataSet.amount}
              id="amount" />
          </AvGroup>
        </Col>
      </Row>

      <Row>
        <Col lg="12">
          <AvGroup className="mb-3">
            <Label htmlFor="debtor">{t("Debtor")}</Label>
            <AvField
              className="form-control"
              name="debtor"
              value={props.dataSet.debtor}
              type="text"
              id="customerName" />
          </AvGroup>
        </Col>
      </Row>

      <Row>

        <Col lg="4">
          <AvGroup className="mb-3">
            <Label htmlFor="clientTypeId">{t("Customer ID Type")}</Label>
            <AvField
              className="form-control"
              name="clientTypeId"
              type="select"
              id="clientTypeId"
              required>
              <option value="">{c("Select")}</option>
              {listaIdentificacion.map((dt) => (
                <option value={dt.id} key={dt.id}>{t(dt.description)}</option>
              ))}
            </AvField>
          </AvGroup>
        </Col>

        <Col lg="4">
          <AvGroup className="mb-3">
            <Label htmlFor="customerid">{t("ID Number")}</Label>
            <AvField
              className="form-control"
              name="customer[id]"
              type="text"
              value={props.dataSet.numero}
              id="customerid" />
          </AvGroup>
        </Col>

        <Col md="4">
          <AvGroup className="mb-3">
            <Label htmlFor="balance">{t("Balance")}</Label>
            <AvField
              className="form-control"
              name="balance"
              value={props.dataSet.balance}
              min={0}
              type="number"
              onKeyPress={(e) => { return check(e) }}
              id="balance" />
          </AvGroup>
        </Col>

      </Row>
    </React.Fragment>
  );
};

export default CustomerSection;
