import { BitacoraRefinanciamiento } from "../../models/PropuestaCredito";
import ApiService from "../ApiService";

export default class ServicioRefinanciamiento extends ApiService {

  consultarBitacoraRefinanciamiento(id) {
    return this.sendBPMRequest(`propuestacredito/${id}/consultarBitacoraRefinanciamiento`)
      .then((json) => {
        // parse results
        return BitacoraRefinanciamiento.fromJsonArray(json);
      });
  }

}
