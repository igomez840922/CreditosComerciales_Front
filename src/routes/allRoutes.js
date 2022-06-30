import React from "react"
import { Redirect } from "react-router-dom"

// Dashboard
import Dashboard from "../pages/Dashboard/index"
import Dashboard2 from "../pages/Dashboard2.js/index.js"

// Pages Calendar
import Calendar from "../pages/Calendar/index"

// //Tasks
import TasksList from "../pages/Tasks/tasks-list"
import TasksKanban from "../pages/Tasks/tasks-kanban"
import TasksCreate from "../pages/Tasks/tasks-create"

//Email
import EmailInbox from "../pages/Email/email-inbox"
import EmailRead from "../pages/Email/email-read"
import EmailBasicTemplte from "../pages/Email/email-basic-templte"
import EmailAlertTemplte from "../pages/Email/email-template-alert"
import EmailTemplateBilling from "../pages/Email/email-template-billing"

//Pages
import PagesStarter from "../pages/Utility/pages-starter"
import PagesMaintenance from "../pages/Utility/pages-maintenance"
import PagesComingsoon from "../pages/Utility/pages-comingsoon"
import PagesTimeline from "../pages/Utility/pages-timeline"
import PagesFaqs from "../pages/Utility/pages-faqs"
import PagesPricing from "../pages/Utility/pages-pricing"
import Pages404 from "../pages/Utility/pages-404"
import Pages500 from "../pages/Utility/pages-500"
import PagesInvoice from "../pages/Utility/invoice"

//Pages Presolicitud
import Presolicitud from "../pages/CommercialCredit/1_Presolicitud/index"
//Pages Creditos Comerciales
import CommercialCreditInboxPage from "../pages/CommercialCredit/Inbox/InboxPage"
//import ValidarPresolicitudBandejaEntrada from "../pages/CommercialCredit/2_ValidarPresolicitud/BandejaEntrada/index"
import ValidarPresolicitudVerificar from "../pages/CommercialCredit/1_Presolicitud/index"//"../pages/CommercialCredit/2_ValidarPresolicitud/BusquedaCoincidencia/index"
//import CumplimientoBandejaEntrada from "../pages/CommercialCredit/3_Cumplimiento/BandejaEntrada/index"
import Cumplimiento from "../pages/CommercialCredit/3_Cumplimiento/index"
//import InformeGestionReforzadoEntrada from "../pages/CommercialCredit/4_InformeGestionReforzado/BandejaEntrada/index"
import InformeGestionReforzadoVer from "../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/index"
//import CreditProposalPageEntrada from "../pages/CommercialCredit/5_PropuestaCredito/InboxPage"
import CreditProposalPageVer from "../pages/CommercialCredit/5_PropuestaCredito/CreditProposalPage"
//import CreditAnalysisInboxPage from "../pages/CommercialCredit/6_AnalisisCredito/InboxPage"
import CreditAnalysisFinancialReportPage from "../pages/CommercialCredit/6_AnalisisCredito/FinancialReportPage"
//import CreditAnalysisAssignmentPage from "../pages/CommercialCredit/6_AnalisisCredito/AssignmentPage"
import CommercialCreditProposalPage from "../pages/CommercialCredit/6_AnalisisCredito/CommercialCreditProposalPage"
//import SupervisorAnalisisCreditoIEntrada from "../pages/CommercialCredit/7_SupervisorAnalisisCredito/PantallaBusqueda/index"
import SupervisorAnalisisCreditoIVer from "../pages/CommercialCredit/7_SupervisorAnalisisCredito/index"
//import AutonomiaCreditoEntrada from "../pages/CommercialCredit/8_AutonomiaCredito/PantallaBusqueda/index"
import AutonomiaBanca from "../pages/CommercialCredit/8_AutonomiaCredito/index"
import AutonomiaCredito from "../pages/CommercialCredit/8_AutonomiaCredito/index2"
import AceptacionClienteEntrada from "../pages/CommercialCredit/9_AceptacionCliente/index"
//import FideicomisoEntrada from "../pages/CommercialCredit/10_Fideicomiso/PantallaBusqueda/index"
import FideicomisoAsignar from "../pages/CommercialCredit/10_Fideicomiso/AsignarNumeroFideicomiso/index"
import FideicomisoRelacionFiduciaria from "../pages/CommercialCredit/10_Fideicomiso/Relacionfiduciaria/index"
import FideicomisoGarantias from "../pages/CommercialCredit/10_Fideicomiso/GarantiasFideicomiso/index"
//import DocumentacionLegalEntrada from "../pages/CommercialCredit/11_DocumentacionLegal/PantallaBusqueda/index"
import DocumentacionLegalVer from "../pages/CommercialCredit/11_DocumentacionLegal/PantallaDetalle/index"
import DocumentacionPrendaria from "../pages/CommercialCredit/11_DocumentacionLegal/PantallaDetalle/index2"
//import AbogadoEntrada from "../pages/CommercialCredit/12_Abogado/PantallaBusqueda/index"
import AbogadoVer from "../pages/CommercialCredit/12_Abogado/PantallaDetalle/index"
import FirmaContratoEntrada from "../pages/CommercialCredit/13_FirmaContrato/index"
//import RiesgoAmbientalInboxPage from "../pages/CommercialCredit/16_RiesgoAmbiental/InboxPage"
import RiesgoAmbientalDetalle from "../pages/CommercialCredit/16_RiesgoAmbiental/RiesgoAmbientalDetalle"
//import RiesgoCreditoInboxPage from "../pages/CommercialCredit/17_RiesgoCredito/InboxPage"
import RiesgoCreditoDetalle from "../pages/CommercialCredit/17_RiesgoCredito/RiesgoCreditoDetalle"
//import AdministracionVer from "../pages/CommercialCredit/14_AdminDesembolso/Administracion/Busqueda/index"

import AdministracionDetalle from "../pages/CommercialCredit/23_bandejaInstructivo/Administracion/Detalle/index"
import GarantiasEntrada from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/index"
import DesembolsoInstructivo from "../pages/CommercialCredit/23_bandejaInstructivo/InstructivoDesembolso"
import DesembolsoInstructivoEjecutar from "../pages/CommercialCredit/23_bandejaInstructivo/InstructivoDesembolsoEjecutar"
//14_AdminDesembolso/Desembolso/Instructivo/index"

//import CentroArchivoEntrada from "../pages/CommercialCredit/15_CentroArchivo/Busqueda/index"
import CentroArchivoVer from "../pages/CommercialCredit/15_CentroArchivo/Detalle/index"
import ListaExclusionVer from "../pages/CommercialCredit/18_ListaExclusion/index"
//import import GarantiasMuebles from "../pages/CommercialCredit/14_AdminDesembolso/Colateral/GarantiasMuebles/index"
import GarantiasMuebles from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/GarantiasMuebles/index"
//import GarantiaEquiposNuevosUsados from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/GarantiaEquiposNuevosUsados/index"
import GarantiaEquiposNuevosUsados from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/GarantiaEquiposNuevosUsados/index"
//import GarantiaBienInmueble from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/GarantiaBienInmueble/index"
import GarantiaBienInmueble from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/GarantiaBienInmueble/index"
//import Pignoracion from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/Pignoracion/index"
import Pignoracion from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/Pignoracion/index"
//import LineaCredito from"../pages/CommercialCredit/23_bandejaInstructivo/Colateral/Lineacredito/index"
import LineaCredito from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/Lineacredito/index"
//import MantenimientoLinea from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/MantenimientoLinea/index"
import MantenimientoLinea from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/MantenimientoLinea/index"
//import CreacionLinea from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/CreacionLinea/index"
import CreacionLinea from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/CreacionLinea/index"
//import ReportingService from "../pages/CommercialCredit/23_bandejaInstructivo/ReportingService/index"
import ReportingService from "../pages/CommercialCredit/14_AdminDesembolso/ReportingService/index"
//import OtrasGarantias from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/OtrasGarantias/index"
import OtrasGarantias from "../pages/CommercialCredit/23_bandejaInstructivo/Colateral/OtrasGarantias/index"

import ColateralGarantia from "../pages/CommercialCredit/19_ColateralGarantias/index"

import GastosLegales from "../pages/CommercialCredit/22_GastosLegales/index"

// Previsualizar
import previsualizarIGR from "../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/previsualizarIGR"
import previsualizarPropCred from "../pages/CommercialCredit/5_PropuestaCredito/previsualizarPropCred"
import previsualizarAIF from "../pages/CommercialCredit/6_AnalisisCredito/previsualizarAIF"
import PrevisualizarFideicomiso from "../pages/CommercialCredit/10_Fideicomiso/Relacionfiduciaria/PrevisualizarFideicomiso"

//Ui
import UiAlert from "../pages/Ui/UiAlert"
import UiButtons from "../pages/Ui/UiButtons"
import UiCards from "../pages/Ui/UiCards"
import UiCarousel from "../pages/Ui/UiCarousel"
import UiColors from "../pages/Ui/UiColors"
import UiDropdown from "../pages/Ui/UiDropdown"
import UiGeneral from "../pages/Ui/UiGeneral"
import UiGrid from "../pages/Ui/UiGrid"
import UiImages from "../pages/Ui/UiImages"
import UiLightbox from "../pages/Ui/UiLightbox"
import UiModal from "../pages/Ui/UiModal"
import UiProgressbar from "../pages/Ui/UiProgressbar"
import UiSweetAlert from "../pages/Ui/UiSweetAlert"
import UiTabsAccordions from "../pages/Ui/UiTabsAccordions"
import UiTypography from "../pages/Ui/UiTypography"
import UiVideo from "../pages/Ui/UiVideo"
import UiSessionTimeout from "../pages/Ui/UiSessionTimeout"
import UiRating from "../pages/Ui/UiRating"
import UiRangeSlider from "../pages/Ui/UiRangeSlider"
import UiNotifications from "../pages/Ui/ui-notifications"
import UiImageCropper from "../pages/Ui/ui-image-cropper"

// Forms
import BasicElements from "../pages/Forms/BasicElements"
import FormLayouts from "../pages/Forms/FormLayouts"
import FormAdvanced from "../pages/Forms/FormAdvanced"
import FormEditors from "../pages/Forms/FormEditors"
import FormValidations from "../pages/Forms/FormValidations"
import FormRepeater from "../pages/Forms/FormRepeater"
import FormUpload from "../pages/Forms/FormUpload"
import FormWizard from "../pages/Forms/FormWizard"
import FormXeditable from "../pages/Forms/FormXeditable"
import FormMask from "../pages/Forms/FormMask"

//Tables
import BasicTables from "../pages/Tables/BasicTables"
import DatatableTables from "../pages/Tables/DatatableTables"
import ResponsiveTables from "../pages/Tables/ResponsiveTables"
import EditableTables from "../pages/Tables/EditableTables"

// Charts
import ChartApex from "../pages/Charts/Apexcharts"
import ChartjsChart from "../pages/Charts/ChartjsChart"
import EChart from "../pages/Charts/EChart"
import SparklineChart from "../pages/Charts/SparklineChart"
import ChartsKnob from "../pages/Charts/charts-knob"

//Icons

import IconUnicons from "../pages/Icons/IconUnicons"
import IconBoxicons from "../pages/Icons/IconBoxicons"
import IconDripicons from "../pages/Icons/IconDripicons"
import IconMaterialdesign from "../pages/Icons/IconMaterialdesign"
import IconFontawesome from "../pages/Icons/IconFontawesome"

// Maps
import MapsGoogle from "../pages/Maps/MapsGoogle"
import MapsVector from "../pages/Maps/MapsVector"
import MapsLeaflet from "../pages/Maps/MapsLeaflet"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

//  // Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login"
import Register1 from "../pages/AuthenticationInner/Register"
import Recoverpw from "../pages/AuthenticationInner/Recoverpw"
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen"

// Profile
import UserProfile from "../pages/Authentication/user-profile"
import Historical from "../pages/Dashboard/historical"
import RiesgoAmbientalHistorico from "../pages/Dashboard/riesgoAmbiental"
import DashboardInstructivo from "../pages/Dashboard/bandejaInstructivo/dashboardInstructivo"
import InstructivoDesembolsoNew from "../pages/Dashboard/bandejaInstructivo/InstructivoDesembolso"
import Statistics from "../pages/Statistics"

// sections test
import Scheduler from "../pages/CommercialCredit/21_Scheduler/"
import LoanQuoterCalulator from "../pages/CommercialCredit/20_Cotizador/LoanQuoterCalulator"
import Comments from "../components/Comments/Comments";

const userRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/dashboard2", component: Dashboard2 },
  { path: "/calendar", component: Calendar },
  { path: "/historical", component: Historical },
  { path: "/RiesgoAmbientalHistorico", component: RiesgoAmbientalHistorico },
  { path: "/DashboardInstructivo", component: DashboardInstructivo },
  { path: "/InstructivoDesembolsoNew", component: InstructivoDesembolsoNew },
  { path: "/statistics", component: Statistics },

  // testing routes
  { path: "/testing/preguntas", component: Comments },
  { path: "/testing/loan-quoter", component: LoanQuoterCalulator },

  //Creditos Comerciales
  { path: "/creditocomercial/bandeja", component: CommercialCreditInboxPage },
  //{ path: "/creditocomercial/analisis/bandeja", component: CreditAnalysisInboxPage },
  //{ path: "/creditocomercial/analisis/asignar/:id", component: CreditAnalysisAssignmentPage },
  { path: "/creditocomercial/analisiscredito", component: CommercialCreditProposalPage, },
  //{ path: "/creditocomercial/analisis/ver/:id", component: CommercialCreditProposalPage },
  { path: "/creditocomercial/analisiscredito/informefinanciero", component: CreditAnalysisFinancialReportPage, },
  //{ path: "/creditocomercial/supervisoranalisiscredito", component: SupervisorAnalisisCreditoIEntrada },
  { path: "/creditocomercial/supervisoranalisiscredito", component: SupervisorAnalisisCreditoIVer, },
  //{ path: "/creditocomercial/riesgo-ambiental/bandeja", component: RiesgoAmbientalInboxPage },
  { path: "/creditocomercial/riesgoambiental", component: RiesgoAmbientalDetalle, },
  //{ path: "/creditocomercial/riesgo-credito/bandeja", component: RiesgoCreditoInboxPage },
  { path: "/creditocomercial/riesgocredito", component: RiesgoCreditoDetalle },
  //{ path: "/creditocomercial/busquedadescarte", component: ValidarPresolicitudBandejaEntrada },
  { path: "/creditocomercial/busquedadescarte", component: ValidarPresolicitudVerificar, },
  //{ path: "/creditocomercial/descartarcoincidencia", component: CumplimientoBandejaEntrada },
  { path: "/creditocomercial/descartarcoincidencia", component: Cumplimiento, },
  //{ path: "/creditocomercial/informegestion", component: InformeGestionReforzadoEntrada },
  { path: "/creditocomercial/informegestion", component: InformeGestionReforzadoVer, },
  //{ path: "/creditocomercial/propuestacredito", component: CreditProposalPageEntrada },
  { path: "/creditocomercial/propuestacredito", component: CreditProposalPageVer, },
  //{ path: "/creditocomercial/autonomiacredito", component: AutonomiaCreditoEntrada },
  { path: "/creditocomercial/autonomiabanca", component: AutonomiaBanca, },
  { path: "/creditocomercial/autonomiacredito", component: AutonomiaCredito, },
  { path: "/creditocomercial/aceptacioncliente", component: AceptacionClienteEntrada, },
  //{ path: "/creditocomercial/fideicomiso", component: FideicomisoEntrada },
  { path: "/creditocomercial/fideicomiso/asignarnumero", component: FideicomisoAsignar, },
  { path: "/creditocomercial/fideicomiso/relacionfiduciaria", component: FideicomisoRelacionFiduciaria, },
  { path: "/creditocomercial/fideicomiso/garantias", component: FideicomisoGarantias, },
  //{ path: "/creditocomercial/documentacionlegal", component: DocumentacionLegalEntrada },
  { path: "/creditocomercial/documentacionlegal", component: DocumentacionLegalVer, },
  { path: "/creditocomercial/documentacionprendaria", component: DocumentacionPrendaria, },
  //{ path: "/creditocomercial/abogado", component: AbogadoEntrada },
  { path: "/creditocomercial/abogado", component: AbogadoVer },
  { path: "/creditocomercial/firmarcontrato", component: FirmaContratoEntrada },
  //{ path: "/creditocomercial/administracion", component: AdministracionVer },
  { path: "/creditocomercial/administracion", component: AdministracionDetalle, },
  { path: "/creditocomercial/garantias", component: GarantiasEntrada },
  { path: "/creditocomercial/instructivodesembolso", component: DesembolsoInstructivo },
  { path: "/creditocomercial/ejecutarinstructivodesembolso", component: DesembolsoInstructivoEjecutar },

  //{ path: "/creditocomercial/centroarchivo", component: CentroArchivoEntrada },
  { path: "/creditocomercial/centroarchivo", component: CentroArchivoVer },
  { path: "/creditocomercial/listaexclusion", component: ListaExclusionVer },
  { path: "/creditocomercial/presolicitud", component: Presolicitud },
  //{ path: "/creditocomercial/AdminDesembolso", component: GarantiasMuebles }
  { path: "/creditocomercial/AdminDesembolso/GarantiasMuebles", component: GarantiasMuebles },
  { path: "/creditocomercial/AdminDesembolso/GarantiaEquiposNuevosyUsados", component: GarantiaEquiposNuevosUsados },
  { path: "/creditocomercial/AdminDesembolso/GarantiaBienInmueble", component: GarantiaBienInmueble },
  { path: "/creditocomercial/AdminDesembolso/OtrasGarantias", component: OtrasGarantias },
  { path: "/creditocomercial/AdminDesembolso/Pignoracion", component: Pignoracion },

  { path: "/creditocomercial/AdminDesembolso/LineaCredito", component: LineaCredito },

  { path: "/creditocomercial/AdminDesembolso/CreacionLinea", component: CreacionLinea },
  { path: "/creditocomercial/AdminDesembolso/MantenimientoLinea", component: MantenimientoLinea },

  //  { path: "/creditocomercial/AdminDesembolso/ReportingService", component: ReportingService },
  { path: "/creditocomercial/AdminDesembolso/ReportingService", component: ReportingService },
  //{ path: "/creditocomercial/AdminDesembolso/ReportingService", component: ReportingService },
  { path: "/creditocomercial/Colateral", component: ColateralGarantia },

  { path: "/creditocomercial/cotizador", component: LoanQuoterCalulator },
  // scheduler
  { path: "/creditocomercial/scheduler", component: Scheduler },

  { path: "/creditocomercial/previsualizarIGR/:id", component: previsualizarIGR },
  { path: "/creditocomercial/previsualizarPropCred/:id", component: previsualizarPropCred },
  { path: "/creditocomercial/previsualizarAIF/:id", component: previsualizarAIF },
  { path: "/creditocomercial/PrevisualizarFideicomiso/:id", component: PrevisualizarFideicomiso },

  { path: "/creditocomercial/gastoslegales", component: GastosLegales },



  //Email
  { path: "/email-inbox", component: EmailInbox },
  { path: "/email-read", component: EmailRead },
  { path: "/email-template-basic", component: EmailBasicTemplte },
  { path: "/email-template-alert", component: EmailAlertTemplte },
  { path: "/email-template-billing", component: EmailTemplateBilling },

  //Utility
  { path: "/pages-starter", component: PagesStarter },
  { path: "/pages-timeline", component: PagesTimeline },
  { path: "/pages-faqs", component: PagesFaqs },
  { path: "/pages-pricing", component: PagesPricing },
  { path: "/invoice", component: PagesInvoice },

  // Ui
  { path: "/ui-alerts", component: UiAlert },
  { path: "/ui-buttons", component: UiButtons },
  { path: "/ui-cards", component: UiCards },
  { path: "/ui-carousel", component: UiCarousel },
  { path: "/ui-colors", component: UiColors },
  { path: "/ui-dropdowns", component: UiDropdown },
  { path: "/ui-general", component: UiGeneral },
  { path: "/ui-grid", component: UiGrid },
  { path: "/ui-images", component: UiImages },
  { path: "/ui-lightbox", component: UiLightbox },
  { path: "/ui-modals", component: UiModal },
  { path: "/ui-progressbars", component: UiProgressbar },
  { path: "/ui-sweet-alert", component: UiSweetAlert },
  { path: "/ui-tabs-accordions", component: UiTabsAccordions },
  { path: "/ui-typography", component: UiTypography },
  { path: "/ui-video", component: UiVideo },
  { path: "/ui-session-timeout", component: UiSessionTimeout },
  { path: "/ui-rating", component: UiRating },
  { path: "/ui-rangeslider", component: UiRangeSlider },
  { path: "/ui-notifications", component: UiNotifications },
  { path: "/ui-image-cropper", component: UiImageCropper },

  // Forms
  { path: "/basic-elements", component: BasicElements },
  { path: "/form-layouts", component: FormLayouts },
  { path: "/form-advanced", component: FormAdvanced },
  { path: "/form-editors", component: FormEditors },
  { path: "/form-repeater", component: FormRepeater },
  { path: "/form-uploads", component: FormUpload },
  { path: "/form-wizard", component: FormWizard },
  { path: "/form-validation", component: FormValidations },
  { path: "/form-xeditable", component: FormXeditable },
  { path: "/form-mask", component: FormMask },

  // Tables
  { path: "/tables-basic", component: BasicTables },
  { path: "/tables-datatable", component: DatatableTables },
  { path: "/tables-responsive", component: ResponsiveTables },
  { path: "/tables-editable", component: EditableTables },

  //Charts
  { path: "/apex-charts", component: ChartApex },
  { path: "/chartjs-charts", component: ChartjsChart },
  { path: "/e-charts", component: EChart },
  { path: "/sparkline-charts", component: SparklineChart },
  { path: "/charts-knob", component: ChartsKnob },

  // Tasks
  { path: "/tasks-list", component: TasksList },
  { path: "/tasks-kanban", component: TasksKanban },
  { path: "/tasks-create", component: TasksCreate },

  // Icons
  { path: "/icons-unicons", component: IconUnicons },
  { path: "/icons-boxicons", component: IconBoxicons },
  { path: "/icons-dripicons", component: IconDripicons },
  { path: "/icons-materialdesign", component: IconMaterialdesign },
  { path: "/icons-fontawesome", component: IconFontawesome },

  // Maps
  { path: "/maps-google", component: MapsGoogle },
  { path: "/maps-vector", component: MapsVector },
  { path: "/maps-leaflet", component: MapsLeaflet },

  // //profile
  { path: "/profile", component: UserProfile },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const authRoutes = [

  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },

  { path: "/pages-maintenance", component: PagesMaintenance },
  { path: "/pages-comingsoon", component: PagesComingsoon },
  { path: "/pages-404", component: Pages404 },
  { path: "/pages-500", component: Pages500 },

  // Authentication Inner
  { path: "/pages-login", component: Login1 },
  { path: "/pages-register", component: Register1 },
  { path: "/page-recoverpw", component: Recoverpw },
  { path: "/auth-lock-screen", component: LockScreen },
]

export { userRoutes, authRoutes }