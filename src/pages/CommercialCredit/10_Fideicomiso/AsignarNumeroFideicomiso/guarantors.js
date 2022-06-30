/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { BackendServices, CoreServices } from "../../../../services";
import { useLocation, useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import {
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    Button,
    Label,
    Table
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
//i18n
import { withTranslation } from "react-i18next";
import ModalBeneficiosFideicomiso from "./ModalBeneficiosFideicomiso";
import * as url from "../../../../helpers/url_helper"
import { uniq_key } from "../../../../helpers/unq_key";
import { PersonModel } from "../../../../models/Common/PersonModel";

const Guarantors = (props) => {
    const apiBack = new BackendServices();
    const location = useLocation()
    const [botonValidation, setbotonValidation] = useState(true);
    const [showModalFideicomitente, setShowModalFideicomitente] = useState(false);
    const [type, settype] = useState("");

    const [dataGuarantorRow, setdataGuarantorRow] = useState(null)
    const [dataSet, setdataSet] = useState({
        "transactId": 0,
        "firstName": "",
        "secondName": "",
        "firstLastName": "",
        "secondLastName": "",
        "nationality": "",
        "personType": "",
        "documentType": "",
        "documentNumber": "",
        "address": "",
        "telephone": "",
        "relationship": "",
        "percentage": 0
    });

    const [locationData, setLocationData] = useState(null);
    const history = useHistory();

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


        // Read Api Service data
        initializeData(dataSession);
    }, []);

    function initializeData(dataSession) {
        apiBack.consultarGaranteBD(dataSession.transactionId).then(response => {
            if (response?.length > 0) {
                console.log(response)
                setdataGuarantorRow(response.map((data, index) => (
                    <tr key={uniq_key()}>
                        <td>
                            {`${data.firstName} ${data.firstLastName}`}
                        </td>
                        <td>
                            {data.relationship}
                        </td>
                        <td>
                            {data.guaranteeReason}
                        </td>
                        <td>
                            {data.typeId}
                        </td>
                        <td>
                            {data.docIdCustomer}
                        </td>
                        {/* <td>
                            {data.customerNumberT24}
                        </td> */}
                        <td>
                            <Button type="button" color="link" onClick={(resp) => { surveillanceList(data) }} className="btn btn-link" ><i className="mdi mdi-shield-account mdi-24px"></i></Button>
                        </td>
                    </tr>
                )))
            } else {
                setdataGuarantorRow(
                    <tr key={1}>
                        <td colSpan="9" style={{ textAlign: 'center' }}><h5>{props.t("NoData")}</h5></td>
                    </tr>)
            }
        }).catch(err => { console.log(err) })
    }
    function surveillanceList(data) {
        let jsonData = {
            "personType": data.type,
            "idType": data.typeId,
            "personId": data.id,
            "clientDocumentId": data.docIdCustomer,
            "customerNumberT24": data.customerNumberT24,
            "name": data.firstName,
            "secondName": data.firstLastName,
            "lastName": data.secondName,
            "secondSurname": data.secondLastName,
            "nationality": data.nationality,
            "birthDate": data.birthDate,
        }
        let model = new PersonModel();
        data = { ...model, ...jsonData }
        props.showBlackListFormModal(data)
    }
    return (
        <React.Fragment>
            <Row>
                <Col lg="12">
                    <p className="card-title-desc"></p>
                    <p className="card-title-desc"></p>
                    <div className="d-flex flex-row justify-content-between my-3">
                        <h4 className="card-title">{props.t("Guarantors")}</h4>
                    </div>
                    <div className="table-responsive styled-table-div">
                        <Table className="table table-striped table-hover styled-table table mb-0">
                            <thead>
                                <tr>
                                    <th>{props.t("Name")}</th>
                                    <th>{props.t("Guarantor Relation Ship")}</th>
                                    <th>{props.t("Warranty Reason")}</th>
                                    <th>{props.t("Document Type")}</th>
                                    <th>{props.t("Guarantor Document")}</th>
                                    <th style={{ textAlign: "right" }}>
                                        {props.t("Actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataGuarantorRow}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
}
export default (withTranslation()(Guarantors))
