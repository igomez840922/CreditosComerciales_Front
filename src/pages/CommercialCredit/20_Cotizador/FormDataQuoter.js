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
    Container
} from 'react-bootstrap'
import { Label } from "reactstrap";
import Select from "react-select";
import { useFormQuoter } from './Hooks/useFormQuoter';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import checkNumber from '../../../helpers/checkNumber';

const intialForm = {
    amountDebt: ""
}

const validationsForm = (form) => { }

const FormDataQuoter = (props) => {
    // props
    const {
        onChange,
        hdlOnKeyUpRealNumber,
        hdlOnKeyUpPercentageNumber,
        form,
        disableSelect,
        disableDefinedFee,
        disableTerm,
        disableGracePeriod,
    } = props

    // hooks
    const { t, i18n } = useTranslation();

    // custom hooks
    const {
        form2,
        errors,
        loading,
        response,
        handleChange,
        handleBlur,
        hdlSubmit,
    } = useFormQuoter(intialForm)
    const [amountDebt, setAmountDebt] = useState("")
    const [anualRate, setAnualRate] = useState("")

    const optionsConfirmation = [
        { label: 'Sí', value: 'Si' },
        { label: 'No', value: 'No', }
    ]
    const optionsPayments = [
        { label: 'Mensual', value: 1 },
        { label: 'Bimensual', value: 2 },
        { label: 'Trimestral', value: 3 },
        { label: 'Cuatrimestral', value: 4 },
        { label: 'Semestral', value: 6 },
        { label: 'Anual', value: 12 },
    ]
    const optionsGracePeriodType = [
        { label: 'Total', value: 't' },
        { label: 'Parcial', value: 'p' },
    ]
    const optionsBanking = [
        { label: 'International Banking', value: '1' },
        { label: 'Fuerza en venta', value: '2' },
    ]
    const optionsTypeLoan = [
        { label: 'Compuesto', value: 'compuesto' },
        { label: 'Abono', value: 'abono', }
    ]

    // const handleChangeInput = (evt) => {
    //     const regexOnlyNum = new RegExp(/^[0-9]+$/)
    //     const regexOnlyNum2 = evt.target.value.replace(/[^0-9,.]/g, "")
    //     const valueAmountDebt = regexOnlyNum2;
    //     setAmountDebt(valueAmountDebt)
    // }

    // const handleKeyOnlyNum = (evt) => {
    //     const keyPress = evt.key;
    //     const regexOnlyNum = /^[0-9,.]+$/

    //     if (!regexOnlyNum.test(keyPress)) return
    //     // console.log('here!');
    // }

    return (
        <Container>
            <Card.Title className='mt-5'>
                {t("QuoterData")}
            </Card.Title>
            <AvForm onInvalidSubmit={ hdlSubmit }>
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
                                onChange={onChange} />
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="amountDebt">{t("Amount Debt")}</Label>
                            <AvField
                                id="amountDebt"
                                name='amountDebt'
                                value={form.name}
                                validate={{ required: { value: true } }}
                                errorMessage={t("Required Field")}
                                onChange={onChange}
                                onKeyUp={ hdlOnKeyUpRealNumber }
                                onKeyPress={(e) => { return checkNumber(e) }}
                            />
                        </div>
                    </Col>
                    {/* <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="amountFinanced">{t("Amount to finance")}</Label>
                            <AvField
                                id="amountFinanced"
                                name="amountFinanced"
                                value={form.name}
                                validate={{ required: { value: true } }}
                                errorMessage={t("Required Field")}
                                onKeyPress={(e) => { return checkNumber(e) }}
                                onChange={onChange}
                            />
                        </div>
                    </Col> */}
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="anualRate">{t("Annual rate (%)")}</Label>
                            <AvField
                                id="anualRate"
                                name="anualRate"
                                value={form.name}
                                validate={{ required: { value: true } }}
                                errorMessage={t("Required Field")}
                                onChange={onChange}
                                onKeyUp={hdlOnKeyUpPercentageNumber}
                            />
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="effectiveRate">{t("Effective rate (%)")}</Label>
                            <AvField
                                id="effectiveRate"
                                name="effectiveRate"
                                value={form.name}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="paymentPeriod">{t("Payments")}</Label>
                            <Select
                                id="paymentPeriod"
                                name="paymentPeriod"
                                defaultValue={optionsPayments[0]}
                                value={form.name}
                                options={optionsPayments}
                                onChange={onChange} />
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="definedPayment">{t("Defined fee")}</Label>
                            <Select
                                id="definedPayment"
                                name="definedPayment"
                                options={optionsConfirmation}
                                defaultValue={optionsConfirmation[1]}
                                value={form.name}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="customerDefinedPayment">{t("Defined fee value")}</Label>
                            <AvField
                                id="customerDefinedPayment"
                                name="customerDefinedPayment"
                                value={form.name}
                                validate={{ required: { value: true } }}
                                errorMessage={t("Required Field")}
                                disabled={disableDefinedFee}
                                onChange={onChange}
                                onKeyUp={hdlOnKeyUpRealNumber}
                                onKeyPress={(e) => { return checkNumber(e) }}
                            />
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="term">{t("Term (months)")}</Label>
                            <AvField
                                id="term"
                                name="term"
                                value={form.name}
                                validate={{ required: { value: true } }}
                                errorMessage={t("Required Field")}
                                disabled={disableTerm}
                                onChange={onChange}
                                onKeyPress={(e) => { return checkNumber(e) }}
                            />
                        </div>
                    </Col>
                    {/* <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="monthlyBill">{t("Monthly bill")}</Label>
                            <AvField
                                id="monthlyBill"
                                name="monthlyBill"
                                value={form.name}
                                // validate={{ required: { value: true } }}
                                errorMessage={t("Required Field")}
                                onKeyPress={(e) => { return checkNumber(e) }}
                                onChange={onChange}
                            />
                        </div>
                    </Col> */}
                    {/* <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="initialCredit">{t("Initial credit")}</Label>
                            <AvField
                                id="initialCredit"
                                name="initialCredit"
                                value={form.name}
                                onKeyPress={(e) => { return checkNumber(e) }}
                                onChange={onChange}
                            />
                        </div>
                    </Col> */}
                </Row>
                <Row>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="feciPercentage">{t("Feci")}</Label>
                            <Select
                                id="feciPercentage"
                                name="feciPercentage"
                                defaultValue={optionsConfirmation[1]}
                                value={form.name}
                                options={optionsConfirmation}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="feciRate">{t("Feci amount")}</Label>
                            <AvField
                                id="feciRate"
                                name="feciRate"
                                value={form.name}
                                validate={{ required: { value: true } }}
                                disabled={disableSelect}
                                onChange={onChange}
                                onKeyUp={ hdlOnKeyUpPercentageNumber }
                            />
                        </div>
                    </Col>
                    {/* <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="gracePeriodType">{t("Capital grace period")}</Label>
                            <Select
                                id="gracePeriodType"
                                name="gracePeriodType"
                                defaultValue={optionsConfirmation[1]}
                                value={form.name}
                                options={optionsConfirmation}
                                onChange={onChange}
                            />
                        </div>
                    </Col> */}
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="gracePeriodType">{t("Grace period type")}</Label>
                            <Select
                                id="gracePeriodType"
                                name="gracePeriodType"
                                defaultValue={optionsGracePeriodType[1]}
                                value={form.name}
                                options={optionsGracePeriodType}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="gracePeriod">{t("Grace period")}</Label>
                            <AvField
                                id="gracePeriod"
                                name="gracePeriod"
                                value={form.name}
                                validate={{ required: { value: true } }}
                                errorMessage={t("Required Field")}
                                // disabled={disableGracePeriod}
                                onChange={onChange}
                                onKeyPress={(e) => { return checkNumber(e) }}
                            />
                        </div>
                    </Col>
                </Row>
                {/* <Row>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="specialFee">{t("Capital special fee")}</Label>
                            <Select
                                id="specialFee"
                                name="specialFee"
                                defaultValue={optionsConfirmation[1]}
                                value={form.name}
                                options={optionsConfirmation}
                                onChange={onChange} />
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="specialFeeFreq">{t("Periodicity of the special fee")}</Label>
                            <Select
                                id="specialFeeFreq"
                                name="specialFeeFreq"
                                defaultValue={optionsSpecialFees[0]}
                                value={form.name}
                                options={optionsSpecialFees}
                                isDisabled={disableSelectSpecialFee}
                                onChange={onChange} />
                        </div>
                    </Col>
                    <Col md={6} lg={3}>
                        <div className="mb-3">
                            <Label htmlFor="specialFeeAmount">{t("Amount capital special fee")}</Label>
                            <AvField
                                id="specialFeeAmount"
                                name="specialFeeAmount"
                                value={form.name}
                                validate={{ required: { value: true } }}
                                errorMessage={t("Required Field")}
                                disabled={disableSelectSpecialFee}
                                onKeyPress={(e) => { return checkNumber(e) }}
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                </Row> */}
                <Row>
                    <Col md={12} lg={6}>
                        <div className="mb-3">
                            <Label htmlFor="banking">{t("Banking")}</Label>
                            <Select
                                id="banking"
                                name="banking"
                                value={form.name}
                                options={optionsBanking}
                                onChange={onChange}
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
                                onChange={onChange}
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
                                onChange={onChange}
                            />
                        </div>
                    </Col>
                </Row>
            </AvForm>
        </Container>
    )
}

export default FormDataQuoter