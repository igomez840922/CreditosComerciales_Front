//Accionista
export default class ShareholderModel {

    static fromJson(json) {
        const item = new ShareholderModel();
        item.id = json.id;
        item.name = json.name;
        item.nationality = json.nationality;
        item.dbo = json.dbo;
        item.participation = json.participation;
        item.experienceYears = json.experienceYears;
        return item;
    }
}