import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../helpers/translation-helper';

import {
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Label,
    Input,
    CardHeader,
    CardTitle,
    InputGroup,
    Table,
    CardFooter
} from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { Link, useHistory, useLocation } from "react-router-dom"
import ModalNewDebt from './ModalNewDebt';
import ModalDeudasCortoPlazo from '../../../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/Secciones/ModalDeudasCortoPlazo';
import ModalDeudasLargoPlazo from '../../../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/Secciones/ModalDeudasLargoPlazo';
import { BackendServices, CoreServices } from '../../../services';
import { AvForm, AvField } from "availity-reactstrap-validation"
import "flatpickr/dist/themes/material_blue.css";
import LoadingOverlay from "react-loading-overlay";
import HeaderSections from "../../Common/HeaderSections";
import moment from "moment";
import Currency from "../../../helpers/currency";
import * as url from "../../../helpers/url_helper"
import { useTranslation } from "react-i18next";
const estiloTotales = { backgroundColor: "lightgrey", color: "black" };

const DebtSL = (props) => {
    const location = useLocation()
    const [locationData, setLocationData] = useState(null);
    const history = useHistory();
    const api = new BackendServices()

    /**
     * All use state
     */
    const currencyData = new Currency();
    const [isActiveLoading, setIsActiveLoading] = useState(false);
    const [termsDebts, setTermsDebts] = useState(null);
    const [termsDebtsTotal, setTermsDebtsTotal] = useState(null);
    const [toggleModalNewDebt, setToggleModalNewDebt] = useState(false);
    /**
     * End All use state
     */

    const { t, i18n } = useTranslation();

    React.useEffect(() => {
        let dataSession;
        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                //location.data.transactionId = 0;
                //checkAndCreateProcedure(location.data);
                history.push(url.URL_DASHBOARD);
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
        getTermsDebt(dataSession);
    }, []);

    function getTermsDebt(dataSession) {
        setIsActiveLoading(true);

        props?.typeDebt === 'Short' && api.consultBankingRelationsDebtsCP(dataSession?.transactionId).then(resp => {
            // setTermsDebtsTotal(setDebtTotal(resp.shortTermresult[resp.shortTermresult.length - 1]));
            // resp.shortTermresult.length = resp.shortTermresult.length - 1;
            setTermsDebts(setDebt(resp.getBankingRelationCPDTOList))
            setIsActiveLoading(false);
        }).catch(err => {
            setIsActiveLoading(false);
        });

        props?.typeDebt === 'Long' && api.consultBankRelationsDebtsLP(dataSession?.transactionId).then(resp => {
            // console.log(resp);
            // setTermsDebtsTotal(setDebtTotal(resp.longTermresult[resp.longTermresult.length - 1]));
            // resp.longTermresult.length = resp.longTermresult.length - 1;
            setTermsDebts(setDebt(resp.bankingRelationLPDTOList))
            setIsActiveLoading(false);
        }).catch(err => {
            setIsActiveLoading(false);
        });
    }

    function setDebt(debt) {
        return debt?.map((data, key) => (
            <tr key={key}>
                <td>{data.bank}</td>
                <td>{data?.facilityType ?? data?.facilityTypeId}</td>
                <td>${currencyData.formatTable((data.amount ?? 0).toFixed(2))}</td>
                <td>{formatDate(data.date)}</td>
                <td>${currencyData.formatTable((data.debitBalance1 ?? 0).toFixed(2))}</td>
            </tr>
        ))
    }

    function setDebtTotal(debt) {
        return (
            <tr className="table-info">
                <th>{t("Total").toLocaleUpperCase()}</th>
                <th>{debt.balance}</th>
                <th>{debt.approvedAmount}</th>
                <th>{debt.variation}</th>
                <th>{formatDate(debt.date, 'dd-mmm-yyyy')}</th>
            </tr>
        )
    }

    function editDebt(debt) {

    }

    function deleteDebt(debt) {

    }

    function formatDate(date) {
        return moment(date).format("DD/MM/YYYY");
    }

    return (
        <>
            <HeaderSections title={props.title} t={t}></HeaderSections>
            {/* <p className="card-title-desc"></p> */}

            <Col md="12">
                <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
                    <div className="table-responsive styled-table-div">
                        <Table className="table table-striped table-hover styled-table table" responsive>
                            <thead>
                                <tr>
                                    <th>{t("Bank")}</th>
                                    <th>{t("FacilityType")}</th>
                                    <th>{t("ApprovedAmount")}</th>
                                    <th>{t("GrantDate")}</th>
                                    <th>{t("Debit") + " " + t("CurrentYear")}</th>
                                    {/* <th style={{ textAlign: "right" }}></th> */}

                                    {props.editable && (<th><Link to="#" className="float-end" onClick={() => { toggleModalNewDebt() }}>
                                        <i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i>{t("")}
                                    </Link> </th>)}

                                </tr>
                            </thead>
                            <tbody>
                                {termsDebts}
                                {termsDebts?.length > 0 && termsDebtsTotal}
                            </tbody>
                        </Table>
                    </div>
                </LoadingOverlay >

            </Col>
        </>
    );
};

DebtSL.propTypes = {
    title: PropTypes.string,
    // items: PropTypes.array.isRequired,
    editable: PropTypes.bool,
    addDebt: PropTypes.func
};

DebtSL.defaultProps = {
    editable: false
};


export default DebtSL;
