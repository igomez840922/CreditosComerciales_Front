import PropTypes from 'prop-types';
import { translationHelper } from '../../../helpers';

import {
  Table,
} from "reactstrap"


const RestructuringDetails = (props) => {

  const t = translationHelper('financial_report');

  // Headers
  const headers = (
    <tr>
      <th>{t("Date")}</th>
      {props.headers.map(header => (<th>{header}</th>))}
    </tr>
  );

  // Items
  const rows = props.data.map((item, index) => (
    <tr key={"row-restructuring-" + index}>
      <td>{item.description}</td>
      {item.values.map((value) => (<td>{value}</td>))}
    </tr>
  ));

  return (
    <div className="table-responsive">
      <h5>{t("RestructuringDetails.Title")}</h5>
      <Table className="table mb-0">
        <thead className="table-light">
          {headers}
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </div>
  );

};

RestructuringDetails.propTypes = {
  headers: PropTypes.array,
  data: PropTypes.array
};

RestructuringDetails.defaultProps = {
  headers: [],
  data: []
};

export default RestructuringDetails;
