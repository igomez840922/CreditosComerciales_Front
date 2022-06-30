import React, { useEffect, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import PropTypes from "prop-types";

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
  InputGroup,
} from "reactstrap";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation";
import { BackendServices, CoreServices } from "../../../../../services";
import Currency from "../../../../../helpers/currency";


import moment from "moment";
import { saveLogProcess } from "../../../../../helpers/logs_helper";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import * as OPTs from "../../../../../helpers/options_helper";


import { Select } from 'antd';
import { values } from "lodash";

const ModalGobiernoCorporativo = (props) => {
  const currencyData = new Currency()
  const { Option } = Select;
  const [poliza, setpoliza] = useState(null);
  const [polizaSet, setpolizaSet] = useState(null);
  const [aseguradora, setaseguradora] = useState(null);
  const [aseguradoraSet, setaseguradoraSet] = useState(null);
  const [corredora, setcorredora] = useState(null);
  const [corredoraSet, setcorredoraSet] = useState(null);
  const { t, i18n } = useTranslation();
  const [fechaSet, setfechaSet] = useState(null);
  const [fechaSet2, setfechaSet2] = useState(null);
  const backendServices = new BackendServices();
  const coreServices = new CoreServices();
  useEffect(() => {
    if(props?.tipo=="edit"){
      console.log(props?.dataSet?.issuedDate);
      setfechaSet(moment(props?.dataSet?.issuedDate).format("DD-MM-YYYY"))
      setfechaSet2(moment(props?.dataSet?.dueDate).format("DD-MM-YYYY"))
    }else{
      setfechaSet(moment().format("DD-MM-YYYY"))
      setfechaSet2(moment().format("DD-MM-YYYY"))

    }
    loadData()
  }, [props?.isOpen]);
  function loadData(data = null) {
    coreServices.getInsurersCatalog().then(resp => {
      setaseguradora(resp.Records)
    });
    coreServices.getBrokersCatalog().then(resp => {
      setcorredora(resp.Records)
    });
    coreServices.getPolicyTypeCatalog().then(resp => {
      setpoliza(resp.Records)
    });
  }
  function handleSubmit(event, errors, value) {

    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    value.issuedDate=moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD"));
    value.dueDate=moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet2 : (moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD"));
    value.company = aseguradoraSet ?? "";
    value.companyCode = corredoraSet ?? "";
    value.policyType = polizaSet ?? "";
    value.amount = currencyData.getRealValue(value?.amount ?? 0);
    props.getTemporalyData(value, "new")
  }
  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("Policy Data")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          data-dismiss="modal"
          className="close"
          aria-label="Close"
        >
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
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="Nombreasegurado">
                          {t("Insured Name")}
                        </Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="insuredName"
                          value={props?.dataSet?.insuredName ?? ""}
                          id="insuredName"
                          errorMessage={t("Required Field")}
                          validate={{ required: { value: true } }}
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="Monto">{t("Amount")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="amount"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          value={currencyData.format(props?.dataSet?.amount ?? 0)}
                          id="amount"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="Monto">
                          {t("Insurance company")}
                        </Label>
                        <Select noOptionsMessage={() => ""}
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={t("SearchtoSelect")}
                          optionFilterProp="children"
                          defaultValue={props.dataSet.company}
                          onChange={(e) => { setaseguradoraSet(e) }}
                          filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {aseguradora != null ?

                            aseguradora.map((item, index) => (
                              <Option key={index} value={item.Description}>{item.Description}</Option>
                            ))
                            : null}
                        </Select>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="Npoliza">
                          {t("Policy Number")}
                        </Label>
                        <AvField
                          className="form-control"
                          type="text"
                          validate={{
                            number: { value: true, errorMessage: t("InvalidField") },
                          }}
                          name="policyNumber"
                          value={props?.dataSet?.policyNumber ?? ""}
                          id="policyNumber"
                        />
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label>{t("Policy Issue Date")}</Label>
                       
                          <Flatpickr
                            id="issuedDate"
                            name="issuedDate"
                            className="form-control d-block"
                            placeholder={OPTs.FORMAT_DATE_SHOW}
                            options={{
                              dateFormat: OPTs.FORMAT_DATE,
                              //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                              defaultDate: fechaSet
                            }}
                            onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                          /> 
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label>{t("Policy Expiration Date")}</Label>
                        
                          <Flatpickr
                            id="dueDate"
                            name="dueDate"
                            className="form-control d-block"
                            placeholder={OPTs.FORMAT_DATE_SHOW}
                            options={{
                              dateFormat: OPTs.FORMAT_DATE,
                              //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                              defaultDate: fechaSet2
                            }}
                            onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                          />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label>{t("Broker Company")}</Label>
                        <Select noOptionsMessage={() => ""}
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={t("SearchtoSelect")}
                          optionFilterProp="children"
                          defaultValue={props.dataSet.companyCode}
                          onChange={(e) => { setcorredoraSet(e) }}
                          filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {corredora != null ?

                            corredora.map((item, index) => (
                              <Option key={index} value={item.Description}>{item.Description}</Option>
                            ))
                            : null}
                        </Select>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label>{t("Policy type")}</Label>
                        <Select noOptionsMessage={() => ""}
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={t("SearchtoSelect")}
                          optionFilterProp="children"
                          defaultValue={props.dataSet.policyType}
                          onChange={(e) => { setpolizaSet(e) }}
                          filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {poliza != null ?

                            poliza.map((item, index) => (
                              <Option key={index} value={item.Description}>{item.Description}</Option>
                            ))
                            : null}
                        </Select>
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-6">
                        <Label htmlFor="DescripEquipo">
                          {t("Equipment Description")}
                        </Label>
                        <AvField
                          className="form-control"
                          type="textarea"
                          name="description"
                          id="description"
                          title={t("")}
                          value={props?.dataSet?.description??""}
                          rows="4"
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter style={{ textAlign: "right" }}>
                  <Button
                    id="btnNew"
                    color="danger"
                    type="button"
                    style={{ margin: "5px" }}
                    onClick={props.toggle}
                    data-dismiss="modal"
                  >
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}
                    {t("Cancel")}
                  </Button>

                  <Button id="btnSearch" type="submit" color="success" style={{ margin: '5px' }}>
                    <i className="mdi mdi-content-save mdi-12px"></i>
                    {" "} {props.tipo == "new" ? t("Save") : t("Save")}
                  </Button>
                </CardFooter>
              </Card>
            </AvForm>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

ModalGobiernoCorporativo.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default ModalGobiernoCorporativo;
