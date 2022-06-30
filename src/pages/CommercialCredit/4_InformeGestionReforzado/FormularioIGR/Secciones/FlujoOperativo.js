import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  CardHeader,
  Table,
  CardFooter
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';

const FlujoOperativo = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();

  const { locationData } = props;

  const [dataReturn, setDataReturn] = useState(props.dataFlujoOperativo);
  const [formValid, setFormValid] = useState(false);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmFlujoOperativo');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }))
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      setFormValid(false);
      return;
    }
    setFormValid(true);
    // props.onSubmit(values);
  }
  function changeAll(e) {
    // setFormValid(true);
    dataReturn.observations = e.target.value
    setDataReturn(dataReturn);
  }
  return (
    <React.Fragment>
      <h5 className="card-title">
        {t("OperationalFlow")}
      </h5>
      <AvForm id="frmFlujoOperativo" name="frmFlujoOperativo" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="companyHistoryDetails">{t("Details")}</Label>
              <AvField
                className="form-control"
                name="companyHistoryDetails"
                type="textarea"
                id="companyHistoryDetails"
                maxLength="1000"
                rows="7"
                value={props.dataFlujoOperativo.observations}
                onChange={(e) => { changeAll(e) }}
              />
            </div>
          </Col>
        </Row>
        {locationData ? (props?.activeTab == 8 ?
          <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_FLUJOOPERATIVO)} />
          : null) : null}
      </AvForm>
    </React.Fragment>
  );
})
FlujoOperativo.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  locationData: PropTypes.any,
}
export default FlujoOperativo;
