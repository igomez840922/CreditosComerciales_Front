import React, { useState } from "react"
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Table,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

//i18n
import { withTranslation } from "react-i18next"

const ExposicionCorporativaCliente = (props) => {

    const [corporateExposureResults, setCorporateExposureResults] = useState([]);

    var data = [
        { description: 'Cliente 1', approved: 42000000, current: 40000000, proposed: 42000000, difference:"-", warrant: 46603023, ltv: 90 },
        { description: 'CP', approved: 14680400, current: 14680400, proposed: 14680400, difference: "-", warrant: 23290000, ltv: 63 },
        { description: 'LP', approved: 14680400, current: 14680400, proposed: 14680400, difference: "-", warrant: 23290000, ltv: 63 },
        { description: 'Cliente 2', approved: 42000000, current: 40000000, proposed: 42000000, difference:"-", warrant: 46603023, ltv: 90 },
        { description: 'CP', approved: 14680400, current: 14680400, proposed: 14680400, difference: "-", warrant: 23290000, ltv: 63 },
        { description: 'LP', approved: 14680400, current: 14680400, proposed: 14680400, difference: "-", warrant: 23290000, ltv: 63 },
        { description: 'Exposicion Bruta Comercial', approved: 14680400, current: 14680400, proposed: 14680400, difference: "-", warrant: 23290000, ltv: 63 },
        { description: 'Exposicion Bruta Consumo', approved: 14680400, current: 14680400, proposed: 14680400, difference: "-", warrant: 23290000, ltv: 63 },
        { description: 'Exposicion Bruta Grupo Económico', approved: 14680400, current: 14680400, proposed: 14680400, difference: "-", warrant: 23290000, ltv: 63 },
      ];    
      
    const dataRows = data.map((item, index) => (
        <tr key={'row-' + index}>
          <th scope="row">{item.description}</th>
          <td className="text-end">{ item.approved }</td>
          <td className="text-end">{ item.current }</td>
          <td className="text-end">{ item.proposed }</td>
          <td className="text-end">{ item.difference }</td>
          <td className="text-end">{ item.warrant }</td>
          <td className="text-end">{item.ltv + '%'}</td>
        </tr>)
      );
      
  return (
     
    <CardBody>
        <h4 className="card-title">{ props.t("CorporateExhibitionClient") }</h4>
        <p className="card-title-desc"></p>
        <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th></th>
                <th className="text-end">{ props.t("Approved") }</th>
                <th className="text-end">{ props.t("CurrentBalance") }</th>
                <th className="text-end">{ props.t("Proposed") }</th>
                <th className="text-end">{ props.t("Difference") }</th>
                <th className="text-end">{ props.t("Warranty") }</th>
                <th className="text-end">{ props.t("LTV") }</th>
              </tr>
            </thead>
            <tbody>
              {dataRows}
            </tbody>
          </Table>
        </div>
      </CardBody>    
    
  );

}


{/*DatosGenerales.propTypes = {
    onSelectIdPropuesta: PropTypes.func.isRequired
}*/}

export default (withTranslation()(ExposicionCorporativaCliente))
