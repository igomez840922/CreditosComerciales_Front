import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { translationHelpers } from "../../helpers";

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
  Table,
} from "reactstrap"

import CoreServices from '../../services/CoreServices/Services';
import { BackendServices } from "../../services";
import * as moment from 'moment';

const ModalReportingServices = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [customerNumberT24, setcustomerNumberT24] = useState(null);

  const backendServices = new BackendServices();
  const coreServices = new CoreServices();

  const [dataLocation, setData] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));


  useEffect(() => {

    // const partyId = "600133774";
    const transactionId = dataLocation.transactionId;

    Promise.allSettled([
      backendServices.consultPrincipalDebtor(transactionId)
    ]).then(resp => {
      const [{ value: PrincipalDebtor }] = resp;
       console.log('fetchProspect', PrincipalDebtor);
      fetchReportingServices(PrincipalDebtor.customerNumberT24);
    });

  }, []);

  function fetchProspect(transactionId) {
    return backendServices.consultPrincipalDebtor(transactionId)
      .then(resp => {
        // console.log('prospecto', resp);
        setcustomerNumberT24(resp.customerNumberT24);
        return resp.customerNumberT24;
      })
      .catch((error) => {
        console.error('error fetching prospect', error);
      })
  }

  function fetchReportingServices(customerNumberT24) {

    //console.log("fetchReportingServices",customerNumberT24,coreServices);
    coreServices.getReportingServices(customerNumberT24)
      .then((reportingServices) => {
        console.log('getReportingServices', reportingServices);
        if (!reportingServices || !reportingServices.Status) {
          throw new Error('Error Fetching Data');
        }
        if (reportingServices.Status.StatusCode !== "M0000") {
          throw new Error('Invalid Status Response');
        }
        setRecords(reportingServices.records);

        for( const field of reportingServices.records ) {
          if(field["CATEGORIA_CAMBIO"] === "03"){
            props.hasChangeCategory();
          }
        }      

      })
      .catch((error) => {
        console.error('error fetching reporting services', error);
      });
  }

  const fields = [
    { key: 'FECHA', label: 'FECHA', type: 'date' },
    { key: 'T_CREDITO', label: 'T_CREDITO', type: 'text' },
    { key: 'T_FACILIDAD', label: 'T_FACILIDAD COSTO', type: 'text' },
    { key: 'CLASIFICACION', label: 'CLASIFICACION', type: 'text' },
    { key: 'LOC_EXT', label: 'LOC_EXT', type: 'text' },
    { key: 'REGION', label: 'REGION', type: 'text' },
    { key: 'CLIENTE_RUC', label: 'CLIENTE_RUC', type: 'text' },
    { key: 'TNO_EMPRESA', label: 'TNO_EMPRESA', type: 'text' },
    { key: 'NOMBRE_CLIENTE', label: 'NOMBRE_CLIENTE', type: 'text' },
    { key: 'GRUPO_ECON', label: 'GRUPO_ECON', type: 'text' },
    { key: 'GRUPO_RUC', label: 'GRUPO_RUC', type: 'text' },
    { key: 'T_RELACION', label: 'T_RELACION', type: 'text' },
    { key: 'ACT_ECON', label: 'ACT_ECON', type: 'text' },
    { key: 'TASA_INT', label: 'TASA_INT', type: 'number' },
    { key: 'MONTO_IN', label: 'MONTO_IN', type: 'number' },
    { key: 'INT_PC', label: 'INT_PC', type: 'number' },
    { key: 'FECHA_INI', label: 'FECHA_INI', type: 'date' },
    { key: 'FECHA_FIN', label: 'FECHA_FIN', type: 'date' },
    { key: 'FECHA_REFIN', label: 'FECHA_REFIN', type: 'date' },
    { key: 'FECHA_RENEG', label: 'FECHA_RENEG', type: 'date' },
    { key: 'G1', label: 'G1', type: 'text' },
    { key: 'MONTO_G1', label: 'MONTO_G1', type: 'number' },
    { key: 'G2', label: 'G2', type: 'text' },
    { key: 'MONTO_G2', label: 'MONTO_G2', type: 'number' },
    { key: 'G3', label: 'G3', type: 'text' },
    { key: 'MONTO_G3', label: 'MONTO_G3', type: 'number' },
    { key: 'G4', label: 'G4', type: 'text' },
    { key: 'MONTO_G4', label: 'MONTO_G4', type: 'number' },
    { key: 'G5', label: 'G5', type: 'text' },
    { key: 'MONTO_G5', label: 'MONTO_G5', type: 'number' },
    { key: 'PROV_REG', label: 'PROV_REG', type: 'number' },
    { key: 'PROV_NIIF', label: 'PROV_NIIF', type: 'number' },
    { key: 'PROV_PAIS', label: 'PROV_PAIS', type: 'number' },
    { key: 'SALDO', label: 'SALDO', type: 'number' },
    { key: 'N_CUOTAS_VENCER', label: 'N_CUOTAS_VENCER', type: 'text' },
    { key: 'X_VENCER30', label: 'X_VENCER30', type: 'number' },
    { key: 'X_VENCER60', label: 'X_VENCER60', type: 'number' },
    { key: 'X_VENCER90', label: 'X_VENCER90', type: 'number' },
    { key: 'X_VENCER120', label: 'X_VENCER120', type: 'number' },
    { key: 'X_VENCER180', label: 'X_VENCER180', type: 'number' },
    { key: 'X_VENCER1A', label: 'X_VENCER1A', type: 'number' },
    { key: 'X_VENCER5A', label: 'X_VENCER5A', type: 'number' },
    { key: 'X_VENCER10A', label: 'X_VENCER10A', type: 'number' },
    { key: 'X_VENCERM10A', label: 'X_VENCERM10A', type: 'number' },
    { key: 'N_CUOTA_VENCIDAS', label: 'N_CUOTA_VENCIDAS', type: 'text' },
    { key: 'VENCIDOS30', label: 'VENCIDOS30', type: 'number' },
    { key: 'VENCIDOS60', label: 'VENCIDOS60', type: 'number' },
    { key: 'VENCIDOS90', label: 'VENCIDOS90', type: 'number' },
    { key: 'VENCIDOS120', label: 'VENCIDOS120', type: 'number' },
    { key: 'VENCIDOS180', label: 'VENCIDOS180', type: 'number' },
    { key: 'VENCIDOS1A', label: 'VENCIDOS1A', type: 'number' },
    { key: 'VENCIDOSM1A', label: 'VENCIDOSM1A', type: 'number' },
    { key: 'RANGO_MORA', label: 'RANGO_MORA', type: 'text' },
    { key: 'DIAS_MORA', label: 'DIAS_MORA', type: 'number' },
    { key: 'PROX_CAP', label: 'PROX_CAP', type: 'date' },
    { key: 'PER_CAP', label: 'PER_CAP', type: 'text' },
    { key: 'PROX_INT', label: 'PROX_INT', type: 'date' },
    { key: 'PER_INT', label: 'PER_INT', type: 'text' },
    { key: 'CUOTA_XPAGAR', label: 'CUOTA_XPAGAR', type: 'number' },
    { key: 'SUCURSAL', label: 'SUCURSAL', type: 'text' },
    { key: 'MONEDA', label: 'MONEDA', type: 'text' },
    { key: 'CUENTA_CONTABLE', label: 'CUENTA_CONTABLE', type: 'text' },
    { key: 'PRODUCTO', label: 'PRODUCTO', type: 'text' },
    { key: 'BANCA', label: 'BANCA', type: 'text' },
    { key: 'SECTOR1', label: 'SECTOR1', type: 'text' },
    { key: 'SECTOR2', label: 'SECTOR2', type: 'text' },
    { key: 'SECTOR3', label: 'SECTOR3', type: 'text' },
    { key: 'SECTOR4', label: 'SECTOR4', type: 'text' },
    { key: 'PRODUCTO1', label: 'PRODUCTO1', type: 'text' },
    { key: 'PRODUCTO2', label: 'PRODUCTO2', type: 'text' },
    { key: 'PRODUCTO3', label: 'PRODUCTO3', type: 'text' },
    { key: 'NUM_OPS', label: 'NUM_OPS', type: 'text' },
    { key: 'NUM_CLIENTE', label: 'NUM_CLIENTE', type: 'text' },
    { key: 'CENTRO_COSTO', label: 'CENTRO_COSTO', type: 'text' },
    { key: 'NUM_LINEA', label: 'NUM_LINEA', type: 'text' },
    { key: 'COD_OFIC', label: 'COD_OFIC', type: 'text' },
    { key: 'COD_OFIC2', label: 'COD_OFIC2', type: 'text' },
    { key: 'INGRESO', label: 'INGRESO', type: 'text' },
    { key: 'SEGMENTO', label: 'SEGMENTO', type: 'text' },
    { key: 'TIPO_PAGO', label: 'TIPO_PAGO', type: 'text' },
    { key: 'PUNTAJE', label: 'PUNTAJE', type: 'number' },
    { key: 'FECHA_ULT_PAGO_CAPITAL', label: 'FECHA_ULT_PAGO_CAPITAL', type: 'date' },
    { key: 'CATEGORIA_CAMBIO', label: 'CATEGORIA_CAMBIO', type: 'text' },
    { key: 'MONTO_ULT_PAGO_CAPITAL', label: 'MONTO_ULT_PAGO_CAPITAL', type: 'number' },
    { key: 'FECHA_ULT_PAGO_INTERES', label: 'FECHA_ULT_PAGO_INTERES', type: 'date' },
    { key: 'MONTO_ULT_PAGO_INTERES', label: 'MONTO_ULT_PAGO_INTERES', type: 'number' },
    { key: 'STAGE', label: 'STAGE', type: 'number' },
    { key: 'PROXIMO_CAP_HIST', label: 'PROXIMO_CAP_HIST', type: 'date' },
    { key: 'PROXIMO_INT_HIS', label: 'PROXIMO_INT_HIS', type: 'date' },
  ];

  const cellAlign = (type) => {
    return type === 'number' ? 'text-end' : ''
  };

  const formatCell = (value, type) => {
    switch (type) {
      case 'date':
        const m = moment(value, 'YYYYMMDD');
        return m.format('DD/MM/YYYY');
      default:
        return value;
    }
  }

  const headerRow = (<tr>
    {fields.map((field, index) => <th key={index} className={cellAlign(field.type)}>{field.label}</th>)}
  </tr>);

  const rows = records.map((record, index) => {

    const cols = fields.map((field) => (
      <td key={index} className={cellAlign(field.type)}>{formatCell(record[field.key], field.type)}</td>
    ));

    return (<tr key={index}>
      {cols}
    </tr>)
  })

  return (
    <Modal isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
      size="xl">

      <ModalHeader toggle={props.toggle} color="primary">{t("Reporting Services")}</ModalHeader>

      <ModalBody>
        <Row className="mt-2">
          <Col xl="12">
            <Table responsive>
              <thead className="table-light">
                {headerRow}
              </thead>
              <tbody>
                {rows}
              </tbody>
            </Table>
          </Col>
        </Row>
      </ModalBody>
    </Modal>);

};

ModalReportingServices.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  hasChangeCategory: PropTypes.func,
  // onSelectClient: PropTypes.func.isRequired
};

export default ModalReportingServices;
