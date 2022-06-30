import { useEffect, useRef, useState } from "react";
import { BackendServices } from "../../../../services/";
import Currency from "../../../../helpers/currency";
import { optionsPersonType } from "../dummy/optionsSelect";
import { LoadAsyncSelects } from "../searchDataSelects";

const services = new BackendServices();
const currencyValidation = new Currency();

export const useFormQuoter = (initialForm) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [typePerson, setTypePerson] = useState(true);
  const [selectionFields, setselectionFields] = useState(optionsPersonType);
  const [disableFeci, setDisableFeci] = useState(true);
  const [disableDefinedFee, setDisableDefinedFee] = useState(true);
  const [disableTerm, setDisableTerm] = useState(false);
  const [disableGracePeriod, setDisableGracePeriod] = useState(true);
  const [optionsIdTypes, setOptionsIdTypes] = useState([]);
  const [optionsCountries, setOptionsCountries] = useState([]);
  const [optionsBanks, setOptionsBanks] = useState([]);

  useEffect(async () => {
    const { idTypesList, countriesList, banksList } = await LoadAsyncSelects();
    setOptionsIdTypes(idTypesList);
    setOptionsCountries(countriesList.Records);
    setOptionsBanks(banksList.Records);

    return async () => {
      await LoadAsyncSelects();
    };
  }, []);

  const hdlOnChange = (evt, selectField) => {
    const name = evt?.target ? evt.target.name : selectField.name;

    let value = evt?.target ? evt.target.value : evt.value;

    if (name === "amountDebt" || name === "customerDefinedPayment") {
      // value = Number(currencyValidation.getRealValue(evt.target.value)).toFixed(2)
      value = currencyValidation.getRealValue(evt.target.value);
      console.info("value", value);
    }

    if (name === "anualRate" || name === "feciRate") {
      value = currencyValidation.getRealPercent(evt.target.value);
      console.info("value", value);
    }

    if (selectField?.name) {
      auxSelectFields(selectField.name, value);
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleChangeInput = (evt) => {
    const regexOnlyNum = new RegExp(/^[0-9]+$/);
    const regexOnlyNum2 = evt.target.value.replace(/[^0-9,.]/g, "");
    const valueAmountDebt = regexOnlyNum2;
  };

  const handleKeyOnlyNum = (evt) => {
    const keyPress = evt.key;
    const regexOnlyNum = /^[0-9,.]+$/;

    if (!regexOnlyNum.test(keyPress)) return;
    // console.log('here!');
  };

  const hdlOnKeyUpRealNumber = (e) => {
    let input = currencyValidation.getRealValue(e.target.value);
    e.target.value = currencyValidation.format(input);
    console.info("real number decimal:", Number(input).toFixed(2));
  };

  const hdlOnKeyUpPercentageNumber = (e) => {
    let input = currencyValidation.getRealPercent(e.target.value);
    e.target.value = currencyValidation.formatPercent(input);
    console.info("percentage number:", input);
  };

  const hdlOnSubmit = (evt) => {
    console.group("FORM SUBMIT");
    console.info("evt:", evt);
    console.groupEnd();
  };

  const hdlOnValidSubmit = async () => {
    console.group("VALID FORM");
    console.info("Data submitted!", form);

    setLoading(true);
    const resp = await services.getQuoterPaymentPlan(
      form.loanType,
      form.amountDebt,
      form.anualRate,
      form.feciRate,
      form.term,
      form.paymentPeriod,
      form.gracePeriod,
      form.gracePeriodType,
      form.customerDefinedPayment
    );
    setLoading(false);

    console.info("Service response", resp);

    setResponse(resp.payments);
    setForm(initialForm);

    console.groupEnd();
  };

  const hdlOnInvalidSubmit = (evt, errors, values) => {
    console.group("INVALID FORM");
    console.info("Not working!");
    console.groupEnd();
  };

  const hdlTest = (evt) => {
    console.group("HANDLE TEST");
    console.info("", evt);
    console.groupEnd();
  };

  const auxSelectFields = (selectFieldName, selectedValue) => {
    switch (selectFieldName) {
      case "feciSelect":
        const disableFeci = selectedValue === "Si" ? false : true;
        setDisableFeci(disableFeci);
        return;
      case "personType":
        const type = selectedValue === "Natural" ? "Natural" : "Juridica";
        setForm({
          personType: type,
        });
        return;
      case "definedPayment":
        const definedFee = selectedValue === "Si" ? false : true;
        setDisableDefinedFee(definedFee);
        setDisableTerm(!definedFee);
        return;
      case "gracePeriodSelect":
        const disableGracePeriod = selectedValue === "Si" ? false : true;
        setDisableGracePeriod(disableGracePeriod);
        return;
      default:
        break;
    }
  };

  const changeSelectOptions = (valueCheck, option) => {
    const activateOption = valueCheck === option ? false : true;

    return activateOption;
  };

  return {
    form,
    errors,
    loading,
    response,
    hdlTest,
    hdlOnKeyUpRealNumber,
    hdlOnKeyUpPercentageNumber,
    hdlOnChange,
    hdlOnSubmit,
    hdlOnInvalidSubmit,
    hdlOnValidSubmit,
    disableFeci,
    disableDefinedFee,
    disableTerm,
    disableGracePeriod,
    optionsIdTypes,
    optionsCountries,
    optionsBanks,
  };
};
