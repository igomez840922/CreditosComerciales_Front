//Gobierno Corporativo
export default class CorporateGovernanceModel {

    static fromJson(json) {
        const item = new CorporateGovernanceModel();
        item.id = json.id;
        item.name = json.name;
        item.charge = json.charge;
        item.dbo = json.dbo;
        return item;
    }
}