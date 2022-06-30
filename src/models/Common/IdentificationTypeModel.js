//Tipo Identificacion
export default class IdentificationTypeModel {

    static fromJson(json) {
        const item = new IdentificationTypeModel();
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}