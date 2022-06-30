import { PropuestaCredito } from "../../models";
import ApiService from "../ApiService";
import BackendServices from "../BackendServices/Services";
import BpmServices from "../BpmServices/Services";


export default class ServicioPropuestaCredito extends ApiService {

  constructor() {
    super();
    this.backend = new BackendServices();
    this.bpm = new BpmServices();
  }

  guardarDatosGenerales(instanceId, requestId, values) {
    values.transactId = Number(values.transactId);
    console.log('guardarDatosGenerales()', values);
    if (!requestId) {
      return this.backend.newDataGeneralPropCred(values)
        .then((result) => {
          if (result.status && result.status.statusCode === "200") {
            // Actualizar Variable en BPM de requestId
            this.bpm.updatevariables(instanceId, {
              requestId: result.requestId
            });
          }
          return result;
        });
    }
    else {
      values.requestId = requestId;
      return this.backend.updateDataGeneralPropCred(values);
    }
  }

  actualizarDatosGenerales(transactId, values) {
    console.log('actualizarDatosGenerales()', transactId);
    return this.backend.updateDataGeneralPropCred(values);
  }

  async consultarDatosGenerales(requestId) {
    const data = await this.backend.consultGeneralDataPropCred(requestId);
    console.log('consultarDatosGenerales()', data);
    if (data !== undefined) {
      if (requestId) {
        return data.find(record => record.requestId === requestId);
      }
      else {
        // return last array element
        return data[data.length - 1];
      }
    }

  }


  consultarDocumentosPropuestaCredito(criteria) {
    return this.sendCoreRequest('propuestacredito/documentos', 'POST', criteria)
      .then((data) => {
        // parse results
        return PropuestaCredito.fromJsonArray(data);
      });
  }


}
