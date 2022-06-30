export default class ResumenCambios {

  static fromJsonArray(array) {
    // get list
    return array.map((json) => ResumenCambios.fromJson(json));
  }

  static fromJson(json) {
    const item = new ResumenCambios();
    item.description = json.description;
    return item;
  }

}
