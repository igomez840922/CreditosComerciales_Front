//Capex Presupuesto
export default class CapexProjectDetail {

    static fromJson(json) {
        const item = new CapexProjectDetail();
        item.id = json.id;
        item.description = json.description;
        item.amount = json.amount;
        return item;
    }
}