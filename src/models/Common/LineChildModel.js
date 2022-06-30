import moment from "moment";

export class LineChildModel{      
    constructor() {
      
      this.lineMasterId=1;//Id relacionado a tabla padre LineMaster - integer         
      
      this.lineTypeCode="";//Codigo de Tipo de Linea - Varchar         
      this.lineTypeDesc="";//descripcion de Tipo de Linea - Varchar 

      this.lineNumber="";//Numero de la Linea - Varchar         
      this.amount=0;//Monto Aprobado - Decimal - (viene de facilidad)
        
    }
  }