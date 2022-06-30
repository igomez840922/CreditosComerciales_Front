
//opciones de desiciones
export const OPT_PREFINALIZARPROCESO = 1
export const OPT_FINALIZARPROCESO = 2
export const OPT_SALVAFULL = 3
export const OPT_SALVAPARCIAL = 4
export const OPT_ENVIARBUSQUEDADESCARTE = 5
export const OPT_ENVIARCUMPLIMIENTO = 6
export const OPT_LISTAEXCLUSION = 7
export const OPT_ENVIARIGR = 8
export const OPT_ENVIARPROPUESTACREDITO = 9


//Procesos
export const PROCESS_CLIENTDECLINED = -2
export const PROCESS_CANCELPROCESS = -1
export const PROCESS_REFUSED = 100 //RECCHASADO
export const PROCESS_FINISHED = 200 //RECCHASADO

export const PROCESS_BUSQUEDADESCARTE = 1
export const PROCESS_CUMPLIMIENTO = 2
export const PROCESS_LISTAEXCLUSION = 3
export const PROCESS_INFORMEGESTION = 4
export const PROCESS_PROPUESTACREDITO = 5
export const PROCESS_ANALISISCREDITO = 6
export const PROCESS_SUPERVISORANALISISCREDITO = 7
export const PROCESS_CREDITRISK = 8
export const PROCESS_EVIROMENTRISK = 9
export const PROCESS_AUTONOMY = 10
export const PROCESS_INFORMEFINANCIERO = 16
export const PROCESS_ACEPTACIONCLIENTE = 17
export const PROCESS_DOCUMENTACIONLEGAL = 18
export const PROCESS_ASIGNARNUMFIDEICOMISO = 19
export const PROCESS_DATOSFIDEICOMISO = 20
export const PROCESS_LAWEYER = 21 //ABOGADO
export const PROCESS_SIGNCONTRACT = 11
export const PROCESS_ADMINDISBURSEMENT = 12
export const PROCESS_INSTRUCTIVEDISBURSEMENT = 13
export const PROCESS_GUARANTEE = 14 //Garantias
export const PROCESS_VALIDATEFILE = 15 //Validar Expediente
export const PROCESS_INVESTFINCAS = 25 //Investigacion de Fincas
export const PROCESS_AUTONOMYCREDIT = 26 //Autonomia de credito
export const PROCESS_LEGACYEXPENSE = 27 //Gastos Legales
export const PROCESS_EXECUTEDISBURSEMENT = 28 //Ejecutar Desembolso
export const PROCESS_ASIGNARANALISISCREDITO = 29 //Asignar Analista de Credito

//administration and disbursement
/**
1,busqueda y descarte,0,true
2,cumplimiento,0,true
3,lista de exclusion,0,true
4,informe de gestion reforzado,0,true
5,propuesta de credito,0,true
6,analisis de credito,0,true
7,sup analisis de credito,0,true
8,riesgo de credito,0,true
9,ambiental y social,0,true
10,autonomia,0,true
11,formalizacion de credito,0,true -> Firma de Contrato
12,administracion de desembolso,0,true
13,desembolso,0,true
14,garantias,0,true
15,validar expediente fisico,0,true
--------
16,informe financiero,0,true
17,aceptacion cliente,0,true
*/

//Actividades
export const ACT_NONE = 0
export const ACT_DATOSGENERALES = 1
export const ACT_GENERALESEMPRESA = 2
export const ACT_HISTORIAEMPRESA = 3
export const ACT_INFORMACIONACCIONISTA = 4
export const ACT_ESTRUCTURAORGANIZACIONAL = 5
export const ACT_GOBIERNOCORPORATIVO = 6
export const ACT_RELEVOGENERACIONAL = 7
export const ACT_FLUJOOPERATIVO = 8
export const ACT_EMPRESASRELACIONADAS = 9
export const ACT_INFORMACIONCLIENTES = 10
export const ACT_INFORMACIONPROVEEDORES = 11
export const ACT_PRINCIPALESCOMPETIDORES = 12
export const ACT_PROYECCIONES = 13
export const ACT_RELACIONESBANCARIAS = 14
export const ACT_MOVIMIENTOCUENTAS = 15
export const ACT_RECIPROCIDAD = 16
export const ACT_FACILIDADACTIVOSFIJOS = 17
export const ACT_ASPECTOSAMBIENTALES = 18
export const ACT_INFORMACIONGARANTE = 19
export const ACT_SEGUROSACTUALESEMPRESA = 20
export const ACT_ARQUITECTURAEMPRESARIAL = 21
export const ACT_CUENTASPORCOBRAR = 22
export const ACT_CAPEX = 23
export const ACT_FLUJODECAJA = 24
export const ACT_NEGOCIOSOBTENER = 25
export const ACT_MATRIZCOMPETITIVA = 26
export const ACT_RECOMENDACIONES = 27
export const ACT_INFORMEFINANCIERO_1 = 101
export const ACT_INFORMEFINANCIERO_2 = 102
export const ACT_INFORMEFINANCIERO_3 = 103
export const ACT_INFORMEFINANCIERO_4 = 104
export const ACT_PROPUESTACREDITO = 105
export const ACT_FIDEICOMISOGARANTIAS = 106

export const CHECKLIST_PROCESS_COTIZACION = 1
export const CHECKLIST_PROCESS_SOLICITUD = 2
export const CHECKLIST_PROCESS_ANLISIS = 3
export const CHECKLIST_PROCESS_AUTONOMIA = 4
export const CHECKLIST_PROCESS_FORMALIZACION = 5
export const CHECKLIST_PROCESS_ADMINEXPEDIENTE = 6
export const CHECKLIST_PROCESS_DESEMBOLSO = 7
export const CHECKLIST_PROCESS_FIDEICOMISO = 8
export const CHECKLIST_PROCESS_RIESGOAMB = 9
export const CHECKLIST_PROCESS_CREDITO = 10
export const CHECKLIST_PROCESS_COMPENSACION = 11
export const CHECKLIST_PROCESS_ARCHIVO = 12
/*
Cotización	1
Solicitud	2
Análisis	3
Autonomía	4
Formalización y Firma	5
Adm. Crédito - Exp Físico	6
Desembolso	7
Fideicomiso	8
Riesgo Ambiental y soc	9
Riesgo de Crédito	10
Compensación	11
Archivo	12
*/

//PROCESOS BPM		
export const BPM_PROCESS_01 = { id: "FP-SC-BPM-01", name: "Solicitud de crédito" }
export const BPM_PROCESS_02 = { id: "FP-RAS-BPM-02", name: "Riesgo ambiental y social" }
export const BPM_PROCESS_03 = { id: "FP-RC-BPM-03", name: "Riesgo de crédito" }
export const BPM_PROCESS_04 = { id: "FP-FOR-BPM-04", name: "Formalización de crédito" }
export const BPM_PROCESS_05 = { id: "FP-ADC-BPM-05", name: "Administración y desembolso de crédito" }

//ACTIVIDADES BPM
export const BPM_ACTIVITY_01 = { id: "001", processId: "FP-SC-BPM-01", processName: ""/*"Solicitud de crédito"*/, name: ""/*"Descartar coincidencia"*/ }
export const BPM_ACTIVITY_02 = { id: "002", processId: "FP-SC-BPM-01", processName: ""/*"Solicitud de crédito"*/, name: ""/*"Validar Pre-Solicitud"*/ }
export const BPM_ACTIVITY_03 = { id: "003", processId: "FP-SC-BPM-01", processName: ""/*"Solicitud de crédito"*/, name: ""/*"Generar informe de gestión y propuesta de crédito"*/ }
export const BPM_ACTIVITY_04 = { id: "004", processId: "FP-SC-BPM-01", processName: ""/*"Solicitud de crédito"*/, name: ""/*"Analizar solicitud y generar informe financiero"*/ }
export const BPM_ACTIVITY_05 = { id: "005", processId: "FP-SC-BPM-01", processName: ""/*"Solicitud de crédito"*/, name: ""/*"Revisar solicitud de crédito"*/ }
export const BPM_ACTIVITY_06 = { id: "006", processId: "FP-SC-BPM-01", processName: ""/*"Solicitud de crédito"*/, name: ""/*"Aprobar solicitud"*/ }
export const BPM_ACTIVITY_07 = { id: "007", processId: "FP-RAS-BPM-02", processName: ""/*"Riesgo ambiental y social"*/, name: ""/*"Emitir opinión de riesgo ambiental y social"*/ }
export const BPM_ACTIVITY_08 = { id: "008", processId: "FP-RC-BPM-03", processName: ""/*"Riesgo de crédito"*/, name: ""/*"Emitir opinión de riesgo de crédito"*/ }
export const BPM_ACTIVITY_09 = { id: "009", processId: "FP-FOR-BPM-04", processName: ""/*"Formalización de crédito"*/, name: ""/*"Aceptación del cliente"*/ }
export const BPM_ACTIVITY_10 = { id: "010", processId: "FP-FOR-BPM-04", processName: ""/*"Formalización de crédito"*/, name: ""/*"Revisar y asociar numero de fideicomiso"*/ }
export const BPM_ACTIVITY_11 = { id: "011", processId: "FP-FOR-BPM-04", processName: ""/*"Formalización de crédito"*/, name: ""/*"Generar contrato / Documento legal"*/ }
export const BPM_ACTIVITY_12 = { id: "012", processId: "FP-FOR-BPM-04", processName: ""/*"Formalización de crédito"*/, name: ""/*"Revisar y/o Ajustar contrato"*/ }
export const BPM_ACTIVITY_13 = { id: "013", processId: "FP-FOR-BPM-04", processName: ""/*"Formalización de crédito"*/, name: ""/*"Firmar contrato"*/ }
export const BPM_ACTIVITY_14 = { id: "014", processId: "FP-ADC-BPM-05", processName: ""/*"Administración y desembolso de crédito"*/, name: ""/*"Oficial de administración de crédito"*/ }
export const BPM_ACTIVITY_15 = { id: "015", processId: "FP-ADC-BPM-05", processName: ""/*"Administración y desembolso de crédito"*/, name: ""/*"Analista de desembolso"*/ }
export const BPM_ACTIVITY_16 = { id: "016", processId: "FP-ADC-BPM-05", processName: ""/*"Administración y desembolso de crédito"*/, name: ""/*"Oficial de administración de crédito"*/ }
export const BPM_ACTIVITY_17 = { id: "017", processId: "FP-ADC-BPM-05", processName: ""/*"Administración y desembolso de crédito"*/, name: ""/*"Archivista de crédito"*/ }

//Nombre de Variables Comunes de Session 
export const VARNAME_LOCATIONDATA = "locationData"
export const VARNAME_USRCREDENTIAL = "usrcredentials"

//Respuestas de status de Backend
export const ResponseBackend_STATUSOK = "200"
export const ResponseBackend_STATUSOK1 = "201"

//Respuestas de status de T24
export const ResponseT24_STATUSOK = "M0000"
export const ResponseT24_STATUSOK2 = "M0002"//No retorna data
export const ResponseT24_STATUSOK1 = "SUCCESS"

//codigos de STAFF T24
export const STAFF_LIST = [
    {
        "Code": "08",
        "Description": "ACCIONISTAS",
        "DBCode": "ACC",
    },
    {
        "Code": "09",
        "Description": "REPRESENTANTE LEGAL",
        "DBCode": "RPL",
    },
    {
        "Code": "10",
        "Description": "JUNTA DIRECTIVA",
        "DBCode": "MIJ",
    },
    {
        "Code": "12",
        "Description": "APODERADO",
        "DBCode": "APO",
    }
]
/*
            
*/

/////idestado	estadosolicitud
export const APPLICATION_STATUS_INI = { id: "ini", name: "Inicio" }
export const APPLICATION_STATUS_REC = { id: "rec", name: "Recomienda" }
export const APPLICATION_STATUS_NREC = { id: "nrec", name: "No Recomienda" }
export const APPLICATION_STATUS_CONF = { id: "conf", name: "Confeccion" }
export const APPLICATION_STATUS_DESCN = { id: "DESCN", name: "Desistido Credito Negocio" }
export const APPLICATION_STATUS_DEV = { id: "dev", name: "Devuelto" }
export const APPLICATION_STATUS_DEVA = { id: "deva", name: "Devuelto a Analisis" }
export const APPLICATION_STATUS_DEVB = { id: "deva", name: "Devuelto a Banca" }
export const APPLICATION_STATUS_APRO = { id: "apro", name: "Aprobado" }
export const APPLICATION_STATUS_RECH = { id: "rech", name: "Rechazado" }
export const APPLICATION_STATUS_DIFA = { id: "difa", name: "Diferido a Analisis" }
export const APPLICATION_STATUS_DIFB = { id: "difb", name: "Diferido a Banca" }
export const APPLICATION_STATUS_CONFC = { id: "confc", name: "Confeccion CTC" }
export const APPLICATION_STATUS_ACEP = { id: "acep", name: "Aceptacion" }
export const APPLICATION_STATUS_DESCL = { id: "descl", name: "Desistido por el Cliente" }
export const APPLICATION_STATUS_CONFL = { id: "confl", name: "Confección Legal" }
export const APPLICATION_STATUS_RECFIR = { id: "recfir", name: "Recoleccion Firma" }
export const APPLICATION_STATUS_DES = { id: "des", name: "Desistido" }
export const APPLICATION_STATUS_REV = { id: "rev", name: "Revision" }
export const APPLICATION_STATUS_COM = { id: "com", name: "Completo" }
export const APPLICATION_STATUS_PROC = { id: "proc", name: "Procesado" }
export const APPLICATION_STATUS_DEVEC = { id: "devec", name: "Devuelto Error Calculo" }
export const APPLICATION_STATUS_CREG = { id: "creg", name: "Creacion Garantia" }
export const APPLICATION_STATUS_VALEL = { id: "valel", name: "Validacion Exp Legal" }
export const APPLICATION_STATUS_VALEC = { id: "valec", name: "Validacion Exp Completo" }
export const APPLICATION_STATUS_CANC = { id: "canc", name: "Cancelado" }
export const APPLICATION_STATUS_SUPA = { id: "supa", name: "Listo" }


export const FORMAT_DATE = "d/m/Y";
export const FORMAT_DATE_SHOW = "DD/MM/YYYY";


/////Grupos de Usuarios
export const Grp_AnalistaCredito = "Grp_EtECC_Analista_credito"
export const Grp_SupervisorAnalisisCredito = "Grp_EtECC_Supervisor_analisis_credito"
export const Grp_Administrador = "Grp_BC_Administrador"
export const Grp_EtECC_Ejecutivo = "Grp_EtECC_Ejecutivo_relacion_Oficial_relacion_Gerente_relacion"

