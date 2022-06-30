//Provincia
export default class ProvinceModel {

    static fromJson(json) {
        const item = new ProvinceModel();
        item.idPais = json.idPais;
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}