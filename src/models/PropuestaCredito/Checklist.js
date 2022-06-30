export default class Checklist {

  static fromJsonArray(array) {
    // get list
    return array.map((json) => Checklist.fromJson(json));
  }

  static fromJson(json) {
    const item = new Checklist(json);
    return item;
  }

  constructor(payload) {
    this.payload = payload;
  }

  get requerido() {
    return this.payload.required;
  }

  get excepcion() {
    return this.payload.exception;
  }

  get descripcion() {
    return this.payload.descripcion;
  }

  get comentarios() {
    return this.payload.comentarios;
  }

  get aprobadoPor() {
    return this.payload.aprobadoPor;
  }

  get fechaAprobacion() {
    return this.payload.fechaAprobacion ? new Date(this.payload.fechaAprobacion) : null;
  }

  get actualizadoPor() {
    return this.payload.actualizadoPor;
  }

  get fechaActualizacion() {
    return this.payload.fechaActualizacion ? new Date(this.payload.fechaActualizacion) : null;
  }

  get fechaExpiracion() {
    return this.payload.fechaExpiracion ? new Date(this.payload.fechaExpiracion) : null;
  }

}
