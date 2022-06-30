//Provincia
export default class ReciprocityModel {

    static fromJson(json) {
        const item = new ReciprocityModel();
        item.id = json.id;
        item.year = json.year;
        item.month = json.month;
        item.sales = json.sales;
        item.deposits = json.deposits;
        item.averageBalance = json.averageBalance; //Saldo Promedio
        item.reciprocity = json.reciprocity; //Reciprocidad
        item.sow = json.sow; //sow
        return item;
    }
}