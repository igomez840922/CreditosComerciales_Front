import {ResultadoDetalleDocLegalCentroArchivoModel} from "../../models"

const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesChecklistDocLegalCentroArchivo {
    // getResultadosbandejaentrada
    getResultadoDetalleDocLegalCentroArchivoModel(criteria) {

        return fetch("/api/CentroArchivo/ResultadoDetalleDocLegalCentroArchivo", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => ResultadoDetalleDocLegalCentroArchivoModel.fromJson(item));
            });
    }
}
