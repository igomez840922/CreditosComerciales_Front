
import ResultadosDetalleDocumentacionModel from "../../models/DocumentacionLegal/ResultadosDetalleDocumentacionModel"
const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesDetalleDocumentacion {
    // getResultadosbandejaentrada
    getResultadosDetalleDocumentacionModel(criteria) {

        return fetch("/api/DocumentacionLegal/ResultadoDetalleDocumentacionLegal", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => ResultadosDetalleDocumentacionModel.fromJson(item));
            });
    }
}
