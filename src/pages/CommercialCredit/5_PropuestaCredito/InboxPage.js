import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelper } from "../../../helpers";
import {
  Card,
  CardBody,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import FormBusqueda from "./inbox/FormBusqueda"
import FormResultados from "./inbox/FormResultados.js"
import { ServicioPropuestaCredito } from "../../../services/PropuestaCredito";
const InboxPage = props => {
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  //buscamos los informes de gestion ordenados por fecha desc
  function searchData(criteria) {
    const servicioPropuestaCredito = new ServicioPropuestaCredito();
    setLoading(true);
    servicioPropuestaCredito.consultarDocumentosPropuestaCredito(criteria)
      .then((documents) => {
        setLoading(false);
        setDataList(documents);
        setShowResults(true);
      })
      .catch((error) => {
        setLoading(false);
      });
  }
  const n = translationHelper('navigation');
  return (
    <div className="page-content">
      <Breadcrumbs title={n("Commercial Credit")} breadcrumbItem={n("CreditProposal")} />
      <Card>
        <CardBody>
          <FormBusqueda onSubmit={searchData} />
          {showResults && (
            <FormResultados results={dataList} />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
export default InboxPage;
