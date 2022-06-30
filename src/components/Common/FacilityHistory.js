import React, { useEffect, useState } from 'react';
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
  Alert,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"
import { Link } from "react-router-dom"
import moment from "moment";
import { CoreServices, BackendServices } from '../../services';
import HeaderSections from './HeaderSections';

import Currency from "../../helpers/currency"
import { translationHelpers } from '../../helpers';

const FacilityHistory = (props) => {

  const { t, i18n } = useTranslation();
  const [tr] = translationHelpers('translation');
  const [locationData, setLocationData] = useState(null);
  const location = useLocation();

  const [dataRows, setDataRows] = useState([]);
  const [isActiveLoading, setIsActiveLoading] = useState(false);

  const [apiServiceBackend, setapiServiceBackend] = useState(new BackendServices());
  const [apiCoreServices, setCoreServices] = useState(new CoreServices());
  const [historyDetails, setHistoryDetails] = useState(false);

  const currencyData = new Currency();
  useEffect(() => {

    let dataSession;
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        dataSession = location.data;
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        dataSession = result;
      }
    }
    loadFacilityHistory(dataSession);
  }, []);
  //On Mounting (componentDidMount)


  //On Mounting (componentDidMount)
  React.useEffect(() => {
    setHistoryDetails(props.historyDetails)
  }, [props.historyDetails]);

  function fetchData() {
    loadFacilityHistory();
  }
  function formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }
  //cargar lista de facilidades
  async function loadFacilityHistory(dataSession) {

    setIsActiveLoading(true)
    await apiServiceBackend.consultGeneralDataPropCred(dataSession?.transactionId ?? 0).then(async propuesta => {
      await apiServiceBackend.consultarFacilidadesT24(propuesta[0].requestId).then(async resp => {
        if (resp.length > 0 && resp != undefined) {
          //Cargamos las facilidades
          setIsActiveLoading(false)
          // props.setLevelAutonomy(resp.reduce((acc, crr) => acc + crr.amount, 0))
          setDataRows(resp.map((data, index) => (
            <tr key={index}>
              <td data-label={t("FacilityType")}>{data?.facilityTypeId}</td>
              <td data-label={t("DebtorName")}>{data?.debtor}</td>
              <td data-label={t("ApprovedAmount")}>{currencyData.formatTable(data.amount)}</td>
              {/* <td data-label={t("ApprovedDate")}>{formatDate(data.approvedDate)}</td> */}
              <td data-label={t("ActualBalance")}>{currencyData.formatTable(data.balance)}</td>
              <td style={{ textAlign: "right" }}>
                {props?.validacion ? null :
                  <Link to="#" title={t("View")} onClick={(resp) => props?.editFacilitiesT24(data)}><i className="mdi mdi-border-color mdi-24px"></i></Link>}
              </td>
            </tr>)))
        } else {
          setIsActiveLoading(false)            
          //guardamos
          if (props?.validacion) {
            return
          } 
          /*
          else {
            await apiCoreServices.getFacilitiesByTransaction(dataSession?.transactionId ?? 0)
              .then(async (data2) => {
                console.log(data2);
                if (data2 !== null && data2 !== undefined && data2.length > 0) {
                  for (let i = 0; i < data2.length; i++) {
                    let jsonSet = {
                      "facilityNumber": "0",
                      "cr": data2[i]?.AcctId,
                      "amount": data2[i]?.approvedAmount,
                      "debtor": props.mainDebtor.name,
                      "clientTypeId": props?.mainDebtor?.personId,
                      "customer": {
                        "id": "469303-1-434018"
                      },
                      "balance": data2[i]?.actualBalance,
                      "purpose": "",
                      "sublimits": "",
                      "proposalRate": 0,
                      "noSubsidyRate": 0,
                      "effectiveRate": 0,
                      "feci": false,
                      "termDays": 0,
                      "termDescription": "",
                      "ltv": 0,
                      "finantialConditions": " ",
                      "environmentRiskCategory": 0,
                      "covenant": " ",
                      "environmentRiskOpinion": " ",
                      "finantialCovenant": " ",
                      "legalDocumentation": "  ",
                      "otherConditions": " ",
                      "creditRiskOpinion": " ",
                      "provision": " ",
                      "proposalTypeId": "",
                      "proposalTypeName": "",
                      "facilityTypeId": data2[i]?.facilityType ?? "",
                      "termType": "",
                      "origin": "CORE",
                      "applyEscrow": false,
                      "facilityId": 0,
                      "requestId": propuesta[0].requestId ?? "",
                      "startingAmount": 0,
                      "term": ""
                    }

                    await apiServiceBackend.newFacilityPropCred(jsonSet).then(saveExpo => {

                    })

                  }
                  setIsActiveLoading(false)
                  loadFacilityHistory(locationData)
                } else {
                  setIsActiveLoading(false)
                  return
                }
                setIsActiveLoading(false)
              }).catch((error) => {
                setIsActiveLoading(false)
              });
          }
          */
          // var rows = data.map((data, index) => (
          //   <tr key={index}>
          //     <td data-label={t("FacilityType")}>{data?.facilityType ?? data?.facilityTypeId}</td>
          //     <td data-label={t("DebtorName")}>{props.mainDebtor.name}</td>
          //     <td data-label={t("ApprovedAmount")}>{currencyData.formatTable(data.approvedAmount)}</td>
          //     <td data-label={t("ApprovedDate")}>{formatDate(data.approvedDate)}</td>
          //     <td data-label={t("ActualBalance")}>{currencyData.formatTable(data.actualBalance)}</td>
          //     <td style={{ textAlign: "right" }}>
          //       <Link to="#" title={t("View")} onClick={(resp) => props?.editFacilitiesT24(data)}><i className="mdi mdi-border-color mdi-24px"></i></Link>
          //     </td>
          //   </tr>)
          // );
          // setDataRows(rows);
        }
        setIsActiveLoading(false)
      }).catch(error => {
        setIsActiveLoading(false)
      });

    }).catch(error => {
      setIsActiveLoading(false)
    });
  }



  return (

    <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>

      <Card>

        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("FacilityHistory")}</h5>
          </Col>
        </Row>

        <CardBody>

          {historyDetails && (<Alert show="true" dismissible="true" color="danger" onClose={() => { setHistoryDetails(!historyDetails) }}>
            {tr("The facility was not found")}
          </Alert>)}

          <Row>
            <Col md="12" className="table-responsive styled-table-div">
              <Table className="table table-striped table-hover styled-table table" >
                <thead>
                  <tr>
                    <th>{t("FacilityType")}</th>
                    <th>{t("DebtorName")}</th>
                    <th>{t("ApprovedAmount")}</th>
                    {/* <th>{t("ApprovedDate")}</th> */}
                    <th>{t("ActualBalance")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dataRows.length > 0 ? dataRows : null}
                </tbody>
              </Table>
            </Col>
          </Row>
        </CardBody>
      </Card>


    </LoadingOverlay>

  )
}

FacilityHistory.propTypes = {
  partyId: PropTypes.string,
  mainDebtor: PropTypes.any,
  transactId: PropTypes.any,
}

//export default (withTranslation()(DatosGenerales));
export default FacilityHistory;


