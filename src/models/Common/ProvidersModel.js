//Proveedores
export default class ProvidersModel {

    static fromJson(json) {
        const item = new ProvidersModel();
        item.id = json.id;
        item.name = json.name;
        item.country = json.country;
        item.ageRelationship = json.ageRelationship;
        item.percentagePurchases = json.percentagePurchases;
        item.termCrDays = json.termCrDays;
        item.specialTradingConditions = json.specialTradingConditions;
        return item;
    }
}