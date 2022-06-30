import { BusquedaDescarteModel } from "../../models";


const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesValidarPresolicitud {
    // getResultadosbandejaentrada
    getResultadosBandejaEntradaPresolicitud(criteria) {

        return fetch("/api/ValidarPresolicitud/ResultadosBandejaEntrada", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => BusquedaDescarteModel.fromJson(item));
            });
    }
}
