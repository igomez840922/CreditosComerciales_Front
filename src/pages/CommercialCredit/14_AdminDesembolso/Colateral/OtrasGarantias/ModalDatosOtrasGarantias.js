import React, { useState } from "react";
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
import { CoreServices } from "../../../../../services";
import Select from "react-select";


import moment from "moment";
import { saveLogProcess } from "../../../../../helpers/logs_helper";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import * as OPTs from "../../../../../helpers/options_helper";

const ModalGobiernoCorporativo = (props) => {
  const { t, i18n } = useTranslation();

  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("CorporateGovernance")}</h5>
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
            <AvForm id="frmSearch" className="needs-validation">
              <Card>
                <CardBody>
                  <Row>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="Nombreasegurado">
                          {t("Nombre Asegurado ")}
                        </Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="searchfield"
                          id="searchfield"
                          errorMessage={t("Required Field")}
                          validate={{ required: { value: true } }}
                        />
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="Monto">{t("Monto ")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="searchfield"
                          id="searchfield"
                        />
                      </div>
                    </Col>
                    <Row></Row>

                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="Monto">
                          {t("Compañia Aseguradora ")}
                        </Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="searchfield"
                          id="searchfield"
                        />
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="Npoliza">
                          {t("Numero de Poliza ")}
                        </Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="searchfield"
                          id="searchfield"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label>{t("Tipo de Poliza")}</Label>
                        <Select noOptionsMessage={() => ""}  />
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label>{t("Codigo de Compañia Corredora")}</Label>
                        <Select noOptionsMessage={() => ""}  />
                      </div>
                    </Col>

                    <Row> </Row>
                    <Col md="3">
                      <div className="mb-3">
                        <Label>{t("Fecha de Emison  de la Poliza  ")}</Label>

                        <Flatpickr
                            id="estimatedDate"
                            name="estimatedDate"
                            className="form-control d-block"
                            placeholder={OPTs.FORMAT_DATE_SHOW}
                            options={{
                              dateFormat: OPTs.FORMAT_DATE,
                              //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                              defaultDate:  new Date()
                            }}
                            //onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                          />   

                      </div>
                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label>{t("Fecha Vencimiento de la Poliza ")}</Label>

                        <Flatpickr
                            id="estimatedDate"
                            name="estimatedDate"
                            className="form-control d-block"
                            placeholder={OPTs.FORMAT_DATE_SHOW}
                            options={{
                              dateFormat: OPTs.FORMAT_DATE,
                              //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                              defaultDate: new Date()
                            }}
                            //onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
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

                  <Button
                    id="btnSearch"
                    color="success"
                    type="submit"
                    style={{ margin: "5px" }}
                  >
                    <i className="mdi mdi-content-save mdi-12px"></i>{" "}
                    {props.tipo == "guardar" ? t("Save") : t("Save")}
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
