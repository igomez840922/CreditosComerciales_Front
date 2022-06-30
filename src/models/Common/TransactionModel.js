
export default class TransactionModel {

  static fromJsonArray(array) {
    // get list
    return array.map((json) => TransactionModel.fromJson(json.Trn));
  }

  static fromJson(json) {
    const item = new TransactionModel();
    item.balance = json.CurBalance;
    item.description = json.Desc;
    item.date = json.EffDt;
    item.amount = json.TotalCurAmt;
    item.ref = json.TrnRef;
    item.type = json.TrnType;
    return item;
  }

}
