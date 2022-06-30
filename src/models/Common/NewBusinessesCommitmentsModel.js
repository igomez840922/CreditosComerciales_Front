//Nuevos Negocios y Compromisos
export default class NewBusinessesCommitmentsModel {

    static fromJson(json) {
        const item = new NewBusinessesCommitmentsModel();
        item.id = json.id;
        item.type = json.type;
        item.status = json.status;
        item.observations = json.observations;
        return item;
    }
}