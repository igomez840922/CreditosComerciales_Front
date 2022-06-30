export default class SubSectorModel {

    static fromJson(json) {
        const item = new SubSectorModel();
        item.idSector = json.idSector;
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}