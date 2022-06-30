export default class ResultadosDetalleDocumentacionModel {

    static fromJson(json) {

        const item = new ResultadosDetalleDocumentacionModel();

        item.id = json.id;
        item.comment = json.comentario;
         
        return item;
    }
}
