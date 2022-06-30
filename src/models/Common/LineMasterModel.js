import moment from "moment";

export class LineMasterModel{      
    constructor() {
        this.transactId=""; //Numero de Tramite - Varchar - (viene de propuesta)
        this.facilityNumber=""; //Numero de Facilidad - Varchar - (viene de facilidad)
        this.debtorName="";//Nombre del Deudor - Varchar - (viene de facilidad)
        this.debtorId="";//Id del Deudor - Varchar - (viene de facilidad)
        this.proposalTypeName="";//Nombre Tipo de Propuesta - Varchar - (viene de facilidad)
        this.proposalTypeCode="";///Codigo Tipo de Propuesta - Varchar - (viene de facilidad)
        this.changeTypeName="";//Nombre Tipo de Cambio - Varchar
        this.changeTypeCode="";//Codigo Tipo de Cambio - Varchar
        this.amount=0;//Monto Aprobado - Decimal - (viene de facilidad)
        this.maxTotal=0;//Monto Maximo Aprobado - Decimal - 
        this.modifiedAmount=0;//Monto Modificado - Decimal - 
        this.currencyName="";//Nombre de Moneda - Varchar - (catalogo de moneda)
        this.currencyCode="";//Codigo de Moneda - Varchar - (catalogo de moneda)
        this.facilityTypeName="";//Nombre Tipo de Facilidad - Varchar - (viene de facilidad)
        this.facilityTypeCode="";//Codigo Tipo de Facilidad - Varchar - (viene de facilidad)
        this.numCurrentAccount="";//Numero de Cuenta Corriente - Varchar 
        this.rate="";//Tasa Aprobada - Varchar - (viene de facilidad de )        
        this.rotativeLine=false;//Linea Rotativa - boolean       
        this.pledgeSubquota=false;//Subcupo Prendario - boolean
        this.pledgeSubquotaAmount=0;//Monto Subcupo Prendario - decimal 
        this.pledge=false;// Prendario - boolean
        this.numOthersAccount="";//Otros numeros de Cuentas - Varchar 
        this.numAN="";//numero de A/N - Varchar 
        this.pawAmount=0;//Monto a Pignorar - Decimal - 
        this.clientAccount="";//cuenta del Cliente a Debitar - Varchar 
        this.riskCountryCode="";//Codigo Pais de Riesgo - Varchar 
        this.riskCountryDesc="";//Descripcion de Pais de Riesgo - Varchar 
        this.riskProvinceCode="";//Codigo Provincia de Riesgo - Varchar 
        this.riskProvinceDesc="";//Descripcion Provincia de Riesgo - Varchar 
        this.proposalDate=moment().format("YYYY-MM-DD");//Fecha Propuesta - Date 
        this.approvalDate=moment().format("YYYY-MM-DD");//Fecha Aprobada - Date 
        this.limitDate=moment().format("YYYY-MM-DD");//Fecha Revision - Date  
        this.dueDate=moment().format("YYYY-MM-DD");//Fecha Vencimiento - Date 
        this.economicActivityCode="";//Codigo de Actividad Economica - Varchar 
        this.economicActivityDesc="";//Descripcion de Actividad Economica - Varchar 
        this.cinuActivity="";//Descripcion de Actividad Economica CINU - Varchar 
        this.comisionType="";//Tipo de Comision - Varchar 
        this.comisionAmount=0;//Monto de Comision - Decimal 
        this.itbmsAmount=0;//Monto de ITBMS - Decimal 
        this.differ=false;//Diferir - bool 
        this.differ=false;//Diferir - bool 
        this.bankSpecialsInstructions="";//Instrucciones especiales de la Banca - Varchar 
        this.notaryExpenses=0;//Gastos de Notaria - Decimal 
        this.stampsExpenses=0;//Gastos de Timbres - Decimal  
        this.limitTypeCode="";//Codigo del Tipo de Limite - Varchar 
        this.limitTypeDesc="";//Descripcion del Tipo de Limite - Varchar
        this.lineTypeCode="";//Codigo Tipo de Linea - Varchar 
        this.lineTypeDesc="";//Descripcion Tipo de Linea - Varchar         
        this.lineNumber="";//Dumero de la Linea - Varchar         
        this.additionalInfo="";//Informacion Adicional - Varchar  
        this.additionalComment="";//Comentarios Adicionales - Varchar 
        this.allowNetting = false;//Permite Compensacion o Neteo - bool     
        this.limitReject =false;//Rechazar Limite - bool
        this.accounts =false;//Contabiliza - bool
        this.availMarker =false;//Marcador Disponible - bool

        this.additionalInfo="";//Frecuencia de Revision - Varchar 

        this.autonomy="";//Descripcion de Autonomia - Varchar
        this.autonomyCode="";//Código de Autonomia - Varchar
        this.autonomyUser="";//Usuario de Autonomia - Varchar
        
        this.authType="";//Tipo de Autorizacion - Varchar
        this.countryRiskPercent=0;//Porciento de Riesgo - Decimal

        this.facilityId="";//Id de la facilidad a la que pertenece - Varchar

        this.revisionFrequency="";//Frecuencia de Revision - Varchar 
        this.freqDate=moment().format("YYYY-MM-DD");//Fecha de Frecuencia - Date 
        this.freqCodeType="";//Codigo del Tipo de Frecuencia - Varchar 
        this.freqAmount=1;//Monto de la Frecuencia - Integer 
        this.freqDay=1;//Dia de la Frecuencia - Integer 

        this.clientNumber="";//Numero del Cliente T24 - Varchar 
        
        //lista de productos y subproductos
        //lista de Lineas hijas           
        
      }
  }