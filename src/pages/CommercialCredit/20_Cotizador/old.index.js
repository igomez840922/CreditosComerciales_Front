import React, { useState } from 'react';
import { setDefaults, useTranslation } from "react-i18next";
import {
    Row,
    Col,
    Card,
    CardBody,
    Label,
    CardFooter,
    Button,
    Table,
    CardHeader,
    Modal,
    InputGroup,
} from "reactstrap"
import { AvForm, AvField, AvGroup, AvInput, AvCheckbox } from "availity-reactstrap-validation";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import ModalQuoterForm from "./old.ModalQuoterForm"

const LoanQuoter = props => {
    const { t, i18n } = useTranslation();

    const [showQuoter, setshowQuoter] = useState(false);

    //Abrir modal de verificacion en listas de vigilancias
  function OpenCloseQuoter(show = true) {
    setshowQuoter(show);
  }


    return (
        <div className="page-content">
            <Breadcrumbs title={t("Process")} breadcrumbItem={t("Quoter")} />
            <Card>
                <CardHeader>
                    <Row>
                        <Col md={6}>
                            <h4 className="card-title">{t("Quoter")}</h4>
                            <p className="card-title-desc">{t("This form is official and must be filled out correctly")}</p>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                <Row>               
                      <Col md={4} style={{ textAlign: "left", }}>
                      <div className="mb-3">
                        <Label htmlFor="idnumber">Número, Nombre, Identificación</Label>
                        <InputGroup>
                      <input typeof='text' className="form-control"
                            name="clientDocumentId" type="text"/>
                          <div className="input-group-append">
                            <button
                              type="button" color="success"
                              className="btn btn-outline-secondary"
                            >
                              <i
                                className="fa fa-search"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </InputGroup>                        
                </div>
                        </Col>
                      <Col md={8} style={{ textAlign: "right" }}> 
                      <div class="mb-3">
                          <label class="">&nbsp;</label><br/>
                          <button onClick={()=>OpenCloseQuoter(true)} type="button" class="btn btn-primary"><i class="mdi mdi-calculator mdi-12px"></i> Nuevo</button>
                          </div>                                      
                      </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <div className="table-responsive styled-table-div">
                                <Table className="table table-striped table-hover styled-table">
                                    <thead>
                                        <tr>
                                            <th>{t("Numero")}</th>
                                            <th>{t("Nombre")}</th>
                                            <th>{t("Tipo Ident.")}</th>
                                            <th>{t("# Ident.")}</th>
                                            <th>{t("Monto Deuda")}</th>
                                            <th>{t("Tasa Anual")}</th>
                                            <th>{t("Feci")}</th>
                                            <th>{t("Plazo (Meses)")}</th>
                                            <th>{t("Monto Financiar")}</th>
                                            <th>{t("Letra Mensual")}</th>
                                            <th>{""}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{t("1")}</td>
                                            <td>{t("Hombres de Blanco")}</td>
                                            <td>{t("RUC")}</td>
                                            <td>{t("J77755514")}</td>
                                            <td>{t("$400,0000.00")}</td>
                                            <td>{t("7.5%")}</td>
                                            <td>{t("Si")}</td>
                                            <td>{t("35")}</td>
                                            <td>{t("$30,0000.00")}</td>
                                            <td>{t("$129.30")}</td>
                                            <td>{<i className="mdi mdi-eye mdi-24px" style={{cursor: "pointer"}}></i>}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            {showQuoter ?
        <ModalQuoterForm isOpen={showQuoter} toggle={() => { OpenCloseQuoter(!showQuoter) }} onCancel={() => { OpenCloseQuoter(false); }} />
        : null}

        </div>
    )
}

export default LoanQuoter;