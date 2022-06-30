import React, { useEffect, useState } from "react"
import { BackendServices } from "../../../services";

import {
    Row,
    Col,
    Label,
    Card,
    CardBody,
    CardHeader,
    Table,
} from "reactstrap"
import { translationHelpers } from "../../../helpers";
import { Link, useHistory, useLocation } from "react-router-dom";
import * as url from "../../../helpers/url_helper"

const GeneralesEmpresaIGRPreview = (props) => {

    const MODEL = {
        transactId: 0,
        economicGroup: {
            code: "",
            name: ""
        },
        economicActivity: {
            code: "",
            name: ""
        },
        subeconomicActivity: {
            code: "",
            name: ""
        },
        bank: {
            code: "",
            name: ""
        },
        status: false,
        identificationType: null,
        customerDocumentId: null,
        customerNumberT24: null,
        firstName: null,
        secondName: null,
        firstLastName: null,
        secondLastName: null
    }

    const [data, setData] = useState(MODEL)
    const [datosDeudores, setDatosDeudores] = useState(null)

    const api = new BackendServices();
    const [t] = translationHelpers('translation');

    const location = useLocation()
    const history = useHistory();

    const [locationData, setLocationData] = useState(null);

    useEffect(() => {

        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                //location.data.transactionId = 0;
                //checkAndCreateProcedure(location.data);
                history.push(url.URL_DASHBOARD);
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                setLocationData(location.data);
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                setLocationData(result);
            }
        }

        initializeData()
    }, [])


    function initializeData() {
        console.log(props);
        api.consultGeneralDataIGR(props.transactId).then(resp => {
            if (resp !== undefined) {
                data.transactId = props.transactId;
                data.economicGroup.code = resp.economicGroup.code;
                data.economicGroup.name = resp.economicGroup.name;
                data.economicActivity.code = resp.economicActivity.code;
                data.economicActivity.name = resp.economicActivity.name;
                data.subeconomicActivity.code = resp.subeconomicActivity.code;
                data.subeconomicActivity.name = resp.subeconomicActivity.name;
                data.bank.code = resp.bank.code;
                data.bank.name = resp.bank.name;
                setData(data);
            }
        }).catch((err) => {
            console.log(err);
        });

        api.consultarCatalogoTipoPersonaDescripcion("").then(resp2 => {
            if (resp2 !== undefined) {
                // consultarDeudores
                api.consultarDeudores(props.transactId).then(resp => {
                    if (resp === undefined) return;
                    if (resp.length > 0) {
                        setDatosDeudores(resp.map((data) => (
                            <tr key={data.personId}>
                                <td>{resp2.find(x => x.code === Number(data.typePerson)).label}</td>
                                <td>{Number(data.typePerson) === 2 ? data.name : data.name + " " + data.name2 + " " + data.lastName + " " + data.lastName2}</td>
                                <td>{data.idType}</td>
                                <td>{data.clientDocId}</td>
                            </tr>)))
                    } else {
                        setDatosDeudores(
                            <tr key={1}>
                                <td colSpan="4" style={{ textAlign: 'center' }}></td>
                            </tr>);

                    }

                }).catch((err) => {
                    console.log(err);
                });
            }
        })
    }

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between">
                <h5 className="card-title">{t("General Data")}</h5>
                {props?.previewProposal && <Link
                    style={{ margin: '5px', border: "1px", backgroundColor: "#1C8464", color: "#fff" }}
                    className="btn"
                    color="success"
                    type="button"
                    to={{
                        pathname: '/creditocomercial/previsualizarPropCred/' + btoa(props?.transactId ?? locationData?.transactionId),
                    }}
                    target="_blank"
                >{" "} {t("ConsultCreditProposal")} <i className="mdi mdi-eye mdi-12px"></i></Link>}
            </CardHeader>
            <CardBody>

                <div className="table-responsive styled-table-div">
                    <Table className="table table-striped table-hover styled-table table">
                        <thead >
                            <tr>
                                <th><strong>{t("PersonType")}</strong></th>
                                <th><strong>{t("FullName")}</strong></th>
                                <th><strong>{t("IdentificationType")}</strong></th>
                                <th><strong>{t("IdentificationNumber")}</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosDeudores}
                        </tbody>
                    </Table>
                </div>

                <Row className="mt-4">
                    <Col xl="2">
                        <strong htmlFor="clientNumber">{t("Economic Group")}</strong>
                    </Col>
                    <Col xl="4">
                        <Label htmlFor="clientNumber">{data.economicGroup?.name === "" || data.economicGroup?.name == null ? t("NoData") : data.economicGroup?.name}</Label>
                    </Col>
                    <Col xl="2">
                        <strong htmlFor="clientNumber">{t("Economic Activity")}</strong>
                    </Col>
                    <Col xl="4">
                        <Label htmlFor="clientNumber">{data.economicActivity?.name === "" || data.economicActivity?.name == null ? t("NoData") : data.economicActivity?.name}</Label>
                    </Col>
                </Row>
                <Row>
                    <Col xl="2">
                        <strong htmlFor="clientNumber">{t("Banking")}</strong>
                    </Col>
                    <Col xl="4">
                        <Label htmlFor="clientNumber">{data.bank?.name === "" || data.bank?.name == null ? t("NoData") : data.bank?.name}</Label>
                    </Col>
                    <Col xl="2">
                        <strong htmlFor="clientNumber">Sub{t("Economic Activity")}</strong>
                    </Col>
                    <Col xl="4">
                        <Label htmlFor="clientNumber">{data.subeconomicActivity?.name === "" || data.subeconomicActivity?.name == null ? t("NoData") : data.subeconomicActivity?.name}</Label>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

export default GeneralesEmpresaIGRPreview;