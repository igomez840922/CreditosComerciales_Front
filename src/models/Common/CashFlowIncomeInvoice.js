//Capex Presupuesto
export default class CashFlowIncomeInvoice {

    static fromJson(json) {
        const item = new CashFlowIncomeInvoice();
        item.id = json.id;
        item.month1 = json.month1;
        item.month2 = json.month2;
        item.month3 = json.month3;
        item.month4 = json.month4;
        item.month5 = json.month5;
        item.month6 = json.month6;
        item.month7 = json.month7;
        item.month8 = json.month8;
        item.month9 = json.month9;
        item.month10 = json.month10;
        item.month11 = json.month11;
        item.month12 = json.month12;
        return item;
    }
}