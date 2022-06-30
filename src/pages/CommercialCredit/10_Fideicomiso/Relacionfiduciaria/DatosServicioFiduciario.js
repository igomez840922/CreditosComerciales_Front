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


const DatosServicioFiduciario = (props) => {
  React.useEffect(() => {
    // SumTotal();
    if (props.ServiciosFiduciario?.guaranteetrust) {
      SumTotal();
    }
  }, [props.ServiciosFiduciario]);
  const results = [
    // { id: 1, comentario: "Fideicomiso de Garantia" },
    // { id: 2, comentario: "Fideicomiso de  Administracion" },
    // { id: 3, comentario: "Fideicomiso de  Inversión " },
    // { id: 4, comentario: "Fideicomiso patrimonial y Testamento" },
    // { id: 5, comentario: "Escrow account (Deposito en Plica)" },
    // { id: 6, comentario: "Otros especifique" },
    // { id: 7, comentario: "TOTAL " }
  ];

  const [Total, setTotal] = useState(0);
  const [guaranteetrust, setguaranteetrust] = useState(0);
  const [administrationTrust, setadministrationTrust] = useState(0);
  const [investmentTrust, setinvestmentTrust] = useState(0);
  const [stateTrust, setstateTrust] = useState(0);
  const [scrowAccount, setscrowAccount] = useState(0);
  const [others, setothers] = useState(0);

  // const dataRows = results.map((data) => (
  // <tr key={data.id}>
  //   <td>{data.comentario}</td>
  //   {data.comentario === "Otros especifique" && (
  //     <th scope="row">
  //       <input className="form-control" type="text" />
  //     </th>
  //   )}
  //   {data.comentario !== "Otros especifique" &&
  //     (<td></td>)}
  //   <th scope="row">
  //     <input className="form-control" type="text" />
  //   </th>
  // </tr>)
  // );
  const currencyData = new Currency();



  function SumTotal() {

    setTotal((
      (+currencyData.getRealValue(document.getElementById('guaranteetrust').value)) +
      (+currencyData.getRealValue(document.getElementById('administrationTrust').value)) +
      (+currencyData.getRealValue(document.getElementById('investmentTrust').value)) +
      (+currencyData.getRealValue(document.getElementById('stateTrust').value)) +
      (+currencyData.getRealValue(document.getElementById('scrowAccount').value)) +
      (+currencyData.getRealValue(document.getElementById('others').value))))
  }

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
                  <tr key={10}>

                    <th>{props.t("TypeofTrustService")}</th>
                    <th></th>
                    <th>{props.t("Amount")}</th>

                  </tr>
                </thead>
                <tbody>
                  <tr key={1}>
                    <td>{props.t("GuaranteeTrust")}</td>

                    <th scope="row">
                    </th>
                    <th scope="row">
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="guaranteetrust"
                        onKeyPress={(e) => { return OnlyNumber(e) }}
                        pattern="^[0-9,.]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        type="text"
                        id="guaranteetrust"
                        onChange={(e) => { SumTotal() }}
                        value={currencyData.format(props.ServiciosFiduciario?.guaranteetrust ?? 0)}
                      />
                    </th>

                  </tr>

                  <tr key={2}>
                    <td>{props.t("AdministrationTrust")}</td>

                    <th scope="row">
                    </th>

                    <th scope="row">
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="administrationTrust"
                        onKeyPress={(e) => { return OnlyNumber(e) }}
                        pattern="^[0-9,.]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        type="text"
                        id="administrationTrust"
                        onChange={(e) => { SumTotal() }}
                        value={currencyData.format(props.ServiciosFiduciario?.administrationTrust ?? 0)}
                      />
                    </th>

                  </tr>

                  <tr key={3}>
                    <td>{props.t("InvestmentTrust")}</td>

                    <th scope="row">
                    </th>

                    <th scope="row">
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="investmentTrust"
                        onKeyPress={(e) => { return OnlyNumber(e) }}
                        pattern="^[0-9,.]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        type="text"
                        id="investmentTrust"
                        onChange={(e) => { SumTotal() }}
                        value={currencyData.format(props.ServiciosFiduciario?.investmentTrust ?? 0)}
                      />
                    </th>

                  </tr>

                  <tr key={4}>
                    <td>{props.t("EstateTrustAndWill")}</td>

                    <th scope="row">
                    </th>

                    <th scope="row">
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="stateTrust"
                        onKeyPress={(e) => { return OnlyNumber(e) }}
                        pattern="^[0-9,.]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        type="text"
                        id="stateTrust"
                        onChange={(e) => { SumTotal() }}
                        value={currencyData.format(props.ServiciosFiduciario?.stateTrust ?? 0)}
                      />
                    </th>

                  </tr>


                  <tr key={5}>
                    <td>{props.t("EscrowAccount")}</td>

                    <th scope="row">
                    </th>

                    <th scope="row">
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="scrowAccount"
                        onKeyPress={(e) => { return OnlyNumber(e) }}
                        pattern="^[0-9,.]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        type="text"
                        id="scrowAccount"
                        onChange={(e) => { SumTotal() }}
                        value={currencyData.format(props.ServiciosFiduciario?.scrowAccount ?? 0)}
                      />
                    </th>

                  </tr>

                  <tr key={6}>
                    <td>{props.t("OthersSpecify")}</td>

                    <th scope="row">
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="description"
                        type="text"
                        id="description"
                        // value={currencyData.format(props.ServiciosFiduciario?.description ?? 0)}
                        value={props.ServiciosFiduciario?.description ?? ''}
                      />
                    </th>

                    <th scope="row">
                      <AvField
                        disabled={props?.preview ?? false}
                        className="form-control"
                        name="others"
                        onKeyPress={(e) => { return OnlyNumber(e) }}
                        pattern="^[0-9,.]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        type="text"
                        id="others"
                        onChange={(e) => { SumTotal() }}
                        value={currencyData.format(props.ServiciosFiduciario?.others ?? 0)}
                      />
                    </th>

                  </tr>

                  <tr key={7}>
                    <td>TOTAL</td>

                    <th scope="row">
                    </th>

                    <th scope="row">
                      <AvField
                        className="form-control"
                        name="total"
                        type="text"
                        id="total"
                        disabled={true}
                        value={`$${(currencyData.format(Total))}`}
                      />
                    </th>

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

export default (withTranslation()(DatosServicioFiduciario));