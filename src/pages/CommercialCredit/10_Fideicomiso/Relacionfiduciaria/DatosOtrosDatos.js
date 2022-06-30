import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import React, { useState } from "react"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"


import {
  Table,
  Card,
  CardBody,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardFooter,
  Button,
  Row,
  Col,
} from "reactstrap"
import Currency from '../../../../helpers/currency';
import { OnlyNumber } from '../../../../helpers/commons';



const DatosOtrosDatos = (props) => {
  //     const results = [
  //         { id: 1, comentario:"Propuesta" },
  //         { id: 2, comentario:"Propósito" },
  //         { id: 3, comentario:"Tipos de Activos Fijos" },
  //         { id: 4, comentario:"Descripción" },
  //         { id: 5, comentario:"Comisión Estructuración" },
  //         { id: 6, comentario:"Comisión Administración" },
  //         { id: 6, comentario:"Plazo" },
  //         { id: 6, comentario:"Forma de Pagos" },
  //         { id: 7, comentario:"Otras Condiciones" },

  //       ];

  //       const dataRows = results.map((data) => (
  //         <tr key={ data.id }>
  //            <td>{ data.comentario }</td>
  //            <td></td>
  //         <td>
  //         <input className="form-control" type="text"/>
  //             </td>
  //         </tr>)
  //       );

  const currencyData = new Currency();

  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 45) {
      e.preventDefault();
      return true;
    }

    return false;
  }


  return (
    <React.Fragment>

      <CardBody>
        <Row>
          <Col lg="12">
            <div className="table-responsive">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>

                    <th>{props.t("Otherdata")}</th>
                    <th></th>
                    <th>{props.t("Amount")}</th>

                  </tr>
                </thead>
                <tbody>
                  <tr key={1}>
                    <td>{props.t("Proposal")}</td>
                    <td></td>
                    <td>
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="proposal"
                        type="text"
                        id="proposal"
                        // onKeyPress={(e) => { return check(e) }}
                        // pattern="^[0-9,.]*$"
                        // onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        // value={currencyData.format(props.OtherServiciosFiduciario?.proposal ?? 0)}
                        value={props.OtherServiciosFiduciario?.proposal ?? ''}
                      />
                    </td>
                  </tr>

                  <tr key={2}>
                    <td>{props.t("Purpose")}</td>
                    <td></td>
                    <td>
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="purpose"
                        type="text"
                        id="purpose"
                        value={props.OtherServiciosFiduciario?.purpose ?? ''}
                      />
                    </td>
                  </tr>

                  <tr key={3}>
                    <td>{props.t("TypesOfFixedAssets")}</td>
                    <td></td>
                    <td>
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="fixedActiveType"
                        // onKeyPress={(e) => { return check(e) }}
                        // pattern="^[0-9,.]*$"
                        // onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        // value={currencyData.format(props.OtherServiciosFiduciario?.fixedActiveType ?? 0)}
                        value={props.OtherServiciosFiduciario?.fixedActiveType ?? ''}
                        type="text"
                        id="fixedActiveType"
                      />
                    </td>
                  </tr>

                  <tr key={4}>
                    <td>{props.t("Description")}</td>
                    <td></td>
                    <td>
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="descriptionOtherServiciosFiduciario"
                        // onKeyPress={(e) => { return check(e) }}
                        // pattern="^[0-9,.]*$"
                        // onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        // value={currencyData.format(props.OtherServiciosFiduciario?.description ?? 0)}
                        value={props.OtherServiciosFiduciario?.description ?? ''}
                        type="text"
                        id="descriptionOtherServiciosFiduciario"
                      />
                    </td>
                  </tr>

                  <tr key={5}>
                    <td>{props.t("StructuringCommission")}</td>
                    <td></td>
                    <td>
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="structureCommission"
                        onKeyPress={(e) => { return OnlyNumber(e) }}
                        pattern="^[0-9,.]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        type="text"
                        id="structureCommission"
                        value={currencyData.format(props.OtherServiciosFiduciario?.structureCommission ?? 0)}
                      />
                    </td>
                  </tr>

                  <tr key={6}>
                    <td>{props.t("AdministrationCommission")}</td>
                    <td></td>
                    <td>
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="administrationCommision"
                        onKeyPress={(e) => { return OnlyNumber(e) }}
                        pattern="^[0-9,.]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        type="text"
                        id="administrationCommision"
                        value={currencyData.format(props.OtherServiciosFiduciario?.administrationCommision ?? 0)}
                      />
                    </td>
                  </tr>

                  <tr key={7}>
                    <td>{props.t("Term")}</td>
                    <td></td>
                    <td>
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="term"
                        type="text"
                        id="term"
                        // onKeyPress={(e) => { return OnlyNumber(e) }}
                        // pattern="^[0-9,.]*$"
                        // onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        value={currencyData.format(props.OtherServiciosFiduciario?.term ?? 0)}
                      />
                    </td>
                  </tr>

                  <tr key={8}>
                    <td>{props.t("FormOfPayments")}</td>
                    <td></td>
                    <td>
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="paymentType"
                        type="text"
                        id="paymentType"
                        // onKeyPress={(e) => { return OnlyNumber(e) }}
                        // pattern="^[0-9,.]*$"
                        // onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        value={props.OtherServiciosFiduciario?.paymentType}
                      />
                    </td>
                  </tr>

                  <tr key={9}>
                    <td>{props.t("OtherConditions")}</td>
                    <td></td>
                    <td>
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="othersOtherServiciosFiduciario"
                        // onKeyPress={(e) => { return check(e) }}
                        // pattern="^[0-9,.]*$"
                        // onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        // value={currencyData.format(props.OtherServiciosFiduciario?.others ?? 0)}
                        value={props.OtherServiciosFiduciario?.others ?? ''}
                        type="text"
                        id="othersOtherServiciosFiduciario"
                      />
                    </td>
                  </tr>

                </tbody>
              </Table>

            </div>
          </Col>
        </Row>
      </CardBody>

    </React.Fragment>
  );
}

export default (withTranslation()(DatosOtrosDatos));