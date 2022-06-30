//Cliente
export default class ClientModel {

    static fromJson(json) {
        const item = new ClientModel();
        item.id = json.id;
        item.name = json.name;
        item.country = json.country;
        item.clientType = json.clientType;
        item.salesType = json.salesType;
        item.termCrDays = json.termCrDays;
        item.reasonforDelay = json.reasonforDelay;
        return item;
    }
}