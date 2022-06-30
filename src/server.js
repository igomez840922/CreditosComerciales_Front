import { Server } from "miragejs";
import propuestacredito_documentos from "./api/core/propuestacredito/documentos";
import propuestacredito_detalle from "./api/core/propuestacredito/detalle";
import exposicionCorporativa from "./api/core/propuestacredito/exposicionCorporativa";
import exposicionCliente from "./api/core/propuestacredito/exposicionCliente";
import resumenCambios from "./api/core/propuestacredito/resumenCambios";
import listaFacilidades from "./api/bpm/propuestacredito/facilidades";
import bitacoraRefinanciamiento from "./api/bpm/propuestacredito/refinanciamiento";
import listaChecklist from "./api/bpm/propuestacredito/checklist";
import resultUpdatePropuesta from "./api/bpm/propuestacredito/update";
import ResultadosBandejaEntrada from "./api/ValidarPresolicitud/ResultadosBandejaEntrada"
import ValidarListaVigilancia from "./api/ValidarPresolicitud/ResultadosListaVigilancia";
import ResultadosBandejaEntradaCli from "./api/AceptacionCliente/ResultadosBandejaEntradaCli";
import ResultadosEntradaFideicomiso from "./api/Fideicomiso/ResultadosEntradaFideicomiso";
import ResultadoFideicomitente from "./api/Fideicomiso/ResultadoFideicomitente";
import ResultadosEntradaDocumentacion from "./api/DocumentacionLegal/ResultadosEntradaDocumentacion";
import ResultadoDetalleDocumentacionLegal from "./api/DocumentacionLegal/ResultadoDetalleDocumentacionLegal";
import ResultadoEntradaFirmaContrato from "./api/FirmaContrato/ResultadoEntradaFirmaContrato";
import ResultadoDetalleAbogado from "./api/Abogado/ResultadoDetalleAbogado";
import ResultadoChecklistCentroArchivo from "./api/CentroArchivo/ResultadoChecklistCentroArchivo";
import ResultadoDetalleDocLegalCentroArchivo from "./api/CentroArchivo/ResultadoDetalleDocLegalCentroArchivo";
import informegestion_inboxresult from "./api/bpm/informegestion/inboxresult";
import common_economicactivitylist from "./api/bpm/common/economicactivity";
import common_bankinglist from "./api/bpm/common/banking";
import common_economicgrouplist from "./api/bpm/common/economicgroup";
import common_idtypelist from "./api/bpm/common/idtype";
import common_countrylist from "./api/bpm/common/country";
import common_provincelist from "./api/bpm/common/province";
import common_townshiplist from "./api/bpm/common/township";
import common_districtlist from "./api/bpm/common/district";
import common_citylist from "./api/bpm/common/city";
import common_sectorlist from "./api/bpm/common/sector";
import common_subsectorlist from "./api/bpm/common/subsector";
import common_shareholderinfolist from "./api/bpm/common/shareholderinfo";
import common_transactions from "./api/bpm/common/transactions";
import watchlist from "./api/core/busquedadescarte/watchlist";
import PartiesInformation from "./api/bpm/common/PartiesInformation"
import PartiesStaff from "./api/bpm/common/PartiesStaff"
import AccountsTransactions from "./api/bpm/common/AccountsTransactions";
import UpDocuments from "./api/bpm/common/UpDocuments";
import GetDashBoard from "./api/bpm/common/GetDashBoard";
// mock server
const server = new Server({

  routes() {

    // If your API requests go to an external domain, pass those through by
    // specifying the fully qualified domain name
    this.passthrough("https://qa-auth-ob.banesco.com.pa/**")
    this.passthrough("https://qa.api.ob.banesco.com.pa/**")
    this.passthrough("https://test-auth-ob.banesco.com.pa/**")
    this.passthrough("https://test.api.ob.banesco.com.pa/**")
    this.passthrough("http://10.40.216.88:8080/**")
    this.passthrough("http://10.40.216.182:8080/**")
    this.passthrough("http://10.40.216.82:8080/**")
    this.passthrough("http://10.40.217.90:8080/**")
    this.passthrough("http://127.0.0.1:8080/**")
    this.passthrough("http://qa-bpm-app.panama.banesco.lac:8080/**")
    this.passthrough("https://qa-bpm-app.panama.banesco.lac:8080/**")
    this.passthrough("http://dev-bpm-app.panama.banesco.lac:8080/**")
    this.passthrough("https://dev-bpm-app.panama.banesco.lac:8080/**")
    

    this.namespace = "api";

    // CORE routes
    this.post("/core/propuestacredito/documentos", () => propuestacredito_documentos);
    this.get("/core/consultarExposicionCorporativa/:id", () => exposicionCorporativa);
    this.get("/core/consultarExposicionCliente/:id", () => exposicionCliente);
    this.get("/core/propuestacredito/detalle/:id", () => propuestacredito_detalle);
    this.get("/core/propuestacredito/:id/consultarResumenCambios", () => resumenCambios);
    this.post("/core/busquedadescarte/watchlist", () => watchlist);
    this.post("/core/propuestacredito/actualizarDatos", () => resultUpdatePropuesta);

    this.get("/bpm/common/PartiesInformation", () => PartiesInformation);
    this.get("/bpm/common/PartiesStaff", () => PartiesStaff);
    this.get("/bpm/common/AccountsTransactions", () => AccountsTransactions);


    // BPM routes
    this.get("/bpm/propuestacredito/:id/consultarListaFacilidades", () => listaFacilidades);
    this.get("/bpm/propuestacredito/:id/consultarBitacoraRefinanciamiento", () => bitacoraRefinanciamiento);
    this.get("/bpm/propuestacredito/:id/checklist", () => listaChecklist);
    this.post("/bpm/informegestion/inboxresult", () => informegestion_inboxresult);
    this.post("/bpm/propuestacredito/:id/datosgenerales", () => resultUpdatePropuesta);
    this.get("/bpm/common/GetDashBoard", () => GetDashBoard);

    


    //Common
    this.get("/bpm/common/economicactivity", () => common_economicactivitylist);
    this.get("/bpm/common/banking", () => common_bankinglist);
    this.get("/bpm/common/economicgroup", () => common_economicgrouplist);
    this.get("/bpm/common/idtype", () => common_idtypelist);
    this.get("/bpm/common/country", () => common_countrylist);
    this.get("/bpm/common/province", () => common_provincelist);
    this.get("/bpm/common/township", () => common_townshiplist);
    this.get("/bpm/common/district", () => common_districtlist);
    this.get("/bpm/common/city", () => common_citylist);
    this.get("/bpm/common/sector", () => common_sectorlist);
    this.get("/bpm/common/subsector", () => common_subsectorlist);
    this.get("/bpm/common/shareholderinfo", () => common_shareholderinfolist);
    this.get("/bpm/common/transactions", () => common_transactions);

    this.post("/ValidarPresolicitud/ResultadosBandejaEntrada", () => ResultadosBandejaEntrada);
    this.post("/ValidarPresolicitud/ResultadosListaVigilancia", () => ValidarListaVigilancia);
    this.post("/AceptacionCliente/ResultadosBandejaEntradaCli", () => ResultadosBandejaEntradaCli);
    this.post("/Fideicomiso/ResultadosEntradaFideicomiso", () => ResultadosEntradaFideicomiso);
    this.post("/Fideicomiso/ResultadoFideicomitente", () => ResultadoFideicomitente);
    this.post("/DocumentacionLegal/ResultadosEntradaDocumentacion", () => ResultadosEntradaDocumentacion);
    this.post("/DocumentacionLegal/ResultadoDetalleDocumentacionLegal", () => ResultadoDetalleDocumentacionLegal);
    this.post("/FirmaContrato/ResultadoEntradaFirmaContrato", () => ResultadoEntradaFirmaContrato);
    this.post("/Abogado/ResultadoDetalleAbogado", () => ResultadoDetalleAbogado);
    this.post("/CentroArchivo/ResultadoChecklistCentroArchivo", () => ResultadoChecklistCentroArchivo);
    this.post("/CentroArchivo/ResultadoDetalleDocLegalCentroArchivo", () => ResultadoDetalleDocLegalCentroArchivo);
    this.post("/bpm/common/UpDocuments", () => UpDocuments);


  }


});

export default server;
