//Matriz de Rentabilidad
export default class ProfitabilityMatrixModel {

    static fromJson(json) {
        const item = new ProfitabilityMatrixModel();
        item.id = json.id;
        item.name = json.name;
        item.qty = json.qty;
        return item;
    }
}