//Banca
export default class AccountMovementModel {

    static fromJson(json) {
        const item = new AccountMovementModel();
        item.id = json.id;
        item.year = json.year;
        item.month = json.name;
        item.deposits = json.deposits; //Deposito
        item.averageBalance = json.averageBalance; //Salo Promedio
        return item;
    }
}