//Anexos
export default class AttachModel {

    static fromJson(json) {
        const item = new AttachModel();
        item.id = json.id;
        item.name = json.name;
        item.description = json.description;
        item.url = json.url;
        return item;
    }
}