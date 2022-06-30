export default class ResultadoDetalleAbogadoModel {

    static fromJson(json) {

        const item = new ResultadoDetalleAbogadoModel();

        item.id = json.id;
        item.comment = json.comentario;
         
        return item;
    }
}
