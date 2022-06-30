import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../helpers';

import {
  Row,
  Col
} from "reactstrap"

import Balance from './financialSummary/Balance';
import Debts from './financialSummary/Debts';
import FinancialStatus from "./financialSummary/FinancialStatus";
import History from './financialSummary/History';
import { BackendServices } from '../../services';
import { useLocation } from "react-router-dom";
import DebtSL from "./financialSummary/DebtSL";
import HeaderSections from "../Common/HeaderSections";

const FinancialSummary = (props) => {
  const location = useLocation();
  const [dataLocation, setData] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));
  const [dataBalanceActivo, setdataBalanceActivo] = useState(null);
  const [dataBalancePasivo, setdataBalancePasivo] = useState(null);
  const [dataOrigenAplicacionn, setdataOrigenAplicacionn] = useState(null);
  const [dataindicadores, setdataindicadores] = useState(null);
  const [t, c] = translationHelpers('commercial_credit', 'common');
  const api = new BackendServices();
  // React.useEffect(() => {
  //   // Read Api Servic e data 
  //   initializeData();
  // }, [props]);
  // function initializeData() {
  //   api.checkActiveBalanceAC(dataLocation.transactionId).then(resp => {
  //     setdataBalanceActivo(resp);
  //   })
  //   api.checkBalancePassiveAC(dataLocation.transactionId).then(resp => {
  //     setdataBalancePasivo(resp);
  //   })
  //   api.queryStateOriginApplicationsAC(dataLocation.transactionId).then(resp => {
  //     setdataOrigenAplicacionn(resp);
  //   })
  //   api.queryACIndicator(dataLocation.transactionId).then(resp => {
  //     setdataindicadores(resp);
  //   })
  // }
  return (
    <div className="m-0">

      <div className="col mt-3 mr-4 mb-4 ml-4">
        <Balance title={t('Active Balance')}
          headers={[t('Period Date'), '', '', '']}
          items={dataBalanceActivo}
          type="BalanceActivo"
          debtorId={props.debtorId}
          preview={props.preview}
        />
      </div>
      <div className="col mt-5 mr-4 mb-4 ml-4">
        <Balance title={t('Passive Balance and Capital')}
          headers={[t('Period Date'), '', '', '']}
          items={dataBalancePasivo}
          type="BalancePasivo"
          debtorId={props.debtorId}
          preview={props.preview}
        />
      </div>
      <div className="col mt-5 mr-4 mb-4 ml-4">
        <Balance title={t('Origin and Application Status')}
          headers={[t('Period Date'), '', '', '']}
          items={dataOrigenAplicacionn}
          type="OrigenAplicacionn"
          debtorId={props.debtorId}
          preview={props.preview}
        />
      </div>
      <div className="col mt-5 mr-4 mb-4 ml-4">
        <Balance title={t('Indicators')}
          headers={[t('Period Date'), '', '', '']}
          items={dataindicadores}
          type="indicadores"
          debtorId={props.debtorId}
          preview={props.preview}
        />
      </div>
      {/* {props.debts.short && (
        <Row>
          <div className="col">
            <Debts title={t("Short Term Debts")} items={props.debts.short.items}
              editable={props.editMode} addDebt={props.addDebt} />
          </div>
        </Row>
      )} */}
      <div className="col mt-5">
        {/* <Debts title={t("Long Term Debts")} dataRelacionesBancarias={{
          transactId: 0,
          observations: null,
          dataTablDeudaCorto: null,
          dataTablDeudaLargo: null,
          dataTablSowActual: null,
          dataTablSowPropuesto: null,
          sumatoriaDeudaCorto: { monto: 0, saldo1: 0, saldo2: 0, saldo3: 0 },
          sumatoriaDeudaLargo: { monto: 0, saldo1: 0, saldo2: 0, saldo3: 0 }
        }} items={props.debts.long.items}
          editable={props.editMode} addDebt={props.addDebt} /> */}


      </div>

    </div>
  );
};

FinancialSummary.propTypes = {
  editMode: PropTypes.bool,
  client: PropTypes.object.isRequired,
  financialStatus: PropTypes.object.isRequired,
  balances: PropTypes.object,
  addDebt: PropTypes.func,
  addHistoryDetail: PropTypes.func,
};

FinancialSummary.defaultProps = {
  editMode: false,
};


export default FinancialSummary;
