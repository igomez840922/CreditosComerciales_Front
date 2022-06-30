import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import Select from "react-select";
import { useLocation, useHistory } from 'react-router-dom'
import LoadingOverlay from 'react-loading-overlay';

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardFooter,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"
import { Link } from "react-router-dom"

import { CoreServices, BackendServices } from '../../services';
import Currency from "../../helpers/currency";

const ShortLongTermDebts = (props) => {

  const { t, i18n } = useTranslation();

  const [longDataRows, setlongDataRows] = useState([]);
  const [shortDataRows, setshortDataRows] = useState([]);

  const [isActiveLoading, setIsActiveLoading] = useState(false);

  const [apiServiceBackend, setapiServiceBackend] = useState(new BackendServices());
  const [apiCoreServices, setCoreServices] = useState(new CoreServices());

  const currencyData = new Currency();

  //On Mounting (componentDidMount)
  React.useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    loadData();
  }

  //cargar lista de deudas Corto Plazo
  function loadData() {
    //var deudas = {debtype:"short",facilityType:item.dc_descr_corta_rela, bank:item.dc_nom_asoc,proposalAmount:item.dc_saldo_actual,aprovedAmount:item.dc_monto_original,fechaStart:item.dc_fec_inicio_rel,fechaEnd:item.dc_fec_fin_rel}
    
    apiCoreServices.getAllTermDebtsByTransaction(props.transactId)
      .then((data) => {
        if (data !== null && data !== undefined) {        
          var rows = data.longTermresult.map((data, index) => (
            <tr key={index}>
              <td>{data.bank}</td>
              <td>{data.facilityType}</td>
              <td>${currencyData.formatTable(data.approvedAmount.toFixed(2))}</td>
              <td>${currencyData.formatTable(data.balance.toFixed(2))}</td>
              <td>${currencyData.formatTable(data.variation.toFixed(2))}</td>
            </tr>)
          );
          setlongDataRows(rows);

          var rows2 = data.shortTermresult.map((data, index) => (
            <tr key={index}>
              <td>{data.bank}</td>
              <td>{data.facilityType}</td>
              <td>${currencyData.formatTable(data.approvedAmount.toFixed(2))}</td>
              <td>${currencyData.formatTable(data.balance.toFixed(2))}</td>
              <td>${currencyData.formatTable(data.variation.toFixed(2))}</td>
            </tr>)
          );
          setshortDataRows(rows2);
        }
      }).catch((error) => { });
  }

  return (

    <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
        
        <Card>          
                  <Row>
                    <Col md="6">
                      <h5 className="card-sub-title">{t("ShortTermDebtsHistory")}</h5>
                    </Col>                    
                  </Row>                  
          <CardBody>
          
        <Row>
        <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table">
              <thead>
                <tr>
                  <th>{t("Bank")}</th>
                  <th>{t("FacilityType")}</th>
                  <th>{t("ApprovalRisk")}</th>
                  <th>{t("Balance")}</th>
                  <th>{t("Variation")}</th>
                </tr>
              </thead>
              <tbody>
              {shortDataRows.length > 0?shortDataRows:null}
              </tbody>
            </Table>
        </Col>        
      </Row>
          </CardBody>
        </Card>          
           


        <Card>          
                  <Row>
                    <Col md="6">
                      <h5 className="card-sub-title">{t("LongTermDebtsHistory")}</h5>
                    </Col>                    
                  </Row>                  
          <CardBody>
          
        <Row>
        <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table">
              <thead>
                <tr>
                  <th>{t("Bank")}</th>
                  <th>{t("FacilityType")}</th>
                  <th>{t("ApprovalRisk")}</th>
                  <th>{t("Balance")}</th>
                  <th>{t("Variation")}</th>
                </tr>
              </thead>
              <tbody>
              {longDataRows.length > 0?longDataRows:null}
              </tbody>
            </Table>
        </Col>        
      </Row>
          </CardBody>
        </Card>

    </LoadingOverlay >

  )
}

ShortLongTermDebts.propTypes = {
  clientDocId: PropTypes.string,
  transactId: PropTypes.any
}

//export default (withTranslation()(DatosGenerales));
export default ShortLongTermDebts;


