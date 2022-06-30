import LogProcess from "../../../components/LogProcess";
import { LogProcessModel } from "../../../models/Common/LogProcessModel";
import FormDetalles from "../../CommercialCredit/16_RiesgoAmbiental/riesgoAmbiental/FormDetalles";
import AspectosAmbientales from "../../CommercialCredit/4_InformeGestionReforzado/FormularioIGR/Secciones/AspectosAmbientales";
import GeneralesEmpresaIGRPreview from "./GeneralesEmpresaIGRPreview";
import {
    Card,
    CardBody,
    Row,
    Col,
    Button,
    Label
} from "reactstrap"
import AttachmentFileCore from "../../../components/Common/AttachmentFileCore";
import { AttachmentFileInputModel } from "../../../models/Common/AttachmentFileInputModel";
import * as OPTs from "../../../helpers/options_helper";
import HeaderSections from '../../../components/Common/HeaderSections';
import { useEffect, useState } from "react";
import { AvForm, AvGroup } from "availity-reactstrap-validation";
import Switch from "react-switch";
import { useTranslation } from 'react-i18next'

import Flatpickr from "react-flatpickr";
import moment from "moment";
import { BackendServices } from "../../../services";
import { useHistory, useLocation } from "react-router-dom";
import * as url from "../../../helpers/url_helper"


const Offsymbol = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 12,
                color: "#fff",
                paddingRight: 2,
            }}
        >
            {" "}
            No
        </div>
    );
};

const OnSymbol = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 12,
                color: "#fff",
                paddingRight: 2,
            }}
        >
            {" "}
            Si
        </div>
    );
};

const PreviewHistorical = (props) => {
    const [reputationResearch, setReputationResearch] = useState('');
    const { t, i18n } = useTranslation();

    const [environemntCovenantClosing, setEnvironemntCovenantClosing] = useState(props.closingPreview)
    const [environemntRisk, setEnvironemntRisk] = useState(undefined)
    const [fechaSet, setfechaSet] = useState(props.dateClosing)

    const backendServices = new BackendServices();
    const location = useLocation();
    const history = useHistory();


    useEffect(() => {
        console.log({ props }, !props?.autonomyBank)
        let dataSession;
        if (props?.transactId) {
            dataSession = { transactId: props?.transactId ?? "", transactionId: props?.transactId ?? "" }
            loadEnvironmentalRiskOthers(dataSession)
        }
        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                //location.data.transactionId = 0;
                //checkAndCreateProcedure(location.data);
                history.push(url.URL_DASHBOARD);
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                dataSession = location.data;
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                dataSession = result;
            }
        }
        loadEnvironmentalRiskOthers(dataSession)
    }, [])

    useEffect(() => {
        let datos = { ...environemntRisk, closingComplianceDate: fechaSet, closingCompliance: environemntCovenantClosing };
        console.log({ datos })

    }, [fechaSet, environemntCovenantClosing])


    function loadEnvironmentalRiskOthers(locationData) {
        backendServices.getEnvironmentalRiskInfo(locationData.transactionId).then(environmentalRiskInf => {
            setEnvironemntRisk(environmentalRiskInf)
        }).catch(err => {
            console.log(err)
        })
    }
    function saveData() {
        let dato = {
            "Acct": {
                "Activity": 3201,//Preguntar si es la subActividad Economica de IGR
                "Category": 28212,//Preguntar
                "CurCode": "USD",// MONEDA
                "CreditAcctData": {
                    "CountryDestination": "PA", //PAIS
                    "PromiseLetter": {
                        "AdvExpiryDt": "2022-12-31",  //FECHA DE EXPEDICION
                        "AutoExpiry": true,
                        "BeneficiaryCust": {
                            "PartyId": "",
                            "PartyType": ""
                        },
                        "BeneficiaryName": "AUTO TUNNIG CA", //Nombre deudor t24
                        "ContractType": "CA",//TIPO CONTRATO
                        "CustomerReferenceId": "MP2022154001", //customerNumberT24
                        "DealSubType": "CMTA", //Sub tipo de trato
                        "EffDt": "2022-06-03", // Efectivo debito
                        "EventsProcessing": "ONLINE", //Quemado
                        "LimitRef": "", // Texto
                        "LiquidationMode": "Automatic", //Preguntar si es un select o un text o quemado
                        "MaturityDt": "2022-12-31", //Fecha vencimiento
                        "OpenDt": "2022-06-03",// Abierto
                        "PrincipalAmt": {
                            "Amt": 15000, //Monto
                            "CurCode": "USD" //Moneda
                        }
                    }
                },
                "AcctMember": {
                    "PartyKey": {
                        "PartyId": 600072721, //customerNumberT24
                        "PartyType": 2// Tipo de persona  Juridica o Natural
                    }
                }
            }
        }
    }

    return (
        <>
            <GeneralesEmpresaIGRPreview previewProposal={props.title != "Historical Preview"} transactId={props.transactId} />
            {props.title != "Historical Preview" ?
                <Card>
                    <CardBody>
                        <AspectosAmbientales setReputationResearch={setReputationResearch} reputationResearch={reputationResearch} previsualizar={true} previsualizarHistoria={true} activeTab="18" locationData={{ transactionId: props.transactId, transactId: props.transactId }} />
                        <FormDetalles previsualizarHistoria={true} locationData={{ transactionId: props.transactId, transactId: props.transactId }} />
                        {<>
                            <HeaderSections title="Attach Compliance Support" />
                            <AvForm>
                                <Row>
                                    <Col md="4" className="">
                                        <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea">{t("Closing")} Covenants</Label>
                                        <AvGroup check className="m-0">
                                            <Switch name="isProjectLocatedProtectedNaturalArea"
                                                uncheckedIcon={<Offsymbol />}
                                                checkedIcon={<OnSymbol />}
                                                onColor="#007943"
                                                id="check1"
                                                disabled={(props?.closingPreview ?? false) || (props?.autonomyBank ?? false)}
                                                className="form-label"
                                                onChange={() => {
                                                    setEnvironemntCovenantClosing(!environemntCovenantClosing);
                                                }}
                                                checked={environemntCovenantClosing}
                                            />
                                            {'   '}
                                        </AvGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="3" className="mt-3">
                                        <AvGroup className="mb-3">
                                            <Label htmlFor="birthDate">{t("Compliance Date")} de Cierre</Label>
                                            <Flatpickr
                                                id="issuedDate"
                                                name="issuedDate"
                                                className="form-control d-block"
                                                placeholder={OPTs.FORMAT_DATE_SHOW}
                                                disabled={(props?.closingPreview ?? false) || (props?.autonomyBank ?? false)}
                                                options={{
                                                    dateFormat: OPTs.FORMAT_DATE,
                                                    //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                                                    defaultDate: fechaSet
                                                }}
                                                onChange={(selectedDates, dateStr, instance) => {
                                                    let date = moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD");
                                                    setfechaSet(date)
                                                }}
                                            />

                                        </AvGroup>
                                    </Col>
                                </Row>
                            </AvForm>
                            <AttachmentFileCore preview={props?.autonomyBank ?? false} titleType={true} attachmentFileInputModel={new AttachmentFileInputModel(props.transactId, OPTs.PROCESS_EVIROMENTRISK, OPTs.ACT_ASPECTOSAMBIENTALES)} />
                        </>}
                    </CardBody>
                </Card> : null}
            {!props?.autonomyBank && <LogProcess logProcessModel={new LogProcessModel(props.instanceId, props.transactId, 0, "", "")} preview={true} />}
        </>
    );
}

export default PreviewHistorical;