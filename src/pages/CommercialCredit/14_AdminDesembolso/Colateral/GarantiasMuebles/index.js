/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react";
import PropTypes from "prop-types";

import { Card, CardBody, Button, CardFooter } from "reactstrap";

//Import Breadcrumb

import Breadcrumb from "../../../../../components/Common/Breadcrumb";

//i18n
import { withTranslation, useTranslation } from "react-i18next";


import Formulario from "./Fromulario"

import HorizontalSteeper from "../../../../../components/Common/HorizontalSteeper";

const PantallaBusqueda = (props) => {
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayClienteModal, setDisplayClienteModal] = useState(false);
  const { t, i18n } = useTranslation();

 

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumb title={t("Colateral")} breadcrumbItem={t("Movable property guarantee")} />

        <HorizontalSteeper processNumber={3} activeStep={ 2 }></HorizontalSteeper>

        <Card>
          <CardBody>
            <Formulario />
          </CardBody>
            <CardFooter style={{textAlign:"right"}}>  
              

              </CardFooter>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(PantallaBusqueda);
