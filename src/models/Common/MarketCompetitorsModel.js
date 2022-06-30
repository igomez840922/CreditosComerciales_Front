//Tipo Identificacion
export default class MarketCompetitorsModel {

    static fromJson(json) {
        const item = new MarketCompetitorsModel();
        item.id = json.id;
        item.name = json.name;
        item.description = json.description;
        return item;
    }
}