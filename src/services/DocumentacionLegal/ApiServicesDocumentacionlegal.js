
import {EntradaDocumentacionModel} from "../../models"

const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesDocumentacionlegal {
    // getResultadosbandejaentrada
    getResultadosEntradaDocumentaciono(criteria) {

        return fetch("/api/DocumentacionLegal/ResultadosEntradaDocumentacion", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => EntradaDocumentacionModel.fromJson(item));
            });
    }
}
