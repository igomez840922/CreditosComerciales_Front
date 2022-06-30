//Actividad Economica
export default class EconomicActivityModel {

    static fromJson(json) {
        const item = new EconomicActivityModel();
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}