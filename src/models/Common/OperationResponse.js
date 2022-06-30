export default class OperationResponse {

  constructor(json) {
    this.result = json.result;
    this.error = json.error || undefined;
    this.data = json.data || {};
  }

  get isSuccessful() {
    return this.result === 'ok';
  }

  get errorMessage() {
    return this.error || '';
  }

}
