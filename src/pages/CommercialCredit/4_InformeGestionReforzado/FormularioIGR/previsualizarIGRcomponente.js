import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
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
} from "reactstrap"

import Switch from "react-switch";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { BackendServices, CoreServices } from "../../../../services";
import { useLocation, useHistory } from "react-router-dom";
import * as url from "../../../../helpers/url_helper"
import HeaderSections from "../../../../components/Common/HeaderSections";
import moment from "moment";
import Currency from "../../../../helpers/currency";
import AspectosAmbientales from "./Secciones/AspectosAmbientales";
import { uniq_key } from "../../../../helpers/unq_key";
import AccountMovementsHistory from "../../../../components/Common/AccountMovementsHistory";
import RelacionesBancarias from "./Secciones/RelacionesBancarias";
import MoviemientosCuentas from "./Secciones/MoviemientosCuentas";
import InformacionGarante from "./Secciones/InformacionGarante";
import LoadingOverlay from "react-loading-overlay";
const estiloTotales = { backgroundColor: "lightgrey", color: "black" }
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
const PrevicualizarIGR = (props) => {
    let modelo = {
        datosGenerales: {
            codigoTipoIdentificacion: null,
            numeroCliente: null,
            primerNombre: null,
            segundoNombre: null,
            primerApellido: null,
            segundoApellido: null,
            numeroIdentificacion: null,
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
        },
        datosEmpresa: {
            transactId: "",
            referencePoint: "",
            residency: "",
            houseNumber: "",
            phoneNumber: "",
            mobileNumber: "",
            workNumber: "",
            email: "",
            exclusion: false,
            sustainable: false,
            apto: "",
            country: {
                code: "",
                name: ""
            },
            province: {
                code: "",
                name: ""
            },
            district: {
                code: "",
                name: ""
            },
            township: {
                code: "",
                name: ""
            },
            city: {
                code: "",
                name: ""
            },
            sector: {
                code: "",
                name: ""
            },
            subSector: {
                code: "",
                name: ""
            },
        },
        historiaEmpresa: {
            transactId: 0,
            description: " ",
            employeesNumber: 0,
            details: " "
        },
        dataAccionistas: {
            transactId: 0,
            informacionAccionistaDetails: " ",
            datosTablaAccionistas: null,
            observations: " ",
            description: " ",
        },
        dataGobiernoCorporativo: {
            transactId: 0,
            corporateIdentification: 0,
            name: " ",
            position: " ",
            birthDate: " ",
            age: " ",
            status: true,
            dataTableGobiernoCorporativo: null
        },
        dataRelevoGeneracional: {
            trasactId: 0,
            observations: " ",
            dataTableRelevo: null
        },
        dataFlujoOperativo: {
            transactId: 0,
            observations: " ",
            infoDate: null
        },
        dataEstructuraOrganizacional: {
            transactId: 0,
            description: null,
            date: ""
        },
        dataEmpresaRelacionada: {
            transactId: 0,
            description: null,
            observations: null,
            dataTableEmpresaRelacionada: null,
            date: ""
        },
        dataInformacionClientes: {
            transactId: 0,
            dataTableInformacionClientes: null,
            description: " ",
            cicloVenta: false,
            observations: " ",
            porcenVenta: 0,
            "seasonalSales": false,
            "percSeasonalPeriodSales": 0,
        },
        dataInformacionProveedores: {
            transactId: 0,
            dataTableInformacionProveedores: null,
            cicloCompra: " ",
            description: " ",
            purchasingCycle: " "
        },
        dataPrincipalesCompetidores: {
            transactId: 0,
            dataTablePrincipalesCompetidores: null
        },
        dataProyecciones: {
            transactId: 0,
            descripcion: " ",
            assetsOperatingAmount: 0,
            assetsOperatingReason: " ",
            fixedAssetsAmount: 0,
            fixedAssetsReason: " ",
            othersAssetsAmount: 0,
            othersAssetsReason: " ",
            bankAmount: 0,
            bankReason: " ",
            providersAmount: 0,
            providersReason: " ",
            capitalAmount: 0,
            capitalReason: " ",
            maximodeuda: 0,
            estimatedDate: null,
        },
        dataRelacionesBancarias: {
            transactId: 0,
            observations: " ",
            dataTablDeudaCorto: null,
            dataTablDeudaLargo: null,
            dataTablSowActual: null,
            dataTablSowPropuesto: null,
            sumatoriaDeudaCorto: { monto: 0, saldo1: 0, saldo2: 0, saldo3: 0 },
            sumatoriaDeudaLargo: { monto: 0, saldo1: 0, saldo2: 0, saldo3: 0 }
        },
        dataMoviemientosCuentas: {
            transactId: 0,
            dataTableMovimientoCuentas: null,
            details: " ",
            observations: " ",
        },
        dataReciprocidad: {
            transactId: 0,
            dataTableReciprocidad: null,
            description: " ",
            observations: " ",
        },
        dataFacilidadActivosFijos: {
            transactId: 0,
            dataTableFacilidadActivosFijos: null,
            variationsAssets: false,
            variationsAssetsObs: " ",
            manufacturingAgroCompanies: false,
            productionLine: " ",
            capacity: " ",
            usedCapacity: " ",
            tradingCompany: false,
            warehouseCapacity: " ",
            transportDistributionFleet: false,
            units: " ",
            renovation: " ",
        },
        dataAspectosAmbientales: {
            transactId: 0,
            riskPreClassification: null,
            sustainableCreditRating: "2",
            riskClassificationConfirmation: null,
            natureLocationProject: false,
            physicalResettlement: false,
            environmentalPermits: false,
            newProject: false,
            workersContractors: false
        },
        dataInformacionGarante: {
            transactId: 0,
            dataTbleInformacionGarantes: null
        },
        dataSegurosActualesEmpresa: {
            transactId: 0,
            dataTableSegurosActualesEmpresa: null
        },
        dataArquitecturaEmpresarial: {
            transactId: 0,
            ticCompanyUse: " ",
            auditedAreas: " "
        },
        dataCuentasCobrar: {
            transactId: 0,
            dataTableCuentasCobrar: null
        },
        dataCapex: {
            transactId: 0,
            dataTableCapex1: null,
            dataTableCapex2: null,
            dataTableCapex3: null,
        },
        dataFlujoCaja: {
            transactId: 0,
            dataTableFlujoCaja1: null,
            dataTableFlujoCaja2: null,
            dataTableFlujoCaja3: null,
            dataTableFlujoCaja4: null,
            dataTableFlujoCaja5: null,
            dataTableFlujoCaja6: null,
        },
        dataNegociosObtener: { transactId: 0, observations: null },
        dataMatrizCompetitiva: {
            transactId: 0,
            observations: " ",
        },
        dataRecomendacionesOtros: {
            transactId: 0,
            recommendations: " ",
            valueChain: " ",
            background: " ",
            refinancingLog: " "
        },
    }
    const { t, i18n } = useTranslation();
    const location = useLocation()
    const [dataLocation, setData2] = useState(location.data);
    const [data, setData] = useState(modelo)
    const [datosDeudores, setdatosDeudores] = useState(null)
    const [shorttermdebtsRows, setshorttermdebtsRows] = useState(null);
    const [longtermdebtsRows, setlongtermdebtsRows] = useState(null);
    const [dataReturn, setdataReturn] = useState(modelo.dataRelacionesBancarias);
    const [datosUsuario, setdatosUsuario] = useState(null)
    // Submitimos formulario para busqueda de clientes
    const api = new BackendServices();
    const backendServices = new BackendServices();
    const apiCore = new CoreServices();
    const history = useHistory();
    const [locationData, setLocationData] = useState(null);
    const currencyData = new Currency();
    const [sowProposal, setsowProposal] = useState(null);
    const [sowApproved, setsowApproved] = useState(null);

    const [loadDebtsAuto, setloadDebtsAuto] = useState(false);
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


        setData(modelo)
        // Read Api Serv ice ddasata
        initializeData(dataSession);
    }, []);
    function initializeData(dataLocation) {
        // consultarDatosGeneralesIGR

        api.consultGeneralDataIGR(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.datosGenerales.transactId = dataLocation.transactionId;
                data.datosGenerales.economicGroup.code = resp.economicGroup.code;
                data.datosGenerales.economicGroup.name = resp.economicGroup.name;
                data.datosGenerales.economicActivity.code = resp.economicActivity.code;
                data.datosGenerales.economicActivity.name = resp.economicActivity.name;
                data.datosGenerales.subeconomicActivity.code = resp.subeconomicActivity.code;
                data.datosGenerales.subeconomicActivity.name = resp.subeconomicActivity.name;
                data.datosGenerales.bank.code = resp.bank.code;
                data.datosGenerales.bank.name = resp.bank.name;
                setData(data);

            }
        }).catch((error) => {
        });
        // consultarCatalogoTipoPersonaDescripcion
        api.consultarCatalogoTipoPersonaDescripcion("").then(resp2 => {
            if (resp2 != undefined) {
                // consultarDeudores
                api.consultarDeudores(dataLocation.transactionId).then(resp => {
                    if (resp == undefined) return;
                    if (resp.length > 0) {
                        setdatosDeudores(resp.map((data) => (
                            <tr key={uniq_key()}>
                                <td>{resp2.find(x => x.code === Number(data.typePerson)).label}</td>
                                <td>{Number(data.typePerson) === 2 ? data.name : data.name + " " + data.name2 + " " + data.lastName + " " + data.lastName2}</td>
                                <td>{data.idType}</td>
                                <td>{data.clientDocId}</td>
                                <td>{data.customerNumberT24}</td>
                            </tr>)))
                    } else {
                        setdatosDeudores(
                            <tr key={uniq_key()}>
                                <td colSpan="4" style={{ textAlign: 'center' }}></td>
                            </tr>);

                    }

                }).catch((error) => {

                });
            }
        })
        // consultarDatosEmpresaIGR
        api.consultDataCompanyIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            data.datosEmpresa.country.code = resp.country.code;
            data.datosEmpresa.country.name = resp.country.name;
            data.datosEmpresa.province.name = resp.province.name;
            data.datosEmpresa.province.code = resp.province.code;
            data.datosEmpresa.district.code = resp.district.code;
            data.datosEmpresa.district.name = resp.district.name;
            data.datosEmpresa.township.name = resp.township.name;
            data.datosEmpresa.township.code = resp.township.code;
            data.datosEmpresa.city.code = resp.city.code;
            data.datosEmpresa.city.name = resp.city.name;
            data.datosEmpresa.referencePoint = resp.referencePoint;
            data.datosEmpresa.residency = resp.residency;
            data.datosEmpresa.houseNumber = resp.houseNumber;
            data.datosEmpresa.phoneNumber = resp.phoneNumber;
            data.datosEmpresa.mobileNumber = resp.mobileNumber;
            data.datosEmpresa.workNumber = resp.workNumber;
            data.datosEmpresa.email = resp.email;
            data.datosEmpresa.sector.name = resp.sector.name;
            data.datosEmpresa.sector.code = resp.sector.code;
            data.datosEmpresa.subSector.name = resp.subSector.name;
            data.datosEmpresa.subSector.code = resp.subSector.code;
            data.datosEmpresa.exclusion = resp.exclusion;
            data.datosEmpresa.sustainable = resp.sustainable;
            data.datosEmpresa.sustainableProjectId = resp?.sustainableProjectId;
            data.datosEmpresa.sustainableProjectDesc = resp?.sustainableProjectDesc;
            setData(data);
        }).catch((error) => {
        });
        // consultarDeudorPrincipal
        api.consultPrincipalDebtor(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp != undefined) {
                data.datosGenerales.codigoTipoPersona = resp.personType
                data.datosGenerales.codigoTipoIdentificacion = resp.identificationType
                data.datosGenerales.numeroCliente = resp.customerNumberT24
                data.datosGenerales.primerNombre = resp.firstName
                data.datosGenerales.segundoNombre = resp.secondName
                data.datosGenerales.primerApellido = resp.firstLastName
                data.datosGenerales.segundoApellido = resp.secondLastName
                data.datosGenerales.numeroIdentificacion = resp.customerDocumentId
                data.datosGenerales.nuevoDato = ""
                setData(data);
                setdatosUsuario(resp);
            }
        })
        /* ---------------------------------------------------------------------------------------------- */
        /*           Cargatos todos los datos si exite algun registro de historia de la empresa           */
        /* ----------------------------------------------------------------------------------------------*/
        // consultarHistorialEmpresaIGR
        api.checkHistoryCompanyIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.historiaEmpresa.transactId = dataLocation.transactionId
                data.historiaEmpresa.description = resp.data.description;
                data.historiaEmpresa.employeesNumber = resp.data.employeesNumber;
                data.historiaEmpresa.details = resp.data.details;
                setData(data);
            }
        })
        /* ---------------------------------------------------------------------------------------------- */
        /*                      Cargamos los datos por defecto del flujo de operativo                     */
        /* ---------------------------------------------------------------------------------------------- */
        // consultarFlujoOperativo
        api.consultOperatingFlow(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataFlujoOperativo.transactId = dataLocation.transactionId;
                data.dataFlujoOperativo.observations = resp.observations;
                data.dataFlujoOperativo.infoDate = resp.infoDate;
                setData(data);
            }
        });
        // consultarSeccionAccionista
        api.consultSectionShareholder(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataAccionistas.observations = resp;
                setData(data);
            }
        });
        // consultarDatosEmpresaRelacionada
        api.consultRelatedCompanyData(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataEmpresaRelacionada.observations = resp.observations;
                data.dataEmpresaRelacionada.dataTableEmpresaRelacionada = resp.relatedCompanies;
                setData(data);
            }
        });
        // consultarSeccionRelevoGeneracional

        // consultarSeccionReciprocidad
        api.consultSectionReciprocity(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataReciprocidad.observations = resp;
                setData(data);
            }
        });
        // consultarMatrizSeccionIGR
        api.consultMatrixSectionIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataMatrizCompetitiva.observations = resp.observations;
                setData(data);
            }
        });
        // consultarSeccionMovimientosCuentas
        api.consultSectionMovementsAccounts(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataMoviemientosCuentas.observations = resp.observations;
                setData(data);
            }
        });
        // consultarActivosFijosIGR
        api.consultFixedAssetsIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataFacilidadActivosFijos.variationsAssets = resp.variationsAssets;
                data.dataFacilidadActivosFijos.variationsAssetsObs = resp.variationsAssetsObs;
                data.dataFacilidadActivosFijos.manufacturingAgroCompanies = resp.manufacturingAgroCompanies;
                data.dataFacilidadActivosFijos.productionLine = resp.productionLine;
                data.dataFacilidadActivosFijos.capacity = resp.capacity;
                data.dataFacilidadActivosFijos.usedCapacity = resp.usedCapacity;
                data.dataFacilidadActivosFijos.tradingCompany = resp.tradingCompany;
                data.dataFacilidadActivosFijos.warehouseCapacity = resp.warehouseCapacity;
                data.dataFacilidadActivosFijos.transportDistributionFleet = resp.transportDistributionFleet;
                data.dataFacilidadActivosFijos.units = resp.units;
                data.dataFacilidadActivosFijos.renovation = resp.renovation;
                data.dataFacilidadActivosFijos.descriptionOfTheFacilities = resp.descriptionOfTheFacilities;
                data.dataFacilidadActivosFijos.invested = resp.invested;
                data.dataFacilidadActivosFijos.rentalConditionsAf = resp.rentalConditionsAf;
                data.dataFacilidadActivosFijos.physicalLocation = resp.physicalLocation;
                data.dataFacilidadActivosFijos.notApplicable = resp.notApplicable;
                setData(data);
            }
        });
        // consultarSeccionClienteIGR
        api.consultIGRClientSection(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataInformacionClientes.description = resp.description;
                data.dataInformacionClientes.seasonalSales = resp.seasonalSales;
                data.dataInformacionClientes.percSeasonalPeriodSales = resp.percSeasonalPeriodSales;
                setData(data);

            }
        });
        // consultarSeccionProveedorIGR
        api.consultProviderSectionIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataInformacionProveedores.description = resp.description;
                data.dataInformacionProveedores.purchasingCycle = resp.purchasingCycle;
                setData(data);
            }
        });
        // consultarNegocioObtenerIGR
        api.consultBusinessGetIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataNegociosObtener.observations = resp.observations;
                setData(data);
            }
        });
        /* ---------------------------------------------------------------------------------------------- */
        /*                               Cargamos los datos de Proyecciones                               */
        /* ---------------------------------------------------------------------------------------------- */
        // consultarProyecciones
        api.consultProjections(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            data.dataProyecciones.descripcion = resp.projectionsDTO.descripcion;
            data.dataProyecciones.assetsOperatingAmount = currencyData.format(resp?.projectionsDTO?.assetsOperatingAmount ?? 0);
            data.dataProyecciones.assetsOperatingReason = resp.projectionsDTO.assetsOperatingReason;
            data.dataProyecciones.fixedAssetsAmount = currencyData.format(resp?.projectionsDTO?.fixedAssetsAmount ?? 0);
            data.dataProyecciones.fixedAssetsReason = resp.projectionsDTO.fixedAssetsReason;
            data.dataProyecciones.othersAssetsAmount = currencyData.format(resp?.projectionsDTO?.othersAssetsAmount ?? 0);
            data.dataProyecciones.othersAssetsReason = resp.projectionsDTO.othersAssetsReason;
            data.dataProyecciones.bankAmount = currencyData.format(resp?.projectionsDTO?.bankAmount ?? 0);
            data.dataProyecciones.bankReason = resp.projectionsDTO.bankReason;
            data.dataProyecciones.providersAmount = currencyData.format(resp?.projectionsDTO?.providersAmount ?? 0);
            data.dataProyecciones.providersReason = resp.projectionsDTO.providersReason;
            data.dataProyecciones.capitalAmount = currencyData.format(resp?.projectionsDTO?.capitalAmount ?? 0);
            data.dataProyecciones.capitalReason = resp.projectionsDTO.capitalReason;
            data.dataProyecciones.maximodeuda = currencyData.format(resp?.projectionsDTO?.maximodeuda ?? 0);
            data.dataProyecciones.estimatedDate = resp.projectionsDTO.estimatedDate;
            data.dataProyecciones.transactId = dataLocation.transactionId;
            setData(data);

        });
        // consultarEstructuraEmpresaIGR
        api.consultStructureCompanyIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataEstructuraOrganizacional.transactId = dataLocation.transactionId;
                data.dataEstructuraOrganizacional.description = resp.observations;
                data.dataEstructuraOrganizacional.date = resp.infoDate;
                setData(data);
            }
        });
        // consultarRelacionesBancariasSeccionIGR
        api.consultBankingRelationsSectionIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataRelacionesBancarias.transactId = dataLocation.transactionId;
                data.dataRelacionesBancarias.observations = resp.bankingRelationSection.observations;
                setData(data);
            }
        });
        // consultarAspectosAmbientalesIGR
        api.consultEnvironmentalAspectsIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataAspectosAmbientales.transactId = dataLocation.transactionId;
                data.dataAspectosAmbientales.riskPreClassification = resp.environmentalAspectsDTO.riskPreClassification;
                data.dataAspectosAmbientales.sustainableCreditRating = resp.environmentalAspectsDTO.sustainableCreditRating;
                data.dataAspectosAmbientales.riskClassificationConfirmation = resp.environmentalAspectsDTO.riskClassificationConfirmation;
                data.dataAspectosAmbientales.natureLocationProject = resp.environmentalAspectsDTO.natureLocationProject;
                data.dataAspectosAmbientales.physicalResettlement = resp.environmentalAspectsDTO.physicalResettlement;
                data.dataAspectosAmbientales.environmentalPermits = resp.environmentalAspectsDTO.environmentalPermits;
                data.dataAspectosAmbientales.newProject = resp.environmentalAspectsDTO.newProject;
                data.dataAspectosAmbientales.workersContractors = resp.environmentalAspectsDTO.workersContractors;
                // data.dataAspectosAmbientales.workersContractors=resp.environmentalAspectsDTO.workersContractors;
                setData(data);
            }
        });
        // consultarArquitecturaEmpresarialIGR
        api.consultBusinessArchitectureIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataArquitecturaEmpresarial.transactId = dataLocation.transactionId;
                data.dataArquitecturaEmpresarial.ticCompanyUse = resp.ticCompanyUse;
                data.dataArquitecturaEmpresarial.auditedAreas = resp.auditedAreas;
                setData(data);
            }
        });
        // consultarRecomendacionesIGR
        api.consultRecommendationsIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataRecomendacionesOtros.transactId = dataLocation.transactionId;
                data.dataRecomendacionesOtros.recommendations = resp.recommendations;
                data.dataRecomendacionesOtros.valueChain = resp.valueChain;
                data.dataRecomendacionesOtros.background = resp.background;
                data.dataRecomendacionesOtros.refinancingLog = resp.refinancingLog;
                setData(data);
            }
        });
        // Consulta de Listas
        // consultarGobiernoCorpBD
        // consultarGobiernoCorpBD
        api.consultarRolPersona(dataLocation.transactionId).then(respRoles => {
            let roles = [];
            for (let i = 0; i < respRoles.length; i++) {
                let roles1 = "";
                for (let j = 0; j < respRoles[i].roles.length; j++) {
                    roles1 = roles1 + " - " + respRoles[i].roles[j].roleDescription + ", "
                }
                roles.push({ personId: respRoles[i].personId, roles: roles1 })
            }
            api.consultarGobiernoCorpBD(dataLocation.transactionId).then(resp => {
                if (resp.length > 0) {
                    let arr = [];
                    let setdataAccionistasDataRows = (resp.map((data, index) => {
                        if (!arr.includes(data.personId)) {
                            arr.push(data.personId);
                            return (
                                <tr key={uniq_key()}>
                                    <td data-label={t("Name")}>{data.name + " " + data.secondName + " " + data.lastName + " " + data.secondSurname}</td>
                                    <td data-label={t("Charge")}>{roles.find(x => x.personId === data.personId).roles}{data.position}</td>
                                    <td>{formatDate(data.birthDate)}</td>
                                    <td>{calculateYear(
                                        moment(data.birthDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                    )}</td>
                                </tr>)
                        } else {
                            return null;
                        }
                    }
                    ));
                    data.dataGobiernoCorporativo.dataTableGobiernoCorporativo = setdataAccionistasDataRows;
                    setData(data)
                }
            })
        })
        // api.consultarGobiernoCorpBD(dataLocation.transactionId).then(resp => {
        //     if (resp == undefined) return;
        //     if (resp != undefined) {
        //         let arr = [];
        //         let setdataAccionistasDataRows = (resp.map((data, index) => {
        //             if (!arr.includes(data.personId)) {
        //                 arr.push(data.personId);
        //                 return (
        //                     <tr key={uniq_key()}>
        //                         <td>{data.name + " " + data.secondName + " " + data.lastName + " " + data.secondSurname}</td>
        //                         <td>{data.position}</td>
        //                         <td>{formatDate(data.birthDate)}</td>
        //                         <td>{calcular(data.birthDate)}</td>
        //                     </tr>)
        //             } else {
        //                 return null;
        //             }
        //         }
        //         ));
        //         data.dataGobiernoCorporativo.dataTableGobiernoCorporativo = setdataAccionistasDataRows
        //         setData(data);
        //     }
        // });
        api.getGovernanceInformation(dataLocation?.transactionId ?? 0).then(resp => {
            if (resp !== undefined && resp !== null) {
                data.dataGobiernoCorporativo.description = resp.description;
                setData(data);
            }
        }).catch();
        // consultarDatosRelevoGeneracional
        // setData(data);
        api.consultSectionRelevoGeneracional(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp !== undefined) {
                data.dataRelevoGeneracional.observations = resp;
                setData(data);
            }
        });
        api.consultDataRelayGenerational(dataLocation.transactionId).then(response1 => {
            if (response1 == undefined) return;
            let html = response1.getManagementRelaysResponseDTOList.map((datos) => (
                datos.status ?
                    <tr key={uniq_key()}>
                        <td>{datos.name}</td>
                        <td>{datos.position}</td>
                        <td>{formatDate(datos.birthDate)}</td>
                        <td>{calculate(datos.birthDate)}</td>
                        <td>{datos.relationship}</td>
                    </tr> : null))
            data.dataRelevoGeneracional.dataTableRelevo = html;
            setData({
                ...data,
                dataRelevoGeneracional: {
                    ...data.dataRelevoGeneracional,
                    dataTableRelevo: html
                }
            });
            //console.log("relevoGeneracional", data);
        });

        // consultarListaClientesIGR
        api.consultListaClientesIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp.clientsInformationListDTOList.length > 0) {
                data.dataInformacionClientes.dataTableInformacionClientes = resp.clientsInformationListDTOList
                setData(data);
            }
        });
        // consultarListaProveedoresIGR
        api.consultListaProvidersIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp.providers.length > 0) {
                data.dataInformacionProveedores.dataTableInformacionProveedores = resp.providers
                setData(data);
            }
        });
        // consultarCompetidores
        api.consultCompetitors(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp.competitors.length > 0) {
                data.dataPrincipalesCompetidores.dataTablePrincipalesCompetidores = resp.competitors
                setData(data);
            }
        });
        // consultarRelacionesBancariasDeudasCP
        api.consultBankingRelationsDebtsCP(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp != undefined) {
                data.dataRelacionesBancarias.dataTablDeudaCorto = resp.getBankingRelationCPDTOList
                data.dataRelacionesBancarias.sumatoriaDeudaCorto = { monto: 0, saldo1: 0, saldo2: 0, saldo3: 0 }
                for (let i = 0; i < resp.getBankingRelationCPDTOList.length; i++) {
                    if (resp.getBankingRelationCPDTOList[i].status) {
                        data.dataRelacionesBancarias.sumatoriaDeudaCorto.monto = parseFloat(data.dataRelacionesBancarias.sumatoriaDeudaCorto.monto) + parseFloat(resp.getBankingRelationCPDTOList[i].amount);
                        data.dataRelacionesBancarias.sumatoriaDeudaCorto.saldo1 = parseFloat(data.dataRelacionesBancarias.sumatoriaDeudaCorto.saldo1) + parseFloat(resp.getBankingRelationCPDTOList[i].debitBalance1);
                        data.dataRelacionesBancarias.sumatoriaDeudaCorto.saldo2 = parseFloat(data.dataRelacionesBancarias.sumatoriaDeudaCorto.saldo2) + parseFloat(resp.getBankingRelationCPDTOList[i].debitBalance2);
                        data.dataRelacionesBancarias.sumatoriaDeudaCorto.saldo3 = parseFloat(data.dataRelacionesBancarias.sumatoriaDeudaCorto.saldo3) + parseFloat(resp.getBankingRelationCPDTOList[i].debitBalance3);
                    }
                }
                setData(data);
            }
        });
        // consultarRelacionesBancariasDeudasLP
        api.consultBankRelationsDebtsLP(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp != undefined) {
                data.dataRelacionesBancarias.dataTablDeudaLargo = resp.bankingRelationLPDTOList
                data.dataRelacionesBancarias.sumatoriaDeudaLargo = { monto: 0, saldo1: 0, saldo2: 0, saldo3: 0 }
                for (let i = 0; i < resp.bankingRelationLPDTOList.length; i++) {
                    if (resp.bankingRelationLPDTOList[i].status) {
                        data.dataRelacionesBancarias.sumatoriaDeudaLargo.monto = parseFloat(data.dataRelacionesBancarias.sumatoriaDeudaLargo.monto) + parseFloat(resp.bankingRelationLPDTOList[i].amount);
                        data.dataRelacionesBancarias.sumatoriaDeudaLargo.saldo1 = parseFloat(data.dataRelacionesBancarias.sumatoriaDeudaLargo.saldo1) + parseFloat(resp.bankingRelationLPDTOList[i].debitBalance1);
                        data.dataRelacionesBancarias.sumatoriaDeudaLargo.saldo2 = parseFloat(data.dataRelacionesBancarias.sumatoriaDeudaLargo.saldo2) + parseFloat(resp.bankingRelationLPDTOList[i].debitBalance2);
                        data.dataRelacionesBancarias.sumatoriaDeudaLargo.saldo3 = parseFloat(data.dataRelacionesBancarias.sumatoriaDeudaLargo.saldo3) + parseFloat(resp.bankingRelationLPDTOList[i].debitBalance3);
                    }
                }
                setData(data);
            }
        });
        // consultarSowActualIGR
        api.consultSowActualIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp != undefined) {
                data.dataRelacionesBancarias.dataTablSowActual = resp.currentSOWDTOList
                setData(data);
            }
        });
        // consultarAccionistaBD
        api.consultarAccionistaBD(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp != undefined) {
                data.dataAccionistas.datosTablaAccionistas = resp
                setData(data);
            }
        });
        // consultarSowPropuestoIGR
        api.consultSowProposedIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp != undefined) {
                data.dataRelacionesBancarias.dataTablSowPropuesto = resp.proposedSOWDTOList
                setData(data);
            }
        });
        // consultarMovimientosCuentasIGR
        api.consultMovementsAccountsIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp != undefined) {
                data.dataMoviemientosCuentas.dataTableMovimientoCuentas = resp
                setData(data);
            }
        });
        // consultarListaReciprocidadIGR
        api.consultIGRReciprocityList(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp != undefined) {
                data.dataReciprocidad.dataTableReciprocidad = resp.reciprocity
                setData(data);
            }
        });
        // consultarActivosFijosIGR
        api.consultFixedAssetsIGR(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            if (resp != undefined) {
                data.dataFacilidadActivosFijos.dataTableFacilidadActivosFijos = resp.fixedAssets;
                setData(data);
            }
        });
        // consultarGaranteBD
        api.consultarGaranteBD(dataLocation.transactionId).then(resp => {
            //console.log(resp);
            if (resp != undefined) {
                data.dataInformacionGarante.dataTbleInformacionGarantes = resp;
                setData(data);
            }
        });
        // consultarSegurosEmpresaIGR
        api.consultInsuranceCompanyIGR(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.dataSegurosActualesEmpresa.dataTableSegurosActualesEmpresa = resp;
                setData(data);
            }
        });
        // consultarCuentasCobrarIGR
        api.consultAccountsReceivableIGR(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.dataCuentasCobrar.dataTableCuentasCobrar = resp;
                setData(data);
            }
        });
        // consultarCapexIGR
        api.consultarListaCapexAC(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.dataCapex.dataTableCapex1 = resp;
                setData(data);
            }
        });
        // consultarCapexPresupuestoIGR
        api.consultarListaCapexPresupuestoAC(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.dataCapex.dataTableCapex2 = resp;
                setData(data);
            }
        });
        // consultarCapexDetalleProyectoIGR
        api.consultarListaCapexDetallesAC(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.dataCapex.dataTableCapex3 = resp;
                setData(data);
            }
        });
        /* ---------------------------------------------------------------------------------------------- */
        /*                                 Consulta para el flujo de caja                                 */
        /* ---------------------------------------------------------------------------------------------- */
        // consultarFlujoCajaDollar
        api.queryCashFlowDollar(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            data.dataFlujoCaja.dataTableFlujoCaja1 = resp.cashFlowDollarDTOList;
            setData(data);
        });
        // consultarFlujoCajaIngresoFacturacion
        api.checkCashFlowIncomeInvoicing(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            data.dataFlujoCaja.dataTableFlujoCaja2 = resp.cashFlowInvoiceIncome;
            setData(data);
        });
        // consultarFlujoCajaCobranzas
        api.checkCashFlowCollections(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            data.dataFlujoCaja.dataTableFlujoCaja3 = resp.cashFlowCollection;
            setData(data);
        });
        // consultarFlujoCajaEgresos
        api.consultCashFlowExpenses(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            data.dataFlujoCaja.dataTableFlujoCaja4 = resp.cashFlowOutcome;
            setData(data);
        });
        // consultarFlujoCajaServicioDeudas
        api.consultCashFlowServiceDebts(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            data.dataFlujoCaja.dataTableFlujoCaja5 = resp.cashFlowDebtServiceDTOList;
            setData(data);
        });
        // consultarFlujoCajaCargaTrabajo
        api.queryCashFlowLoadWork(dataLocation.transactionId).then(resp => {
            if (resp == undefined) return;
            data.dataFlujoCaja.dataTableFlujoCaja6 = resp.cashFlowWorkLoad;
            setData(data);
        });
        /* ---------------------------------------------------------------------------------------------- */
        /*                                  Data para matriz competitiva                                  */
        /* ---------------------------------------------------------------------------------------------- */
        // consultarMatrizOtrosBancosIGR
        api.consultMatrixOtherBanksIGR(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.dataMatrizCompetitiva.dataTableOtrosBancosActivosFijos = resp.competitiveMatrixOtherBanks;
                setData(data);
            }
        });
        // consultarMatrizNuevosNegociosIGR
        api.consultMatrixNewBusinessIGR(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.dataMatrizCompetitiva.dataTableNuevosNegocios = resp.newBusiness;
                setData(data);
            }
        });
        // consultarMatrizExpedientesIGR
        api.consultMatrixFilesIGR(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.dataMatrizCompetitiva.dataTableExpedientes = resp.files;
                setData(data);
            }
        });
        // consultarMatrizRentabilidadIGR
        api.consultMatrixProfitabilityIGR(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.dataMatrizCompetitiva.dataTableRentabilidad = resp.profitability;
                setData(data);
            }
        });
        // consultarMovimientosCuentasIGR
        api.consultMovementsAccountsIGR(dataLocation.transactionId).then(resp => {
            if (resp != undefined) {
                data.dataMoviemientosCuentas.dataTableMovimientoCuentas = resp;
                setData(data);
            }
        });
        // consultarMatrizPosicionBanescoIGR
        api.consultMatrixPosicionBanescoIGR(dataLocation.transactionId).then(resp => {
            if (resp.length > 0) {
                data.dataMatrizCompetitiva.dataTablePosicion = resp;
                setData(data);
            }
        });
        // consultarMatrizTransaccionBanescoIGR
        api.consultMatrixTransactionBanescoIGR(dataLocation.transactionId).then(resp => {
            if (resp.length > 0) {
                data.dataMatrizCompetitiva.dataTableTransaccion = resp;
                setData(data);
            }
        });

    }
    function calculate(fecha) {
        var today = new Date();
        var yyyy = moment().format("YYYY");
        var today2 = new Date(fecha);
        var yyyy2 = moment(fecha).format("YYYY");
        return (parseInt(yyyy) - parseInt(yyyy2));
    }
    function formatDate(date) {
        return date === '2022-01-01' || date === '' ? '' : moment(date).format("DD/MM/YYYY");
    }
    function calculateYear(fecha_nac) {
        var a = moment(moment().format('YYYY-MM-DD'));
        var b = moment(fecha_nac);

        var years = a.diff(b, 'year');
        b.add(years, 'years');

        var months = a.diff(b, 'months');
        b.add(months, 'months');

        var days = a.diff(b, 'days');

        if (isNaN(years) || isNaN(months) || isNaN(days))
            return t('InvalidDate');

        let date;

        if (years == 0) {
            if (months <= 1) {
                if (days <= 1) {
                    date = `${months} ${t("month")} ${days} ${t("day")}`;
                } else {
                    date = `${months} ${t("month")} ${days} ${t("days")}`;
                }
            } else {
                if (days <= 1) {
                    date = `${months} ${t("months")} ${days} ${t("day")}`;
                } else {
                    date = `${months} ${t("months")} ${days} ${t("days")}`;
                }
            }

        } else {
            if (years == 1) {
                date = `${years} ${t("year")}`;
            } else {
                date = `${years} ${t("years")}`;
            }
        }
        return date;
    }
    return (
        <>
            {
                locationData ? <>
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("General Data")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("PersonType")}</strong></th>
                                                <th><strong>{t("FullName")}</strong></th>
                                                <th><strong>{t("IdentificationType")}</strong></th>
                                                <th><strong>{t("IdentificationNumber")}</strong></th>
                                                <th><strong>{t("Customer ID")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datosDeudores}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Economic Group")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosGenerales.economicGroup?.name == "" || data.datosGenerales.economicGroup?.name == null ? t("NoData") : data.datosGenerales.economicGroup?.name}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">Sub{t("Economic Activity")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosGenerales.economicActivity?.name == "" || data.datosGenerales.economicActivity?.name == null ? t("NoData") : data.datosGenerales.economicActivity?.name}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Banking")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosGenerales.bank?.name == "" || data.datosGenerales.bank?.name == null ? t("NoData") : data.datosGenerales.bank?.name}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Economic Activity")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosGenerales.subeconomicActivity?.name == "" || data.datosGenerales.subeconomicActivity?.name == null ? t("NoData") : data.datosGenerales.subeconomicActivity?.name}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de datos generales de la empresa pantalla 2 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("General of the Company")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Country")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.country.name == "" || data.datosEmpresa.country.name == null ? t("NoData") : data.datosEmpresa.country.name}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Province")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.province.name == "" || data.datosEmpresa.province.name == null ? t("NoData") : data.datosEmpresa.province.name}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("District")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.district.name == "" || data.datosEmpresa.district.name == null ? t("NoData") : data.datosEmpresa.district.name}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Township")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.township.name == "" || data.datosEmpresa.township.name == null ? t("NoData") : data.datosEmpresa.township.name}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("City")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.city.name == "" || data.datosEmpresa.city.name == null ? t("NoData") : data.datosEmpresa.city.name}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Reference Point")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.referencePoint == "" || data.datosEmpresa.referencePoint == null ? t("NoData") : data.datosEmpresa.referencePoint}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Building/Residence")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.residency == "" || data.datosEmpresa.residency == null ? t("NoData") : data.datosEmpresa.residency}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Apto")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.houseNumber == "" || data.datosEmpresa.houseNumber == null ? t("NoData") : data.datosEmpresa.houseNumber}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Phone Number")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.phoneNumber == "" || data.datosEmpresa.phoneNumber == null ? t("NoData") : data.datosEmpresa.phoneNumber}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Mobile Phone Number")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.mobileNumber == "" || data.datosEmpresa.mobileNumber == null ? t("NoData") : data.datosEmpresa.mobileNumber}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Office Phone Number")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.workNumber == "" || data.datosEmpresa.workNumber == null ? t("NoData") : data.datosEmpresa.workNumber}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Email")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.email == "" || data.datosEmpresa.email == null ? t("NoData") : data.datosEmpresa.email}</Label>
                                </Col>
                            </Row>
                            {/* <Row>
                        <Col xl="2">
                            <strong htmlFor="clientNumber">{t("Sector")}</strong>
                        </Col>
                        <Col xl="4">
                            <Label htmlFor="clientNumber">{data.datosEmpresa.sector.name == "" || data.datosEmpresa.sector.name == null ? t("NoData") : data.datosEmpresa.sector.name}</Label>
                        </Col>
                        <Col xl="2">
                            <strong htmlFor="clientNumber">{t("SubSector")}</strong>
                        </Col>
                        <Col xl="4">
                            <Label htmlFor="clientNumber">{data.datosEmpresa.subSector.name == "" || data.datosEmpresa.subSector.name == null ? t("NoData") : data.datosEmpresa.subSector.name}</Label>
                        </Col>
                    </Row> */}
                            <Row>
                                {/* <Col xl="2">
                            <strong htmlFor="clientNumber">{t("Apply for Exclusion List")}</strong>
                        </Col>
                        <Col xl="4">
                            <Label htmlFor="clientNumber">{data.datosEmpresa.exclusion == "" || data.datosEmpresa.exclusion == null ? t("NoData") : (data.datosEmpresa.exclusion ? t("yes") : t("not"))}</Label>
                        </Col> */}
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("SustainableCustomer")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.sustainable == "" || data.datosEmpresa.sustainable == null ? t("NoData") : (data.datosEmpresa.sustainable ? t("yes") : t("not"))}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Sustainable Project")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.datosEmpresa.sustainableProjectDesc == "" || data.datosEmpresa.sustainableProjectDesc == null ? t("NoData") : (data.datosEmpresa.sustainableProjectDesc)}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de historia de la empresa pantalla 3 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("History of the Company")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Details")}</strong>
                                </Col>
                                <Col xl="6">
                                    <Label htmlFor="clientNumber">{data.historiaEmpresa.description == "" || data.historiaEmpresa.description == null ? t("NoData") : data.historiaEmpresa.description}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Number of Employees")}</strong>
                                </Col>
                                <Col xl="2">
                                    <Label htmlFor="clientNumber">{data.historiaEmpresa.employeesNumber == "" || data.historiaEmpresa.employeesNumber == null ? t("NoData") : data.historiaEmpresa.employeesNumber}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Description")}</strong>
                                </Col>
                                <Col xl="10">
                                    <Label htmlFor="clientNumber">{data.historiaEmpresa.details == "" || data.historiaEmpresa.details == null ? t("NoData") : data.historiaEmpresa.details}</Label>
                                </Col>

                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de informacion de accionista pantalla 4 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("Shareholder Information")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("ID Number")}</strong></th>
                                                <th><strong>{t("Name")}</strong></th>
                                                <th><strong>{t("Nationality")}</strong></th>
                                                <th><strong>{t("DBO")}</strong></th>
                                                <th><strong>{t("Participation")}</strong></th>
                                                <th><strong>{t("YearsExprience")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataAccionistas.datosTablaAccionistas == null ? <tr key={uniq_key()}>
                                                {/*<td colSpan="5" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>*/}
                                            </tr> : data.dataAccionistas.datosTablaAccionistas.map((data) => (
                                                <tr key={uniq_key()}>
                                                    <td>{data.clientDocumentId}</td>
                                                    <td>{data.name + " " + data.secondName + " " + data.lastName + " " + data.secondSurname}</td>
                                                    <td>{data.nationality}</td>
                                                    <td>{formatDate(data.birthDate)}</td>
                                                    <td>{data.participation > 0 ? currencyData.formatTable(data.participation) : 0.00}%</td>
                                                    <td>{data.yearsExperience > 0 ? data.yearsExperience : 0} {t("Year")}s</td>
                                                </tr>))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Description")}</strong>
                                </Col>
                                <Col xl="10">
                                    <Label htmlFor="clientNumber">{data.dataAccionistas.observations == "" || data.dataAccionistas.observations == null ? t("NoData") : data.dataAccionistas.observations}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de iestructura organizacional pantalla 5 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("OrganizationalStructure")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Details")}</strong>
                                </Col>
                                <Col xl="12">
                                    <Label htmlFor="clientNumber" className="lineBreak">{data.dataEstructuraOrganizacional.description == "" || data.dataEstructuraOrganizacional.description == null ? t("NoData") : data.dataEstructuraOrganizacional.description}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de Gobierno pantalla 6 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("CorporateGovernance")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Name")}</strong></th>
                                                <th><strong>{t("Charge")}</strong></th>
                                                <th><strong>{t("DBO")}</strong></th>
                                                <th><strong>{t("Age")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataGobiernoCorporativo.dataTableGobiernoCorporativo}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Description")}</strong>
                                </Col>
                                <Col xl="12">
                                    <Label htmlFor="clientNumber">{data.dataGobiernoCorporativo.description == "" || data.dataGobiernoCorporativo.description == null ? t("NoData") : data.dataGobiernoCorporativo.description}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de relevo gerenacional pantalla 7 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("ManagementRelays")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Name")}</strong></th>
                                                <th><strong>{t("Charge")}</strong></th>
                                                <th><strong>{t("DBO")}</strong></th>
                                                <th><strong>{t("Age")}</strong></th>
                                                <th><strong>{t("Relation")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataRelevoGeneracional.dataTableRelevo}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Description")}</strong>
                                </Col>
                                <Col xl="12">
                                    <Label htmlFor="clientNumber">{data.dataRelevoGeneracional.observations == "" || data.dataRelevoGeneracional.observations == null ? t("NoData") : data.dataRelevoGeneracional.observations}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de flujo operativo pantalla 8 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("OperationalFlow")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Details")}</strong>
                                </Col>
                                <Col xl="10">
                                    <Label htmlFor="clientNumber">{data.dataFlujoOperativo.observations == "" || data.dataFlujoOperativo.observations == null ? t("NoData") : data.dataFlujoOperativo.observations}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de empresas relacionadas pantalla 9 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("RelatedCompanies")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Name")}</strong></th>
                                                <th><strong>{t("Activity")}</strong></th>
                                                <th><strong>{t("YearsInTheSector")}</strong></th>
                                                <th><strong>{t("Relation")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataEmpresaRelacionada.dataTableEmpresaRelacionada == null ? <tr key={uniq_key()}>
                                                {/*<td colSpan="5" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>*/}
                                            </tr> : data.dataEmpresaRelacionada.dataTableEmpresaRelacionada.map((data) => (
                                                <tr key={uniq_key()}>
                                                    <td>{data.name}</td>
                                                    <td>{data.activity}</td>
                                                    <td>{data.sectorExperience}</td>
                                                    <td>{data.relationship}</td>
                                                </tr>))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Description")}</strong>
                                </Col>
                                <Col xl="12">
                                    <Label htmlFor="clientNumber">{data.dataEmpresaRelacionada.observations == "" || data.dataEmpresaRelacionada.observations == null ? t("NoData") : data.dataEmpresaRelacionada.observations}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de informacion de clientes pantalla 10 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("ClientsInfo")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Name")}</strong></th>
                                                <th><strong>{t("Country")}</strong></th>
                                                <th><strong>{t("SalePercent")}</strong></th>
                                                <th><strong>{t("ClientType")}</strong></th>
                                                <th><strong>{t("SaleType")}</strong></th>
                                                <th><strong>{t("Crtermindays")}</strong></th>
                                                <th><strong>{t("IncaseofCollectionDelayindicateReasonforCollectionDelayandStartegia")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataInformacionClientes.dataTableInformacionClientes == null ? <tr key={uniq_key()}>
                                                {/*<td colSpan="5" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>*/}
                                            </tr> : data.dataInformacionClientes.dataTableInformacionClientes.map((data) => (
                                                <tr key={uniq_key()}>
                                                    <td>{data.name}</td>
                                                    <td>{data.country}</td>
                                                    <td>{currencyData.formatTable(data.salePercentage)}%</td>
                                                    <td>{data.customerType}</td>
                                                    <td>{data.salesType}</td>
                                                    <td>{data.creditDays}</td>
                                                    <td>{data.delayReason}</td>
                                                </tr>))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="3">
                                    <strong htmlFor="clientNumber">{t("Description")}</strong>
                                </Col>
                                <Col xl="9">
                                    <Label htmlFor="clientNumber">{data.dataInformacionClientes.description == "" || data.dataInformacionClientes.description == null ? t("NoData") : data.dataInformacionClientes.description}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="3">
                                    <strong htmlFor="clientNumber">{t("SalesCycle")}</strong>
                                </Col>
                                <Col xl="9">
                                    <Label htmlFor="clientNumber">{data.dataInformacionClientes.seasonalSales == "" || data.dataInformacionClientes.seasonalSales == null ? t("NoData") : (data.dataInformacionClientes.seasonalSales ? t("yes") : t("not"))}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="3">
                                    <strong htmlFor="clientNumber">{t("PercentageSalesSeasonalPeriods")}</strong>
                                </Col>
                                <Col xl="9">
                                    <Label htmlFor="clientNumber">{data.dataInformacionClientes.percSeasonalPeriodSales == "" || data.dataInformacionClientes.percSeasonalPeriodSales == null ? t("NoData") : data.dataInformacionClientes.percSeasonalPeriodSales + "%"}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de informacion de proveedores pantalla 11 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("ProvidersInfo")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Name")}</strong></th>
                                                <th><strong>{t("Country")}</strong></th>
                                                <th><strong>{t("AgeofRelationship")}</strong></th>
                                                <th><strong>{t("BuyPercent")}</strong></th>
                                                <th><strong>{t("Crtermindays")}</strong></th>
                                                <th><strong>{t("SpecialTradingConditions")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataInformacionProveedores.dataTableInformacionProveedores == null ? <tr key={uniq_key()}>
                                                {/*<td colSpan="5" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>*/}
                                            </tr> : data.dataInformacionProveedores.dataTableInformacionProveedores.map((data) => (
                                                <tr key={uniq_key()}>
                                                    <td>{data.name}</td>
                                                    <td>{data.country}</td>
                                                    <td>{data.antiquity}</td>
                                                    <td>{currencyData.formatTable(data.percentPurchases)}%</td>
                                                    <td>{data.creditDays}</td>
                                                    <td>{data.negotiationConditions}</td>
                                                </tr>))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="3">
                                    <strong htmlFor="clientNumber">{t("Description")}</strong>
                                </Col>
                                <Col xl="9">
                                    <Label htmlFor="clientNumber">{data.dataInformacionProveedores.description == "" || data.dataInformacionProveedores.description == null ? t("NoData") : data.dataInformacionProveedores.description}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="3">
                                    <strong htmlFor="clientNumber">{t("PurchasingCycle")}</strong>
                                </Col>
                                <Col xl="9">
                                    <Label htmlFor="clientNumber">{data.dataInformacionProveedores.purchasingCycle == "" || data.dataInformacionProveedores.purchasingCycle == null ? t("NoData") : data.dataInformacionProveedores.purchasingCycle}</Label>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                    {/* Previsualizacion de principales competidores pantalla 12 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("MainCompetitorsintheMarket")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Name")}</strong></th>
                                                <th><strong>{t("Description")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataPrincipalesCompetidores.dataTablePrincipalesCompetidores == null ? <tr key={uniq_key()}>
                                                {/*<td colSpan="5" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>*/}
                                            </tr> : data.dataPrincipalesCompetidores.dataTablePrincipalesCompetidores.map((data) => (
                                                <tr key={uniq_key()}>
                                                    <td>{data.name}</td>
                                                    <td>{data.description}</td>
                                                </tr>))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                    {/* Previsualizacion de proyecciones pantalla 13 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("Projections")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Details")}</strong>
                                </Col>
                                <Col xl="10">
                                    <Label htmlFor="clientNumber">{data.dataProyecciones.descripcion == "" || data.dataProyecciones.descripcion == null ? t("NoData") : data.dataProyecciones.descripcion}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <CardHeader>
                                    <h5 className="card-title">{t("EstimatesVariationsInItsAssetStructure")}</h5>
                                </CardHeader>
                            </Row>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Type")}</strong></th>
                                                <th><strong>{t("Amount")}</strong></th>
                                                <th><strong>{t("Reason")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{t("OperatingAssets")}</td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.assetsOperatingAmount == "" || data.dataProyecciones.assetsOperatingAmount == null ? t("NoData") : currencyData.formatTable(data?.dataProyecciones?.assetsOperatingAmount ?? 0)}</Label>
                                                </td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.assetsOperatingReason == "" || data.dataProyecciones.assetsOperatingReason == null ? t("NoData") : data.dataProyecciones.assetsOperatingReason}</Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{t("FixedAssets")}</td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.fixedAssetsAmount == "" || data.dataProyecciones.fixedAssetsAmount == null ? t("NoData") : currencyData.formatTable(data?.dataProyecciones?.fixedAssetsAmount ?? 0)}</Label>
                                                </td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.fixedAssetsReason == "" || data.dataProyecciones.fixedAssetsReason == null ? t("NoData") : data.dataProyecciones.fixedAssetsReason}</Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{t("OthersAssets")}</td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.othersAssetsAmount == "" || data.dataProyecciones.othersAssetsAmount == null ? t("NoData") : currencyData.formatTable(data?.dataProyecciones?.othersAssetsAmount ?? 0)}</Label>
                                                </td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.othersAssetsReason == "" || data.dataProyecciones.othersAssetsReason == null ? t("NoData") : data.dataProyecciones.othersAssetsReason}</Label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <CardHeader>
                                    <h5 className="card-title">{t("EstimatesVariationsInItsFinancingSources")}</h5>
                                </CardHeader>
                            </Row>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Type")}</strong></th>
                                                <th><strong>{t("Amount")}</strong></th>
                                                <th><strong>{t("Reason")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{t("Banking")}</td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.bankAmount == "" || data.dataProyecciones.bankAmount == null ? t("NoData") : currencyData.formatTable(data?.dataProyecciones?.bankAmount ?? 0)}</Label>
                                                </td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.bankReason == "" || data.dataProyecciones.bankReason == null ? t("NoData") : data.dataProyecciones.bankReason}</Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{t("Providers")}</td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.providersAmount == "" || data.dataProyecciones.providersAmount == null ? t("NoData") : currencyData.formatTable(data?.dataProyecciones?.providersAmount ?? 0)}</Label>
                                                </td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.providersReason == "" || data.dataProyecciones.providersReason == null ? t("NoData") : data.dataProyecciones.providersReason}</Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{t("Capital")}</td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.capitalAmount == "" || data.dataProyecciones.capitalAmount == null ? t("NoData") : currencyData.formatTable(data?.dataProyecciones?.capitalAmount ?? 0)}</Label>
                                                </td>
                                                <td>
                                                    <Label htmlFor="clientNumber">{data.dataProyecciones.capitalReason == "" || data.dataProyecciones.capitalReason == null ? t("NoData") : data.dataProyecciones.capitalReason}</Label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="3">
                                    <strong htmlFor="clientNumber">{t("MaximumAmountOfBankDebtToTake")}</strong>
                                </Col>
                                <Col xl="3">
                                    <Label htmlFor="clientNumber">{data.dataProyecciones.maximodeuda == "" || data.dataProyecciones.maximodeuda == null ? t("NoData") : currencyData.formatTable(data?.dataProyecciones?.maximodeuda ?? 0)}</Label>
                                </Col>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("EstimatedDate")}</strong>
                                </Col>
                                <Col xl="4">
                                    <Label htmlFor="clientNumber">{data.dataProyecciones.estimatedDate == "" || data.dataProyecciones.estimatedDate == null ? t("NoData") : formatDate(data.dataProyecciones.estimatedDate)}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de relaciones bancarias pantalla 14 */}
                    <Card>
                        <CardBody>
                            <RelacionesBancarias activeTab={14} activacion={true} dataRelacionesBancarias={data.dataRelacionesBancarias} />
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de Movimiento de cuentas pantalla 15 */}
                    <MoviemientosCuentas activeTab={15} validacion={true} dataMoviemientosCuentas={data.dataMoviemientosCuentas} />
                    {/* Previsualizacion de informacion de clientes pantalla 16 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("Reciprocity")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th>{t("Year")}</th>
                                                <th>{t("Month")}</th>
                                                <th>{t("Sales")}</th>
                                                <th>{t("Deposits")}</th>
                                                {/* <th>{t("AverageBalance")}</th> */}
                                                <th>{t("Reciprocity")}</th>
                                                <th>{t("ActualSow")}</th>
                                                <th>{t("Description")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataReciprocidad.dataTableReciprocidad == null ? <tr key={uniq_key()}>
                                                <td colSpan="7" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                            </tr> : data.dataReciprocidad.dataTableReciprocidad.map((data) => (
                                                data.status ?
                                                    <tr key={data[uniq_key()]}>
                                                        <td>{data.year}</td>
                                                        <td>{data.month}</td>
                                                        <td>${currencyData.formatTable(data?.sales ?? 0)}</td>
                                                        <td>${currencyData.formatTable(data?.deposits ?? 0)}</td>
                                                        {/* <td>${currencyData.formatTable(data?.averageBalance ?? 0)}</td> */}
                                                        <td>{currencyData.formatTable(data?.reciprocity ?? 0)}%</td>
                                                        <td>{currencyData.formatTable(data?.sow ?? 0)}%</td>
                                                        <td>{data.description ?? ''}</td>
                                                    </tr> : null))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="3">
                                    <strong htmlFor="clientNumber">{t("Description")}</strong>
                                </Col>
                                <Col xl="9">
                                    <Label htmlFor="clientNumber">{data.dataReciprocidad.observations == "" || data.dataReciprocidad.observations == null ? t("NoData") : data.dataReciprocidad.observations}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de informacion de clientes pantalla 17 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("FixedAssetsFacilities")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th>{t("Address")}</th>
                                                <th>{t("Description")}</th>
                                                <th>{t("PropertyType")}</th>
                                                <th>{t("OwnerCompany")}</th>
                                                <th>{t("LeaseFee")}</th>
                                                <th>{t("ContractPeriod") + " (" + t("Year") + "s)"}</th>
                                                <th>{t("LeaseTerms")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataFacilidadActivosFijos.dataTableFacilidadActivosFijos == null || data.dataFacilidadActivosFijos.dataTableFacilidadActivosFijos.length == 0 ? <tr key={uniq_key()}>
                                                <td colSpan="7" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                            </tr> : data.dataFacilidadActivosFijos.dataTableFacilidadActivosFijos.map((data) => (
                                                <tr key={uniq_key()}>
                                                    <td>{data.address}</td>
                                                    <td>{data.observations}</td>
                                                    <td>{data.propertyType.code}</td>
                                                    <td>{data.ownerCompany}</td>
                                                    <td>${currencyData.format(data.leaseFee)}</td>
                                                    <td>{data.contractDuration}</td>
                                                    <td>{data.leaseConditions}</td>
                                                </tr>))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "20px" }}>
                                <Col md="11" style={{ textAlign: "left" }}>
                                    <strong htmlFor="variationsAssets">¿{t("ThereSignificanVariationsFixedAssetsCompanies")}?   :    {"      "} {data.dataFacilidadActivosFijos.variationsAssets ? "Si" : "No"}</strong>
                                </Col>
                                {data.dataFacilidadActivosFijos.variationsAssets ?
                                    <><Col md="12" style={{ textAlign: "left", marginLeft: "20px" }}>
                                        <strong htmlFor="variationsAssets">{t("IndicateTypeInvestmentWasMadeAdvantagesCompanyInvestmentWasFinanced")}</strong>
                                    </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "21px" }}>
                                            <Label htmlFor="variationsAssets">{data.dataFacilidadActivosFijos.variationsAssetsObs}</Label>
                                        </Col></> : null}
                                {/* Segunda pregunta? */}
                                <Col md="11" style={{ textAlign: "left" }}>
                                    <strong htmlFor="variationsAssets">¿{t("HasManufacturingCompaniesAgroindustries")}?   :    {"      "} {data.dataFacilidadActivosFijos.manufacturingAgroCompanies ? "Si" : "No"}</strong>
                                </Col>
                                {data.dataFacilidadActivosFijos.manufacturingAgroCompanies ?
                                    <>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "20px" }}>
                                            <strong htmlFor="variationsAssets">{t("MainProductionLinesWhatDoesConsist")}</strong>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "21px" }}>
                                            <Label htmlFor="variationsAssets">{data.dataFacilidadActivosFijos.productionLine}</Label>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "20px" }}>
                                            <strong htmlFor="variationsAssets">{t("Installed Capacity in units amount of finished products that the company can produce per period per year, per month, etc")}</strong>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "21px" }}>
                                            <Label htmlFor="variationsAssets">{data.dataFacilidadActivosFijos.capacity}</Label>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "20px" }}>
                                            <strong htmlFor="variationsAssets">{t("Percentage of capacity used number of finished products that are currently producing per year, per month, etc")}</strong>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "21px" }}>
                                            <Label htmlFor="variationsAssets">{data.dataFacilidadActivosFijos.usedCapacity}</Label>
                                        </Col>
                                    </> : null}
                                {/* tercera pregunta */}
                                <Col md="11" style={{ textAlign: "left" }}>
                                    <strong htmlFor="variationsAssets">¿{t("Has Marketing Companies")}?   :    {"      "} {data.dataFacilidadActivosFijos.tradingCompany ? "Si" : "No"}</strong>
                                </Col>
                                {data.dataFacilidadActivosFijos.tradingCompany ?
                                    <>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "20px" }}>
                                            <strong htmlFor="variationsAssets">{t("Storage and Distribution Capacity (Installed and percentage of use)")}</strong>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "21px" }}>
                                            <Label htmlFor="variationsAssets">{data.dataFacilidadActivosFijos.warehouseCapacity}</Label>
                                        </Col>
                                    </> : null}
                                {/* cuarta pregunta */}
                                <Col md="11" style={{ textAlign: "left" }}>
                                    <strong htmlFor="variationsAssets">¿{t("It has a transportation / distribution fleet")}?   :    {"      "} {data.dataFacilidadActivosFijos.transportDistributionFleet ? "Si" : "No"}</strong>
                                </Col>
                                {data.dataFacilidadActivosFijos.transportDistributionFleet ?
                                    <>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "20px" }}>
                                            <strong htmlFor="variationsAssets">{t("Indicate the number of units with which it has the age of said vehicles the average number of trips per month average costs of routine and preventive maintenance of each vehicle and the frequency in which they do it")}</strong>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "21px" }}>
                                            <Label htmlFor="variationsAssets">{data.dataFacilidadActivosFijos.units}</Label>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "20px" }}>
                                            <strong htmlFor="variationsAssets">{t("Do you estimate a short-term renewal of the fleet? How do you plan to finance it?")}</strong>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "21px" }}>
                                            <Label htmlFor="variationsAssets">{data.dataFacilidadActivosFijos.renovation}</Label>
                                        </Col>
                                    </> : null}
                                {/* quinta pregunta */}
                                <Col md="11" style={{ textAlign: "left" }}>
                                    <strong htmlFor="variationsAssets">¿{t("Description of the facilities")}?   :    {"      "} {data.dataFacilidadActivosFijos.descriptionOfTheFacilities ? "Si" : "No"}</strong>
                                </Col>
                                {data.dataFacilidadActivosFijos.descriptionOfTheFacilities ?
                                    <>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "20px" }}>
                                            <strong htmlFor="variationsAssets">{t("DescriptionOfTheFacilities1")}</strong>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "21px" }}>
                                            <Label htmlFor="variationsAssets">{data.dataFacilidadActivosFijos.physicalLocation}</Label>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "20px" }}>
                                            <strong htmlFor="variationsAssets">{t("DescriptionOfTheFacilities4")}</strong>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "21px" }}>
                                            <Label htmlFor="variationsAssets">{data.dataFacilidadActivosFijos.rentalConditionsAf}</Label>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "20px" }}>
                                            <strong htmlFor="variationsAssets">{t("DescriptionOfTheFacilities5")}</strong>
                                        </Col>
                                        <Col md="12" style={{ textAlign: "left", marginLeft: "21px" }}>
                                            <Label htmlFor="variationsAssets">{data.dataFacilidadActivosFijos.invested}</Label>
                                        </Col>
                                    </> : null}
                                {/* sexta pregunta */}
                                <Col md="11" style={{ textAlign: "left" }}>
                                    <strong htmlFor="variationsAssets">¿{t("N/A")}?   :    {"      "} {data.dataFacilidadActivosFijos.notApplicable ? "Si" : "No"}</strong>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de informacion de clientes pantalla 18 */}
                    <Card>
                        <CardHeader>

                            <h5 className="card-title">{t("EnvironmentalAspects")}</h5>
                        </CardHeader>
                        <CardBody disabled={true}>
                            <AvForm id="frmAspectosAmbientales" className="needs-validation" disabled={true}>
                                <AspectosAmbientales supervisorPreview={props?.supervisorPreview} previsualizar={true} activeTab="18" datosGenerales={data.dataAspectosAmbientales} locationData={locationData} dataAspectosAmbientales={data.dataAspectosAmbientales} />
                                {/* <Row>
                            <Col md="12">
                                <AvGroup check className="mb-3">
                                
                                    <Switch name="isProjectLocatedProtectedNaturalArea"
                                        uncheckedIcon={<Offsymbol />}
                                        checkedIcon={<OnSymbol />}
                                        onColor="#007943"
                                        disabled={true}
                                        className="form-label"
                                        checked={data.dataAspectosAmbientales.natureLocationProject}
                                    />
                                    {'   '}
                                    <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Is the project located or adjacent to a protected natural area")}</Label>
                                </AvGroup>
                            </Col>
                            <Col md="12">
                                <AvGroup check className="mb-3">
                                    <Switch name="theProjectInvolvePhysicalEconomicResettlement"
                                        uncheckedIcon={<Offsymbol />}
                                        checkedIcon={<OnSymbol />}
                                        onColor="#007943"
                                        disabled={true}
                                        className="form-label"
                                        checked={data.dataAspectosAmbientales.physicalResettlement}
                                    />
                                    {'   '}
                                    <Label style={{ textAlign: "left" }} htmlFor="theProjectInvolvePhysicalEconomicResettlement">{t("Does the project involve physical and or economic resettlement of more than 100 people")}</Label>
                                </AvGroup>
                            </Col>
                            <Col md="12">
                                <AvGroup check className="mb-3">
                                    <Switch name="isPresentationEnvironmentalPermitsNecessary"
                                        uncheckedIcon={<Offsymbol />}
                                        checkedIcon={<OnSymbol />}
                                        onColor="#007943"
                                        disabled={true}
                                        className="form-label"
                                        checked={data.dataAspectosAmbientales.environmentalPermits}
                                    />
                                    {'   '}
                                    <Label style={{ textAlign: "left" }} htmlFor="isPresentationEnvironmentalPermitsNecessary">{t("Is the presentation of environmental permits necessary for the execution of the project")}</Label>
                                </AvGroup>
                            </Col>
                            <Col md="12">
                                <AvGroup check className="mb-3">
                                    <Switch name="isProjectNew"
                                        uncheckedIcon={<Offsymbol />}
                                        checkedIcon={<OnSymbol />}
                                        onColor="#007943"
                                        disabled={true}
                                        className="form-label"
                                        checked={data.dataAspectosAmbientales.environmentalPermits}
                                    />
                                    {'   '}
                                    <Label style={{ textAlign: "left" }} htmlFor="isProjectNew">{t("Is the project new and involves the use of more than 35 hectares of land")}</Label>
                                </AvGroup>
                            </Col>
                            <Col md="12">
                                <AvGroup check className="mb-3">
                                    <Switch name="doesActivityEmployMoreThan50Workers"
                                        uncheckedIcon={<Offsymbol />}
                                        checkedIcon={<OnSymbol />}
                                        onColor="#007943"
                                        disabled={true}
                                        className="form-label"
                                        checked={data.dataAspectosAmbientales.workersContractors}
                                    />
                                    {'   '}
                                    <Label style={{ textAlign: "left" }} htmlFor="doesActivityEmployMoreThan50Workers">{t("Does the activity employ more than 50 workers and handle more than 15 contractors")}</Label>  {'  '}
                                </AvGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl="3">
                                <strong htmlFor="clientNumber">{t("PreClassificationRisk")}</strong>
                            </Col>
                            <Col xl="9">
                                <Label htmlFor="clientNumber">{data.dataAspectosAmbientales.riskPreClassification == "" || data.dataAspectosAmbientales.riskPreClassification == null ? t("NoData") : data.dataAspectosAmbientales.riskPreClassification}</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl="3">
                                <strong htmlFor="clientNumber">{t("EnvironmentalRiskclassification")}</strong>
                            </Col>
                            <Col xl="9">
                                <Label htmlFor="clientNumber">{data.dataAspectosAmbientales.riskClassificationConfirmation == "" || data.dataAspectosAmbientales.riskClassificationConfirmation == null ? t("NoData") : data.dataAspectosAmbientales.riskClassificationConfirmation}</Label>
                            </Col>
                        </Row> */}
                            </AvForm>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de informacion de garantes pantalla 19 */}
                    <Card>
                        <InformacionGarante activeTab={19} validacion={true} dataInformacionGarante={data.dataInformacionGarante} />
                    </Card>
                    {/* Previsualizacion de Seguros Actuales de la Empresa pantalla 20 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("CurrentCompanyInsurance")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("InsuranceCompany")}</strong></th>
                                                <th><strong>{t("InsuranceType")}</strong></th>
                                                <th><strong>{t("Amount")}</strong></th>
                                                <th><strong>{t("Expiration")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataSegurosActualesEmpresa.dataTableSegurosActualesEmpresa == null ? <tr key={uniq_key()}>
                                                <td colSpan="4" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                            </tr> : data.dataSegurosActualesEmpresa.dataTableSegurosActualesEmpresa.map((data) => (
                                                data.status ?
                                                    <tr key={uniq_key()}>
                                                        <td>{data.company}</td>
                                                        <td>{data.insuranceType.code}</td>
                                                        <td>${currencyData.formatTable(data?.amount ?? 0)}</td>
                                                        <td>{formatDate(data.dueDate)}</td>
                                                    </tr> : null))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de arquitectura empresarial pantalla 21 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("EnterpriseArchitecture")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xl="12">
                                    <strong htmlFor="clientNumber">{t("Use of Technological Information Systems for the General Operation of the Company")}</strong>
                                </Col>
                                <Col xl="8">
                                    <Label htmlFor="clientNumber">{data.dataArquitecturaEmpresarial.ticCompanyUse == "" || data.dataArquitecturaEmpresarial.ticCompanyUse == null ? t("NoData") : data.dataArquitecturaEmpresarial.ticCompanyUse}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="12">
                                    <strong htmlFor="clientNumber">{t("If some of your areas have been audited, indicate the Opinion of the Independent Auditors")}</strong>
                                </Col>
                                <Col xl="8">
                                    <Label htmlFor="clientNumber">{data.dataArquitecturaEmpresarial.auditedAreas == "" || data.dataArquitecturaEmpresarial.auditedAreas == null ? t("NoData") : data.dataArquitecturaEmpresarial.auditedAreas}</Label>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                    {/* Previsualizacion de Cuentas por cobrar pantalla 22 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("AccountsReceivable")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Description")}</strong></th>
                                                <th><strong>30 {t("Days")}</strong></th>
                                                <th><strong>60 {t("Days")}</strong></th>
                                                <th><strong>90 {t("Days")}</strong></th>
                                                <th><strong>120 {t("Days")}</strong></th>
                                                <th><strong>150 {t("Days")}</strong></th>
                                                <th><strong>180 {t("Days")}</strong></th>
                                                <th><strong>210 {t("Days")}</strong></th>
                                                <th><strong>240 {t("Days")}</strong></th>
                                                <th><strong>270 {t("Days")}</strong></th>
                                                <th><strong>300 {t("Days")}</strong></th>
                                                <th><strong>330 {t("Days")}</strong></th>
                                                <th><strong>+331 {t("Days")}</strong></th>
                                                <th><strong>{t("Total")}</strong></th>
                                                <th><strong>{t("Percent")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataCuentasCobrar.dataTableCuentasCobrar == null ? <tr key={uniq_key()}>
                                                <td colSpan="15" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                            </tr> : data.dataCuentasCobrar.dataTableCuentasCobrar.map((data) => (
                                                <tr key={uniq_key()}>
                                                    <td>{data.countryCustomer}</td>
                                                    <td>${currencyData.formatTable(data?.days30 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days60 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days90 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days120 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days150 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days180 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days210 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days240 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days270 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days300 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days330 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.days331 ?? 0)}</td>
                                                    <td>${currencyData.formatTable(data?.total ?? 0)}</td>
                                                    <td>{data.percentage}</td>
                                                </tr>))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de Capex pantalla 23 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("Capex")}</h5>
                        </CardHeader>
                        <CardBody>
                            <HeaderSections title="Capex" descri="" t={t} />
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Description")}</strong></th>
                                                <th><strong>{t("UsesInMiles")}</strong></th>
                                                <th><strong>{t("Shareholder")}</strong></th>
                                                <th><strong>{t("Bank")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataCapex.dataTableCapex1 == null ? <tr key={uniq_key()}>
                                                <td colSpan="4" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                            </tr> : data.dataCapex.dataTableCapex1.map((data) => (
                                                <tr key={uniq_key()}>
                                                    <td>{data.observations}</td>
                                                    <td>${currencyData.formatTable(data?.thousandUse ?? 0)}</td>
                                                    <td>{data.shareholder}</td>
                                                    <td>{data.back}</td>
                                                </tr>))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <HeaderSections title="Budget" descri="" t={t} />
                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("Budget")}</strong></th>
                                                <th><strong>{t("Amount")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataCapex.dataTableCapex2 == null ? <tr key={uniq_key()}>
                                                <td colSpan="4" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                            </tr> : data.dataCapex.dataTableCapex2.map((data) => (
                                                <tr key={uniq_key()}>
                                                    <td>{data.budget}</td>
                                                    <td>${currencyData.formatTable(data?.amount ?? 0)}</td>
                                                </tr>))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <HeaderSections title="Details" descri="" t={t} />

                            <Row>
                                <Col md="12" className="table-responsive styled-table-div">
                                    <Table className="table table-striped table-hover styled-table table">
                                        <thead >
                                            <tr>
                                                <th><strong>{t("ProjectDetails")}</strong></th>
                                                <th><strong>{t("Amount")}</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.dataCapex.dataTableCapex3 == null ? <tr key={uniq_key()}>
                                                <td colSpan="4" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                            </tr> : data.dataCapex.dataTableCapex3.map((data) => (
                                                <tr key={uniq_key()}>
                                                    <td>{data.details}</td>
                                                    <td>${currencyData.formatTable(data?.amount ?? 0)}</td>
                                                </tr>))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de Flujo de caja pantalla 24 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("CashFlow")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Card>
                                    <CardHeader>
                                        <h5 className="card-title">{t("InDollars")}</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col md="12" className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table" >
                                                    <thead >
                                                        <tr>
                                                            <th>{t("Description")}</th>
                                                            <th><strong>{t("January")}</strong></th>
                                                            <th><strong>{t("February")}</strong></th>
                                                            <th><strong>{t("March")}</strong></th>
                                                            <th><strong>{t("April")}</strong></th>
                                                            <th><strong>{t("May")}</strong></th>
                                                            <th><strong>{t("June")}</strong></th>
                                                            <th><strong>{t("July")}</strong></th>
                                                            <th><strong>{t("August")}</strong></th>
                                                            <th><strong>{t("September")}</strong></th>
                                                            <th><strong>{t("October")}</strong></th>
                                                            <th><strong>{t("November")}</strong></th>
                                                            <th><strong>{t("December")}</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.dataFlujoCaja.dataTableFlujoCaja1 == null ? <tr key={uniq_key()}>
                                                            <td colSpan="13" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                        </tr> : data.dataFlujoCaja.dataTableFlujoCaja1.map((data) => (
                                                            <tr key={uniq_key()}>
                                                                <td>{data.description}</td>
                                                                <td>${currencyData.formatTable(data?.january ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.february ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.march ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.april ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.may ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.june ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.july ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.august ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.september ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.october ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.november ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.december ?? 0)}</td>
                                                            </tr>))}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Row>
                            <Row>
                                <Card>
                                    <CardHeader>
                                        <h5 className="card-title">{t("IncomeInvoicesITBMSNotIncluded")}</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col md="12" className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table" >
                                                    <thead >
                                                        <tr>
                                                            <th>{t("Description")}</th>
                                                            <th><strong>{t("January")}</strong></th>
                                                            <th><strong>{t("February")}</strong></th>
                                                            <th><strong>{t("March")}</strong></th>
                                                            <th><strong>{t("April")}</strong></th>
                                                            <th><strong>{t("May")}</strong></th>
                                                            <th><strong>{t("June")}</strong></th>
                                                            <th><strong>{t("July")}</strong></th>
                                                            <th><strong>{t("August")}</strong></th>
                                                            <th><strong>{t("September")}</strong></th>
                                                            <th><strong>{t("October")}</strong></th>
                                                            <th><strong>{t("November")}</strong></th>
                                                            <th><strong>{t("December")}</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.dataFlujoCaja.dataTableFlujoCaja2 == null || data.dataFlujoCaja.dataTableFlujoCaja2 == undefined ? <tr key={uniq_key()}>
                                                            <td colSpan="13" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                        </tr> : data.dataFlujoCaja.dataTableFlujoCaja2.map((data) => (
                                                            <tr key={uniq_key()}>
                                                                <td>{data.description}</td>
                                                                <td>${currencyData.formatTable(data?.january ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.february ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.march ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.april ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.may ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.june ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.july ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.august ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.september ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.october ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.november ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.december ?? 0)}</td>
                                                            </tr>))}
                                                    </tbody>
                                                </Table>
                                            </Col>

                                        </Row>
                                    </CardBody>
                                </Card>
                            </Row>
                            <Row>
                                <Card>
                                    <CardHeader>
                                        <h5 className="card-title">{t("CollectionsITBMSNotIncluded")}</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col md="12" className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table" >
                                                    <thead >
                                                        <tr>
                                                            <th>{t("Description")}</th>
                                                            <th><strong>{t("January")}</strong></th>
                                                            <th><strong>{t("February")}</strong></th>
                                                            <th><strong>{t("March")}</strong></th>
                                                            <th><strong>{t("April")}</strong></th>
                                                            <th><strong>{t("May")}</strong></th>
                                                            <th><strong>{t("June")}</strong></th>
                                                            <th><strong>{t("July")}</strong></th>
                                                            <th><strong>{t("August")}</strong></th>
                                                            <th><strong>{t("September")}</strong></th>
                                                            <th><strong>{t("October")}</strong></th>
                                                            <th><strong>{t("November")}</strong></th>
                                                            <th><strong>{t("December")}</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.dataFlujoCaja.dataTableFlujoCaja3 == null || data.dataFlujoCaja.dataTableFlujoCaja3 == undefined ? <tr key={uniq_key()}>
                                                            <td colSpan="13" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                        </tr> : data.dataFlujoCaja.dataTableFlujoCaja3.map((data) => (
                                                            <tr key={uniq_key()}>
                                                                <td>{data.description}</td>
                                                                <td>${currencyData.formatTable(data?.january ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.february ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.march ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.april ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.may ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.june ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.july ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.august ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.september ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.october ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.november ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.december ?? 0)}</td>
                                                            </tr>))}
                                                    </tbody>
                                                </Table>
                                            </Col>

                                        </Row>
                                    </CardBody>
                                </Card>
                            </Row>
                            <Row>
                                <Card>
                                    <CardHeader>
                                        <h5 className="card-title">{t("Expenses")}</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col md="12" className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table" >
                                                    <thead >
                                                        <tr>
                                                            <th>{t("Description")}</th>
                                                            <th><strong>{t("January")}</strong></th>
                                                            <th><strong>{t("February")}</strong></th>
                                                            <th><strong>{t("March")}</strong></th>
                                                            <th><strong>{t("April")}</strong></th>
                                                            <th><strong>{t("May")}</strong></th>
                                                            <th><strong>{t("June")}</strong></th>
                                                            <th><strong>{t("July")}</strong></th>
                                                            <th><strong>{t("August")}</strong></th>
                                                            <th><strong>{t("September")}</strong></th>
                                                            <th><strong>{t("October")}</strong></th>
                                                            <th><strong>{t("November")}</strong></th>
                                                            <th><strong>{t("December")}</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.dataFlujoCaja.dataTableFlujoCaja4 == null || data.dataFlujoCaja.dataTableFlujoCaja4 == undefined ? <tr key={uniq_key()}>
                                                            <td colSpan="13" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                        </tr> : data.dataFlujoCaja.dataTableFlujoCaja4.map((data) => (
                                                            <tr key={uniq_key()}>
                                                                <td>{data.description}</td>
                                                                <td>${currencyData.formatTable(data?.january ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.february ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.march ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.april ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.may ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.june ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.july ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.august ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.september ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.october ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.november ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.december ?? 0)}</td>
                                                            </tr>))}
                                                    </tbody>
                                                </Table>
                                            </Col>

                                        </Row>
                                    </CardBody>
                                </Card>
                            </Row>
                            <Row>
                                <Card>
                                    <CardHeader>
                                        <h5 className="card-title">{t("DebtServicing")}</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col md="12" className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table" >
                                                    <thead >
                                                        <tr>
                                                            <th>{t("Description")}</th>
                                                            <th><strong>{t("January")}</strong></th>
                                                            <th><strong>{t("February")}</strong></th>
                                                            <th><strong>{t("March")}</strong></th>
                                                            <th><strong>{t("April")}</strong></th>
                                                            <th><strong>{t("May")}</strong></th>
                                                            <th><strong>{t("June")}</strong></th>
                                                            <th><strong>{t("July")}</strong></th>
                                                            <th><strong>{t("August")}</strong></th>
                                                            <th><strong>{t("September")}</strong></th>
                                                            <th><strong>{t("October")}</strong></th>
                                                            <th><strong>{t("November")}</strong></th>
                                                            <th><strong>{t("December")}</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.dataFlujoCaja.dataTableFlujoCaja5 == null || data.dataFlujoCaja.dataTableFlujoCaja5 == undefined ? <tr key={uniq_key()}>
                                                            <td colSpan="13" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                        </tr> : data.dataFlujoCaja.dataTableFlujoCaja5.map((data) => (
                                                            <tr key={uniq_key()}>
                                                                <td>{data.description}</td>
                                                                <td>${currencyData.formatTable(data?.january ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.february ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.march ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.april ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.may ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.june ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.july ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.august ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.september ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.october ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.november ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.december ?? 0)}</td>
                                                            </tr>))}
                                                    </tbody>
                                                </Table>
                                            </Col>

                                        </Row>
                                    </CardBody>
                                </Card>
                            </Row>
                            <Row>
                                <Card>
                                    <CardHeader>
                                        <h5 className="card-title">{t("Workload")}</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col md="12" className="table-responsive styled-table-div">
                                                <Table className="table table-striped table-hover styled-table table" >
                                                    <thead >
                                                        <tr>
                                                            <th><strong>{t("Client")}</strong></th>
                                                            <th><strong>{t("ProjectName")}</strong></th>
                                                            <th><strong>{t("PublicOrganizationPrivateCompany")}</strong></th>
                                                            <th><strong>{t("ContractAmount")}</strong></th>
                                                            <th><strong>{t("PendinAmount")}</strong></th>
                                                            <th><strong>{t("StartExecutionPeriod")}</strong></th>
                                                            <th><strong>{t("EndExecutionPeriod")}</strong></th>
                                                            <th><strong>{t("PercentExecuted")}</strong></th>
                                                            <th><strong>{t("PercentToExecute")}</strong></th>
                                                            <th><strong>{t("ExpectedExecution")}</strong></th>
                                                            <th><strong>{t("AssignedDomiciledContract")}</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.dataFlujoCaja.dataTableFlujoCaja6 == null || data.dataFlujoCaja.dataTableFlujoCaja6 == undefined ? <tr key={uniq_key()}>
                                                            <td colSpan="13" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                        </tr> : data.dataFlujoCaja.dataTableFlujoCaja6.map((data) => (
                                                            <tr key={uniq_key()}>
                                                                <td>{data.customer}</td>
                                                                <td>{data.projectName}</td>
                                                                <td>{data.organismType}</td>
                                                                <td>${currencyData.formatTable(data?.contractAmount ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.pendingAmount ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.initialPlan ?? 0)}</td>
                                                                <td>${currencyData.formatTable(data?.endPlan ?? 0)}</td>
                                                                <td>{data.executedPercentage}</td>
                                                                <td>{data.percentageTobeExecuted}</td>
                                                                <td>{data.expectedExecution}</td>
                                                                <td>{data.contractType}</td>
                                                            </tr>))}
                                                    </tbody>
                                                </Table>
                                            </Col>

                                        </Row>
                                    </CardBody>
                                </Card>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de Negocios obtener pantalla 25 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("BusinessObtain")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Description")}</strong>
                                </Col>
                                <Col xl="10">
                                    <Label htmlFor="clientNumber">{data.dataNegociosObtener.observations == "" || data.dataNegociosObtener.observations == null ? t("NoData") : data.dataNegociosObtener.observations}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de MatrizCompetitiva pantalla 26 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("Matriz Competitiva")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xl="12">
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title">{t("BanescoPosition")}</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md="12" className="table-responsive styled-table-div">
                                                    <Table className="table table-striped table-hover styled-table table" >
                                                        <thead >
                                                            <tr>
                                                                <th><strong>{t("Product")}</strong></th>
                                                                <th><strong>{t("Amount")}</strong></th>
                                                                <th><strong>{t("ParticipationBanesco")}</strong></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.dataMatrizCompetitiva.dataTablePosicion == null ? <tr key={uniq_key()}>
                                                                <td colSpan="3" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                            </tr> : data.dataMatrizCompetitiva.dataTablePosicion.map((data) => (
                                                                data.status ?
                                                                    <tr key={uniq_key()}>
                                                                        <td>{data.product}</td>
                                                                        <td>${currencyData.formatTable(data?.closeVol ?? 0)}</td>
                                                                        <td>{currencyData.formatTable(data.participation)}%</td>
                                                                    </tr> : null))}
                                                            <tr style={estiloTotales}>
                                                                <td><strong>{t("Total")}</strong></td>
                                                                <td><strong>${currencyData.formatTable(data.dataMatrizCompetitiva.dataTablePosicion?.filter(data => data.status)?.reduce((ac, crr) => ac + crr.closeVol, 0) ?? 0)}</strong></td>
                                                                <td><strong>{parseFloat(currencyData.formatTable(data.dataMatrizCompetitiva.dataTablePosicion?.filter(data => data.status)?.reduce((ac, crr) => ac + crr.participation, 0) ?? 0)).toFixed(2)}%</strong></td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Col>

                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl="12">
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title">{t("BanescoTransactionalProducts")}</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md="12" className="table-responsive styled-table-div">
                                                    <Table className="table table-striped table-hover styled-table table" >
                                                        <thead >
                                                            <tr>
                                                                <th><strong>{t("Product")}</strong></th>
                                                                <th><strong>{t("Amount")}</strong></th>
                                                                <th><strong>{t("ParticipationBanesco")}</strong></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.dataMatrizCompetitiva.dataTableTransaccion == null ? <tr key={uniq_key()}>
                                                                <td colSpan="3" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                            </tr> : data.dataMatrizCompetitiva.dataTableTransaccion.map((data) => (
                                                                data.status ?
                                                                    <tr key={uniq_key()}>
                                                                        <td>{data.product}</td>
                                                                        <td>${currencyData.formatTable(data?.closeVol ?? 0)}</td>
                                                                        <td>{currencyData.formatTable(data.participation)}%</td>
                                                                    </tr> : null))}
                                                            <tr style={estiloTotales}>
                                                                <td><strong>{t("Total")}</strong></td>
                                                                <td><strong>${currencyData.formatTable(data.dataMatrizCompetitiva.dataTableTransaccion?.filter(data => data.status)?.reduce((ac, crr) => ac + crr.closeVol, 0) ?? 0)}</strong></td>
                                                                <td><strong>{parseFloat(currencyData.formatTable(data.dataMatrizCompetitiva.dataTableTransaccion?.filter(data => data.status)?.reduce((ac, crr) => ac + crr.participation, 0) ?? 0)).toFixed(2)}%</strong></td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Col>

                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="12">
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title">{t("OtherBanksLiabilitiesAssets")}</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md="12" className="table-responsive styled-table-div">
                                                    <Table className="table table-striped table-hover styled-table table" >
                                                        <thead >
                                                            <tr>
                                                                <th><strong>{t("Bank")}</strong></th>
                                                                <th><strong>{t("Passive")}</strong></th>
                                                                <th><strong>{t("Participation")}</strong></th>
                                                                <th><strong>{t("LongTerm")}</strong></th>
                                                                <th><strong>{t("ShortTerm")}</strong></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.dataMatrizCompetitiva.dataTableOtrosBancosActivosFijos == null ? <tr key={uniq_key()}>
                                                                <td colSpan="6" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                            </tr> : data.dataMatrizCompetitiva.dataTableOtrosBancosActivosFijos.map((data) => (
                                                                <tr key={uniq_key()}>
                                                                    <td>{data.bank}</td>
                                                                    <td>{currencyData.formatTable(data.passivePercentage)}%</td>
                                                                    <td>{currencyData.formatTable(data.participation)}%</td>
                                                                    <td>${currencyData.formatTable(data?.longTerm ?? 0)}</td>
                                                                    <td>${currencyData.formatTable(data?.shortTerm ?? 0)}</td>
                                                                </tr>))}
                                                            <tr style={estiloTotales}>
                                                                <td><strong>{t("Total")}</strong></td>
                                                                <td><strong>{parseFloat(currencyData.formatTable(data.dataMatrizCompetitiva.dataTableOtrosBancosActivosFijos?.reduce((ac, crr) => ac + crr.passivePercentage, 0) ?? 0)).toFixed(2)}%</strong></td>
                                                                <td><strong>{parseFloat(currencyData.formatTable(data.dataMatrizCompetitiva.dataTableOtrosBancosActivosFijos?.reduce((ac, crr) => ac + crr.participation, 0) ?? 0)).toFixed(2)}%</strong></td>
                                                                <td><strong>${currencyData.formatTable(data.dataMatrizCompetitiva.dataTableOtrosBancosActivosFijos?.reduce((ac, crr) => ac + crr.longTerm, 0) ?? 0)}</strong></td>
                                                                <td><strong>${currencyData.formatTable(data.dataMatrizCompetitiva.dataTableOtrosBancosActivosFijos?.reduce((ac, crr) => ac + crr.shortTerm, 0) ?? 0)}</strong></td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Col>

                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl="12">
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title">{t("ProfitabilityMatrix")}</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md="12" className="table-responsive styled-table-div">
                                                    <Table className="table table-striped table-hover styled-table table" >
                                                        <thead >
                                                            <tr>
                                                                <th><strong>{t("Type")}</strong></th>
                                                                <th><strong>{t("Quantity")}</strong></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.dataMatrizCompetitiva.dataTableRentabilidad == null ? <tr key={uniq_key()}>
                                                                <td colSpan="2" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                            </tr> : data.dataMatrizCompetitiva.dataTableRentabilidad.map((data) => (
                                                                <tr key={uniq_key()}>
                                                                    <td>{data.matrixType.code}</td>
                                                                    <td>{data.quantity}</td>
                                                                </tr>))}
                                                        </tbody>
                                                    </Table>
                                                </Col>

                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>

                            </Row>
                            <Row>
                                <Col xl="12">
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title">{t("NewBusinessesCommitments")}</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md="12" className="table-responsive styled-table-div">
                                                    <Table className="table table-striped table-hover styled-table table" >
                                                        <thead >
                                                            <tr>
                                                                <th><strong>{t("Type")}</strong></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.dataMatrizCompetitiva.dataTableNuevosNegocios == null ? <tr key={uniq_key()}>
                                                                <td colSpan="3" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                            </tr> : data.dataMatrizCompetitiva.dataTableNuevosNegocios.map((data) => (
                                                                <tr key={uniq_key()}>
                                                                    <td>{data.observations}</td>
                                                                </tr>))}
                                                        </tbody>
                                                    </Table>
                                                </Col>

                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl="12">
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-title">{t("FilesOthers")}</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col md="12" className="table-responsive styled-table-div">
                                                    <Table className="table table-striped table-hover styled-table table" >
                                                        <thead >
                                                            <tr>
                                                                <th><strong>{t("Type")}</strong></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.dataMatrizCompetitiva.dataTableExpedientes == null ? <tr key={uniq_key()}>
                                                                <td colSpan="3" style={{ textAlign: 'center' }}><h5 className="card-title">{t("NoData")}</h5></td>
                                                            </tr> : data.dataMatrizCompetitiva.dataTableExpedientes.map((data) => (
                                                                <tr key={uniq_key()}>
                                                                    <td>{data.observations}</td>
                                                                </tr>))}
                                                        </tbody>
                                                    </Table>
                                                </Col>

                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="3">
                                    <strong htmlFor="clientNumber">{t("Comment")}</strong>
                                </Col>
                                <Col xl="9">
                                    <Label htmlFor="clientNumber">{data.dataMatrizCompetitiva.observations == "" || data.dataMatrizCompetitiva.observations == null ? t("NoData") : data.dataMatrizCompetitiva.observations}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    {/* Previsualizacion de Recomendaciones pantalla 25 */}
                    <Card>
                        <CardHeader>
                            <h5 className="card-title">{t("RecomendationsAndOthers")}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Recomendations")}</strong>
                                </Col>
                                <Col xl="10">
                                    <Label htmlFor="clientNumber">{data.dataRecomendacionesOtros.recommendations == "" || data.dataRecomendacionesOtros.recommendations == null ? t("NoData") : data.dataRecomendacionesOtros.recommendations}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("ValueChain")}</strong>
                                </Col>
                                <Col xl="10">
                                    <Label htmlFor="clientNumber">{data.dataRecomendacionesOtros.valueChain == "" || data.dataRecomendacionesOtros.valueChain == null ? t("NoData") : data.dataRecomendacionesOtros.valueChain}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("Background")}</strong>
                                </Col>
                                <Col xl="10">
                                    <Label htmlFor="clientNumber">{data.dataRecomendacionesOtros.background == "" || data.dataRecomendacionesOtros.background == null ? t("NoData") : data.dataRecomendacionesOtros.background}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl="2">
                                    <strong htmlFor="clientNumber">{t("RefinancingLog")}</strong>
                                </Col>
                                <Col xl="10">
                                    <Label htmlFor="clientNumber">{data.dataRecomendacionesOtros.refinancingLog == "" || data.dataRecomendacionesOtros.refinancingLog == null ? t("NoData") : data.dataRecomendacionesOtros.refinancingLog}</Label>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </>
                    : null}</>
    );
};


export default PrevicualizarIGR;
