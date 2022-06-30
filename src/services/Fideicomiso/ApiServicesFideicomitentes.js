
import ResultadoFideicomitenteModel from "../../models/Fideicomiso/ResultadoFideicomitenteModel";
const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesFideicomitentes {
    // getResultadosbandejaentrada
    getResultadosFideicomitentes(criteria) {

        return fetch("/api/Fideicomiso/ResultadoFideicomitente", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => ResultadoFideicomitenteModel.fromJson(item));
            });
    }
}
