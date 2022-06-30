//Ciudad
export default class CityModel {

    static fromJson(json) {
        const item = new CityModel();
        item.idProvincia = json.idProvincia;
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}