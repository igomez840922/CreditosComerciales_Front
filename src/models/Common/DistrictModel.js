//Distrito
export default class DistrictModel {

    static fromJson(json) {
        const item = new DistrictModel();
        item.idProvincia = json.idProvincia;
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}