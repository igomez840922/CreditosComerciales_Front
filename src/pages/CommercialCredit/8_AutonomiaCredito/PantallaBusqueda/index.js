/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types';

import {
  Card,
  CardBody,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"

import FormularioBusqueda from "./FormularioBusqueda"
import ResultadosBusqueda from "./ResultadosBusqueda.js"

const PantallaBusqueda = props => {
  
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);
 
    
  //buscamos las Propuestas de Credito
  function searchData(values) {
    
    //console.log(values);
    const data = [
      { id: 1, date:"17/09/2021",clientnumber: '600149013', clientname: "Aseguradora del ITSMO", procedure:"321654987", facilityType:"Linea de credito rotativa", proposalType:"Mención" },
      { id: 2, date:"17/09/2021",clientnumber: '600149013', clientname: "Aseguradora del ITSMO", procedure:"321654987", facilityType:"Linea de credito rotativa", proposalType:"Mención" },
      { id: 3,  date:"17/09/2021",clientnumber: '600149013', clientname: "Aseguradora del ITSMO", procedure:"321654987", facilityType:"Linea de credito rotativa", proposalType:"Mención" },
      { id: 4,  date:"17/09/2021",clientnumber: '600149013', clientname: "Aseguradora del ITSMO", procedure:"321654987", facilityType:"Linea de credito rotativa", proposalType:"Mención" },
    ];
    setDataList(data);
    setShowResults(true);
  }

  
   
  return (
    <React.Fragment>      

      <div className="page-content">
        
          <Breadcrumbs title={props.t("CommercialCredit")} breadcrumbItem={props.t("CreditAutonomy")} />


          <Card>
      <CardBody>
          <FormularioBusqueda onSubmit={ searchData }/>

          { showResults && (
            <ResultadosBusqueda results={ dataList }/>
        )}

      </CardBody>
    </Card>          
        
      </div>
      
    </React.Fragment>
  )
}


export default (withTranslation()(PantallaBusqueda))
