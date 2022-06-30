import React, { useEffect, useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import { formatCurrency, translationHelpers } from '../../../../helpers';
import * as url from "../../../../helpers/url_helper"
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Button,
    Label,
    Input,
    Modal,
    Card,
    CardBody,
    CardFooter,
    InputGroup,
    CardHeader,
    Table,
    Alert,
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { BackendServices, CoreServices } from "../../../../services";
import { useHistory, useLocation } from "react-router-dom";

import LoadingOverlay from "react-loading-overlay";
import Currency from "../../../../helpers/currency";
import { uniq_key } from '../../../../helpers/unq_key'
import moment from "moment";
import DatosServicioFiduciario from "./DatosServicioFiduciario";
import DatosOtrosDatos from "./DatosOtrosDatos";
import previewEscrow from './preview.model'
import { Form, Tabs } from "react-bootstrap";
import HeaderSections from "../../../../components/Common/HeaderSections";
import LevelAutonomy from "../../5_PropuestaCredito/Secciones/LevelAutonomy";



const PrevisualizarFideicomiso = (props) => {
    const currencyData = new Currency();

    const [t] = translationHelpers('translation');
    const location = useLocation()

    const api = new BackendServices();
    const core = new CoreServices();
    const history = useHistory();

    const [ServiciosFiduciario, setServiciosFiduciario] = useState(null);
    const [OtherServiciosFiduciario, setOtherServiciosFiduciario] = useState(null);

    const [preview, setPreview] = useState(null);

    const [isActiveLoading, setIsActiveLoading] = useState(true);
    const [facility, setFacility] = useState(null);
    const [facilities, setFacilities] = useState(null);
    const [instructiveType, setInstructiveType] = useState(null);
    const [facilityId, setFacilityId] = useState(null);
    const [facilityType, setFacilityType] = useState(null);
    const [proposalType, setProposalType] = useState(null);
    const [tabsFacility, setTabsFacility] = useState(null);
    const [guaranteesType, setGuaranteesType] = useState(null);
    const [msgDataND, setmsgDataND] = useState({ show: false, msg: "", isError: false });


    useEffect(() => {
        initialData();
    }, []);

    React.useEffect(() => {
        setOtherServiciosFiduciario(undefined)
        facilityId && loadFiduciary();
    }, [facilityId]);

    async function loadFiduciary() {
        setIsActiveLoading(true);
        setOtherServiciosFiduciario(await preview.LoadOtherFiduciario());
        setIsActiveLoading(false);
    }

    async function initialData() {
        let dataSession = { transactionId: window.atob(location?.pathname?.split("PrevisualizarFideicomiso/")[1] ?? '') };
        let preview = new previewEscrow(dataSession)
        preview.validateRoute && history.push(url.URL_DASHBOARD);

        let facilities = await preview.loadOtherServiceFiduciary();

        if (!facilities) {
            setIsActiveLoading(false);
            return
        }

        setTabsFacility(facilities);
        setFacilityType(preview.facilityType)
        setFacilities(preview.facilities)
        setFacility(preview.facility)
        setPreview(preview);
        setServiciosFiduciario(await preview.LoadFiduciario());
        setOtherServiciosFiduciario(await preview.LoadOtherFiduciario())
        setFacilityId(preview.facilityId)
        console.log(preview.facilityId)
    }

    function handleSelect(e) {
        let data = facilities.at(e);
        preview.facilityId = data.facilityId;
        preview.facility = data;
        setFacility(data);
        setFacilityId(data.facilityId)
    }

    return (
        <>
            {
                <React.Fragment>
                    <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
                        <div className="page-content">
                            <Breadcrumbs title={t("Commercial Credit")} breadcrumbItem={t("Credit Proposal")} />
                            {/* Previsualizacion de datos generales pantalla 1 */}
                            <Card>
                                <CardBody>
                                    <div className="mx-4">
                                        <Col md={12} className="my-3">
                                            <Row>
                                                <Col sm={6} style={{ textAlign: "left" }}>
                                                    <h5 className="card-title" style={{ textAlign: "left" }}>{t("Fiduciary Services Proposal")}</h5>
                                                </Col>
                                                <Col sm={6} style={{ textAlign: "right" }}>
                                                    <h5 className="card-title" style={{ textAlign: "right" }}>{t("Escrownumber")}:{" "}{preview?.basaFid ?? ''}</h5>
                                                </Col>
                                            </Row>
                                        </Col>
                                        {/* <button onClick={() => {
                                            core.test().then(resp => {

                                            })
                                        }}>Request</button> */}
                                        {tabsFacility != null ?
                                            <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-4" onSelect={(e) => { handleSelect(e) }}>
                                                {tabsFacility}
                                            </Tabs>
                                            : <Alert show="true" variant="warning" dismissible="true" onClose={() => { setmsgDataND({ show: false, msg: "", isError: false }) }}>
                                                {t("No facilities")}
                                            </Alert>}

                                        <HeaderSections title="General Data" t={t}></HeaderSections>
                                        <Row>
                                            <Col sm="3" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Tramit number")}</strong>
                                                <label>{preview?.locationData?.transactionId ?? ''}</label>
                                            </Col>
                                            <Col sm="3" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Customer ID")}</strong>
                                                <label>{preview?.customerID ?? ''}</label>
                                            </Col>
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Revision Type")}</strong>
                                                <label>{preview?.dataGeneral?.revision ?? ''}</label>
                                            </Col>
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Pre Approved")}</strong>
                                                <label>{preview?.dataGeneral?.preapproval ? 'Si' : 'No'}</label>
                                            </Col>
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Request")}</strong>
                                                <label>{preview?.dataGeneral?.requestDate ?? ''}</label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="3" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Economic Group Number")}</strong>
                                                <label>{preview?.dataGeneralIGR?.economicGroup.code ?? ''}</label>
                                            </Col>
                                            <Col sm="5" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Economic Group Name")}</strong>
                                                <label>{preview?.dataGeneralIGR?.economicGroup.name ?? ''}</label>
                                            </Col>
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("CountryClass")}</strong>
                                                <label>{preview?.dataGeneral?.country ?? ''}</label>
                                            </Col>
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Last Application Date")}</strong>
                                                <label>{preview?.dataGeneral?.lastRequestDate ?? ''}</label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="3" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("CompanyActivity")}</strong>
                                                <label>{preview?.dataGeneralIGR?.economicActivity?.name ?? ''}</label>
                                            </Col>
                                            <Col sm="5" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("RiskAssesment")}</strong>
                                                <label>{preview?.dataGeneralEnvironmentAspects?.riskPreClassification ?? ''}</label>
                                            </Col>
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("SIB Minimum Provision")}</strong>
                                                <label>{preview?.dataGeneral?.minimumProvisionSIB ?? ''}</label>
                                            </Col>
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Next Revision Date")}</strong>
                                                <label>{preview?.dataGeneral?.nextRevisionDate ?? ''}</label>
                                            </Col>
                                        </Row>
                                        <Row>

                                            <LevelAutonomy fideicomiso={true} />

                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("RelatedPart")}</strong>
                                                <label>{preview?.dataGeneral?.relatedPart ? 'Si' : 'No'}</label>
                                            </Col>

                                            <Col sm="4" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Proposal Expiration Date")}</strong>
                                                <label>{preview?.dataGeneral?.proposedExpirationDate ?? ''}</label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="6" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("AccountExecutive")}</strong>
                                                <label>{preview?.dataGeneral?.accountExecutive ?? ''}</label>
                                            </Col>
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("ResponsibleUnit")}</strong>
                                                <label>{preview?.dataGeneral?.responsibleUnit ?? ''}</label>
                                            </Col>
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Country Risk")}</strong>
                                                <label>{preview?.dataGeneral?.countryRisk ?? ''}</label>
                                            </Col>
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Flow Type")}</strong>
                                                <label>{preview?.dataGeneral?.flow ?? ''}</label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="3" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("Banking")}</strong>
                                                <label>{preview?.dataGeneralIGR?.bank.name ?? ''}</label>
                                            </Col>
                                            <Col sm="3" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("FacilityType")}</strong>
                                                <label>{facilityType?.find(facilityT => facilityT.id === facility?.facilityTypeId)?.description ?? ''}</label>
                                            </Col>
                                            {/* <Col sm="4" className="d-flex flex-column">
                                            <strong htmlFor="clientNumber">{t("ExposureValue")}</strong>
                                            <label>{''}</label>
                                        </Col> */}
                                            <Col sm="2" className="d-flex flex-column">
                                                <strong htmlFor="clientNumber">{t("ProposalType")}</strong>
                                                <label>{OtherServiciosFiduciario?.proposal ?? ''}</label>
                                            </Col>
                                        </Row>
                                    </div>

                                    <AvForm>

                                        {facilityId && <>
                                            {<DatosServicioFiduciario preview={true} ServiciosFiduciario={ServiciosFiduciario} />}

                                            {<DatosOtrosDatos preview={true} OtherServiciosFiduciario={OtherServiciosFiduciario} />}
                                        </>}
                                    </AvForm>

                                </CardBody>
                            </Card>
                        </div>
                    </LoadingOverlay>
                </React.Fragment >
            }
        </>
    );
};
PrevisualizarFideicomiso.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
};
export default PrevisualizarFideicomiso;
