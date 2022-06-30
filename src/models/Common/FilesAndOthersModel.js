//Expedientes y Otros
export default class FilesAndOthersModel {

    static fromJson(json) {
        const item = new FilesAndOthersModel();
        item.id = json.id;
        item.type = json.type;
        item.status = json.status;
        item.observations = json.observations;
        return item;
    }
}