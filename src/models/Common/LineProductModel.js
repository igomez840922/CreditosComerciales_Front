import moment from "moment";

export class LineProductModel{      
    constructor() {
      
      this.lineMasterId=1;//Id relacionado a tabla padre LineMaster - integer         
      
      this.productCode="";//Codigo del Producto - Varchar         
      this.productDesc="";//Descripcion del Producto - Varchar    
      this.subProductCode="";//Codigo del SubProducto - Varchar         
      this.subProductDesc="";//Descripcion del SubProducto - Varchar    
        
    }
  }