import React, { useState } from "react"
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Label,
} from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';

const EstructuraOrganizacionalEmpresa = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const { locationData } = props;
  const [dataReturn, setDataReturn] = useState(props.dataEstructuraOrganizacional);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmEstructuraOrganizacionalEmpresa');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }))
  const [formValid, setFormValid] = useState(false);
  function changeAll(e) {
    dataReturn.description = e.target.value;
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
        {t("OrganizationalStructure")}
      </h5>
      <AvForm id="frmEstructuraOrganizacionalEmpresa" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="description">{t("Details")}</Label>
              <AvField onChange={(e) => { changeAll(e) }}
                className="form-control"
                name="description"
                id="description"
                type="textarea"
                rows="7"
                value={props.dataEstructuraOrganizacional.description}
              />
            </div>
          </Col>
        </Row>
       {locationData ? (props?.activeTab == 5 ?
        <AttachmentFileCore attachmentFileInputModel={ new AttachmentFileInputModel(locationData.transactionId,OPTs.PROCESS_INFORMEGESTION,OPTs.ACT_ESTRUCTURAORGANIZACIONAL)} />
        :null):null}
        
      </AvForm>
    </React.Fragment>
  );
})
EstructuraOrganizacionalEmpresa.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  locationData: PropTypes.any,
}
export default EstructuraOrganizacionalEmpresa;
