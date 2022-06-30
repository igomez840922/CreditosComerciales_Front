//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register"

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login"
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login"
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd"
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const SOCIAL_LOGIN = "/social-login"

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
export const POST_EDIT_PROFILE = "/post-fake-profile"

//PRODUCTS
export const GET_PRODUCTS = "/products"
export const GET_PRODUCTS_DETAIL = "/product"

//CALENDER
export const GET_EVENTS = "/events"
export const ADD_NEW_EVENT = "/add/event"
export const UPDATE_EVENT = "/update/event"
export const DELETE_EVENT = "/delete/event"
export const GET_CATEGORIES = "/categories"
export const GET_TRAMITS = "/tramits"

//CHATS
export const GET_CHATS = "/chats"
export const GET_GROUPS = "/groups"
export const GET_CONTACTS = "/contacts"
export const GET_MESSAGES = "/messages"
export const ADD_MESSAGE = "/add/messages"

//ORDERS
export const GET_ORDERS = "/orders"

//CART DATA
export const GET_CART_DATA = "/cart"

//CUSTOMERS
export const GET_CUSTOMERS = "/customers"

//SHOPS
export const GET_SHOPS = "/shops"

//CRYPTO
export const GET_WALLET = "/wallet"
export const GET_CRYPTO_ORDERS = "/crypto/orders"

//INVOICES
export const GET_INVOICES = "/invoices"
export const GET_INVOICE_DETAIL = "/invoice"

//PROJECTS
export const GET_PROJECTS = "/projects"
export const GET_PROJECT_DETAIL = "/project"

//TASKS
export const GET_TASKS = "/tasks"

//CONTACTS
export const GET_USERS = "/users"
export const GET_USER_PROFILE = "/user"

/* ---------------------------------------------------------------------------------------------- */
/*                                       Variables de login                                       */
/* ---------------------------------------------------------------------------------------------- */

//CORE
export const URL_CORE_PRE = "https://qa.api.ob.banesco.com.pa/" //URL PREFIX
export const URL_CORE_TOKENGEN = 'https://qa-auth-ob.banesco.com.pa/oauth2/token';//'https://qa-auth-ob.banesco.com.pa/oauth2/token' //url generamos token
export const URL_CORE_WATCHLIST = URL_CORE_PRE + "APIUtil/analysis/customers" //url lista de vigilancia
export const URL_CORE_PARTIEINFO = URL_CORE_PRE + "party/v1/parties/information" //url informacion del cliente 
export const URL_CORE_PARTIESTAFF = URL_CORE_PRE + "party/v1/parties/staff" //url informacion de accionistas de un cliente ?PartyId=600235373
export const URL_CORE_DOCUMENTS = URL_CORE_PRE + "APIUtil/documents" //url guardar documentos en onbase
export const URL_CORE_DOCUMENTSVIEW = URL_CORE_PRE + "APIUtil/v1/documents/ID" //url ver documentos en onbase
export const URL_CORE_COMPANIESRELATIONS = URL_CORE_PRE + "party/v1/parties/companies/relations" //url informacion del cliente ?PartyId=600235373
export const URL_CORE_CATALOGO = URL_CORE_PRE + "APIUtil/v1/catalogs" //url informacion del cliente ?PartyId=600235373
export const URL_CORE_FACILIDADES = URL_CORE_PRE + "acctloan/v1/loans/details/informations" //url de lista de facilidades
export const URL_CORE_AVERAGES = URL_CORE_PRE + "acct/v1/accounts/balances/averages" //url de balances de las cuentas del banco
export const URL_CORE_IMPORTACIONES = URL_CORE_PRE + "acctloan/v1/loans/imports" //url de lista de importaciones
export const URL_CORE_EXPORTACIONES = URL_CORE_PRE + "acctloan/v1/loans/exports" //url de lista de exportaciones
export const URL_CORE_INGOING = URL_CORE_PRE + "acctloan/v1/loans/collections/ingoing" //url de los prestamos entrantes
export const URL_CORE_OUTOGOING = URL_CORE_PRE + "acctloan/v1/loans/collections/outgoing" //url de los prestamos salientes
export const URL_CORE_CREDITOS = URL_CORE_PRE + "acctloan/v1/loans/credits" //url de los creditos
export const URL_CORE_CREDITOS_LINE = URL_CORE_PRE + "party/v1/parties/credits" //url de los creditos en linea
export const URL_CORE_TRANSACCTIONS = URL_CORE_PRE + "acct/v1/accounts/transactions" //url de las transacciones del usuario
export const URL_CORE_PRESTAMOS = URL_CORE_PRE + "acctloan/v1/loans" //url de los prestamos
export const URL_CORE_PRESTAMOS_INFORMATION = URL_CORE_PRE + "acctloan/v1/loans/informations" //url para la inormacion de los prestamos
export const URL_CORE_PIGNORADO = URL_CORE_PRE + "APICards/v1.1/cards/credits/pledges" //url de lista de facilidades
export const URL_CORE_TEST = URL_CORE_PRE + "acctloan/v1/loans" //test
//https://qa.api.ob.banesco.com.pa/APICards/v2/cards/credits/pledges
export const URL_CORE_REPORTINGSERVICES = URL_CORE_PRE + "APIUtil/v1/reports/atoms" //url para la info reporting services
export const URL_CORE_COLLATERALS = URL_CORE_PRE + "acctloan/v1/loans/collaterals" //url para la info colaterales
export const URL_CORE_ACCOUNTSPARTIES = URL_CORE_PRE + "acct/v1/accounts/parties" //url para la info de las cuentas
export const URL_CORE_APCINFO = URL_CORE_PRE + "APIUtil/v1/parties/score" //url para la info del APC
export const URL_CORE_LINES = URL_CORE_PRE + "acctloan/v1/loans/credits/lines/limits" //url para las lienas
export const URL_CORE_BALANCETOTALS = URL_CORE_PRE + "acct/v1/accounts/balances/totals" //url para la info de las cuentas
export const URL_CORE_CreditCard = URL_CORE_PRE + "NativaOpenBanking/ESBCard/readCardTDC" //tarjeta de crédito

//BACKEND
export const URL_BACKEND_PRE = "http://dev-bpm-app.panama.banesco.lac:8080/banescocc/" //URL PREFIX 10.40.216.88
export const URL_BACKEND_DOCUMENTS = URL_BACKEND_PRE + "UtilityBPM/v1/documents" //url guardar documento
export const URL_BACKEND_BITACORA = URL_BACKEND_PRE + "UtilityBPM/management/v1/bpmManagementLog/" //url guardar documento
export const URL_BACKEND_BUSQUEDADESCARTE = URL_BACKEND_PRE + "preapp/v1/validation/"   //busqueda y descarte
export const URL_BACKEND_HISTORIALEMPRESA = URL_BACKEND_PRE + "managementReport/v1/company/detail/" //historia de la empresa
export const URL_BACKEND_USUARIOPROSPECTO = URL_BACKEND_PRE + "preapp/v1/customer/" //usuario o cliente prospecto
export const URL_BACKEND_CUMPLIMIENTO = URL_BACKEND_PRE + "preapp/v1/compliance/" //cumplimiento
export const URL_BACKEND_ACCIONISTA = URL_BACKEND_PRE + "managementReport/v2/shareholders/shList/" //accionnistas
export const URL_BACKEND_ACCIONISTASECCION = URL_BACKEND_PRE + "managementReport/v1/shareholders/shareholderAll" //accionnistas
export const URL_BACKEND_EMPRESA = URL_BACKEND_PRE + "managementReport/v1/company/information/"
export const URL_BACKEND_DOCUMENTSANEXOSAll = URL_BACKEND_PRE + "UtilityBPM/v1/documents/documentAll/"
export const URL_BACKEND_DOCUMENTSANEXOS = URL_BACKEND_PRE + "UtilityBPM/v1/documents"
export const ULR_BACKEND_HISTORICO = URL_BACKEND_PRE + "UtilityBPM/management/v1/bpmLog"
export const ULR_BACKEND_ESTADISTICAS = URL_BACKEND_PRE + "UtilityBPM/management/v1/bpmLog/statistics"
export const ULR_BACKEND_TIPODEIDENTIFICACION = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/retrieveClientIdType"
export const URL_BACKEND_LISTAEXCLUSION = URL_BACKEND_PRE + "preapp/v1/exclusion" //obtenemos la lista de exclusion
export const URL_BACKEND_LISTAEXCLUSION_MARCADA = URL_BACKEND_PRE + "preapp/v1/exclusion/applications" // Obtenemos todas las listas marcadas de la actividad
export const URL_BACKEND_DATOSGENERALES_IGR = URL_BACKEND_PRE + "managementReport/v1/general/" // Obtenemos todas las listas marcadas de la actividad
export const URL_BACKEND_DATOSEMPRESA_IGR = URL_BACKEND_PRE + "managementReport/v1/company/information" // Obtenemos todas las listas marcadas de la actividad
export const URL_BACKEND_FLUJOOPERATIVO_IGR = URL_BACKEND_PRE + "managementReport/v1/operationalFlow"
export const URL_BACKEND_GOBIERNOCORPORATIVO = URL_BACKEND_PRE + "managementReport/v2/corporateGovernance" // Gobierno corporativo
export const URL_BACKEND_ESTRUCTURAEMPRESA = URL_BACKEND_PRE + "managementReport/v1/company/structure/" //ESTRUCTURA de la empresa
export const URL_BACKEND_RELEVOGENERACIONAL = URL_BACKEND_PRE + "managementReport/v1/managementRelays" // RELEVO GENERACIONAL
export const URL_BACKEND_RELEVOGENERACIONALSECTION = URL_BACKEND_PRE + "managementReport/v1/managementRelaysSection" // RELEVO GENERACIONAL
export const URL_BACKEND_EMPRESARELACIONADA = URL_BACKEND_PRE + "managementReport/v1/relatedCompanies" //GUARDA LAS EMPRESAS RELACIONADAS
export const URL_BACKEND_EMPRESARELACIONADASECCION = URL_BACKEND_PRE + "managementReport/v1/relatedCompaniesSection" //GUARDA LAS EMPRESAS RELACIONADAS
export const URL_BACKEND_INFOCLIENTE = URL_BACKEND_PRE + "managementReport/v1/clients" // INFORMACION DE CLIENTES
export const URL_BACKEND_INFOCLIENTEINFO = URL_BACKEND_PRE + "managementReport/v1/clientInfo" // INFORMACION DE CLIENTES
export const URL_BACKEND_SECCIONRELEVOGENERACIONAL = URL_BACKEND_PRE + "managementReport/v1/guarantor" //GUARDA LAS EMPRESAS RELACIONADAS
export const URL_BACKEND_COMPETIDORESMERCADO = URL_BACKEND_PRE + "managementReport/v1/competitors/" // INFORMACION DE CLIENTES
export const URL_BACKEND_PROYECCIONES = URL_BACKEND_PRE + "managementReport/v1/projections" // INFORMACION DE CLIENTES
export const URL_BACKEND_GARANTES = URL_BACKEND_PRE + "managementReport/v1/guarantor" // INFORMACION DE GARANTES
export const URL_BACKEND_PROPUESTACREDITO_DATOSGENERALES = URL_BACKEND_PRE + "creditProposal/v1/proposalData" // PROPUESTA DE CREDITO DATOS GENERALES
export const URL_BACKEND_PROPUESTACREDITO_DESEMBOLSOS = URL_BACKEND_PRE + "creditProposal/v1/disbursement" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_PROPUESTACREDITO_SOWACTUAL = URL_BACKEND_PRE + "managementReport/v1/currentBanking/currentSow" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_PROPUESTACREDITO_SOWPROPUESTO = URL_BACKEND_PRE + "managementReport/v1/currentBanking/proposedSow" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_PROPUESTACREDITO_ASPECTOSAMBIENTALES = URL_BACKEND_PRE + "managementReport/v1/currentBanking/environmentalAspect" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_JSONASPECTOSAMBIENTALES = URL_BACKEND_PRE + "creditAnalysis/v1/aspectosAmbientales" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_DEUDASBANCARIACP = URL_BACKEND_PRE + "managementReport/v1/currentBanking/bankingRelationCP" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_DEUDASBANCARIALP = URL_BACKEND_PRE + "managementReport/v1/currentBanking/bankingRelationLP" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_DEUDASBANCARIASECCION = URL_BACKEND_PRE + "managementReport/v1/currentBanking/bankingRelationSection" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_FLUJOCAJADOLLAR = URL_BACKEND_PRE + "managementReport/v1/cashflow/dollars" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_FLUJOCAJASERVICIODEUDAS = URL_BACKEND_PRE + "managementReport/v1/cashflow/debtservice" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_PROPUESTACREDITO_PROGRAMAPAGO = URL_BACKEND_PRE + "creditProposal/v1/paymentprogram" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_PROPUESTACREDITO_FACILIDAD = URL_BACKEND_PRE + "creditProposal/v1/facility" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_MOVIMIENTOCUENTAS = URL_BACKEND_PRE + "managementReport/v1/accountMovements" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_MOVIMIENTOCUENTASSECCION = URL_BACKEND_PRE + "managementReport/v1/accountMovementsSection" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_INFOPROVEEDORES = URL_BACKEND_PRE + "managementReport/v1/providers" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_RECIPROCIDAD = URL_BACKEND_PRE + "managementReport/v1/reciprocity/" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_RECIPROCIDADSECCION = URL_BACKEND_PRE + "managementReport/v1/reciprocitySection/" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_RECIPROCIDADBORRAR = URL_BACKEND_PRE + "managementReport/v1/reciprocity/delete/" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_ACTIVOSFIJOS = URL_BACKEND_PRE + "managementReport/v1/fixedAssets" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_ACTIVOSFIJOSSECCION = URL_BACKEND_PRE + "managementReport/v1/fixedAssets/section" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_SEGUROSEMPRESA = URL_BACKEND_PRE + "managementReport/v1/companyInsurance/" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_SEGUROSEMPRESABORRAR = URL_BACKEND_PRE + "managementReport/v1/companyInsurance/delete/" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_ARQUITECTURAEMPRESARIAL = URL_BACKEND_PRE + "managementReport/v1/enterpriseArchitecture/" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_CUENTASCOBRAR = URL_BACKEND_PRE + "managementReport/v1/accountsReceivable" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_CAPEX = URL_BACKEND_PRE + "managementReport/v1/capex" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_CAPEXPRESUPUESTO = URL_BACKEND_PRE + "managementReport/v1/capex/budget" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_CAPEXDETALLESPROYECTO = URL_BACKEND_PRE + "managementReport/v1/capex/projectdetail" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_RECOMENDACIONES = URL_BACKEND_PRE + "managementReport/v1/recomendations" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_FLUJOCAJAEGRESO = URL_BACKEND_PRE + "managementReport/v1/cashflow/outcome/" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_FLUJOCAJAEGRESOBORRAR = URL_BACKEND_PRE + "managementReport/v1/cashflow/outcome/delete/" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_FLUJOCAJACARGATRABAJO = URL_BACKEND_PRE + "managementReport/v1/cashflow/workload/" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_FLUJOCAJACARGATRABAJOBORRAR = URL_BACKEND_PRE + "managementReport/v1/cashflow/workload/delete/" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_FLUJOCAJAINGRESOFACTURACION = URL_BACKEND_PRE + "managementReport/v1/cashflow/invoiceIncome" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_FLUJOCAJACOBRANZAS = URL_BACKEND_PRE + "managementReport/v1/cashflow/collection" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_BANDEJAENTRADA_TRAMITE = URL_BACKEND_PRE + "UtilityBPM/management/v1/bpmManagementTransaction" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_PROPUESTACREDITO_COMISION = URL_BACKEND_PRE + "creditProposal/v1/commission/" // INFORMACION DE CLIENTES
export const URL_BACKEND_PROPUESTACREDITO_FORMADESEMBOLSO = URL_BACKEND_PRE + "creditProposal/v1/disbursementForm/" // INFORMACION DE CLIENTES
export const URL_BACKEND_PROPUESTACREDITO_GARANTIA = URL_BACKEND_PRE + "creditProposal/v1/guarantee/" // INFORMACION DE CLIENTES
export const URL_BACKEND_PROPUESTACREDITO_FIANZA = URL_BACKEND_PRE + "creditProposal/v1/bail/" // INFORMACION DE CLIENTES
export const URL_BACKEND_PROPUESTACREDITO_FIANZABORRAR = URL_BACKEND_PRE + "creditProposal/v1/bail/delete/" // INFORMACION DE CLIENTES
export const URL_BACKEND_IGR_MATRIZOTROSBANCOS = URL_BACKEND_PRE + "managementReport/v1/competitiveMatrix/otherBanks/" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_MATRIZOTROSBANCOSBORRAR = URL_BACKEND_PRE + "managementReport/v1/competitiveMatrix/otherBanks/delete/" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_MATRIZEXPEDIENTES = URL_BACKEND_PRE + "managementReport/v1/competitiveMatrix/files/" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_MATRIZNUEVONEGOCIO = URL_BACKEND_PRE + "managementReport/v1/competitiveMatrix/newBusiness/" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_MATRIZRENTABILIDAD = URL_BACKEND_PRE + "managementReport/v1/competitiveMatrix/profitability/" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_MATRIZSECCION = URL_BACKEND_PRE + "managementReport/v1/competitiveMatrix/" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_INFOCLIENTESECCION = URL_BACKEND_PRE + "managementReport/v1/clientsInformation/sectionCompanies" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_INFOPROVEEDORESSECCION = URL_BACKEND_PRE + "ManagementReport/v1/suppliersListSection" // INFORMACION DE CLIENTES
export const URL_BACKEND_NEGOCIOOBTENER = URL_BACKEND_PRE + "managementReport/v1/businessObtain" //ESTRUCTURA de la empresa
export const URL_BACKEND_IGR_MATRIZPOSICIONBANESCO = URL_BACKEND_PRE + "managementReport/v1/CMPositionB" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_IGR_MATRIZTRANSACCIONBANESCO = URL_BACKEND_PRE + "managementReport/v1/CMTransactionalB" // PROPUESTA DE CREDITO DESEMBOLSO
export const URL_BACKEND_CATALOGO_CLASIFICACIONRIESGO = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/retrieveRiskClassification" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_TIPOREVISION = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/retrieveRevisionType" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_TIPOPROPUESTA = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/retrieveProposalType" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_TIPOSUBPROPUESTA = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/retrieveSubproposalType" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_TIPOFACILIDAD = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/retrieveFacilityType" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_TIPOFIANZA = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/retrieveBailType" // INFORMACION DE CLIENTES
export const URL_BACKEND_BALANCEPASIVOAC = URL_BACKEND_PRE + "creditAnalysis/v1/passiveBalanceDebtor/" // INFORMACION DE CLIENTES
export const URL_BACKEND_BALANCEACTIVOAC = URL_BACKEND_PRE + "creditAnalysis/v1/activeBalanceDebtor" // INFORMACION DE CLIENTES
export const URL_BACKEND_ESTADOORIGENAPLICACIONAC = URL_BACKEND_PRE + "creditAnalysis/v1/sourceApplicationsState" // INFORMACION DE CLIENTES
export const URL_BACKEND_INDICADORAC = URL_BACKEND_PRE + "creditAnalysis/v1/indicator/" // INFORMACION DE CLIENTES
export const URL_BACKEND_POLITICACREDITO = URL_BACKEND_PRE + "finantialReport/v2/creditPolicy/" // INFORMACION DE CLIENTES
export const URL_BACKEND_INFOFINANCIERA = URL_BACKEND_PRE + "finantialReport/v1/finantialInfoGuarantor/" // INFORMACION DE CLIENTES
export const URL_BACKEND_OPINIONRIESGOCREDITO = URL_BACKEND_PRE + "finantialReport/v1/creditRiskOpinion" // INFORMACION DE CLIENTES
export const URL_BACKEND_CONCLUSIONESRECOMENDACIONESINFORMEFINANCIERO = URL_BACKEND_PRE + "finantialReport/v1/conclusionFinantialAnalysis" // INFORMACION DE CLIENTES
export const URL_BACKEND_RIESGOAMBIENTALDETALLES = URL_BACKEND_PRE + "environmentalRisk/v1/environmentalRiskOtherDetails/" // INFORMACION DE CLIENTES
export const URL_BACKEND_RIESGOCREDITOS = URL_BACKEND_PRE + "disbursement/v1/disbursementInstructive/" // INFORMACION DE CLIENTES
export const URL_BACKEND_NUMEROFIDEICOMISO = URL_BACKEND_PRE + "formalization/v1/trustInfo" // INFORMACION DE CLIENTES
export const URL_BACKEND_FIDEICOMITENTES = URL_BACKEND_PRE + "finantialTrust/v1/generalDataTrustor" // INFORMACION DE CLIENTES
export const URL_BACKEND_FIDUCIARIAOTROSBANCOS = URL_BACKEND_PRE + "finantialTrust/v1/commission" // INFORMACION DE CLIENTES
export const URL_BACKEND_BEENFICIARIOSECUNDARIO = URL_BACKEND_PRE + "finantialTrust/v1/generalDataSecondBeneficiary" // INFORMACION DE CLIENTES
export const URL_BACKEND_SERVICIOSFIDUCIARIOS = URL_BACKEND_PRE + "finantialTrust/v1/fiduciaryServices" // INFORMACION DE CLIENTES
export const URL_BACKEND_OTROSSERVICIOSFIDUCIARIOS = URL_BACKEND_PRE + "finantialTrust/v1/otherFiduciaryServices" // INFORMACION DE CLIENTES
export const URL_BACKEND_DOCUMENTACIONLEGAL = URL_BACKEND_PRE + "legalDocumentation/v1/legalDoc" // INFORMACION DE CLIENTES
export const URL_BACKEND_DESEMBOLSODATOSGENERALES = URL_BACKEND_PRE + "disbursement/v1/generalData" // INFORMACION DE CLIENTES
export const URL_BACKEND_LOGINUSUARIO = URL_BACKEND_PRE + "UserAuthentication/userInfo" // INFORMACION DE CLIENTES
export const URL_BACKEND_INSTRUCTIVODESEMBOLSO = URL_BACKEND_PRE + "disbursement/v1/disbursementInstructive" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_ROLES = URL_BACKEND_PRE + "preapp/v1/SDRoleCatalog" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_TIPOSPRESTAMOS = URL_BACKEND_PRE + "creditApp/v1/catLoanType" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_CICLOPAGOSINTERES = URL_BACKEND_PRE + "creditApp/v1/catInterestPaymentCycle" // INFORMACION DE CLIENTES
export const URL_BACKEND_PERSONASOLICITUD = URL_BACKEND_PRE + "preapp/v1/SDRequestPerson" // INFORMACION DE CLIENTES
export const URL_BACKEND_PERSONAROLE = URL_BACKEND_PRE + "preapp/v1/SDRolePerson" // INFORMACION DE CLIENTES
export const URL_BACKEND_CONSULTARTASA = URL_BACKEND_PRE + "creditProposal/v1/facility/RateValue/" // INFORMACION DE CLIENTES
export const URL_BACKEND_PERSONALISTAVIGILANCIA = URL_BACKEND_PRE + "preapp/v1/SDWatchListPerson/" // INFORMACION DE CLIENTES
export const URL_BACKEND_PERSONAACCIONISTAS = URL_BACKEND_PRE + "managementReport/v2/shareholders/shList/" // INFORMACION DE CLIENTES
export const URL_BACKEND_PERSONAGOBIERNOCORP = URL_BACKEND_PRE + "managementReport/v2/corporateGovernance" // INFORMACION DE CLIENTES
export const URL_BACKEND_PERSONAGARANTE = URL_BACKEND_PRE + "managementReport/v2/guarantor" // INFORMACION DE CLIENTES
export const URL_BACKEND_PERSONASOLICITUDORQUESTADO = URL_BACKEND_PRE + "preapp/v1/BssRequestPerson" // INFORMACION DE CLIENTES
export const URL_BACKEND_DatosComparecenciaJuridicaLineaSobregiro = URL_BACKEND_PRE + "formalization/v1/legalAppereanceOverdraft" // INFORMACION DE CLIENTES
export const URL_BACKEND_DatosContratosPrivados = URL_BACKEND_PRE + "formalization/v1/privateContract/" // INFORMACION DE CLIENTES
export const URL_BACKEND_DatosActaFideicomiso = URL_BACKEND_PRE + "formalization/v1/trustAct/" // INFORMACION DE CLIENTES
export const URL_BACKEND_DatosComparecenciaJuridicaPrestAPlazo = URL_BACKEND_PRE + "formalization/v1/legalAppereanceTermLoan" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_CLIENTESOSTENIBLE = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/sustainableProjects" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_RelacionSolicitante = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/applicantRelationship/" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_ListaTipoVenta = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/salesType" // INFORMACION DE CLIENTES
export const URL_BACKEND_CATALOGO_ListaSeguros = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/insuranceType" // INFORMACION DE CLIENTES
export const URL_BACKEND_FianzaEntrecruzadaIlimitadaPNat = URL_BACKEND_PRE + "formalization/v1/crissCrossBailNaturalPerson" // INFORMACION DE CLIENTES
export const URL_BACKEND_FianzaSolidariaIlimitadaPNat = URL_BACKEND_PRE + "formalization/v1/unlimitedJointBailNaturalPerson" // INFORMACION DE CLIENTES
export const URL_BACKEND_FianzaSolidariaIlimitadaPJuri = URL_BACKEND_PRE + "formalization/v1/unlimitedJointBailLegalPerson" // INFORMACION DE CLIENTES
export const URL_BACKEND_FianzaSolidariaLimitadaPJuri = URL_BACKEND_PRE + "formalization/v1/limitedJointBailLegalPerson" // INFORMACION DE CLIENTES
export const URL_BACKEND_PERSONADEUDORES = URL_BACKEND_PRE + "UtilityBPM/v1/debtorIGR" // INFORMACION DE CLIENTES
export const URL_BACKEND_FianzalimitadaMancomunadaPNat = URL_BACKEND_PRE + "formalization/v1/limitedJointlyBailNaturalPerson" // INFORMACION DE CLIENTES
export const URL_BACKEND_PERSONAORQUESTADO = URL_BACKEND_PRE + "preapp/v1/BssRequestPerson" // INFORMACION DE CLIENTES
export const URL_BACKEND_DETALLEANTIGUEDAD = URL_BACKEND_PRE + "finantialReport/v1/seniorityDetail/" // INFORMACION DE CLIENTES
export const URL_BACKEND_TRAMITES = URL_BACKEND_PRE + "preapp/v1/applicationProcess" //usuario o cliente prospecto
export const URL_BACKEND_CAPEXDETALLE = URL_BACKEND_PRE + "creditAnalysis/v1/capexDetails/" //usuario o cliente prospecto
export const URL_BACKEND_CAPEX = URL_BACKEND_PRE + "creditAnalysis/v1/capex" //usuario o cliente prospecto
export const URL_BACKEND_CAPEXPRESUPUESTO = URL_BACKEND_PRE + "creditAnalysis/v1/capexBudget" //usuario o cliente prospecto
export const URL_BACKEND_HISTORIALLISTANEGRA = URL_BACKEND_PRE + "preapp/v1/personHistory" //usuario o cliente prospecto
export const URL_BACKEND_CHECKLISTTRAMITE = URL_BACKEND_PRE + "creditApp/v1/checklistTransact" //usuario o cliente prospecto
export const URL_BACKEND_RESUMENCAMBIOS = URL_BACKEND_PRE + "creditProposal/v1/changesSummary" //usuario o cliente prospecto
export const URL_BACKEND_CartaTerminosCondiciones = URL_BACKEND_PRE + "formalization/v1/termAndConditionLetter" // INFORMACION DE CLIENTES
export const URL_BACKEND_FACILIDADES = URL_BACKEND_PRE + "creditProposal/v1/facilitiesListSection" //usuario o cliente prospecto
export const URL_BACKEND_ASIGNARANALISTA = URL_BACKEND_PRE + "creditAnalysis/v1/creditAnalyst" //usuario o cliente prospecto
export const URL_BACKEND_PLEDGES = URL_BACKEND_PRE + "disbursement/v1/pledge" // PIGNORACIONES
export const URL_BACKEND_GUARANTEEPOLICY = URL_BACKEND_PRE + "disbursement/v1/guaranteePolicy/" // PIGNORACIONES
export const URL_BACKEND_CREDITLINE = URL_BACKEND_PRE + "disbursement/v1/creditLine/" // PIGNORACIONES
export const URL_BACKEND_GuaranteeUsedNewEquipments = URL_BACKEND_PRE + "disbursement/v1/guaranteeUsedNewEquipments" // PIGNORACIONES
export const URL_BACKEND_GuaranteeMoveableAsset = URL_BACKEND_PRE + "disbursement/v1/guaranteeMoveableAsset" // PIGNORACIONES
export const URL_BACKEND_DisbursementInstructiveByFacility = URL_BACKEND_PRE + "disbursement/v1/disbursementInstructiveByFacility" // PIGNORACIONES
export const URL_BACKEND_OtherGuarantees = URL_BACKEND_PRE + "disbursement/v1/otherGuarantees/" // PIGNORACIONES
export const URL_BACKEND_CustomerAcceptance = URL_BACKEND_PRE + "legalDocumentation/v1/customerAcceptance" // aCEPTACION CLIENTE
export const URL_BACKEND_legalDocsFunctions = URL_BACKEND_PRE + "legalDocumentation/v1/legalDocsFunctions" // aCEPTACION CLIENTE
export const URL_BACKEND_CheckListDocuments = URL_BACKEND_PRE + "creditProposal/v1/documentoscheck" // Retorna los documentos checklist por etapa
export const URL_BACKEND_LegalDocumentation = URL_BACKEND_PRE + "legalDocumentation/v1/legalDoc" // Retorna los documentos checklist por etapa
export const URL_BACKEND_EstadisticasMejoradas = URL_BACKEND_PRE + "UtilityBPM/management/v1/bpmLog/statistics/vm/" // Retorna los documentos checklist por etapa
export const URL_BACKEND_ExposicionCorporativa = URL_BACKEND_PRE + "creditProposal/v1/corporateExhibition" // Obtiene exposicion Corporativa BD
export const URL_BACKEND_ExposicionCorporativaCliente = URL_BACKEND_PRE + "creditProposal/v1/corporateExhibitionClient" // Obtiene exposicion Corporativa BD
export const URL_BACKEND_SearchesHistorical = URL_BACKEND_PRE + "UtilityBPM/management/v1/bpmLog/statistics/vm/summaryProcess" // Obtiene datos de historicos
export const URL_BACKEND_SearchesHistoricalv2 = URL_BACKEND_PRE + "UtilityBPM/management/v1/bpmLog/statistics/vm/historical" // Obtiene datos de historicos
export const URL_BACKEND_GovernanceInformation = URL_BACKEND_PRE + "managementReport/v1/corporateGovernanceInformation" // Obtiene datos de historicos
export const URL_BACKEND_Disbursementschedule = URL_BACKEND_PRE + "disbursement/v1/disbursementschedule" // Schedule de Instructivo de Desembolso
export const URL_BACKEND_SignContract = URL_BACKEND_PRE + "formalization/v1/signContract" // Firma de Conrato
export const URL_BACKEND_Facilitytrustee = URL_BACKEND_PRE + "creditProposal/v1/facilitytrustee" // Firma de Conrato
export const URL_BACKEND_CatalogTrustee = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/trusteeship" // Firma de Conrato
export const URL_BACKEND_environmentalHistory = URL_BACKEND_PRE + "UtilityBPM/management/v1/bpmLog/statistics/vm/environmentalHistory" // Firma de Conrato
export const URL_BACKEND_devolutionCatalog = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/ReturnCatalog" // Firma de Conrato
export const URL_BACKEND_sustainableProjectsCatalog = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/sustainableProjects" // Firma de Conrato
export const URL_BACKEND_creditRiskOpinionCat = URL_BACKEND_PRE + "UtilityBPM/catalogs/v1/creditRiskOpinionCat" // Firma de Conrato
export const URL_BACKEND_LegalDocuments = URL_BACKEND_PRE + "legalDocumentation/v1/legalDocResults"
export const URL_BACKEND_QUOTER = URL_BACKEND_PRE + "UtilityBPM/v1/quoter"
export const URL_BACKEND_UserGroup = URL_BACKEND_PRE + "retrieveListUsersByGroup" // retorna los usuarios por Grupo
export const URL_BACKEND_ERRORLOG = URL_BACKEND_PRE + "UtilityBPM/management/v1/errorLog/" // linea de credito

//BPM
export const URL_BPM_MODELNAMESPACE = "https://kiegroup.org/dmn/_8312D9CE-742A-44A1-B9E5-FA8F5C7DC982" //"https://kiegroup.org/dmn/_3B8E611A-D760-4020-9BA9-69ED1FD4DFFC"//
export const URL_BPM_PRE = "http://dev-bpm-app.panama.banesco.lac:8080/api-jbpm-0.0.1-SNAPSHOT/soaint-toolbox-eis/bpm-api/v0/processes/" //URL PREFIX
export const USRREASIGNACION = "admin";//"ovmartinez"
export const PSWREASIGNACION = "BanescoBPM2021.";//"Hr5d.t$3s"
export const URL_BPM_DASHBOARD = URL_BPM_PRE + "task/dasboard/" //bandeja entrada
export const URL_BPM_DASHBOARDADMIN = URL_BPM_PRE + "bandejadmin" //bandeja entrada
export const URL_BPM_LOGIN = URL_BPM_PRE + "autenticationProcess"; //login
export const URL_BPM_STATUSTASK = URL_BPM_PRE + "task/modifyStatus"; //modificar e iniciar tarea
export const URL_BPM_STARTPROCESS = URL_BPM_PRE + "startProcess" //bandeja entrada
export const URL_BPM_ABORTPROCESS = URL_BPM_PRE + "abortProcess" //abortar Proceso
export const WORD_BPM_CONTAINERID = "CreditosComerciales_1.0.0-SNAPSHOT";//"CreditosComerciales_1.1.3";//
export const WORD_BPM_PROCESSID = "CreditosComerciales.SolicitudDeCredito";//"CreditosComerciales.SolicitudDeCredito";//
export const WORD_BPM_PROCESSID_DisbursementInstructions = "CreditosComerciales.AdministracionYDesembolsoDeCredito";//"CreditosComerciales.SolicitudDeCredito";//
export const WORD_BPM_COMPLETED = "completed";
export const WORD_BPM_STARTED = "started";
export const URL_BPM_UPDATEVAR = URL_BPM_PRE + "updatevariables"; //actualizar variables
export const URL_BPM_WATCHPROCESS = URL_BPM_PRE + "verproceso"; //Ver imagen de proceso
export const URL_BPM_checketapa = URL_BPM_PRE + "checketapa"; //actualizar autonomia
export const URL_BPM_ChangeTaskUser = URL_BPM_PRE + "reasignarusuario"; //actualizar autonomia

//COMMONS
export const URL_CORSBYPASS = "https://cors-anywhere.herokuapp.com/" //url para bypass el problema del cors en desarrollo
export const URL_DASHBOARD = "/dashboard"
export const URL_CREDITANALISYS = "/creditocomercial/analisiscredito" //ANALISIS DE CREDITO
export const URL_FINANCIALINFO = "/creditocomercial/analisiscredito/informefinanciero" //INFORME FINANCIERO
export const URL_MANAGEMENTREPORT = "/creditocomercial/informegestion" //INFORME GESTION
export const URL_CREDITPROPOSAL = "/creditocomercial/propuestacredito" //PROPUESTA DE CREDITO
export const URL_PREREQUEST = "/creditocomercial/presolicitud" //PRESOLICITUD