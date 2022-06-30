//Banca
export default class BankingModel {

    static fromJson(json) {
        const item = new BankingModel();
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}