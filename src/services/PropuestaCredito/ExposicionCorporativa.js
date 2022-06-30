import ApiService from "../ApiService";
import { ExposicionCorporativa } from "../../models/PropuestaCredito";

export default class ServicioExposicionCorporativa extends ApiService {

  consultarExposicionCorporativa(idCliente) {
    return this.sendCoreRequest(`consultarExposicionCorporativa/${idCliente}`)
      .then((json) => {
        // parse results
        return json.map(item => ExposicionCorporativa.fromJson(item));
      });
  }

  consultarExposicionCliente(idCliente) {
    return this.sendCoreRequest(`consultarExposicionCliente/${idCliente}`)
      .then((json) => {
        // parse results
        return json.map(item => ExposicionCorporativa.fromJson(item));
      });
  }

}
