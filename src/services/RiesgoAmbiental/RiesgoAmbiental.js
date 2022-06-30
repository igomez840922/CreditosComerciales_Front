import ApiService from "../ApiService";
import BackendServices from "../BackendServices/Services";
import BpmServices from "../BpmServices/Services";


export default class ServicioRiesgoAmbiental extends ApiService {

  constructor() {
    super();
    this.backend = new BackendServices();
    this.bpm = new BpmServices();
  }

  consultarInformacionRiesgoAmbiental(transactId) {
    return this.backend.getEnvironmentalRiskInfo(transactId);
  }

  guardarInformacionRiesgoAmbiental(transactId, data, update) {
    data.transactId = transactId;
    if (update) {
      return this.backend.actualizarInformacionRiesgoAmbiental(data);
    }
    else {
      return this.backend.saveEnvironmentalRiskInfo(data);
    }
  }

  consultarAspectosAmbientales(transactId) {
    return this.backend.consultEnvironmentalAspectsIGR(transactId)
      .then(result => result.environmentalAspectsDTO);
  }

  guardarAspectosAmbientales(transactId, data) {
    data.transactId = transactId;
    data.status = true;
    return this.backend.saveEnvironmentalAspectsIGR(data);
  }

}
