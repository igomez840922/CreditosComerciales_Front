/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react";
import PropTypes from "prop-types";

import { Card, CardBody, CardFooter, Button } from "reactstrap";

//Import Breadcrumb

import Breadcrumb from "../../../../../components/Common/Breadcrumb";

//i18n
import { withTranslation, useTranslation } from "react-i18next";
import Formulario from "./Formulario";

import HorizontalSteeper from "../../../../../components/Common/HorizontalSteeper";

import {
  Row,
  Col,
  TabPane,
  Nav,
  NavLink,
  Label,
  TabContent
} from "reactstrap"

const PantallaBusqueda = (props) => {
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayClienteModal, setDisplayClienteModal] = useState(false);
  const { t, i18n } = useTranslation();


  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumb
          title={t("Colateral")}
          breadcrumbItem={t("LineofCredit")}
        />

        <HorizontalSteeper processNumber={3} activeStep={2}></HorizontalSteeper>

        <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
          <Col style={{ textAlign: "right" }}>
            <Button color="danger" style={{ margin: '5px 5px' }} type="button" ><i className="mdi mdi-arrow-left-bold-circle-outline mid-12px"></i> {t("Devolver")}</Button>
            <Button color="danger" style={{ margin: '5px 5px' }} type="button" ><i className="mdi mdi-arrow-left-bold-circle-outline mid-12px"></i> {t("Cancelar")}</Button>
            <Button color="success" style={{ margin: '5px 5px' }} type="button" ><i className=""></i> {t("Generar Documento")}</Button>
            <Button color="success" style={{ margin: '5px 5px' }} type="button" ><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
          </Col>
        </Row>

        <Card>
          <CardBody>
            <Formulario />
          </CardBody>
        </Card>
        <Row style={{ marginTop: "0px", marginBottom: "15px" }}>
          <Col style={{ textAlign: "right" }}>
            <Button color="danger" style={{ margin: '5px 5px' }} type="button" ><i className="mdi mdi-arrow-left-bold-circle-outline mid-12px"></i> {t("Devolver")}</Button>
            <Button color="danger" style={{ margin: '5px 5px' }} type="button" ><i className="mdi mdi-arrow-left-bold-circle-outline mid-12px"></i> {t("Cancelar")}</Button>
            <Button color="success" style={{ margin: '5px 5px' }} type="button" ><i className=""></i> {t("Generar Documento")}</Button>
            <Button color="success" style={{ margin: '5px 5px' }} type="button" ><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {t("Advance")}</Button>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(PantallaBusqueda);
