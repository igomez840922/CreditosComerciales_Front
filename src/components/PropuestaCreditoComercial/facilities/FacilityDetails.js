import PropTypes from 'prop-types';
import { translationHelper } from '../../../helpers';

import {
  Table,
  Card,
  CardBody,
} from "reactstrap"


const FacilityDetails = (props) => {

  const [t, c] = translationHelper('propuesta_credito');

  return (
    <Card>
      <CardBody>
        <h4 className="card-title">{ t("Facility Details") }</h4>
        <p className="card-title-desc"></p>
        <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>{ t("Number Ordinal") }</th>
                <th>{ t("CR") }</th>
                <th>{ t("Amount") }</th>
                <th>{ t("Debtors") }</th>
                <th>{ t("Identity Type") }</th>
                <th>{ t("Identity Number") }</th>
                <th>{ t("Balance") }</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>N</td>
                <td></td>
                <td>TOVA, S.A.</td>
                <td>RUC</td>
                <td>0065219-0068-00360495</td>
                <td>$0</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

FacilityDetails.propTypes = {
};

export default FacilityDetails;
