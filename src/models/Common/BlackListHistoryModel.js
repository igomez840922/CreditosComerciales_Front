export class BlackListHistoryModel{    
    constructor() {
      this.transactId=0;
      this.personId=0;
      this.roleId="";
      this.blackList=false;
      this.comment=""; //comentario de busqueda y descarte
      this.status= true;
      this.date=null;
    }
  }