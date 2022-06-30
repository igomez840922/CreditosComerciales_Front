import { BackendServices, BpmServices, CoreServices } from "../../../../services";

export class LevelAutonomyClass {

    backendServices = new BackendServices();
    bpmServices = new BpmServices();
    coreServices = new CoreServices();
    locationData;

    MODEL_FACILITY = {
        "approved": 0,
        "currentBalance": 0,
        "ltv": 0,
        "proposed": 0,
        "guarantee": 0,
    }

    constructor(dataSession = {}) {

        if (this.location?.data !== null && this.location?.data !== undefined) {
            if (this.location?.data.transactionId === undefined || this.location?.data.transactionId.length <= 0) {
                //this.location?.data.transactionId = 0;
                //checkAndCreateProcedure(this.location?.data);
                this.validateRoute = true
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(this.location?.data));
                this.locationData = this.location?.data;
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                this.locationData = result;
            } else {
                this.locationData = dataSession
            }
        }

    }

    async getLevelAutonomy() {
        return new Promise((resolve, reject) => {
            //facility type prendaria code PR
            Promise.allSettled([
                this.backendServices.consultGeneralDataPropCred(this.locationData?.transactionId ?? 0),
            ]).then(async allPromise => {
                const [{ value: propuesta }] = allPromise;

                let requestId = propuesta[0]?.requestId;
                let facilitiesProposal = await this.backendServices.consultarFacilidades(requestId ?? '');

                let tipo = facilitiesProposal?.some(facility => facility.facilityTypeId === 'PR') ? '4' : '';
                let amount = facilitiesProposal?.reduce((acu, crr) => crr.facilityTypeId === 'PR' ? acu + crr.amount : 0, 0) ?? 0;
                let ltv = facilitiesProposal?.reduce((acu, crr) => crr.facilityTypeId === 'PR' ? acu + crr.ltv : 0, 0) ?? 0;

                if (tipo !== '4') {
                    let expositionCorporative = await this.backendServices.getExposicionCorporativaBD(this.locationData.transactionId);
                    let facilityCP = expositionCorporative.find(x => x.description.toUpperCase() === "Facilidades Corto Plazo".toUpperCase()) ?? this.MODEL_FACILITY;
                    let facilityLP = expositionCorporative.find(x => x.description.toUpperCase() === "Facilidades Largo Plazo".toUpperCase()) ?? this.MODEL_FACILITY;

                    let facilities = await this.backendServices.consultarFacilidadesExposicionCorporativa(requestId ?? '');
                    let jsonFacilidades = {
                        CP: facilities==undefined?0:facilities?.CP.reduce((acu, crr) => (acu + crr.requestAmount), 0) || 0,
                        LP: facilities==undefined?0:facilities?.LP.reduce((acu, crr) => (acu + crr.requestAmount), 0) || 0,
                    }
                    let amountCP = parseFloat(facilityCP.approved) + parseFloat(jsonFacilidades.CP);
                    let amountLP = parseFloat(facilityLP.currentBalance) + parseFloat(jsonFacilidades.LP);
                    
                    let ltvCP = facilityCP.guarantee > 0 ? parseFloat(facilityCP.proposed) / parseFloat(facilityCP.guarantee) * 100 : 0;
                    let ltvLP = facilityLP.guarantee > 0 ? parseFloat(facilityLP.proposed) / parseFloat(facilityLP.guarantee) * 100 : 0;
                    
                    const { amount: amounting, ltv: ltvF } = amountCP > amountLP ? { amount: amountCP, ltvF: ltvCP } : { amount: amountLP, ltvF: ltvLP };
                    amount = amounting;
                    ltv = ltvF;
                    tipo = ltv >= 70 ? '1' : '2';
                    
                }
                
                resolve(await this.onLevelAutonomy({ tipo, amount }))
                
            }).catch(err => {
                console.error(err)
            })
        })
    }
    
    onLevelAutonomy({ tipo, amount }) {
        return new Promise((resolve, reject) => {
            amount > 0 ? this.bpmServices.saveAutonomy({ tipo, amount }).then(resp => {
                let banca = resp?.body?.result['dmn-evaluation-result']['dmn-context']?.autonomiaduales?.banca??"";
                let credit = resp?.body?.result['dmn-evaluation-result']['dmn-context']?.autonomiaduales?.credito??"";
                resolve({ banca, credit });
            }).catch(err => {
                console.log("facilities");
                console.log(err)
            }):resolve({ banca:"", credit:"" });
        })
    }
}