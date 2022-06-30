import React, { useEffect, useState } from "react"
import { translationHelpers } from "../../../helpers"
import { Link } from "react-router-dom"
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../../helpers/url_helper"

import {
    Row,
    Col,
    Button,
    Nav,
    NavLink,
} from "reactstrap"

import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { FinancialSummary } from "../../../components/PropuestaCreditoComercial"
import {
    Background, Capex, CreditProposal, CreditPolicyReview,
    ExchangeRisk, FinancialInformation, FormCreditRisk,
    Projections, Workload, FormRecommendations, DocumentFooter
} from "../../../components/InformeFinanciero"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"

import { Tabs, Tab } from 'react-bootstrap';
import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import { getDateMeta } from "@fullcalendar/react"
import classnames from "classnames"
import LoadingOverlay from "react-loading-overlay"
import DebtSL from "../../../components/PropuestaCreditoComercial/financialSummary/DebtSL"
import History from "../../../components/PropuestaCreditoComercial/financialSummary/History"
import CapexIF from "../../../components/InformeFinanciero/CapexIF"
import Guarantees from "../../../components/InformeFinanciero/background/Guarantees"

const FinancialReportComp = (props) => {

    const history = useHistory();
    const location = useLocation()

    const [proposal, setProposal] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [financialSummary, setFinancialSummary] = useState(null);
    //const [financialInformation, setFinancialInformation] = useState(null);
    const [capex, setCapex] = useState(null);
    const [background, setBackground] = useState(null);
    const [document, setDocument] = useState(null);
    const [Opinion, setOpinion] = useState(null);
    const [Recomendation, setRecomendation] = useState(null);
    const [deudor, setDeudor] = useState(null);
    const [debtorId, setDebtorId] = useState(null);
    const [DataDeudor, setDataDeudor] = useState(0);
    const [isActiveLoading, setIsActiveLoading] = useState(true);

    const [dataLocation, setData] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));


    React.useEffect(() => {
        setIsActiveLoading(true);
        fetchFinancialReport();
    }, []);

    function fetchFinancialReport() {
        setIsActiveLoading(false);
    }

    const [n, t, c] = translationHelpers('navigation', 'commercial_credit', 'common');

    return (
        // <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
        <Col xl="12">
            <CreditPolicyReview
                policies={policies}
                data={location.data}
                debtorId={props.debtorId}
                preview={props.preview ?? false}
            />
            <div className="mt-4">
                <DebtSL
                    title={t("Short Term Debts")}
                    typeDebt="Short"
                    customerNumberT24={props.customerNumberT24}
                />
            </div>

            <div className="mt-4">
                <DebtSL
                    title={t("Long Term Debts")}
                    typeDebt="Long"
                    customerNumberT24={props.customerNumberT24}
                />
            </div>

            <div className="mt-4">
                <History
                    debtorId={props.debtorId}
                    editMode={props.preview ?? false}
                    preview={props.preview ?? false}
                />
            </div>

            <div className="mt-4">
                <CapexIF
                    debtorId={props.debtorId}
                    locationData={dataLocation}
                    preview={props.preview ?? false}
                />
            </div>

            {/* <FinancialSummary
                editMode={props.preview ?? false}
                debtorId={props.debtorId}
                preview={props.preview ?? false}
            /> */}

            <Col className="mt-4">
                <Guarantees
                    customerNumberT24={props.customerNumberT24}
                    preview={props.preview}
                />
            </Col>
        </Col>
        // </LoadingOverlay >

    )
};


export default FinancialReportComp;
