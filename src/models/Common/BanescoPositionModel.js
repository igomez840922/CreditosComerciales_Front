//Posicion de Banesco
export default class BanescoPositionModel {

    static fromJson(json) {
        const item = new BanescoPositionModel();
        item.id = json.id;
        item.product = json.product;
        item.vol = json.vol;
        item.participation = json.participation;
        return item;
    }
}