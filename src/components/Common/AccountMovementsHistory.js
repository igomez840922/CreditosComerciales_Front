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
import Currency from '../../helpers/currency'; import { uniq_key } from '../../helpers/unq_key';
;

const AccountMovementsHistory = (props) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();

  const [dataRows, setDataRows] = useState([]);
  const [isActiveLoading, setIsActiveLoading] = useState(false);

  const [apiServiceBackend, setapiServiceBackend] = useState(new BackendServices());
  const [apiCoreServices, setCoreServices] = useState(new CoreServices());

  const [dataMovimientos, setdataMovimientos] = useState(null);
  //On Mounting (componentDidMount)
  React.useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    loadData();
  }
  function groupBy(collection, property) {
    var i = 0, val, index,
      values = [], result = [];
    for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1)
        result[index].push(collection[i]);
      else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }
  //cargar lista de facilidades
  async function loadData(core = false) {

    setIsActiveLoading(true)
    await apiServiceBackend.consultMovementsBank(props?.transactionId ?? 0).then(resp => {
      setIsActiveLoading(false)
      if (resp !== undefined && resp !== null && resp.bankBanesco.length > 0) {
        setIsActiveLoading(false)
        //toca dibujar la tabla
        if (resp.bankBanesco.length > 0) {

          resp = Array.from(new Set(resp.bankBanesco.map(({ accountNumber, averageBalance, deposits, month, year, status }) => JSON.stringify({ accountNumber, averageBalance, deposits, month, year, status })))).map(JSON.parse);
          // console.log("ssdadasda",groupBy(resp,"accountNumber"));
          // let newJson=groupBy(resp,"accountNumber");
          setdataMovimientos(resp.map((data, index, arr) => {
            let movementsYear = resp?.filter(movement => movement.year === data.year && movement.status && movement.accountNumber === data.accountNumber);
            return (
              data.status ?
                <>
                  <tr key={uniq_key() + "1"}>
                    <th>{arr[index - 1]?.accountNumber != data.accountNumber && data.accountNumber}</th>
                    <td>{data.year}</td>
                    <td>{data.month}</td>
                    <td>${currencyData.formatTable(data.averageBalance ?? 0)}</td>
                    <td>${currencyData.formatTable(data.deposits ?? 0)}</td>

                  </tr>
                  {(data.year !== arr[index + 1]?.year || data.accountNumber !== arr[index + 1]?.accountNumber) && (
                    <>
                      <tr key={uniq_key() + "2"}>
                        <td></td>
                        <th><b>{t("Total")}</b></th>
                        <td></td>
                        <th>${currencyData.formatTable(movementsYear?.reduce((acu, crr) => acu + crr.averageBalance, 0).toFixed(2) ?? 0)}</th>
                        <th>${currencyData.formatTable(movementsYear?.reduce((acu, crr) => acu + crr.deposits, 0).toFixed(2) ?? 0)}</th>
                        <td></td>
                      </tr>
                      <tr key={uniq_key() + "3"}>
                        <td></td>
                        <th><b>{t("Average")}</b></th>
                        <td></td>
                        <th>${currencyData.formatTable(movementsYear?.reduce((acu, crr) => acu + crr.averageBalance / movementsYear.length, 0).toFixed(2) ?? 0)}</th>
                        <th>${currencyData.formatTable(movementsYear?.reduce((acu, crr) => acu + crr.deposits / movementsYear.length, 0).toFixed(2) ?? 0)}</th>
                        <td></td>
                      </tr>
                    </>
                  )}
                </>
                : null)
          }
          ));
        } else {
          setdataMovimientos(
            <tr key={uniq_key() + "2"}>
              <td colSpan="6" style={{ textAlign: 'center' }}>{t("NoData")}</td>
            </tr>);
        }
      } else {
        if (core) {
          setIsActiveLoading(false)
          return;
        }
      }

    });
  }

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  return (

    <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>

      <Card>

        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("AccountMovementsHistory") + " - Banesco"}</h5>
          </Col>
        </Row>

        <CardBody>

          <Row>
            <Col md="12" className="table-responsive styled-table-div">
              <Table className="table table-striped table-hover styled-table table">
                <thead>
                  <tr>
                    <th>{t("Account")}</th>
                    <th>{t("Year")}</th>
                    <th>{t("Month")}</th>
                    <th>{t("AverageAmount")}</th>
                    <th>{t("Deposits")}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {dataRows.length > 0 ? dataRows : null} */}
                  {dataMovimientos}
                </tbody>
              </Table>
            </Col>
          </Row>
        </CardBody>
      </Card>

    </LoadingOverlay>

  )
}

AccountMovementsHistory.propTypes = {
  customerNumberT24: PropTypes.string
}

//export default (withTranslation()(DatosGenerales));
export default AccountMovementsHistory;


