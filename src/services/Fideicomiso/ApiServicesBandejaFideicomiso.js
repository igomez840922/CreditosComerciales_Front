
import {BandejaEntradaFideicomisoModel} from "../../models"

const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesBandejaFideicomiso {
    // getResultadosbandejaentrada
    getResultadosBandejaEntradaFideicomiso(criteria) {

        return fetch("/api/Fideicomiso/ResultadosEntradaFideicomiso", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => BandejaEntradaFideicomisoModel.fromJson(item));
            });
    }
}
