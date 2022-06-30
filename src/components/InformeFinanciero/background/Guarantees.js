
import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import { translationHelper } from '../../../helpers';

import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
} from "reactstrap"
import { useTranslation } from 'react-i18next';
import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import { useHistory, useLocation } from "react-router-dom";
import HeaderSections from "../../Common/HeaderSections";
import LoadingOverlay from "react-loading-overlay";
import Currency from "../../../helpers/currency";
import * as url from "../../../helpers/url_helper"
import { uniq_key } from "../../../helpers/unq_key";


const Guarantees = (props) => {
  const location = useLocation();
  const apiCore = new CoreServices();
  const apiBack = new BackendServices();
  const apiBpm = new BpmServices();
  const [bodyRows1, setbodyRows1] = useState(null);
  const [bodyRows2, setbodyRows2] = useState(null);
  const [bodyRows3, setbodyRows3] = useState(null);
  const [isActiveLoading, setisActiveLoading] = useState(false);
  const [dataLocation, setdataLocation] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));
  const { t, i18n } = useTranslation();
  function initializeData() {
    const jsonSet = {
      Muebles: {},
      Inmuebles: {},
      Depositos: {},
    }
    const CustomerNumeroT24 = props.customerNumberT24;
    // const CustomerNumeroT24=user.customerNumberT24;
    setisActiveLoading(true);



    apiCore.getColaterals(CustomerNumeroT24).then(colaterals => {
      for (let i = 0; i < colaterals?.length; i++) {
        apiCore.getWarrantyDetails(colaterals[i].collateralId, "Muebles").then(respgarantias => {
          let garantias = respgarantias.Collateral;
          // console.log("Muebles", garantias);
          if (!garantias)
            return;

          setbodyRows1(<tr>
            <td>Muebles</td>
            <td>{garantias.EmisionDt ? garantias.EmisionDt : ""}</td>
            <td>{garantias.AppraisedBy ? garantias.AppraisedBy : ""}</td>
            <td>$ {garantias.CollateralAmt.Amt ? garantias.CollateralAmt.Amt : 0}</td>
            <td>{parseFloat(colaterals[i].facilityAmt) / parseFloat(garantias.CollateralAmt.Amt ? garantias.CollateralAmt.Amt : 0)}%</td>
          </tr>);
        }).catch(err => {
          console.log(err);

        })
        apiCore.getWarrantyDetails(colaterals[i].collateralId, "Inmuebles").then(respgarantias => {
          let garantias = respgarantias.Collateral;
          // console.log("Inmuebles", garantias);
          if (!garantias)
            return;
          setbodyRows2(<tr>
            <td>Inmuebles</td>
            <td>{garantias.EmisionDt ? garantias.EmisionDt : ""}</td>
            <td>{garantias.AppraisedBy ? garantias.AppraisedBy : ""}</td>
            <td>$ {garantias.CollateralAmt.Amt ? garantias.CollateralAmt.Amt : 0}</td>
            <td>{parseFloat(colaterals[i].facilityAmt) / parseFloat(garantias.CollateralAmt.Amt ? garantias.CollateralAmt.Amt : 0)}%</td>
          </tr>);
        })
        apiCore.getWarrantyDetails(colaterals[i].collateralId, "Depositos").then(respgarantias => {
          let garantias = respgarantias.Collateral;
          // console.log("Depositos", garantias);
          if (!garantias)
            return;
          setbodyRows3(<tr>
            <td>Depositos</td>
            <td>{garantias.EmisionDt ? garantias.EmisionDt : ""}</td>
            <td>{garantias.AppraisedBy ? garantias.AppraisedBy : ""}</td>
            <td>$ {garantias.CollateralAmt.Amt ? garantias.CollateralAmt.Amt : 0}</td>
            <td>{parseFloat(colaterals[i].facilityAmt) / parseFloat(garantias.CollateralAmt.Amt ? garantias.CollateralAmt.Amt : 0)}%</td>
          </tr>);
        })
      }
      setisActiveLoading(false);
    }).catch(err => {
    });

    // })
  }

  const [locationData, setLocationData] = useState(null);
  const history = useHistory();
  const currencyData = new Currency();

  const [muebles, setMuebles] = useState([])
  const [Inmuebles, setInmuebles] = useState([])
  const [desposito, setDeposito] = useState([])
  const [guaranteesRow, setGuaranteesRow] = useState([])

  React.useEffect(() => {
    // initializeData();
    let dataSession;
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
      }
      else {
        console.log(location)
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
    initializeData2(dataSession);
  }, []);

  function initializeData2(dataSession) {
    console.log(dataSession)
    apiBack.consultGeneralDataPropCred(dataSession.transactionId).then((proposal) => {
      let requestId = proposal.length === 0 ? undefined : proposal[0].requestId;
      Promise.allSettled([
        apiBack.consultarFacilidades(requestId),
        apiCore.getTipoGarantiaCatalogo(),
      ]).then(async allPromises => {
        const [{ value: facilities }, { value: guaranteesType }] = allPromises
        let guaranteesArr = [];
        for (let facility of facilities) {
          let guarantees = await apiBack.consultarGarantiaPropCred(facility.facilityId)
          guaranteesArr.push(...currencyData.groupBy(guarantees, 'guaranteeTypeName'));
        }
        guaranteesArr = [].concat.apply([], guaranteesArr)
        let arrGuarantees = currencyData.groupBy(guaranteesArr, 'guaranteeTypeName').map(guarantee => guarantee[0]);
        let rows = arrGuarantees?.length === 0 ? <tr key={uniq_key() + "1"}>
          <td colSpan="6" style={{ textAlign: 'center' }}>{t("NoData")}</td>
        </tr> : arrGuarantees.map(guarantee => (
          <tr key={uniq_key() + "2"}>
            <td>{guaranteesType?.Records?.find(guaranteeType => guaranteeType.Code === guarantee.guaranteeTypeName)?.Description}</td>
            <td>${currencyData.format(guaranteesArr.filter(guaranteeArr => guaranteeArr.guaranteeTypeName === guarantee.guaranteeTypeName).reduce((ac, crr) => ac + crr.commercialValue, 0))}</td>
            <td>${currencyData.format(guaranteesArr.filter(guaranteeArr => guaranteeArr.guaranteeTypeName === guarantee.guaranteeTypeName).reduce((ac, crr) => ac + crr.fastValue, 0))}</td>
            <td>{currencyData.format(guaranteesArr.filter(guaranteeArr => guaranteeArr.guaranteeTypeName === guarantee.guaranteeTypeName).reduce((ac, crr) => ac + crr.ltv, 0))}%</td>
          </tr>
        ))
        setGuaranteesRow(rows)
      }).catch(err => { console.log(err) })
    }).catch(err => { console.log(err) })
  }
  return (


    <Card>
      <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("WarrantyDetails")}</h5>
          </Col>
        </Row>
        <CardBody>

          <Row>
            <div style={{ minHeight: "100px" }}>
              <Col className="table-responsive styled-table-div">
                <Table className="table table-striped table-hover styled-table table mb-0">
                  <thead>
                    <tr>
                      <th>{t("Type")}</th>
                      <th>{t("Commercial Value")}</th>
                      <th>{t("QuickValue")}</th>
                      <th>{t("LTV")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guaranteesRow}
                  </tbody>
                </Table>
              </Col>
            </div>
          </Row>
        </CardBody>
      </LoadingOverlay>
    </Card>
  );

};


Guarantees.defaultProps = {
  headers: [],
  data: []
};

export default Guarantees;
