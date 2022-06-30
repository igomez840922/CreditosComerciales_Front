import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import moment from "moment";
import * as OPTs from "../../../../helpers/options_helper"
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

import { Row, Col, Card, CardBody, Button, Label } from "reactstrap";
import AvInput from "availity-reactstrap-validation/lib/AvInput";

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation";
import Select from "react-select";
import Switch from "react-switch";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";

const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      No
    </div>
  );
};

const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      Si
    </div>
  );
};

const PantallaBusqueda = (props) => {
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayClienteModal, setDisplayClienteModal] = useState(false);
    const { t, i18n } = useTranslation();

  return (
    <React.Fragment>
      <h5>{t("Datos Generales")}</h5>
      <p className="card-title-desc"></p>

      <AvForm id="frmGarantiasMuebles" className="needs-validation">
        <Row>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Fecha desde ")}</Label>
              
              <Flatpickr
                name="estimatedDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  //defaultDate: DataGeneral !== undefined && DataGeneral !==null ? new Date(moment(DataGeneral.instructiveDate, 'YYYY-MM-DD').format()) : new Date()
                }}
                //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                />
              
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label>{t("Fecha Hasta")}</Label>

              
              <Flatpickr
                name="estimatedDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  //defaultDate: DataGeneral !== undefined && DataGeneral !==null ? new Date(moment(DataGeneral.instructiveDate, 'YYYY-MM-DD').format()) : new Date()
                }}
                //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                />
            </div>
          </Col>

          <Row></Row>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Nombre">{t("Nombre")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
                
              />
            </div>
          </Col>
          <Col md="3">
            <AvGroup check className="mb-3">
              <AvInput type="checkbox" name="Nombre" />
              <Label
                style={{ textAlign: "center" }}
                htmlFor="Nombre"
              >
                {t("NULL")}
              </Label>
            </AvGroup>
          </Col>

          <Col md="3">
            <div className="mb-2">
              <Label>{t("Numero de Cliente(s)")}</Label>
              <Select noOptionsMessage={() => ""}  />
            </div>
          </Col>
          <Row></Row>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="Grupoecco">{t("Grupo Economico ")}</Label>
              <AvField
                className="form-control"
                type="text"
                name="searchfield"
                id="searchfield"
                title={t("")}
              />
            </div>
          </Col>
          <Col md="3">
            <AvGroup check className="mb-3">
              <AvInput type="checkbox" name="GrupoEconomico" />
              <Label
                style={{ textAlign: "center" }}
                htmlFor="GrupoEconomico"
              >
                {t("NULL")}
              </Label>
            </AvGroup>
          </Col>
        </Row>
      </AvForm>
    </React.Fragment>
  );
};

export default withTranslation()(PantallaBusqueda);
