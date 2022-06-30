//Sow
export default class SowModel {

    static fromJson(json) {
        const item = new SowModel();
        item.id = json.id;
        item.otherBank = json.otherBank; //otros bancos
        item.banesco = json.banesco; //banesco
        item.total = json.total;
        item.sow = json.sow;
        return item;
    }
}