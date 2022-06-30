//Relevo Generacional
export default class GenerationalReliefModel {

    static fromJson(json) {
        const item = new GenerationalReliefModel();
        item.id = json.id;
        item.name = json.name;
        item.charge = json.charge;
        item.dbo = json.dbo;
        item.relation = json.relation;
        return item;
    }
}