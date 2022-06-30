export default class AccountsTransactionsModel {
  static results = [];

  static fromJson(json) {
    this.results = [];

    this.searchValue("Trn", json);

    const items = new AccountsTransactionsModel();
    items.results = this.results;

    console.log("Results: " + items.results);

    return items;
  }

  static searchValue(mainkey, json) {
    try {
      for (let [key, value] of Object.entries(json)) {
        if (value !== null && value !== undefined) {
          if (typeof value === "object") {
            if (key !== mainkey) {
              this.searchValue(mainkey, value);
            } else {
              switch (key) {
                case "Trn": {
                  this.results.push({
                    id: this.results.length + 1,
                    CurBalance: value[this.results.length]["CurBalance"],
                    Desc: value[this.results.length]["Desc"],
                    EffDt: value[this.results.length]["EffDt"],
                    TrnRef: value[this.results.length]["TrnRef"],
                    amt: value[this.results.length]["TotalCurAmt"]["Amt"],
                    TrnType: value[this.results.length]["TrnType"]["Type"],
                  });
                   
                 
                  break;
                }
                case "Status": {
                  
                 
                  break;
                }

                default: {
                  break;
                }
              }
            }
          }
        }
      }
    } catch (err) {}
  }

  static getRequestModel() {
    const item = {};

    return item;
  }
}






































