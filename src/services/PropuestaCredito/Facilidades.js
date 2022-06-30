import { Facilidad } from "../../models/PropuestaCredito";
import ApiService from "../ApiService";

export default class ServicioFacilidades extends ApiService {

  consultarListaFacilidades(idCliente) {
    return this.sendBPMRequest(`propuestacredito/${idCliente}/consultarListaFacilidades`)
      .then((json) => {        
        // parse results
        return json;// Facilidad.fromJsonArray(json);
      });
  }

}
