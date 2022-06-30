/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

//i18n
import { withTranslation } from "react-i18next"

const DatosGenerales = (props) => {

  function handleSubmit(event, errors, values) {
    event.preventDefaulprops.t();
    if (errors.length > 0) {
      return;
    }
    //props.onSubmiprops.t(values);
  }

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

    <CardBody>

      <Row>
        <Col lg="12">
          <Row>
            <Col md="6">
              <h4 className="card-sub-title">{props.t("CreditProposal")}</h4>
            </Col>
            <Col md="6" style={{ textAlign: "right" }}>
              <h4 className="card-title">{props.t("Autonomy")}: Gerente General</h4>
            </Col>
          </Row>
          <p className="card-title-desc">

          </p>

          <Row>
            <Col md="12">
              <h4 className="card-title">{props.t("GeneralData")}</h4>
            </Col>
          </Row>

          <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="procedureid">{props.t("ProcedureNumber")}</Label>
                  <AvField
                    className="form-control"
                    name="procedureid"
                    min={0}
                    type="number"
                    onKeyPress={(e) => { return check(e) }}
                    id="procedureid" value="321321" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="customerid">{props.t("ClientNumber")}</Label>
                  <AvField
                    className="form-control"
                    name="customerid"
                    min={0}
                    type="number"
                    onKeyPress={(e) => { return check(e) }}
                    id="customerid" value="101020" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="customerid">{props.t("RevisionType")}</Label>
                  <AvField
                    className="form-control"
                    name="customerid"
                    min={0}
                    type="number"
                    onKeyPress={(e) => { return check(e) }}
                    id="customerid" value={props.t("Semestrual")} disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="customerid">{props.t("PreApproved")}</Label>
                  <AvField
                    className="form-control"
                    name="customerid"
                    min={0}
                    type="number"
                    onKeyPress={(e) => { return check(e) }}
                    id="customerid" value={props.t("Yes")} disabled="disabled" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="economicGroupNumber">{props.t("EconomicGroupNumber")}</Label>
                  <AvField
                    className="form-control"
                    name="economicGroupNumber"
                    type="text"
                    id="economicGroupNumber" value="3213210012" disabled="disabled" />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="economicGroupName">{props.t("EconomicGroupName")}</Label>
                  <AvField
                    className="form-control"
                    name="economicGroupName"
                    type="text"
                    id="economicGroupName" value="Grupo Tova SA" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="countryClass">{props.t("CountryClass")}</Label>
                  <AvField
                    className="form-control"
                    name="countryClass"
                    type="text"
                    id="countryClass" value="Panama" disabled="disabled" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="companyActivity">{props.t("CompanyActivity")}</Label>
                  <AvField
                    className="form-control"
                    name="companyActivity"
                    type="text"
                    id="companyActivity" value="Atividad de la Empresa" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="riskAssesment">{props.t("RiskAssesment")}</Label>
                  <AvField
                    className="form-control"
                    name="riskAssesment"
                    type="text"
                    id="riskAssesment" value="Medio" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="minimumProvisionSIB">{props.t("MinimumProvision")}</Label>
                  <AvField
                    className="form-control"
                    name="minimumProvisionSIB"
                    type="text"
                    id="minimumProvisionSIB" value="Provisión" disabled="disabled" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="relatedPart">{props.t("RelatedPart")}</Label>
                  <AvField
                    className="form-control"
                    name="relatedPart"
                    type="text"
                    id="relatedPart" value={props.t("Yes")} disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="approvalLevel">{props.t("ApprovalLevel")}</Label>
                  <AvField
                    className="form-control"
                    name="approvalLevel"
                    type="text"
                    id="approvalLevel" value="Nivel Indicado" disabled="disabled" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="accountExecutive">{props.t("AccountExecutive")}</Label>
                  <AvField
                    className="form-control"
                    name="accountExecutive"
                    type="text"
                    id="accountExecutive" value="A12300" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="responsibleUnit">{props.t("ResponsibleUnit")}</Label>
                  <AvField
                    className="form-control"
                    name="responsibleUnit"
                    type="text"
                    id="responsibleUnit" value="Nombre de la unidad" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="countryRisk">{props.t("CountryRisk")}</Label>
                  <AvField
                    className="form-control"
                    name="countryRisk"
                    type="text"
                    id="countryRisk" value="Panama" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="flowType">{props.t("FlowType")}</Label>
                  <AvField
                    className="form-control"
                    name="countryRisk"
                    type="text"
                    id="countryRisk" value="Normal" disabled="disabled" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="applicationDate">{props.t("ApplicationDate")}</Label>
                  <AvField
                    className="form-control"
                    name="applicationDate"
                    type="text"
                    id="applicationDate" value="21/09/2021" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="lastApplicationDate">{props.t("LastApplicationDate")}</Label>
                  <AvField
                    className="form-control"
                    name="lastApplicationDate"
                    type="text"
                    id="lastApplicationDate" value="21/09/2021" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="nextRevisionDate">{props.t("NextRevisionDate")}</Label>
                  <AvField
                    className="form-control"
                    name="nextRevisionDate"
                    type="text"
                    id="nextRevisionDate" value="21/09/2021" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="proposalExpirationDate">{props.t("ProposalExpirationDate")}</Label>
                  <AvField
                    className="form-control"
                    name="proposalExpirationDate"
                    type="text"
                    id="proposalExpirationDate" value="21/09/2021" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="proposalExpirationDate">{props.t("Banking")}</Label>
                  <AvField
                    className="form-control"
                    name="proposalExpirationDate"
                    type="text"
                    id="proposalExpirationDate" value="CREDITOS ESPECIALES" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="proposalExpirationDate">{props.t("FacilityType")}</Label>
                  <AvField
                    className="form-control"
                    name="proposalExpirationDate"
                    type="text"
                    id="proposalExpirationDate" value="INTERINO DE CONSTRUCCION" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="proposalExpirationDate">{props.t("ExposureValue")}</Label>
                  <AvField
                    className="form-control"
                    name="proposalExpirationDate"
                    type="text"
                    id="proposalExpirationDate" value="VALOR" disabled="disabled" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="proposalExpirationDate">{props.t("ProposalType")}</Label>
                  <AvField
                    className="form-control"
                    name="proposalExpirationDate"
                    type="text"
                    id="proposalExpirationDate" value="MENSION" disabled="disabled" />
                </div>
              </Col>
            </Row>


          </AvForm>

        </Col>
      </Row>


    </CardBody>


  );

}


export default (withTranslation()(DatosGenerales))
