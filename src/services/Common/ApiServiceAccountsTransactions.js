import ApiService from "../ApiServices";
import AccountsTransactionsModel from "../../models/common/AccountsTransactionsModel";

export default class ApiServiceAccountsTransactions extends ApiService {
  getAccountsTransactionsModel(params) {
    return this.get(
      "/api/bpm/common/AccountsTransactions").then((json) => {
      return AccountsTransactionsModel.fromJson(json);
    });
  }
}