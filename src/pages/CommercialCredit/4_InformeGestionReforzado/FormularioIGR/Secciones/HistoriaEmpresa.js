import React, { useState } from "react"
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"

import {
  Row,
  Col,
  Label,
} from "reactstrap"

import { OnlyNumber } from "../../../../../helpers/commons"
import { AvForm, AvField } from "availity-reactstrap-validation"
import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';

const HistoriaEmpresa = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const { locationData } = props;
  const [dataReturn, setDataReturn] = useState(props.historiaEmpresa);
  const [formValid, setFormValid] = useState(false);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmHistoriaEmpresa');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }))
  function changeAll(e, tipo) {
    if (tipo == "description") {
      dataReturn.description = e.target.value;
    }
    if (tipo == "employeesNumber") {
      dataReturn.employeesNumber = e.target.value;
    }
    if (tipo == "details") {
      dataReturn.details = e.target.value;
    }
    setDataReturn(dataReturn)
  }
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      setFormValid(false);
      return;
    }
    setFormValid(true);
  }
  return (
    <React.Fragment>
      <h5 className="card-title">
        {t("History of the Company")}
      </h5>
      <AvForm id="frmHistoriaEmpresa" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="companyHistoryDetails">{t("Details")}</Label>
              <AvField onChange={(e) => { changeAll(e, "description") }}
                className="form-control"
                name="companyHistoryDetails"
                id="companyHistoryDetails"
                type="textarea"
                rows="7"
                value={props.historiaEmpresa.description}
              />
            </div>
          </Col>
        </Row>
        {locationData ? (props?.activeTab == 3 ?
          <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_HISTORIAEMPRESA)} />
          : null) : null}
        <Row>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="companyHistoryEmployeesNumber">{t("Number of Employees")}</Label>
              <AvField onChange={(e) => { changeAll(e, "employeesNumber") }}
                onKeyPress={(e) => { OnlyNumber(e) }}
                className="form-control"
                name="employeesNumber"
                min={0}
                type="number"
                id="employeesNumber"
                value={props.historiaEmpresa.employeesNumber} pattern="[0-9]*"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="companyHistoryDescription">{t("Description")}</Label>
              <AvField onChange={(e) => { changeAll(e, "details") }}
                className="form-control"
                name="companyHistoryDescription"
                id="companyHistoryDescription"
                type="textarea"
                rows="7"
                value={props.historiaEmpresa.details}
              />
            </div>
          </Col>
        </Row>
      </AvForm>
    </React.Fragment>
  );
})
HistoriaEmpresa.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  locationData: PropTypes.any,
}
export default HistoriaEmpresa;
