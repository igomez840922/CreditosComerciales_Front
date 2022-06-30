import React, { useState, useEffect } from "react"
import { withTranslation } from "react-i18next"
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Table,
  CardFooter
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"


import { translationHelpers } from '../../../helpers';
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"

import { Link } from "react-router-dom"

const InboxPage = (props) => {


  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [t, c] = translationHelpers('translation', 'common');

  

  return (
    <React.Fragment>
      <AvForm id="frmSearch" className="needs-validation" >
        <div className="page-content">

          <Breadcrumbs title={t("CommercialCredit")} breadcrumbItem={t("Garantias")} />

          <Card>
            <CardBody>

              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <td colSpan={2}> <h4 className="card-title">{t("Garantias")}</h4>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><Link to={{
              pathname: "/creditocomercial/AdminDesembolso/GarantiasMuebles",
            }}>GarantiasMuebles</Link></td>
                  </tr>
                  <tr>
                  <td><Link to={{
              pathname: "/creditocomercial/AdminDesembolso/GarantiaEquiposNuevosyUsados",
            }}>GarantiaEquiposNuevosyUsados</Link></td>
                  </tr>
                  <tr>
                  <td><Link to={{
              pathname: "/creditocomercial/AdminDesembolso/GarantiaBienInmueble",
            }}>GarantiaBienInmueble</Link></td>
                  </tr>
                  <tr>
                  <td><Link to={{
              pathname: "/creditocomercial/AdminDesembolso/Pignoracion",
            }}>Pignoracion</Link></td>
                  </tr>  
                  <tr>
                  <td><Link to={{
              pathname: "/creditocomercial/AdminDesembolso/OtrasGarantias",
            }}>OtrasGarantias</Link></td>
                  </tr>                
                  <tr>
                  <td><Link to={{
              pathname: "/creditocomercial/AdminDesembolso/MantenimientoLinea",
            }}>MantenimientoLinea</Link></td>
                  </tr>
                  <tr>
                  <td><Link to={{
              pathname: "/creditocomercial/AdminDesembolso/CreacionLinea",
            }}>CreacionLinea</Link></td>
                  </tr>
                 
                </tbody>
              </Table>

              

            </CardBody>
            <CardFooter style={{ textAlign: "right" }}>
              <Button id="btnSearch" color="negative" type="button" style={{ margin: '5px' }} onClick={() => { }}><i className="mdi mdi-call-missed mid-12px"></i>
                {" "} {props.t("Refuse")}</Button>
              <Button color="success" type="button" onClick={() => { }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {props.t("Continue")}</Button>
            </CardFooter>
          </Card>

        </div>
      </AvForm>
    </React.Fragment>
  );

}


export default (withTranslation()(InboxPage));
