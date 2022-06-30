//Corregimiento
export default class TownshipModel {

    static fromJson(json) {
        const item = new TownshipModel();
        item.idDistrito = json.idDistrito;
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}