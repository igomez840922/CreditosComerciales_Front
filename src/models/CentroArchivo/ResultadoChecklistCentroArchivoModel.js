export default class ResultadoChecklistCentroArchivo {

    static fromJson(json) {

        const item = new ResultadoChecklistCentroArchivo();

    item.id = json.id;
    item.required = json.required;
    item.exception = json.exception;
    item.description = json.description;
    item.approvedBy = json.approvedBy;
    item.approvedAt = json.approvedAt;
    item.updatedBy = json.updatedBy;
    item.updatedAt = json.updatedAt;
    item.expirationDate = json.expirationDate;
    item.comments = json.comments;
    item.attachment = json.attachment;


         
        return item;
    }
}
