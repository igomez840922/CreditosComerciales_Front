export default class Facilidad {

  static fromJsonArray(array) {
    // get list
    return array.map((json) => Facilidad.fromJson(json));
  }

  static fromJson(json) {
    const item = new Facilidad(json);
    return item;
  }

  constructor(payload) {
    this.payload = payload;
  }

  get facilityNumber() {
    return this.payload.facilityNumber;
  }

  get facilityCR() {
    return '';
  }

  get cliente() {
    return this.payload.customer;
  }

  get facilidad() {
    return this.payload.facility;
  }

  get propuesta() {
    return this.payload.proposal;
  }

  get riesgoAprobado() {
    return this.payload.approvedRisk;
  }

  get saldo() {
    return this.payload.balanace;
  }

  get riesgoPropuesto() {
    return this.payload.proposedRisk;
  }

  get variacion() {
    return this.payload.variation;
  }

  get tasaInteresPropuesta() {
    return this.payload.interestRateAmount;
  }

  get tasaInteresEfectiva() {
    return this.payload.interestRateEffective;
  }

  get tasaInteresSinSubsidio() {
    return this.payload.interestRateNoSubsidy;
  }

  get feci() {
    return this.payload.feci;
  }

  get comision() {
    return this.payload.comission;
  }

  get terminos() {
    return this.payload.terms;
  }

  get pagos() {
    return this.payload.disbursement.payments;
  }

  get plazosDesembolso() {
    return this.payload.disbursement.terms;
  }

  get metodosDesembolso() {
    return this.payload.disbursement.methods;
  }

  get garantias() {
    return this.payload.warrants;
  }

  get ltv() {
    return parseFloat(this.payload.ltv);
  }

  get fianzas() {
    return this.payload.sureties;
  }

}
