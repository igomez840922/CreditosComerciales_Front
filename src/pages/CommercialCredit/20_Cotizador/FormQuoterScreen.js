import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Card,
    Row,
    Col,
    Form,
    Container,
    Button
} from "react-bootstrap";
import Select from 'react-select'
import { AvForm, AvField } from 'availity-reactstrap-validation';
import LoadingOverlay from "react-loading-overlay";

import FormContainerQuoter from './FormContainerQuoter'
import FormQuoterTypeNatural from './FormQuoterTypeNatural';
import FormDataQuoter from './FormDataQuoter';
import FormCommonFields from './FormCommonFields';
import TableResultQuoter from './TableResultQuoter';
import quoterCompuesto from "./dummy/quoterCompuesto";
import { BackendServices, CoreServices } from "../../../services";
import Currency from '../../../helpers/currency';
import checkNumber from '../../../helpers/checkNumber'
import { useFormQuoter } from './Hooks/useFormQuoter';
import { FormData } from './FormData';

const currencyValidation = new Currency()
const services = new BackendServices()

const validationsForm = (form) => { }

const FormQuoterScreen = (props) => {
    const { dataPrefillClient } = props
    const initialForm = {
        // // common fields
        // personType: "Natural",
        // idType: "",
        // idnumber: "",
        // // client data
        // firstname: "",
        // name: "",
        // secondname: "",
        // firstlastname: "",
        // secondlastname: "",
        // birthDate: "",
        // nationality: "",
        // phoneNumber: "",
        // email: "",
        // // quoter data
        loanType: "compuesto",
        amountDebt: 0,
        anualRate: 0,
        effectiveRate: 0,
        paymentPeriod: 1,
        definedPayment: "No",
        customerDefinedPayment: 0,
        term: 0,
        feciPercentage: "No",
        feciRate: 0,
        gracePeriodType: "NA",
        gracePeriod: 0,
        // banking: "",
        // legalExpenses: 0,
        // financialTrust: 0,
    }
    // hooks
    const { t, i18n } = useTranslation();
    // custom hooks
    const [form, setForm] = useState(initialForm)
    const [disableSelect, setDisableSelect] = useState(true)
    const [disableDefinedFee, setDisableDefinedFee] = useState(true)
    const [disableTerm, setDisableTerm] = useState(false)
    const [disableSelectSpecialFee, setDisableSelectSpecialFee] = useState(true)
    const [disableSelectGracePeriod, setDisableSelectGracePeriod] = useState(true)
    const [typePerson, setTypePerson] = useState("Natural")
    const [paymentPlan, setPaymentPlan] = useState([])
    const [loader, setLoader] = useState(false)
    const {
        response,
        loading,
    } = useFormQuoter()

    // handlers
    const handleChange = (evt, propertyName) => {

        const name = evt?.target
            ? evt.target.name
            : propertyName.name

        const value = evt?.target
            ? evt.target.value
            : evt.value

        if (propertyName?.name) {
            console.info("Here")
            handleSelect(propertyName.name, value)
        }

        setForm({
            ...form,
            [name]: value
        })

    }

    const handleSelect = (propertyName, value) => {
        switch (propertyName) {
            case 'feciPercentage':
                const disableFeci = value == "Si"
                    ? false
                    : true
                setDisableSelect(disableFeci)
                return
            case 'personType':
                const type = value == "Natural"
                    ? "Natural"
                    : "Juridica"
                setTypePerson(type)
                return
            case 'definedPayment':
                const definedFee = value == "Si"
                    ? false
                    : true
                setDisableDefinedFee(definedFee)
                setDisableTerm(!definedFee)
                return
            case 'specialFee':
                const disableSpecialFee = value == "Si"
                    ? false
                    : true
                setDisableSelectSpecialFee(disableSpecialFee)
                return
            case 'gracePeriodType':
                const disableGracePeriod = value == "p"
                    ? false
                    : true
                setDisableSelectGracePeriod(disableGracePeriod)
                return
            default:
                break;
        }
    }

    const hdlOnKeyUpRealNumber = (e) => {
        let input = currencyValidation.getRealValue(e.target.value)
        e.target.value = currencyValidation.format(input)
        console.info("real number:", input)
    }

    const hdlOnKeyUpPercentageNumber = (e) => {
        let input = currencyValidation.getRealPercent(e.target.value)
        e.target.value = currencyValidation.formatPercent(input)
        console.info("percentage number:", input)
    }

    const handleFormSubmit = async () => {
        console.group("Handle form submit!")
        console.log("data submitted", form)
        console.groupEnd()

        setLoader(true)
        await services.getQuoterPaymentPlan(
            form.loanType,
            form.amountDebt,
            form.anualRate,
            form.feciRate,
            form.term,
            form.paymentPeriod,
            form.gracePeriod,
            form.gracePeriodType,
            form.customerDefinedPayment
        )
            .then(resp => {
                setLoader(false)
                console.info("response service", resp)
                // setPaymentPlan(dataPaymentPlan.payments)
                setPaymentPlan(resp.payments)
                // setForm(initialForm)
                // console.info("data payment plan", dataPaymentPlan.payments)    
            })

    }

    return (
        <>
            {/* <FormContainerQuoter>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            {t("ClientData")}
                        </Card.Title>
                        <Row>
                            <FormCommonFields
                                form={form}
                                typePerson={typePerson}
                                dataPrefillClient={dataPrefillClient}
                                onChange={handleChange}
                            />
                        </Row>
                        <Row>
                            <FormDataQuoter
                                onChange={handleChange}
                                hdlOnKeyUpRealNumber={hdlOnKeyUpRealNumber}
                                hdlOnKeyUpPercentageNumber={hdlOnKeyUpPercentageNumber}
                                form={form}
                                disableSelect={disableSelect}
                                disableDefinedFee={disableDefinedFee}
                                disableTerm={disableTerm}
                                disableSelectSpecialFee={disableSelectSpecialFee}
                                disableGracePeriod={disableSelectGracePeriod}
                            />
                        </Row>
                        <Row >
                            <Col className='d-grid mt-5'>
                                <Button
                                    size='lg'
                                    className='float-end'
                                    type='submit'
                                // onClick={handleFormSubmit}
                                >
                                    {t("Calculate")}
                                </Button>
                            </Col>
                        </Row>
                        <LoadingOverlay
                            active={loader}
                            spinner={true}
                            text={t("Calculating payment plan")}
                        >
                        </LoadingOverlay>
                    </Card.Body>
                </Card>
            </FormContainerQuoter> */}
            <FormData
                clientExist={dataPrefillClient}
                // onChange={handleChange}
            />
            {/* <TableResultQuoter
                paymentPlan={paymentPlan}
            /> */}
            <div style={{ textAlign: "right" }}>
                <Button variant="danger" style={{ margin: '5px 0px' }} type="button">
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                </Button>
                <Button variant="outline-secondary" type="button" style={{ margin: '5px', color: "black" }}><i className="mdi mdi-printer mdi-12px"></i>
                    {" "}{t("Print")}
                </Button>
                <Button variant="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                    {" "}{t("Save")}
                </Button>
            </div>

        </>
    )
}

export default FormQuoterScreen