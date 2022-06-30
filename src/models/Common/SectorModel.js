export default class SectorModel {

    static fromJson(json) {
        const item = new SectorModel();
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}