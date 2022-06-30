import { useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useTranslation } from "react-i18next";
import LoadingOverlay from "react-loading-overlay";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Button, Col, Row, Table } from "reactstrap";
import { BackendServices } from "../../../../../services";
import ModalGobiernoCorporativoJunta from "./ModalGobiernoCorporativoJunta";
import * as url from "../../../../../helpers/url_helper"
import { uniq_key } from "../../../../../helpers/unq_key";

const ROWS_GOVERNANCE = [
    {
        name: "Test",
        charge: "Test charge",
        description: "Test Description",
    }
];

const GobiernoCorporativoJunta = () => {

    const { t } = useTranslation();

    const [successSave_dlg, setSuccessSave_dlg] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [confirm_alert, setConfirm_alert] = useState(false);
    const [dataGovernance, setDataGovernance] = useState(undefined);
    const [dataGovernanceRows, setDataGovernanceRows] = useState(undefined);
    const [showModalGovernanceBoard, setShowModalGovernanceBoard] = useState(false);
    const [isActiveLoading, setIsActiveLoading] = useState(false);

    const location = useLocation();
    const history = useHistory();

    const apiBack = new BackendServices();

    useEffect(() => {

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

        initializeData(dataSession);
        return () => {

        }
    }, [])


    function initializeData(dataSession) {
        setIsActiveLoading(true);
        setDataGovernanceRows(ROWS_GOVERNANCE.map((governance, index) => (
            <tr key={uniq_key()}>
                <td>{governance.name}</td>
                <td>{governance.charge}</td>
                <td>{governance.description}</td>
                <td style={{ textAlign: "right" }}>
                    <Link to="#" title={t("View")} onClick={() => { toggleGovernanceBoard(); updateDataGovernance(governance) }}><i className="mdi mdi-border-color mdi-24px"></i></Link>
                    <Link to="#" title={t("View")} onClick={() => { setConfirm_alert(true); updateDataGovernance(governance) }}><i className="mdi mdi-trash-can-outline mdi-24px"></i></Link>
                </td>
            </tr>
        )));
        setIsActiveLoading(false);
    }

    function updateDataGovernance(governance) {
        setDataGovernance(governance);
    }

    function toggleGovernanceBoard() {
        setShowModalGovernanceBoard(!showModalGovernanceBoard);
    }

    function onSave(governance) {

        setIsActiveLoading(true);

        !dataGovernance && console.log('new', governance);
        dataGovernance && console.log('update', governance);

        setIsActiveLoading(false);
        toggleGovernanceBoard();

    }
    return (
        <Col className="col-12">
            <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>
                <Row>
                    <div className="d-flex flex-row justify-content-between">
                        <h5 className="card-title">
                            {t("Members of the Board of Directors")}
                        </h5>
                        <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleGovernanceBoard(); updateDataGovernance(undefined) }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                    </div>
                    <Col md="12">
                        <div className="table-responsive styled-table-div">
                            <Table className="table table-striped table-hover styled-table table">
                                <thead>
                                    <tr>
                                        <th>{t("Name")}</th>
                                        <th>{t("Charge")}</th>
                                        <th>{t("Description")}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataGovernanceRows ??
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="alert alert-info" style={{ textAlign: "center" }}>{t("NoData")}</div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                        </div>

                    </Col>
                </Row>
            </LoadingOverlay>

            <ModalGobiernoCorporativoJunta isOpen={showModalGovernanceBoard} toggle={() => { toggleGovernanceBoard() }} onSave={onSave} dataGovernance={dataGovernance} />

            {successSave_dlg ? (
                <SweetAlert
                    success
                    title={t("SuccessDialog")}
                    confirmButtonText={t("Confirm")}
                    cancelButtonText={t("Cancel")}
                    onConfirm={() => {
                        setSuccessSave_dlg(false)
                        initializeData(locationData);
                    }}
                >
                    {t("SuccessSaveMessage")}
                </SweetAlert>
            ) : null}

            {confirm_alert ? (
                <SweetAlert
                    title={t("Areyousure")}
                    warning
                    showCancel
                    confirmButtonText={t("Yesdeleteit")}
                    cancelButtonText={t("Cancel")}
                    confirmBtnBsStyle="success"
                    cancelBtnBsStyle="danger"
                    onConfirm={() => {
                        apiBack.deleteCorporateGovernment({ transactId: dataGovernance.transactId, corporateIdentification: dataGovernance.corporateIdentification }).then(resp => {
                            if (resp.statusCode === "500") {
                                setConfirm_alert(false)
                            } else {
                                setConfirm_alert(false)
                                initializeData(locationData);
                            }
                        }).catch(() => {
                            setConfirm_alert(false)
                        })
                    }}
                    onCancel={() => setConfirm_alert(false)}
                >
                    {t("Youwontbeabletorevertthis")}
                </SweetAlert>
            ) : null}
        </Col>
    );
}

export default GobiernoCorporativoJunta;