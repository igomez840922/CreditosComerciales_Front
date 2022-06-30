
import  AceptacionCliente  from "../../models/AceptacionCliente/AceptacionClienteModel";


const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesAceptacionCliente {
    // getResultadosbandejaentrada
    getResultadosBandejaEntradaAceptacionCliente(criteria) {

        return fetch("/api/AceptacionCliente/ResultadosBandejaEntradaCli", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => AceptacionCliente.fromJson(item));
            });
    }
}
