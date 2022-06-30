
import moment from "moment";

export class ResponseModel{      
    constructor() {
      this.data=null;
      this.error={hasError:false, errorCode:0,errorMsg:""};
      this.date=moment().format("YYYY-MM-DD HH:mm:ss");
    }
  }