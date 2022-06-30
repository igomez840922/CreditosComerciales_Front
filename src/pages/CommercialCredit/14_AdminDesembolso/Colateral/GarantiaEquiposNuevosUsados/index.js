/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react";
import PropTypes from "prop-types";

import { Card, CardBody } from "reactstrap";

//Import Breadcrumb

import Breadcrumb from "../../../../../components/Common/Breadcrumb";
import Currency from "../../../../../helpers/currency";

//i18n
import { withTranslation, useTranslation } from "react-i18next";

import Formulario from "./Formulario";

import HorizontalSteeper from "../../../../../components/Common/HorizontalSteeper";

const PantallaBusqueda = (props) => {
  const currencyData = new Currency()
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
          breadcrumbItem={t("Warranties New and Used Furniture")}
        />


        <HorizontalSteeper processNumber={3} activeStep={2}></HorizontalSteeper>

        <Card>
          <CardBody>
            <Formulario />
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(PantallaBusqueda);
