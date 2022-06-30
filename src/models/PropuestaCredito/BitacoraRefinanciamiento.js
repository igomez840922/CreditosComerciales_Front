export default class BitacoraRefinanciamiento {

  static fromJsonArray(array) {
    // get list
    return array.map((json) => BitacoraRefinanciamiento.fromJson(json));
  }

  static fromJson(json) {
    const item = new BitacoraRefinanciamiento(json);
    return item;
  }

  constructor(payload) {
    this.payload = payload;
  }

  get cliente() {
    return this.payload.cliente;
  }

  get facilidad() {
    return this.payload.facilidad;
  }

  get status() {
    return this.payload.status;
  }

  get clasificacion() {
    return this.payload.clasificacion;
  }

  get prestamo() {
    return this.payload.prestamo;
  }

  get monto() {
    return this.payload.monto;
  }

  get saldo() {
    return this.payload.saldo;
  }

  get cuota() {
    return this.payload.cuota;
  }

  get capital() {
    return this.payload.capital;
  }

  get intereses() {
    return this.payload.intereses;
  }

  get otrosCargos() {
    return this.payload.otrosCargos;
  }

  get fechaVencimiento() {
    return new Date(this.payload.fechaVencimiento);
  }

  get refi() {
    return this.payload.refi;
  }

}
