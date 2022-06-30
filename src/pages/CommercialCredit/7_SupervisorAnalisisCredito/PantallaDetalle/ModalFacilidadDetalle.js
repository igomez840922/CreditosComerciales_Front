import React, { useState } from "react"
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Button,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,  
  Card,
  CardBody,
  CardFooter,
  InputGroup,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import classnames from "classnames"
import { Link } from "react-router-dom"

import DatosGenerales from "./DetalleFacilidad/DatosGenerales"
import DatosPropuesta from "./DetalleFacilidad/DatosPropuesta";
import DatosTasa from "./DetalleFacilidad/DatosTasa";
import DatosComision from "./DetalleFacilidad/DatosComision";
import DatosPlazo from "./DetalleFacilidad/DatosPlazo";
import DatosDesembolso from "./DetalleFacilidad/DatosDesembolso";
import DatosGarantias from "./DetalleFacilidad/DatosGarantias";
import DatosFianza from "./DetalleFacilidad/DatosFianza";
import DatosLtv from "./DetalleFacilidad/DatosLtv";
import DatosCondicionesFinanciera from "./DetalleFacilidad/DatosCondicionesFinanciera";
import DatosRas from "./DetalleFacilidad/DatosRas";
import DatosCovenantFinanciero from "./DetalleFacilidad/DatosCovenantFinanciero";
import DatosEstadoDocLegal from "./DetalleFacilidad/DatosEstadoDocLegal";
import DatosOtrasCondiciones from "./DetalleFacilidad/DatosOtrasCondiciones";
import DatosRiesgoCredito from "./DetalleFacilidad/DatosRiesgoCredito";
import DatosProvision from "./DetalleFacilidad/DatosProvision";

const ModalFacilidadDetalle = (props) => {

    //props.ClientId, props.IgrId
  const [activeTab, setactiveTab] = useState(1)

  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 27) {
        setactiveTab(tab)
      }
    }
  }
  

    
  return (
    <Modal
      size="xl"
      isOpen={ props.isOpen }
      toggle={ props.toggle }
      centered={true}>
          <ModalHeader toggle={ props.toggle } color="primary">{ props.t("Facility") }</ModalHeader>
     
          <ModalBody style={{backgroundColor:"#f3f5f7"}}>
          <Card>
      <CardBody>
      <div className="form-wizard-wrapper wizard clearfix">
                  <div className="steps clearfix">
                  <ul style={{display: '-webkit-box', overflowX:'auto'}}>
                      <NavItem
                        className={classnames({ current: activeTab === 1 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 1 })}
                          onClick={() => {
                            setactiveTab(1)
                          }}
                        >
                          <span className="number">1.</span>{" "}
                          {props.t("GeneralData")}
                          </NavLink>
                      </NavItem>
                      
                      <NavItem
                        className={classnames({ current: activeTab === 2 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 2 })}
                          onClick={() => {
                            setactiveTab(2)
                          }}
                        >
                          <span className="number">2.</span>{" "}
                          {props.t("ProposalDetail")}
                          </NavLink>
                      </NavItem>

                      <NavItem
                        className={classnames({ current: activeTab === 3 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 3 })}
                          onClick={() => {
                            setactiveTab(3)
                          }}
                        >
                          <span className="number">3.</span>{" "}
                          {props.t("RateDetail")}
                          </NavLink>
                      </NavItem>

                      <NavItem
                        className={classnames({ current: activeTab === 4 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 4 })}
                          onClick={() => {
                            setactiveTab(4)
                          }}
                        >
                          <span className="number">4.</span>{" "}
                          {props.t("Commission")}
                          </NavLink>
                      </NavItem>

                      <NavItem
                        className={classnames({ current: activeTab === 5 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 5 })}
                          onClick={() => {
                            setactiveTab(5)
                          }}
                        >
                          <span className="number">5.</span>{" "}
                          {props.t("Term")}
                          </NavLink>
                      </NavItem>
                    
                      <NavItem
                        className={classnames({ current: activeTab === 6 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 6 })}
                          onClick={() => {
                            setactiveTab(6)
                          }}
                        >
                          <span className="number">6.</span>{" "}
                          {props.t("Disbursements")}
                          </NavLink>
                      </NavItem>
                    
                      <NavItem
                        className={classnames({ current: activeTab === 7 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 7 })}
                          onClick={() => {
                            setactiveTab(7)
                          }}
                        >
                          <span className="number">7.</span>{" "}
                          {props.t("Guarantee")}
                          </NavLink>
                      </NavItem>
                    
                      <NavItem
                        className={classnames({ current: activeTab === 8 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 8 })}
                          onClick={() => {
                            setactiveTab(8)
                          }}
                        >
                          <span className="number">8.</span>{" "}
                          {props.t("Bail")}
                          </NavLink>
                      </NavItem>
                    
                      <NavItem
                        className={classnames({ current: activeTab === 9 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 9 })}
                          onClick={() => {
                            setactiveTab(9)
                          }}
                        >
                          <span className="number">9.</span>{" "}
                          {props.t("LTV")}
                          </NavLink>
                      </NavItem>
                    
                      <NavItem
                        className={classnames({ current: activeTab === 10 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 10 })}
                          onClick={() => {
                            setactiveTab(10)
                          }}
                        >
                          <span className="number">10.</span>{" "}
                          {props.t("FinancialConditions")}
                          </NavLink>
                      </NavItem>

                      <NavItem
                        className={classnames({ current: activeTab === 11 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 11 })}
                          onClick={() => {
                            setactiveTab(11)
                          }}
                        >
                          <span className="number">11.</span>{" "}
                          {props.t("EnvironmentalSocialRisk")}
                          </NavLink>
                      </NavItem>

                      <NavItem
                        className={classnames({ current: activeTab === 12 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 12 })}
                          onClick={() => {
                            setactiveTab(12)
                          }}
                        >
                          <span className="number">12.</span>{" "}
                          {props.t("FinancialCovenant")}
                          </NavLink>
                      </NavItem>
                      
                      <NavItem
                        className={classnames({ current: activeTab === 13 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 13 })}
                          onClick={() => {
                            setactiveTab(13)
                          }}
                        >
                          <span className="number">13.</span>{" "}
                          {props.t("StatusLegalDocumentation")}
                          </NavLink>
                      </NavItem>
                      
                      <NavItem
                        className={classnames({ current: activeTab === 14 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 14 })}
                          onClick={() => {
                            setactiveTab(14)
                          }}
                        >
                          <span className="number">14.</span>{" "}
                          {props.t("OtherConditions")}
                          </NavLink>
                      </NavItem>
                      
                      <NavItem
                        className={classnames({ current: activeTab === 15 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 15 })}
                          onClick={() => {
                            setactiveTab(15)
                          }}
                        >
                          <span className="number">15.</span>{" "}
                          {props.t("CreditRisk")}
                          </NavLink>
                      </NavItem>
                      
                      <NavItem
                        className={classnames({ current: activeTab === 16 })}>
                        <NavLink
                          className={classnames({ current: activeTab === 16 })}
                          onClick={() => {
                            setactiveTab(16)
                          }}
                        >
                          <span className="number">16.</span>{" "}
                          {props.t("Provision")}
                          </NavLink>
                      </NavItem>

                    </ul>
                  </div>
                  <div className="content clearfix">
                    <TabContent
                      activeTab={activeTab}
                      className="body"
                    >
                      <TabPane tabId={1}>
                        <DatosGenerales />
                      </TabPane>
                      
                      <TabPane tabId={2}>
                        <DatosPropuesta />
                      </TabPane>

                      <TabPane tabId={3}>
                        <DatosTasa />
                      </TabPane>

                      <TabPane tabId={4}>
                        <DatosComision />
                      </TabPane>

                      <TabPane tabId={5}>
                        <DatosPlazo />
                      </TabPane>

                      <TabPane tabId={6}>
                        <DatosDesembolso />
                      </TabPane>

                      <TabPane tabId={7}>
                        <DatosGarantias />
                      </TabPane>

                      <TabPane tabId={8}>
                        <DatosFianza />
                      </TabPane>

                      <TabPane tabId={9}>
                        <DatosLtv />
                      </TabPane>

                      <TabPane tabId={10}>
                        <DatosCondicionesFinanciera />
                      </TabPane>

                      <TabPane tabId={11}>
                        <DatosRas />
                      </TabPane>

                      <TabPane tabId={12}>
                        <DatosCovenantFinanciero />
                      </TabPane>

                      <TabPane tabId={13}>
                        <DatosEstadoDocLegal />
                      </TabPane>

                      <TabPane tabId={14}>
                        <DatosOtrasCondiciones />
                      </TabPane>

                      <TabPane tabId={15}>
                        <DatosRiesgoCredito />
                      </TabPane>

                      <TabPane tabId={16}>
                        <DatosProvision />
                      </TabPane>

                    </TabContent>
                    
                  </div>
                  <div className="content clearfix">
                  </div>
                  <div className="actions clearfix">
                    <ul>
                      
                      <li
                        className={
                          activeTab === 1 ? "previous disabled" : "previous"
                        }
                      >
                        <Link
                          to="#"
                          className="btn btn-primary"
                          onClick={() => {
                            toggleTab(activeTab - 1)
                          }}
                        >
                          {props.t("Previous")}
                          </Link>
                      </li>
                      <li
                        className={activeTab === 27 ? "next disabled" : "next"}
                      >
                        <Link
                          to="#"
                          className="btn btn-primary"
                          onClick={() => {
                            toggleTab(activeTab + 1)
                          }}
                        >
                          {props.t("Next")}
                          </Link>
                      </li>

                      <li className={"next"} >
                        <Link
                          to="#"
                          className="btn btn-dark"
                          onClick={() => { props.toggle()}}>
                          {props.t("Close")}
                          </Link>
                      </li>
                                          
                    </ul>
                  </div>
                </div>
            
      </CardBody>
            
    </Card>

          </ModalBody>
    </Modal>
  );
};

ModalFacilidadDetalle.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};

export default (withTranslation()(ModalFacilidadDetalle));
