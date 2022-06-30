import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Form, Container, Card, Button } from "react-bootstrap";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { AvField, AvForm, AvGroup } from "availity-reactstrap-validation";
import { Label } from "reactstrap";
import Flatpickr from "react-flatpickr";

import checkNumber from "../../../helpers/checkNumber";
import * as OPTs from "../../../helpers/options_helper";
import { useFormQuoter } from "./Hooks/useFormQuoter";
import LoadingOverlay from "react-loading-overlay";
import TableResultQuoter from "./TableResultQuoter";
import {
  optionsPersonType,
  optionsConfirmation,
  optionsGracePeriodType,
  optionsIdType,
  optionsNationality,
  optionsTypeLoan,
  optionsPayments,
  // optionsBanking,
} from "./dummy/optionsSelect";
import { useManagementModal } from "./Hooks/useManagementModal";

const initialForm = {
  // // common fields
  personType: "Natural",
  idType: "",
  idnumber: "",
  // // client data
  // name: "",
  firstname: "",
  secondname: "",
  firstlastname: "",
  secondlastname: "",
  birthDate: "",
  nationality: "",
  phoneNumber: "",
  email: "",
  // // quoter data
  loanType: "compuesto",
  amountDebt: "",
  anualRate: "",
  //   effectiveRate: 0,
  paymentPeriod: 1,
  definedPayment: "No",
  customerDefinedPayment: "",
  term: "",
  feciSelect: "No",
  feciRate: "",
  gracePeriodSelect: "No",
  gracePeriodType: "NA",
  gracePeriod: "",
  // banking: "",
  // legalExpenses: 0,
  // financialTrust: 0,
};

export const FormData = (props) => {
  const { t, i18n } = useTranslation();
  const { clientExist } = props;
  const formPrefill = { ...clientExist[0] };

  console.log("formPrefill:", formPrefill);

  const {
    form,
    hdlTest,
    hdlOnKeyUpRealNumber,
    hdlOnKeyUpPercentageNumber,
    hdlOnSubmit,
    hdlOnInvalidSubmit,
    hdlOnValidSubmit,
    hdlOnChange,
    assignSelectionFields,
    disableFeci,
    disableDefinedFee,
    disableTerm,
    disableGracePeriod,
    optionsIdTypes,
    optionsCountries,
    optionsBanks,
    loading,
    response,
  } = useFormQuoter(initialForm);

  const optionsFormatDate = {
    dateFormat: OPTs.FORMAT_DATE,
    maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
    // defaultDate: selectClient !== undefined ? new Date(moment(selectClient.birthDate, 'YYYY-MM-DD').format()) : new Date()
  };

  return (
    <>
      <AvForm
        // onSubmit={hdlOnValidSubmit}
        onValidSubmit={hdlOnValidSubmit}
        onInvalidSubmit={hdlOnInvalidSubmit}
      >
        <Card>
          <Container>
            <Card.Title className="mt-3">{t("ClientData")}</Card.Title>
            <Row>
              <Col md={6} lg={4}>
                <div className="mb-3">
                  <Label htmlFor="personType">{t("PersonType")}</Label>
                  <Select
                    options={optionsPersonType}
                    id="personType"
                    name="personType"
                    defaultValue={optionsPersonType[0]}
                    // value={form.name}
                    value={
                      formPrefill.length === 0
                        ? form.partyType
                        : optionsPersonType.find(
                            (option) => option.value === formPrefill.partyType
                          )
                    }
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={6} lg={4}>
                <div className="mb-3">
                  <Label htmlFor="idType">{t("IdType")}</Label>
                  <Select
                    id="idType"
                    name="idType"
                    options={optionsIdTypes.map((typeId) => ({
                      label: typeId.description,
                      value: typeId.description,
                    }))}
                    // defaultValue={}
                    // value={form.name}
                    value={optionsIdType.find(
                      (typeId) => typeId.value === formPrefill.idtype
                    )}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={12} lg={4}>
                <div className="mb-3">
                  <Label htmlFor="idnumber">{t("IdNumber")}</Label>
                  <AvField
                    id="idnumber"
                    name="idnumber"
                    value={
                      formPrefill?.idnumber ? formPrefill.idnumber : form.name
                    }
                    validate={{ required: { value: true } }}
                    errorMessage={t("Required Field")}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              {form.personType === "Natural" && (
                <>
                  <Col md={6} lg={3}>
                    <div className="mb-3">
                      <Label htmlFor="firstname">{t("FirstName")}</Label>
                      <AvField
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={
                          formPrefill?.firstname
                            ? formPrefill.firstname
                            : form.name
                        }
                        validate={{ required: { value: true } }}
                        errorMessage={t("Required Field")}
                        onChange={hdlOnChange}
                      />
                    </div>
                  </Col>
                  <Col md={6} lg={3}>
                    <div className="mb-3">
                      <Label htmlFor="secondname">{t("SecondName")}</Label>
                      <AvField
                        id="secondname"
                        name="secondname"
                        value={
                          formPrefill?.secondname
                            ? formPrefill.secondname
                            : form.name
                        }
                        onChange={hdlOnChange}
                      />
                    </div>
                  </Col>
                  <Col md={6} lg={3}>
                    <div className="mb-3">
                      <Label htmlFor="firstlastname">
                        {t("FirstLastName")}
                      </Label>
                      <AvField
                        id="firstlastname"
                        name="firstlastname"
                        value={
                          formPrefill?.lastname
                            ? formPrefill.lastname
                            : form.name
                        }
                        validate={{ required: { value: true } }}
                        errorMessage={t("Required Field")}
                        onChange={hdlOnChange}
                      />
                    </div>
                  </Col>
                  <Col md={6} lg={3}>
                    <div className="mb-3">
                      <Label htmlFor="secondlastname">
                        {t("SecondLastName")}
                      </Label>
                      <AvField
                        id="secondlastname"
                        name="secondlastname"
                        value={
                          formPrefill?.secondlastname
                            ? formPrefill.secondlastname
                            : form.name
                        }
                        onChange={hdlOnChange}
                      />
                    </div>
                  </Col>
                </>
              )}
            </Row>
            <Row>
              {form.personType === "Natural" && (
                <Col md={6} lg={3}>
                  <AvGroup>
                    <div className="mb-3">
                      <Label htmlFor="birthDate">{t("Date of birth")}</Label>
                      <Flatpickr
                        id="birthDate"
                        name="birthDate"
                        value={
                          formPrefill?.birthdate
                            ? formPrefill.birthdate
                            : form.name
                        }
                        placeholder={OPTs.FORMAT_DATE_SHOW}
                        options={optionsFormatDate}
                        className="form-control d-block"
                        onChange={hdlOnChange}
                      />
                    </div>
                  </AvGroup>
                </Col>
              )}
              {form.personType !== "Natural" && (
                <Col md={6} lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="name">{t("SocialReason")}</Label>
                    <AvField
                      type="text"
                      id="name"
                      name="nameJ"
                      value={
                        formPrefill?.businessName
                          ? formPrefill.businessName
                          : form.name
                      }
                      validate={{ required: { value: true } }}
                      errorMessage={t("Required Field")}
                      onChange={hdlOnChange}
                    />
                  </div>
                </Col>
              )}
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="nationality">{t("Nationality")}</Label>
                  <Select
                    id="nationality"
                    name="nationality"
                    options={
                      optionsCountries.length === 0
                        ? "Loading options"
                        : optionsCountries.map((country) => ({
                            label: country.Description,
                            value: country.Description,
                          }))
                    }
                    // value={form.name}
                    value={optionsNationality.find(
                      (country) => country.value === formPrefill.nationality
                    )}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="phoneNumber">{t("PhoneNumber")}</Label>
                  <AvField
                    id="phoneNumber"
                    name="phoneNumber"
                    value={
                      formPrefill?.phoneNumber
                        ? formPrefill.phoneNumber
                        : form.name
                    }
                    onKeyPress={(e) => {
                      return checkNumber(e);
                    }}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="email">{t("Email")}</Label>
                  <AvField
                    type="email"
                    id="email"
                    name="email"
                    value={formPrefill?.email ? formPrefill.email : form.name}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              {/* QUOTER DATA */}
              <Card.Title className="mt-5">{t("QuoterData")}</Card.Title>
            </Row>
            <Row>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="loanType">{t("Quoter type")}</Label>
                  <Select
                    id="loanType"
                    name="loanType"
                    defaultValue={optionsTypeLoan[0]}
                    value={form.name}
                    options={optionsTypeLoan}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="amountDebt">{t("Amount Debt")}</Label>
                  <AvField
                    id="amountDebt"
                    name="amountDebt"
                    value={form.amountDebt}
                    pattern="^[0-9,.]*$"
                    validate={{ required: { value: true } }}
                    errorMessage={t("Required Field")}
                    // onChange={hdlTest}
                    onChange={hdlOnChange}
                    onKeyUp={hdlOnKeyUpRealNumber}
                    // onKeyPress={hdlOnKeyOnlNum}
                    // onKeyPress={(e) => { return checkNumber(e) }}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="anualRate">{t("Annual rate (%)")}</Label>
                  <AvField
                    id="anualRate"
                    name="anualRate"
                    value={form.anualRate}
                    validate={{ required: { value: true } }}
                    errorMessage={t("Required Field")}
                    onChange={hdlOnChange}
                    onKeyUp={hdlOnKeyUpPercentageNumber}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="paymentPeriod">{t("Payments")}</Label>
                  <Select
                    id="paymentPeriod"
                    name="paymentPeriod"
                    defaultValue={optionsPayments[0]}
                    value={form.name}
                    options={optionsPayments}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              {/* <Col md={6} lg={3}>
                                <div className="mb-3">
                                    <Label htmlFor="effectiveRate">{t("Effective rate (%)")}</Label>
                                    <AvField
                                        id="effectiveRate"
                                        name="effectiveRate"
                                        value={form.name}
                                        onChange={hdlOnChange}
                                    />
                                </div>
                            </Col> */}
            </Row>
            <Row>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="definedPayment">{t("Defined fee")}</Label>
                  <Select
                    id="definedPayment"
                    name="definedPayment"
                    options={optionsConfirmation}
                    defaultValue={optionsConfirmation[1]}
                    value={form.name}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="customerDefinedPayment">
                    {t("Defined fee value")}
                  </Label>
                  <AvField
                    id="customerDefinedPayment"
                    name="customerDefinedPayment"
                    value={form.customerDefinedPayment}
                    validate={{ required: { value: !disableDefinedFee } }}
                    errorMessage={t("Required Field")}
                    disabled={disableDefinedFee}
                    onChange={hdlOnChange}
                    onKeyUp={hdlOnKeyUpRealNumber}
                    onKeyPress={(e) => {
                      return checkNumber(e);
                    }}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="feciSelect">{t("Feci")}</Label>
                  <Select
                    id="feciSelect"
                    name="feciSelect"
                    defaultValue={optionsConfirmation[1]}
                    value={form.name}
                    options={optionsConfirmation}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="feciRate">{t("Feci amount")}</Label>
                  <AvField
                    id="feciRate"
                    name="feciRate"
                    value={form.feciRate}
                    validate={{ required: { value: !disableFeci } }}
                    errorMessage={t("Required Field")}
                    disabled={disableFeci}
                    onChange={hdlOnChange}
                    onKeyUp={hdlOnKeyUpPercentageNumber}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="term">{t("Term (months)")}</Label>
                  <AvField
                    id="term"
                    name="term"
                    value={form.term}
                    validate={{ required: { value: !disableTerm } }}
                    errorMessage={t("Required Field")}
                    disabled={disableTerm}
                    onChange={hdlOnChange}
                    onKeyPress={(e) => {
                      return checkNumber(e);
                    }}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="gracePeriodSelect">{t("Grace period")}</Label>
                  <Select
                    id="gracePeriodSelect"
                    name="gracePeriodSelect"
                    options={optionsConfirmation}
                    defaultValue={optionsConfirmation[1]}
                    value={form.name}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="gracePeriodType">
                    {t("Grace period type")}
                  </Label>
                  <Select
                    id="gracePeriodType"
                    name="gracePeriodType"
                    options={optionsGracePeriodType}
                    defaultValue={optionsGracePeriodType[1]}
                    value={form.name}
                    isDisabled={disableGracePeriod}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="gracePeriod">{t("Nos grace period")}</Label>
                  <AvField
                    id="gracePeriod"
                    name="gracePeriod"
                    value={form.gracePeriod}
                    validate={{ required: { value: !disableGracePeriod } }}
                    errorMessage={t("Required Field")}
                    disabled={disableGracePeriod}
                    onChange={hdlOnChange}
                    onKeyPress={(e) => {
                      return checkNumber(e);
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={6}>
                <div className="mb-3">
                  <Label htmlFor="banking">{t("Banking")}</Label>
                  <Select
                    id="banking"
                    name="banking"
                    options={
                      optionsBanks.length === 0
                        ? "Loading banking"
                        : optionsBanks.map((banking) => ({
                            label: banking.Description,
                            value: banking.Description,
                          }))
                    }
                    value={form.name}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="legalExpenses">{t("Legal expenses")}</Label>
                  <AvField
                    id="legalExpenses"
                    name="legalExpenses"
                    value={form.name}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="mb-3">
                  <Label htmlFor="financialTrust">{t("Trust")}</Label>
                  <AvField
                    id="financialTrust"
                    name="financialTrust"
                    value={form.name}
                    onChange={hdlOnChange}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="d-grid mt-5">
                <Button size="lg" className="float-end" type="submit">
                  {t("Calculate")}
                </Button>
              </Col>
            </Row>
          </Container>
        </Card>
      </AvForm>
      <LoadingOverlay
        active={loading}
        spinner={true}
        text={t("Calculating payment plan")}
      ></LoadingOverlay>
      {response !== null && <TableResultQuoter paymentPlan={response} />}
    </>
  );
};
