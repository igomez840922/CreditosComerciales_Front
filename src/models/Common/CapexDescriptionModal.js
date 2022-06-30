//Capex Descripcion
export default class CapexDescriptionModal {

    static fromJson(json) {
        const item = new CapexDescriptionModal();
        item.id = json.id;
        item.description = json.description;
        item.use = json.use; //uso en miles
        item.shareholders = json.shareholders; //accionistas
        item.bank = json.bank; //Banco
        return item;
    }
}