import Currency from "../../../../helpers/currency";
import { BackendServices, CoreServices } from "../../../../services";


export default class TreasuryCurve {

    treasuryCurve;
    backendServices = new BackendServices();
    coreServices = new CoreServices();
    currencyData = new Currency();

    constructor() {

        //chequeamos si tenemos guardado en session
        var result = sessionStorage.getItem('locationData');
        if (result !== undefined && result !== null) {
            result = JSON.parse(result);
            this.location = result;
        }

    }

    initial(location = this.location) {
        return new Promise((resolve, reject) => {
            this.backendServices.consultGeneralDataIGR(location.transactionId).then(async resp => {
                let bankIGR = {
                    "AGROPECUARIO": "AGRO",
                    "CORPORATIVO": "CORPORATIVA",
                    "EMPRESAS": "EMPRESA",
                    "INTERINO": "INTERINO",
                    "BANCA INTERNACIONAL": "INTERNACIONAL",
                    "PYME": "PYME",
                }

                let catalogue = await this.coreServices.getTreasuryCurveCatalogo1().then(resp => resp?.Records);
                let bank = resp.bank.name;
                let code = catalogue.find(catalog => catalog.Description === bankIGR[bank])?.Code;
                let treasuryCurveCat = await this.coreServices.getTreasuryCurveCatalogoChild(code).then(resp => resp?.Records);

                this.treasuryCurve = treasuryCurveCat?.length > 0 ? this.currencyData.orderByJSON(treasuryCurveCat, 'Code', 'asc') : [];
                resolve();
            }).catch(err => { resolve(); console.error(err) })
        })
    }

    getTreasuryCurve({ term, termType }) {
        let termDiv = termType === 'D' ? 30 : 12;
        return term = termType === 'M' && term >= 10 && term <= 12 ? 1 : (termType === 'Y' ? term : term / termDiv), termType = termType === 'D' ? 'M' : 'Y', termType === 'M' && term >= 10 ? this.getTreasuryCurve({ term, termType }) : { term, termType }
    }

    showTreasuryCurve({ proposalRate, termType }) {
        console.log(proposalRate, termType, this.treasuryCurve?.length === 0)
        if (!proposalRate || !termType || this.treasuryCurve?.length === 0)
            return

        let param = { term: proposalRate, termType: termType === 'AÑOS' ? 'Y' : termType[0] }
        let treasuryCurveTerm = this.getTreasuryCurve(param);

        let treasuryCurves = this.treasuryCurve.filter(treasuryCurve => new RegExp(treasuryCurveTerm.termType, 'gi').test(treasuryCurve.Code))

        return treasuryCurves.find(treasury => treasuryCurveTerm.term <= treasury.Code.split('')[0]) ?? treasuryCurves.at(-1);
    }
}