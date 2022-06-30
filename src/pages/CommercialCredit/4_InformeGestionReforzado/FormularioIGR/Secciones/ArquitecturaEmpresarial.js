import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Label,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';

const ArquitecturaEmpresarial = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const { locationData } = props;
  const [formValid, setFormValid] = useState(false);
  const [dataReturn, setDataReturn] = useState(props.dataArquitecturaEmpresarial);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmArquitectura');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
  React.useEffect(() => {
    ////console.log(("aquiiiiiiii"));
    setDataReturn(props.dataArquitecturaEmpresarial)
  }, [props.activeTab==21]);
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    setFormValid(true)
  }
  return (
    <React.Fragment>
      <h5>
        {t("EnterpriseArchitecture")}
      </h5>
      <p className="card-title-desc"></p>
      <AvForm id="frmArquitectura" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="useTechnologicalInformationSystems">{t("Use of Technological Information Systems for the General Operation of the Company")}</Label>
              <AvField
                className="form-control"
                type="textarea"
                name="ticCompanyUse"
                value={props.dataArquitecturaEmpresarial.ticCompanyUse}
                id="ticCompanyUse"
                maxLength="1000"
                onChange={(e) => { dataReturn.ticCompanyUse = e.target.value; setDataReturn(dataReturn); }}
                rows="7"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="someAreasHaveBeenAudited">{t("If some of your areas have been audited, indicate the Opinion of the Independent Auditors")}</Label>
              <AvField
                className="form-control"
                type="textarea"
                name="auditedAreas"
                onChange={(e) => { dataReturn.auditedAreas = e.target.value; setDataReturn(dataReturn); }}
                value={props.dataArquitecturaEmpresarial.auditedAreas}
                id="auditedAreas"
                maxLength="1000"
                rows="7"
              />
            </div>
          </Col>
        </Row>
        {locationData ? (props?.activeTab == 21 ?
          <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_ARQUITECTURAEMPRESARIAL)} />
          : null) : null}

      </AvForm>
    </React.Fragment>
  );
});
ArquitecturaEmpresarial.propTypes = {
  locationData: PropTypes.any,
}
export default ArquitecturaEmpresarial;
