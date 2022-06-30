import React, { useState } from 'react'
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  FormGroup,
  Row,
  Container,
} from 'react-bootstrap'
import { Label } from "reactstrap";
import Select from "react-select";
import FormDataQuoter from './FormDataQuoter';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import checkNumber from '../../../helpers/checkNumber';

const FormQuoterTypeNatural = (props) => {
  const { t, i18n } = useTranslation();
  // props
  const { onChange, form } = props

  const optionsNationality = [
    { value: '1', label: 'Cuba' },
    { value: '2', label: 'Panamá' },
    { value: '3', label: 'Venezuela' }
  ]

  return (
    <AvForm>
      <Row>
        <Col md={6} lg={3}>
          <div className="mb-3">
            <Label htmlFor="firstname">{t("FirstName")}</Label>
            <AvField
              type='text'
              id="firstname"
              name="firstname"
              value={form.name}
              validate={{ required: { value: true } }}
              errorMessage={t("Required Field")}
              onChange={onChange}
            />
          </div>
        </Col>
        <Col md={6} lg={3}>
          <div className="mb-3">
            <Label htmlFor="secondname">{t("SecondName")}</Label>
            <AvField
              id="secondname"
              name="secondname"
              value={form.name}
              onChange={onChange}
            />
          </div>
        </Col>
        <Col md={6} lg={3}>
          <div className="mb-3">
            <Label htmlFor="firstlastname">{t("FirstLastName")}</Label>
            <AvField
              id="firstlastname"
              name="firstlastname"
              value={form.name}
              validate={{ required: { value: true } }}
              errorMessage={t("Required Field")}
              onChange={onChange}
            />
          </div>
        </Col>
        <Col md={6} lg={3}>
          <div className="mb-3">
            <Label htmlFor="secondlastname">{t("SecondLastName")}</Label>
            <AvField
              id="secondlastname"
              name="secondlastname"
              value={form.name}
              onChange={onChange}
            />
          </div>
        </Col>
      </Row>
      {/* <Row>
        <Col md={6} lg={3}>
          <div className="mb-3">
            <Label htmlFor="birthDate">{t("Date of birth")}</Label>
            <AvField
              type='date'
              id="birthDate"
              name="birthDate"
              value={form.name}
              onChange={onChange}
            />
          </div>
        </Col>
      </Row> */}
    </AvForm>
  )
}

export default FormQuoterTypeNatural