//Capex Presupuesto
export default class CapexBudgetModel {

    static fromJson(json) {
        const item = new CapexBudgetModel();
        item.id = json.id;
        item.description = json.description;
        item.amount = json.amount;
        return item;
    }
}