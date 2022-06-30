import PropTypes from "prop-types"
import React, { useEffect, useRef, useCallback, useState } from "react"

// //Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import { withRouter, Link, useLocation, useHistory } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"

import * as opt from "../../helpers/options_helper"
import * as url from "../../helpers/url_helper"

import { BackendServices, BpmServices, CoreServices, } from "../../services/index";
import SessionHelper from "../../helpers/SessionHelper";
import LocalStorageHelper from "../../helpers/LocalStorageHelper";
import { cond } from "lodash"
import { translationHelpers } from "../../helpers"

const SidebarContent = props => {

  const localStorageHelper = new LocalStorageHelper();
  const ref = useRef()

  const history = useHistory();

  const [sessionHelper, setsessionHelper] = useState(new SessionHelper());

  const [t, c, tr] = translationHelpers('translation', 'common', 'translation');

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }
    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement
      if (parent2) {
        parent2.classList.add("mm-show") // ul tag
        const parent3 = parent2.parentElement // li tag
        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false
    }
    scrollElement(item);
    return false
  }, []);

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname
    const initMenu = () => {
      new MetisMenu("#side-menu")
      let matchingMenuItem = null
      const ul = document.getElementById("side-menu")
      const items = ul.getElementsByTagName("a")
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [props.location.pathname, activateParentDropdown])
  useEffect(() => {
    ref.current.recalculate()
  }, []);
  const scrollElement = (item) => {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  function NewInstance() {
    //datos que le enviamos a la pantalla de busqueda y descarte
    var data = { customerId: "", transactionId: "", instanceId: "", taskId: "", taskStatus: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString() }
    sessionHelper.save(opt.VARNAME_LOCATIONDATA, data);
    history.push({
      pathname: url.URL_PREREQUEST,
    });
  }

  function NewInstance2() {
    //creamos un nueva instancia de proceso en BPM...       
    const apiServiceBPM = new BpmServices();
    apiServiceBPM.startProcess()
      .then((number) => {

        if (number !== null && number !== undefined && number > 0) {
          //buscamos la tarea que crea el nuevo proceso
          apiServiceBPM.getTasksByPrcess(number)
            .then((result) => {
              if (result !== undefined) {

                //Inicializamos la nueva tarea en BPM   
                apiServiceBPM.startedStatusTask(result.taskId)
                  .then((iniresult) => {
                    if (iniresult !== undefined) {
                      //datos que le enviamos a la pantalla de busqueda y descarte
                      history.push({
                        //pathname: '/creditocomercial/busquedadescarte',
                        pathname: '/creditocomercial/presolicitud',
                        data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: result.instanceId, taskId: result.taskId, taskStatus: result.status }
                      });
                    }
                  })
              }
            })
        }
      })
      .catch((error) => {

        //Mostrar Mensaje Proceso no instanciado
        console.error('api error: ', error);
      });
  }
  const [condicion, setcondicion] = useState(true);

  React.useEffect(() => {
    try {
      const { menberof } = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);

      const groups = [opt.Grp_Administrador, opt.Grp_EtECC_Ejecutivo]

      setcondicion(groups.some(group => group === menberof.split(',')[0].replace(': CN=', '')))

    } catch (error) {
      // localStorageHelper.delete(opt.VARNAME_USRCREDENTIAL);
      // history.push("/logout");
    }
    // if (usrname === "admintest" || usrname === "ETECCNegocio1" || usrname === "adminBanesco") {
    // } else {
    //   setcondicion(false);
    // }
  });

  return (
    <React.Fragment>
      <SimpleBar ref={ref} className="vertical-simplebar">
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{t("Menu")} </li>
            <li>
              <Link to="/dashboard" className="waves-effect">
                <i className="mdi mdi-airplay"></i><span>{t("Inbox")}</span>
              </Link>
            </li>
            {/*<li>
              <Link to="/creditocomercial/cotizador" className="waves-effect">
                <i className="mdi mdi-calculator"></i>
                <span>{t("Quoter")}</span>
              </Link>
            </li>
            <li>
              <Link to="/creditocomercial/scheduler" className="waves-effect">
                <i className="mdi mdi-calendar-text"></i>
                <span>{t("Scheduler")}</span>
              </Link>
  </li>*/}

            <li className="menu-title">{t("Management")} </li>

            <li>
              <Link to="/historical" className="waves-effect">
                <i className="mdi mdi-history"></i><span>{t("Historical")}</span>
              </Link>
            </li>
            {/* <li>
                <Link to="/RiesgoAmbientalHistorico" className="waves-effect">
                  <i className="mdi mdi-history"></i><span>{t("Historical Environmental Risk")}</span>
                </Link>
              </li> */}
            {/*<li>
              <li>
                <Link to="/RiesgoAmbientalHistorico" className="waves-effect">
                  <i className="mdi mdi-history"></i><span>{t("Historical Environmental Risk")}</span>
                </Link>
              </li>
              <Link to="/DashboardInstructivo" className="waves-effect">
                <i className="mdi mdi-history"></i><span>{t("Inbox Tutorial")}</span>
              </Link>
            </li>
           
              <li>
              <Link to="/DashboardInstructivo" className="waves-effect">
                <i className="mdi mdi-history"></i><span>{t("Inbox Tutorial")}</span>
              </Link>
            </li> 
            <li>
              <Link to="/statistics" className="waves-effect">
                <i className="mdi mdi-history"></i><span>{t("Statistics")}</span>
              </Link>
            </li>*/}

            {condicion && <>
              <li className="menu-title">{t("Processes")} </li>
              <li> <Link to="#" className="waves-effect" onClick={() => { NewInstance() }}>
                <i className="mdi mdi-file-plus-outline"></i><span>{t("CommercialCredit")}</span>
              </Link></li>
            </>
            }


            {
              /*<li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("SearchDiscard") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/busquedadescarte" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("Compliance") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/descartarcoincidencia" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("CreditProposal") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/informegestion" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("ReinforcedManagementReport") }</span>
                  </Link>
                </li>
                <li>
                  <Link to="/creditocomercial/propuestacredito" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">1</span>
                    <span>{ t("CreditProposal") }</span>
                  </Link>
                </li>
              </ul>
            </li>


            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("Credit Analysis") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/analisis/bandeja" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>
            
             <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("Environmental Risk") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/riesgo-ambiental/bandeja" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("Credit Risk") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/riesgo-credito/bandeja" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("CreditAnalysisSupervisor") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/supervisoranalisiscredito" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>
            

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("CreditAutonomy") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/autonomiacredito" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>
            

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("ClientAcceptance") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/aceptacioncliente" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>
            
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("Escrow") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/fideicomiso" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("LegalDocumentation") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/documentacionlegal" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>
            

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("Lawyer") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/abogado" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("SignContract") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/firmarcontrato" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>
              </ul>
            </li>
            

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("Administration") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/administracion" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>                
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("Disbursement") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/instructivodesembolso" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>                
              </ul>
            </li>

            

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("ArchiveCenter") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/creditocomercial/centroarchivo" className="waves-effect">
                    <span className="badge rounded-pill bg-info float-end">2</span>
                    <span>{ t("Inbox") }</span>
                  </Link>
                </li>                
              </ul>
            </li>


       
            <li>
              <Link to="/calendar" className=" waves-effect">
                <i className="mdi mdi-calendar-text"></i>
                <span>{ t("Calendar") }</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-inbox-full"></i>
                <span>{ t("Email") }</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/email-inbox">{ t("Inbox") }</Link>
                </li>
                <li>
                  <Link to="/email-read">{ t("Read Email") } </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-calendar-check"></i>
                <span>{ t("Tasks") }</span>
              </Link>
              <ul className="sub-menu">
                <li><Link to="/tasks-list">{props.t("Task List")}</Link></li>
                <li><Link to="/tasks-kanban">{props.t("Kanban Board")}</Link></li>
                <li><Link to="/tasks-create">{props.t("Create Task")}</Link></li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-account-circle-outline"></i>
                <span>{props.t("Pages")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/pages-login">{props.t("Login")}</Link>
                </li>
                <li>
                  <Link to="/pages-register">{props.t("Register")}</Link>
                </li>
                <li>
                  <Link to="/page-recoverpw">
                    {props.t("Recover Password")}
                  </Link>
                </li>
                <li>
                  <Link to="/auth-lock-screen">{props.t("Lock Screen")}</Link>
                </li>
                <li>
                  <Link to="/pages-starter">{props.t("Starter Page")}</Link>
                </li>
                <li>
                  <Link to="/invoice">{props.t("Invoice")}</Link>
                </li>
                <li>
                  <Link to="/profile">{props.t("Profile")}</Link>
                </li>
                <li>
                  <Link to="/pages-maintenance">{props.t("Maintenance")}</Link>
                </li>
                <li>
                  <Link to="/pages-comingsoon">{props.t("Coming Soon")}</Link>
                </li>
                <li>
                  <Link to="/pages-timeline">{props.t("Timeline")}</Link>
                </li>
                <li>
                  <Link to="/pages-faqs">{props.t("FAQs")}</Link>
                </li>
                <li>
                  <Link to="/pages-pricing">{props.t("Pricing")}</Link>
                </li>
                <li>
                  <Link to="/pages-404">{props.t("Error 404")}</Link>
                </li>
                <li>
                  <Link to="/pages-500">{props.t("Error 500")}</Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">{props.t("Components")}</li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-checkbox-multiple-blank-outline"></i>
                <span>{props.t("UI Elements")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/ui-alerts">{props.t("Alerts")}</Link>
                </li>
                <li>
                  <Link to="/ui-buttons">{props.t("Buttons")}</Link>
                </li>
                <li>
                  <Link to="/ui-cards">{props.t("Cards")}</Link>
                </li>
                <li>
                  <Link to="/ui-carousel">{props.t("Carousel")}</Link>
                </li>
                <li>
                  <Link to="/ui-dropdowns">{props.t("Dropdowns")}</Link>
                </li>
                <li>
                  <Link to="/ui-grid">{props.t("Grid")}</Link>
                </li>
                <li>
                  <Link to="/ui-images">{props.t("Images")}</Link>
                </li>
                <li>
                  <Link to="/ui-lightbox">{props.t("Lightbox")}</Link>
                </li>
                <li>
                  <Link to="/ui-modals">{props.t("Modals")}</Link>
                </li>
                <li>
                  <Link to="/ui-rangeslider">{props.t("Range Slider")}</Link>
                </li>
                <li>
                  <Link to="/ui-session-timeout">
                    {props.t("Session Timeout")}
                  </Link>
                </li>
                <li>
                  <Link to="/ui-progressbars">{props.t("Progress Bars")}</Link>
                </li>
                <li>
                  <Link to="/ui-sweet-alert">{props.t("Sweet-Alert")}</Link>
                </li>
                <li>
                  <Link to="/ui-tabs-accordions">
                    {props.t("Tabs & Accordions")}
                  </Link>
                </li>
                <li>
                  <Link to="/ui-typography">{props.t("Typography")}</Link>
                </li>
                <li>
                  <Link to="/ui-video">{props.t("Video")}</Link>
                </li>
                <li>
                  <Link to="/ui-general">{props.t("General")}</Link>
                </li>
                <li>
                  <Link to="/ui-colors">{props.t("Colors")}</Link>
                </li>
                <li>
                  <Link to="/ui-rating">{props.t("Rating")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="waves-effect">
                <i className="mdi mdi-newspaper"></i>
                <span className="badge rounded-pill bg-danger float-end">6</span>
                <span>{props.t("Forms")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/basic-elements">{props.t("Basic Elements")}</Link>
                </li>
                <li>
                  <Link to="/form-validation">
                    {props.t("Form Validation")}
                  </Link>
                </li>
                <li>
                  <Link to="/form-advanced">{props.t("Form Advanced")}</Link>
                </li>
                <li>
                  <Link to="/form-editors">{props.t("Form Editors")}</Link>
                </li>
                <li>
                  <Link to="/form-uploads">{props.t("Form File Upload")} </Link>
                </li>
                <li>
                  <Link to="/form-xeditable">{props.t("Form Xeditable")}</Link>
                </li>
                <li>
                  <Link to="/form-repeater">{props.t("Form Repeater")}</Link>
                </li>
                <li>
                  <Link to="/form-wizard">{props.t("Form Wizard")}</Link>
                </li>
                <li>
                  <Link to="/form-mask">{props.t("Form Mask")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-clipboard-list-outline"></i>
                <span>{props.t("Tables")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/tables-basic">{props.t("Basic Tables")}</Link>
                </li>
                <li>
                  <Link to="/tables-datatable">{props.t("Data Tables")}</Link>
                </li>
                <li>
                  <Link to="/tables-responsive">
                    {props.t("Responsive Table")}
                  </Link>
                </li>
                <li>
                  <Link to="/tables-editable">{props.t("Editable Table")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-chart-donut"></i>
                <span>{props.t("Charts")}</span>
              </Link>

              <ul className="sub-menu">
                <li>
                  <Link to="/apex-charts">{props.t("Apex charts")}</Link>
                </li>
                <li>
                  <Link to="/chartjs-charts">{props.t("Chartist Chart")}</Link>
                </li>
                <li>
                  <Link to="/e-charts">{props.t("E Chart")}</Link>
                </li>
                <li>
                  <Link to="/charts-knob">{props.t("Jquery Knob")}</Link>
                </li>
                <li>
                  <Link to="/sparkline-charts">
                    {props.t("Sparkline Chart")}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-emoticon-happy-outline"></i>
                <span>{props.t("Icons")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/icons-boxicons">{props.t("Boxicons")}</Link>
                </li>
                <li>
                  <Link to="/icons-materialdesign">
                    {props.t("Material Design")}
                  </Link>
                </li>
                <li>
                  <Link to="/icons-dripicons">{props.t("Dripicons")}</Link>
                </li>
                <li>
                  <Link to="/icons-fontawesome">{props.t("Font awesome")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-map-marker-outline"></i>
                <span>{props.t("Maps")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/maps-google">{props.t("Google Maps")}</Link>
                </li>
                <li>
                  <Link to="/maps-vector">{props.t("Vector Maps")}</Link>
                </li>
                <li>
                  <Link to="/maps-leaflet">{props.t("Leaflet Maps")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-file-tree"></i>
                <span>{props.t("Multi Level")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/#">{props.t("Level 1.1")}</Link>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    {props.t("Level 1.2")}
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/#">{props.t("Level 2.1")}</Link>
                    </li>
                    <li>
                      <Link to="/#">{props.t("Level 2.2")}</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
  */}


          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation('navigation')(SidebarContent))
