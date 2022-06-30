import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Button,
  Label,
  Input,
  Modal,
  Card,
  CardBody,
  CardFooter,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import Select from "react-select";
import { BackendServices, CoreServices } from "../../../../../services";
import * as OPTs from "../../../../../helpers/options_helper"
import moment from "moment";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Currency from "../../../../../helpers/currency";
const ModalSegurosActualesEmpresa = (props) => {
  const currencyData = new Currency();
  const [fechaSet, setfechaSet] = useState("");

  const { t, i18n } = useTranslation();
  const [campoRequeridoSeguro, setcampoRequeridoSeguro] = useState(false);
  const [insuranceType, setinsuranceType] = useState(null);
  const [tipoSeguro, settipoSeguro] = useState(undefined);
  const [coreServices, setcoreServices] = useState(new CoreServices())
  const [backendServices, setbackendServices] = useState(new BackendServices())

  // Submitimos formulario para busqueda de clientes
  const [dataTipoSeguro, setdataTipoSeguro] = useState(null)
  function handleSubmit(event, errors, values) {
    if (tipoSeguro == undefined) {
      setcampoRequeridoSeguro(true);
      return;
    } else {
      setcampoRequeridoSeguro(false);
    }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.dueDate = moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD"))
    values.insuranceType = { code: tipoSeguro.label, name: tipoSeguro.label }
    if (props.tipo == "guardar") {
      props.dataManagament(values, props.tipo);
    } else {
      values.insuranceId = props.dataSeguros.insuranceId;
      props.dataManagament(values, props.tipo);

    }
  }
  React.useEffect(() => {
    // Read Api Service data     
    var defaultVal = null;
    if(props.tipo == "guardar"){
      setfechaSet(moment().format("DD-MM-YYYY"))

    }else{
      setfechaSet(moment(props.dataSeguros.dueDate).format("DD-MM-YYYY"))
    }

    settipoSeguro(undefined)
    //backendServices.retrieveInsuranceType().then(resp => {
    coreServices.getPolicyTypeCatalog().then(resp => {
      let json = [];
      for (let i = 0; i < resp.Records.length; i++) {
        json.push({ label: resp.Records[i]["Description"], value: resp.Records[i]["Code"] })
      }
      setdataTipoSeguro(json);
      try {
        if (json.length > 0 && props.dataSeguros.insuranceType !== null && tipoSeguro === undefined) {
          defaultVal = json.find(x => (x.label).toUpperCase() === (props.dataSeguros.insuranceType.code).toUpperCase());
          if (defaultVal !== undefined) {
            settipoSeguro(defaultVal);
          }
        }

      }
      catch (err) { }
    })

  }, [props.isOpen]);

  return (
    <Modal
      size="md"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("CurrentCompanyInsurance")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          data-dismiss="modal"
          className="close"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#f3f5f7" }}>
        <Row>
          <Col xl="12">
            <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="insuranceCompany">{t("InsuranceCompany")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="company"
                          value={props.dataSeguros.company}
                          id="company"
                          errorMessage={t("Required Field")}
                          validate={{ required: { value: true } }}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="insuranceType">{t("InsuranceType")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => { settipoSeguro(dataTipoSeguro.find(x => x.label === e.label)); setinsuranceType(e) }}
                          options={dataTipoSeguro}
                          id="sustainableCustomer"
                          classNamePrefix="select2-selection"
                          placeholder={t("toselect")}
                          value={tipoSeguro}
                        />
                        {campoRequeridoSeguro ?
                          <p className="message-error-parrafo">{t("Required Field")}</p>
                          : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="amount">{t("Amount")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="amount"
                          value={currencyData.format(props.dataSeguros?.amount ?? 0)}
                          id="amount" />
                      </div>
                    </Col>
                    <Col md="6">
                      <Label htmlFor="expiration">{t("Expiration")}</Label>
                      {fechaSet ?
                        <Flatpickr
                          name="dueDate"
                          id="dueDate"
                          className="form-control d-block"
                          placeholder={OPTs.FORMAT_DATE_SHOW}
                          options={{
                            dateFormat: OPTs.FORMAT_DATE,
                            defaultDate: fechaSet,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                          }}
                          onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                        // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr).format("YYYY-MM-DD") } }) }}
                        /> : null}
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter style={{ textAlign: "right" }}>

                  <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                  </Button>
                  {props.botones ?
                    <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                      {" "} {props.tipo == "guardar" ? t("Save") : t("Save")}
                    </Button> : null}
                </CardFooter>
              </Card>
            </AvForm>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
ModalSegurosActualesEmpresa.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};
export default ModalSegurosActualesEmpresa;
