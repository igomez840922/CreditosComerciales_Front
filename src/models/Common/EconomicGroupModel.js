//Grupo Economico
export default class EconomicGroupModel {

    static fromJson(json) {
        const item = new EconomicGroupModel();
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}