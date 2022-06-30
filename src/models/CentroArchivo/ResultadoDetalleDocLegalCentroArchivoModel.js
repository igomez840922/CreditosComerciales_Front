export default class ResultadoDetalleDocLegalCentroArchivoModel {

    static fromJson(json) {

        const item = new ResultadoDetalleDocLegalCentroArchivoModel();

        item.id = json.id;
        item.comment = json.comentario;
         
        return item;
    }
}
