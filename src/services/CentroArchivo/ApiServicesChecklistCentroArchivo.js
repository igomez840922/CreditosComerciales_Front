import {ResultadoChecklistCentroArchivoModel} from "../../models"

const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesChecklistCentroArchivo {
    // getResultadosbandejaentrada
    getResultadoChecklistCentroArchivoModel(criteria) {

        return fetch("/api/CentroArchivo/ResultadoChecklistCentroArchivo", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => ResultadoChecklistCentroArchivoModel.fromJson(item));
            });
    }
}
