import { Checklist } from "../../models/PropuestaCredito";
import ApiService from "../ApiService";

export default class ServicioChecklist extends ApiService {

  consultarListaCheckList(id) {
    return this.sendBPMRequest(`propuestacredito/${id}/checklist`)
      .then((json) => {
        return Checklist.fromJsonArray(json);
      });
  }

}
