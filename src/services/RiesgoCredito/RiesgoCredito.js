import ApiService from "../ApiService";
import BackendServices from "../BackendServices/Services";
import BpmServices from "../BpmServices/Services";


export default class ServicioRiesgoCredito extends ApiService {

  constructor() {
    super();
    this.backend = new BackendServices();
    this.bpm = new BpmServices();
  }

  consultarRiesgoCreditoComercial(transactId) {
    return this.backend.consultarRiesgoCreditoComercial(transactId);
  }

  guardarInformacionRiesgoCredito(transactId, data, update) {
    data.transactId = transactId;
    
    return this.backend.salvarRiesgoCreditoComercial(data);
  }

}
