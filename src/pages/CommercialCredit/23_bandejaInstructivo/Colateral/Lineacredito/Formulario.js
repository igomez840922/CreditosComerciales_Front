import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardFooter,
  TabPane,
  Nav,
  NavLink,
  Label,
  TabContent
} from "reactstrap"
import { Select } from 'antd';
import classnames from "classnames"
import { Tabs, Tab } from 'react-bootstrap';
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation";
import ApiServicesCommon from "../../../../../services/Common/ApiServicesCommon";
import { BackendServices, CoreServices } from "../../../../../services";
// import Select from "react-select";
import Switch from "react-switch";
import Breadcrumb from "../../../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import moment from "moment";
import { saveLogProcess } from "../../../../../helpers/logs_helper";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import * as OPTs from "../../../../../helpers/options_helper";

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
  const { Option } = Select;
  const [activeTab, setactiveTab] = useState(1);
  const location = useLocation();
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLocation, setdataLocation] = useState(undefined);
  const [dataGlobal, setdataGlobal] = useState({});
  const [dataFacilidad, setdataFacilidad] = useState(null);
  const [dataFacilidadSet, setdataFacilidadSet] = useState(null);
  const [idFacilidad, setidFacilidad] = useState(null);
  const { t, i18n } = useTranslation();
  const backendServices = new BackendServices();
  useEffect(() => {
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        location.data.transactionId = 0;
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setdataLocation(location.data);
        loadData(location.data)
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setdataLocation(result);
        loadData(result)
      }
    }

  }, []);
  function loadData(data) {
    backendServices.consultGeneralDataPropCred(data.transactionId)
      .then((data) => {
        console.log(data);
        dataGlobal.requestId = data[0].requestId;
        setdataGlobal(dataGlobal);
        // consultarFacilidades
        backendServices.consultarFacilidades(data[0].requestId).then(resp => {
          if (resp.length > 0) {
            setdataFacilidadSet(resp)
            setidFacilidad(resp[0].facilityId)
            setdataFacilidad(resp.map((items, index) => (
              items.debtor != "  " ?
                <Tab className="m-4" key={index} eventKey={index} title={items.debtor}>

                </Tab> : null
            )));
          }
        });
      });
  }
  function handleSelect(key) {
    setidFacilidad(dataFacilidadSet[key].facilityId);
  }
  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        setactiveTab(tab)
        window.scrollTo(0, 0)
      }
    }
  }
  return (
    <React.Fragment>
      <Card>
        <Col>
          <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-3" onSelect={(e) => { handleSelect(e) }}>
            {dataFacilidad}
          </Tabs>
        </Col>
        <Col>
          <AvForm id="frmGarantiasMuebles" className="needs-validation">
            <h5>{t("Datos Generales")}</h5>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Tipo de Solicitud")}</Label>
                  <Select noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    // defaultValue={props.dataCapex1.back}
                    // onChange={(e) => { setCodigoBanco(e) }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {dataFacilidadSet != null ?

                      dataFacilidadSet.map((item, index) => (
                        <Option key={index} value={item.debtor}>{item.debtor}</Option>
                      ))
                      : null}
                  </Select>
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Tipo de Modificacion")}</Label>
                  <Select noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    // defaultValue={props.dataCapex1.back}
                    // onChange={(e) => { setCodigoBanco(e) }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {dataFacilidadSet != null ?

                      dataFacilidadSet.map((item, index) => (
                        <Option key={index} value={item.debtor}>{item.debtor}</Option>
                      ))
                      : null}
                  </Select>
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="TipoModificacionOtra">
                    {t("Tipo de Modificacion Otra")}
                  </Label>
                  <AvField
                    className="form-control"
                    type="text"
                    name="searchfield"
                    id="searchfield"
                    title={t("Especificar")}
                  />
                </div>
              </Col>
              <Row> </Row>
              <Col md="3">
                <div className="mb-2">
                  <Label>{t("Tipo de Linea")}</Label>
                  <Select noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    // defaultValue={props.dataCapex1.back}
                    // onChange={(e) => { setCodigoBanco(e) }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {dataFacilidadSet != null ?

                      dataFacilidadSet.map((item, index) => (
                        <Option key={index} value={item.debtor}>{item.debtor}</Option>
                      ))
                      : null}
                  </Select>
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="Monto">{t("Monto")}</Label>
                  <AvField
                    className="form-control"
                    type="text"
                    name="searchfield"
                    id="searchfield"
                  />
                </div>
              </Col>
              <Col md="2">
                <div className="mb-2">
                  <Label>{t("Origen")}</Label>
                  <Select noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    // defaultValue={props.dataCapex1.back}
                    // onChange={(e) => { setCodigoBanco(e) }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {dataFacilidadSet != null ?

                      dataFacilidadSet.map((item, index) => (
                        <Option key={index} value={item.debtor}>{item.debtor}</Option>
                      ))
                      : null}
                  </Select>
                </div>
              </Col>

              <Row></Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="NoCuenta">
                    {t("No. de Linea de Credito")}
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
                  <Label htmlFor="Sobregiro">{t("Sobregiro")}</Label>
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
                <div className="mb-3">
                  <Label htmlFor="Tasa">{t("Tasa")}</Label>
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
                  <Label htmlFor="nomaster">
                    {t("No. de Línea de Crédito ")}
                  </Label>
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
                <div className="mb-3">
                  <Label htmlFor="Nocuentadebitar">
                    {t("Cuenta de Cliente, a debitar")}
                  </Label>
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
                <div className="mb-3">
                  <Label htmlFor="nombrede">{t("A Nombre de")}</Label>
                  <AvField
                    className="form-control"
                    type="text"
                    name="searchfield"
                    id="searchfield"
                    title={t("")}
                  />
                </div>
              </Col>
              <Row></Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="Producto">{t("Producto")}</Label>
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
                <div className="mb-3">
                  <Label htmlFor="SubProducto">{t("Sub-Producto")}</Label>
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
                <div className="mb-3">
                  <Label htmlFor="Centrocosto">{t("Centro de costo")}</Label>
                  <AvField
                    className="form-control"
                    type="text"
                    name="searchfield"
                    id="searchfield"
                    title={t("")}
                  />
                </div>
              </Col>
              <Row></Row>
              <Col md="3">
                <div className="mb-2">
                  <Label>{t("Pais de Destino")}</Label>
                  <Select noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    // defaultValue={props.dataCapex1.back}
                    // onChange={(e) => { setCodigoBanco(e) }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {dataFacilidadSet != null ?

                      dataFacilidadSet.map((item, index) => (
                        <Option key={index} value={item.debtor}>{item.debtor}</Option>
                      ))
                      : null}
                  </Select>
                </div>
              </Col>
              <Col md="3">
                <div className="mb-2">
                  <Label>{t("Actividad")}</Label>
                  <Select noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    // defaultValue={props.dataCapex1.back}
                    // onChange={(e) => { setCodigoBanco(e) }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {dataFacilidadSet != null ?

                      dataFacilidadSet.map((item, index) => (
                        <Option key={index} value={item.debtor}>{item.debtor}</Option>
                      ))
                      : null}
                  </Select>
                </div>
              </Col>
              <Col md="3">
                <div className="mb-2">
                  <Label>{t("Sub-Actividad CINU")}</Label>
                  <Select noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    // defaultValue={props.dataCapex1.back}
                    // onChange={(e) => { setCodigoBanco(e) }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {dataFacilidadSet != null ?

                      dataFacilidadSet.map((item, index) => (
                        <Option key={index} value={item.debtor}>{item.debtor}</Option>
                      ))
                      : null}
                  </Select>
                </div>
              </Col>
              <Row></Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="Plazolinea">{t("Plazo de la Linea")}</Label>
                  <AvField
                    className="form-control"
                    type="text"
                    name="searchfield"
                    id="searchfield"
                    title={t("Meses")}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="Plazodesembolso">
                    {t("Plazos de los Desembolsos")}
                  </Label>
                  <AvField
                    className="form-control"
                    type="text"
                    name="searchfield"
                    id="searchfield"
                    title={t("Meses")}
                  />
                </div>
              </Col>
              <Row></Row>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Fecha de Apertura")}</Label>
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
                //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                />
                 
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Fecha de Vencimiento")}</Label>

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
              <Col md="3">
                <div className="mb-3">
                  <Label>{t("Fecha de Revision")}</Label>

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
                //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                />

                
                </div>
              </Col>
              <Row></Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="comision">{t("Comision")}</Label>
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
                <div className="mb-3">
                  <Label htmlFor="Itbms">{t("ITBMS")}</Label>
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
                <div className="mb-3">
                  <Label htmlFor="Total">{t("Total")}</Label>
                  <AvField
                    className="form-control"
                    type="text"
                    name="searchfield"
                    id="searchfield"
                    title={t("")}
                  />
                </div>
              </Col>
              <Row></Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="Notaria">{t("Notaria")}</Label>
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
                <div className="mb-3">
                  <Label htmlFor="Timbres">{t("Timbres")}</Label>
                  <AvField
                    className="form-control"
                    type="text"
                    name="searchfield"
                    id="searchfield"
                    title={t("")}
                  />
                </div>
              </Col>
              <Row></Row>
              <Col md="6">
                <div className="mb-6">
                  <Label htmlFor="FacturaAbogado">
                    {t("Factura de Abogado")}
                  </Label>
                  <AvField
                    className="form-control"
                    type="text"
                    name="searchfield"
                    id="searchfield"
                    title={t("")}
                  />
                </div>
              </Col>
              <Row></Row>
              <Col md="9">
                <div className="mb-9">
                  <Label htmlFor="InstruccionesEspeciales">
                    {t("Instrucciones Especiales ")}
                  </Label>
                  <AvField
                    className="form-control"
                    type="textarea"
                    name="searchfield"
                    id="searchfield"
                    title={t("")}
                    rows="7"
                  />
                </div>
              </Col>
            </Row>
          </AvForm>
        </Col>
      </Card>
    </React.Fragment>
  );
};

export default withTranslation()(PantallaBusqueda);
