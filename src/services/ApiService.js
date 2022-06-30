import { PropuestaCredito } from "../models";
import { BusquedaDescarteModel } from "../models";


const defaultResponseHandler = (response) => {
  if( !response.ok ) {
    throw Error(response.statusText);
  }
  return response.json();
};

export default class ApiService {

  buildRequestOptions(method, params) {

    const options = { method };
    const headers = {}

    if( method === 'POST' ) {
      if( params ) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(params);
      }
    }

    options.headers = headers;
    return options;
  }

  sendCoreRequest(path, method = 'GET', params = null) {
    const options = this.buildRequestOptions(method, params);
    return fetch(`/api/core/${path}`, options)
      .then(defaultResponseHandler);
  }

  sendBPMRequest(path, method = 'GET', params = null) {
    const options = this.buildRequestOptions(method, params);
    return fetch(`/api/bpm/${path}`, options)
      .then(defaultResponseHandler);
  }


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


