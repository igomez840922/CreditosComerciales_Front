import BandejaEntradaFirmaContratoModel from "../../models/FirmaContrato/BandejaEntradaFirmaContratoModel"

const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesBandejaFirmaContrato {
    // getResultadosbandejaentrada
    getResultadosBandejaFirmaContrato(criteria) {

        return fetch("/api/FirmaContrato/ResultadoEntradaFirmaContrato", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => BandejaEntradaFirmaContratoModel.fromJson(item));
            });
    }
}
