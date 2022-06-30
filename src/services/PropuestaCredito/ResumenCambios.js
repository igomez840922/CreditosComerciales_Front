import ApiService from "../ApiService";
import { ResumenCambios } from "../../models/PropuestaCredito"

export default class ServicioResumenCambios extends ApiService {

  consultarResumenCambios(idCliente) {
    return this.sendCoreRequest(`propuestacredito/${idCliente}/consultarResumenCambios`)
      .then((json) => {
        // parse results
        return ResumenCambios.fromJsonArray(json);
      });
  }

}
