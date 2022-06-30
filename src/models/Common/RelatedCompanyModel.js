//Empresas Relacionada
export default class RelatedCompanyModel {

    static fromJson(json) {
        const item = new RelatedCompanyModel();
        item.id = json.id;
        item.name = json.name;
        item.activity = json.charge;
        item.years = json.dbo;
        item.relation = json.relation;
        return item;
    }
}