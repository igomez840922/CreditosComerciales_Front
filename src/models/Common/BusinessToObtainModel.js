//Negocios a Obtener
export default class BusinessToObtainModel {

    static fromJson(json) {
        const item = new BusinessToObtainModel();
        item.id = json.id;
        item.name = json.name;
        item.year = json.year;
        item.month = json.month;
        item.amount = json.amount;
        return item;
    }
}