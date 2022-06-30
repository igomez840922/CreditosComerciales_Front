//Pais
export default class CountryModel {

    static fromJson(json) {
        const item = new CountryModel();
        item.id = json.id;
        item.name = json.name;
        return item;
    }
}