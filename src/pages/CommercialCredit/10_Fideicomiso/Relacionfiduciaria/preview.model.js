import moment from "moment";
import { BackendServices, CoreServices, BpmServices } from "../../../../services";
import { Tab, Tabs } from 'react-bootstrap';

export default class previewEscrow {

    backendServices = new BackendServices();
    bpmServices = new BpmServices();
    coreServices = new CoreServices();
    serviciosFiduciario;
    otherServiciosFiduciario;
    locationData;
    basaFid;
    dataSession;
    validateRoute = false;
    customerID;
    dataGeneral;
    dataGeneralIGR;
    dataGeneralEnvironmentAspects;
    levelAutonomy;
    isActiveLoading = false;
    facilityType;
    proposalType;
    guaranteesType;
    facilities;
    instructiveType;
    facility;
    facilityId;
    tabsFacility;

    flowType;


    constructor(dataSession) {
        // super();
        this.saveDataSession(dataSession)
    }

    saveDataSession(dataSession) {
        dataSession && sessionStorage.setItem('locationData', JSON.stringify(dataSession));
        if (this.location?.data !== null && this.location?.data !== undefined) {
            if (this.location?.data.transactionId === undefined || this.location?.data.transactionId.length <= 0) {
                //this.location?.data.transactionId = 0;
                //checkAndCreateProcedure(this.location?.data);
                this.validateRoute = true
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(this.location?.data));
                this.locationData = this.location?.data;
                this.dataSession = this.location?.data;
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                this.locationData = result;
                this.dataSession = result;
            }
        }

        this.loadCustomerID();
        this.loadDataGeneral();
        this.loadDataIGR();
        this.loadDataEnvironmentAspects();
        this.loadCatalogCreditRisk()
    }
    async loadCatalogCreditRisk() {
        // let catalogue = await this.backendServices.getCreditRiskOpinionCatalog();
        // this.flowType = (catalogue?.map(creditRiskOpinion => ({ Code: creditRiskOpinion.id, Description: creditRiskOpinion.description })))
        this.flowType = [{ Code: '1', Description: 'Normal' }, { Code: '2', Description: 'Urgente' }]
    }

    loadOtherServiceFiduciary() {
        return new Promise((resolve, reject) => {
            Promise.allSettled([
                this.backendServices.consultGeneralDataPropCred(this.locationData.transactionId),
                this.backendServices.retrieveFacilityType(),
                this.coreServices.getTipoGarantiaCatalogo(),
                this.backendServices.retrieveProposalType(),
            ]).then(data => {
                const [{ value: GeneralDataPropCred }, { value: FacilityType }, { value: guaranteesType }, { value: proposalType }] = data;
                this.facilityType = FacilityType;
                this.proposalType = proposalType;
                this.guaranteesType = guaranteesType?.Records;
                this.backendServices.consultarFacilidades(GeneralDataPropCred[0].requestId).then(async resp => {
                    resp = resp.filter($$ => $$.debtor !== '  ' && $$.facilityTypeId !== " ").filter($$ => $$.proposalTypeId !== "MEN" && $$.applyEscrow);
                    console.log(resp)
                    if (resp.length > 0) {
                        this.facilities = resp;
                        this.instructiveType = resp[0].debtor;
                        this.facility = resp[0];
                        this.facilityId = resp[0].facilityId;
                        this.tabsFacility = (resp.map((items, index) => (
                            <Tab className="m-0" key={index} eventKey={index} title={FacilityType.find($$ => $$.id === items.facilityTypeId).description}></Tab>
                        )));
                        this.basaFid = await this.LoadNumeroFideicomiso();
                    }
                    resolve(this.tabsFacility);
                }).catch(err => {
                    console.error(err);
                });

            }).catch(err => {
                console.error(err)
            })
        })
    }

    async LoadFiduciario() {
        return await this.backendServices.consultarSeccionServiciosFiduciario(this.locationData.transactionId);
    }

    async LoadOtherFiduciario() {
        return new Promise(async (resolve, reject) => {
            Promise.allSettled([
                this.backendServices.consultListProgramPagoPropCred(this.facilityId),
                this.backendServices.consultarGarantiaPropCred(this.facilityId),
                this.backendServices.consultarSeccionOtrosServiciosFiduciario(this.locationData.transactionId, this.facilityId),
                this.LoadNumeroFideicomiso()
            ]).then(allPromise => {
                const [{ value: paymentMethods }, { value: guarantees }, { value: otherServiceFiduciary }, { value: basaFid }] = allPromise;
                this.basaFid = basaFid;

                let dataOtherFiduciary = {};
                (paymentMethods !== null || paymentMethods !== undefined) && (dataOtherFiduciary = { ...dataOtherFiduciary, paymentType: paymentMethods.map(paymentMethod => paymentMethod.paymentProgram).join('; ') });
                (guarantees !== null || guarantees !== undefined) && (dataOtherFiduciary = { ...dataOtherFiduciary, fixedActiveType: guarantees.map(guarantee => this.guaranteesType.find(x => x.Code === guarantee.guaranteeTypeName)?.Description).join('; ') });
                (otherServiceFiduciary !== null || otherServiceFiduciary !== undefined) && (dataOtherFiduciary = { ...dataOtherFiduciary, proposal: this.proposalType.find(x => x.id === this.facility.proposalTypeId)?.description, purpose: this.facility.purpose, ...otherServiceFiduciary });
                resolve(dataOtherFiduciary);
            }).catch(err => {
                console.error(err)
            });
        });
        // return await this.backendServices.consultarSeccionOtrosServiciosFiduciario(this.locationData.transactionId, this.facilityId);
    }

    async LoadNumeroFideicomiso() {
        return await this.backendServices.consultarNumeroFideicomiso(this.locationData.transactionId).then(resp => resp?.find(fiduciary => fiduciary.facilityId === this.facilityId)?.trustName);
    }

    async loadCustomerID() {
        this.customerID = await this.backendServices.consultPrincipalDebtor(this.locationData.transactionId).then(resp => resp.customerNumberT24);
    }

    async loadDataGeneral() {
        this.dataGeneral = await this.backendServices.consultGeneralDataPropCred(this.locationData.transactionId).then(resp => ({ ...resp[0], requestDate: this.formatDate(resp[0].requestDate), lastRequestDate: this.formatDate(resp[0].lastRequestDate), nextRevisionDate: this.formatDate(resp[0].nextRevisionDate), proposedExpirationDate: this.formatDate(resp[0].proposedExpirationDate), flow: this.flowType.find(flowType => flowType.Code === resp[0].flow)?.Description }));
    }

    async loadDataIGR() {
        this.dataGeneralIGR = await this.backendServices.consultGeneralDataIGR(this.locationData.transactionId);
    }
    async loadDataEnvironmentAspects() {
        this.dataGeneralEnvironmentAspects = await this.backendServices.consultEnvironmentalAspectsIGR(this.locationData.transactionId).then(resp => resp.environmentalAspectsDTO)
    }


    async getFacilityHistory() {
        return new Promise(async (resolve, reject) => {
            await this.backendServices.consultGeneralDataPropCred(this.locationData?.transactionId ?? 0).then(async propuesta => {
                this.backendServices.consultarFacilidadesT24(propuesta[0]?.requestId).then(async resp => {
                    if (resp.length > 0 && resp != undefined) {
                        resolve(+resp.reduce((acc, crr) => acc + crr.amount, 0))
                    }
                });
                this.backendServices.consultarFacilidades(propuesta[0].requestId).then(resp => {
                    resp = resp?.filter(data => data.debtor != "  ");
                    if (resp.length > 0) {
                        resolve(+resp.reduce((acc, crr) => acc + crr.amount, 0));
                    }
                });
            })
        })
    }

    formatDate(date) {
        return date ? moment(date).format("DD/MM/YYYY") : '';
    }
}