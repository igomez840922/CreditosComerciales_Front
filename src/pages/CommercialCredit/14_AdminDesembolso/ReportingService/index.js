/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react";
import PropTypes from "prop-types";

import { Card, CardBody, CardFooter, Button } from "reactstrap";

//Import Breadcrumb


import Breadcrumb from "../../../../components/Common/Breadcrumb";
//i18n
import { withTranslation, useTranslation } from "react-i18next";
import Formulario from "./Formulario";
import FormResultados from "./FormResultado";

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
          breadcrumbItem={t("Reporting Services")}
        />

        <Card>
          <CardBody>
            <Formulario />
            <CardFooter style={{textAlign:"right"}}>  
                <Button color="success" type="button" ><i className="mdi mdi-file-find mdi-12px"></i> { t("Search")}</Button>
              </CardFooter>        
                   
              { dataList.length > 0 && (
                  <FormResultados results={ dataList } onScreenOption={props.onScreenOption}/>                  
                )}

                <FormResultados/>




            
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(PantallaBusqueda);
