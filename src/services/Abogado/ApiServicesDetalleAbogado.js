
import ResultadoDetalleAbogadoModel from "../../models/Abogado/ResultadoDetalleAbogadoModel"
const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesDetalleDocumentacion {
    // getResultadosbandejaentrada
    getResultadoDetalleAbogadoMode(criteria) {

        return fetch("/api/Abogado/ResultadoDetalleAbogado", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => ResultadoDetalleAbogadoModel.fromJson(item));
            });
    }
}
