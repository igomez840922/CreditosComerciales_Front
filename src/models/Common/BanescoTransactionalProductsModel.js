//Posicion de Banesco
export default class BanescoTransactionalProductsModel {

    static fromJson(json) {
        const item = new BanescoTransactionalProductsModel();
        item.id = json.id;
        item.product = json.product;
        item.vol = json.vol;
        item.participation = json.participation;
        return item;
    }
}