//Otros Bancos / Pasivos y Activos
export default class LiabilitiesAssetsModel {

    static fromJson(json) {
        const item = new LiabilitiesAssetsModel();
        item.id = json.id;
        item.bank = json.bank;
        item.passive = json.passive;
        item.participation = json.participation;
        item.longTerm = json.participation;
        item.shortTerm = json.shortTerm;
        item.total = json.total;
        return item;
    }
}