export default class ExposicionCorporativa {

  static fromJson(json) {

    const item = new ExposicionCorporativa();

    // copy keys
    const keys = Object.keys(json);
    for( const key of keys ) {
      item[key] = json[key];
    }

    return item;
  }

}
