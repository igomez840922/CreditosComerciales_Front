import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Row,
    Col,
    Form,
    Container,
} from "react-bootstrap";
import Select from 'react-select'
import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
import { Label } from 'reactstrap';
import Flatpickr from "react-flatpickr";

import checkNumber from '../../../helpers/checkNumber';
import FormQuoterTypeNatural from './FormQuoterTypeNatural';
import * as OPTs from "../../../helpers/options_helper"

const FormCommonFields = (props) => {
    // props
    const { onChange, form, typePerson, dataPrefillClient } = props
    console.group('Common Fields')
    console.info(dataPrefillClient)
    console.groupEnd()
    // hooks
    const { t, i18n } = useTranslation();
    // custom hooks

    const options = [
        { label: 'Natural', value: 'Natural' },
        { label: 'Jurídica', value: 'Juridica' }
    ]
    const optionsIdType = [
        { value: '1', label: 'RUC' },
        { value: '2', label: 'RIF' },
        { value: '3', label: 'Cédula' },
    ]

    const optionsNationality = [
        { value: '1', label: 'Cuba' },
        { value: '2', label: 'Panamá' },
        { value: '3', label: 'Venezuela' }
    ]

    const optionsFormatDate = {
        dateFormat: OPTs.FORMAT_DATE,
        maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
        // defaultDate: selectClient !== undefined ? new Date(moment(selectClient.birthDate, 'YYYY-MM-DD').format()) : new Date()
    }


    return (
        <>
            <AvForm>
                <Row>
                    <Col md={6} lg={4}>
                        <div className="mb-3">
                            <Label htmlFor="personType">{t("PersonType")}</Label>
                            <Select
                                options={options}
                                id="personType"
                                name="personType"
                                defaultValue={options[0]}
                                value={form.name}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                    <Col md={6} lg={4}>
                        <div className="mb-3">
                            <Label htmlFor="idType">{t("IdType")}</Label>
                            <Select
                                id="idType"
                                name="idType"
                                options={optionsIdType}
                                defaultValue={optionsIdType[2]}
                                value={form.name}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                    <Col md={12} lg={4}>
                        <div className="mb-3">
                            <Label htmlFor="idnumber">{t("IdNumber")}</Label>
                            <AvField
                                id="idnumber"
                                name="idnumber"
                                value={form.name}
                                validate={{ required: { value: true } }}
                                errorMessage={t("Required Field")}
                                options={optionsIdType}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                </Row>
            </AvForm>
            {

                typePerson == "Natural" &&
                <FormQuoterTypeNatural
                    onChange={onChange}
                    form={form}
                />

            }
            <AvForm>
                <Row>
                    {
                        typePerson == "Natural" &&
                        <Col md={6} lg={3}>
                            <AvGroup>
                                <div className="mb-3">
                                    <Label htmlFor="birthDate">{t("Date of birth")}</Label>
                                    <Flatpickr
                                        id="birthDate"
                                        name="birthDate"
                                        value={form.name}
                                        placeholder={OPTs.FORMAT_DATE_SHOW}
                                        options={optionsFormatDate}
                                        className="form-control d-block"
                                        onChange={onChange}
                                    />
                                    {/* <AvField
                                    type='date'
                                    id="birthDate"
                                    name="birthDate"
                                    value={form.name}
                                    onChange={onChange}
                                /> */}
                                </div>
                            </AvGroup>
                        </Col>

                    }
                    {
                        typePerson == "Juridica" &&
                        (

                            <Col md={6} lg={3}>
                                <div className="mb-3">
                                    <Label htmlFor="name">{t("SocialReason")}</Label>
                                    <AvField
                                        type='text'
                                        id="name"
                                        name="nameJ"
                                        value={form.name}
                                        validate={{ required: { value: true } }}
                                        errorMessage={t("Required Field")}
                                        onChange={onChange}
                                    />
                                </div>
                            </Col>

                        )
                    }
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="nationality">{t("Nationality")}</Label>
                            <Select
                                id="nationality"
                                name="nationality"
                                value={form.name}
                                options={optionsNationality}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="phoneNumber">{t("PhoneNumber")}</Label>
                            <AvField
                                id="phoneNumber"
                                name="phoneNumber"
                                value={form.name}
                                onKeyPress={(e) => { return checkNumber(e) }}
                                onChange={onChange}
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
                                value={form.name}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                </Row>
            </AvForm>
        </>
    )
}

export default FormCommonFields