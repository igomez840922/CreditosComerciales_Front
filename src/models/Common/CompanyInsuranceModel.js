//Seguros Actuales de la Empresa
export default class CompanyInsuranceModel {

    static fromJson(json) {
        const item = new CompanyInsuranceModel();
        item.id = json.id;
        item.insuranceCompany = json.insuranceCompany;
        item.insuranceType = json.insuranceType;
        item.amount = json.amount;
        item.expiration = json.expiration;
        return item;
    }
}