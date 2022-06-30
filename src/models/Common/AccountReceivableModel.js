//Cuentas por Cobrar
export default class AccountReceivableModel {

    static fromJson(json) {
        const item = new AccountReceivableModel();
        item.id = json.id;
        item.name = json.name;
        item.day30 = json.day30;
        item.day60 = json.day60;
        item.day90 = json.day90;
        item.day120 = json.day120;
        item.day150 = json.day150;
        item.day180 = json.day180;
        item.day210 = json.day210;
        item.day240 = json.day240;
        item.day270 = json.day270;
        item.day300 = json.day300;
        item.day330 = json.day330;
        item.day331 = json.day331;
        item.total = json.total;
        item.percent = json.percent; //Salo Promedio
        return item;
    }
}