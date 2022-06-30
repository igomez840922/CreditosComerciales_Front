export default class PropuestaCredito {

  static fromJsonArray(array) {
    // get list
    return array.map((json) => PropuestaCredito.fromJson(json));
  }

  static fromJson(json) {
    const item = new PropuestaCredito(json);
    return item;
  }

  constructor(payload) {
    this.payload = payload;
  }

  get id() {
    return this.payload.id;
  }

  get tipoFacilidad() {
    return this.payload.tipoFacilidad;
  }

  get tipoPropuesta() {
    return this.payload.tipoPropuesta;
  }

  get cliente() {
    return {
      id: this.payload.clientnumber,
      nombre: this.payload.clientname
    }
  }

  get date() {
    return new Date(this.payload.date);
  }

  get exposicionCorporativa() {
    return this.payload.exposicionCorporativa;
  }

  get exposicionCorporativaClientes() {
    return this.payload.exposicionCorporativaClientes;
  }

  static fromJson(json) {
    const item = new PropuestaCredito(json);
    return item;
  }

}
