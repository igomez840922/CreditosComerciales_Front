import PropTypes from 'prop-types';
import { formatCurrency, translationHelper } from '../../../helpers';

import {
  Table,
} from "reactstrap"



const BackgroundList = (props) => {

  const t = translationHelper('financial_report');

  // Headers
  const headers = props.items?.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));

  // Background Items
  const rows = props.items.data.map((item) => (
    <tr key={"row-background-" + item.id}>
      <td>{item.description}</td>
      {item.values.map((value, index) => (
        <td key={index} className="text-end">{formatCurrency('$', value, 0)}</td>
      ))}
    </tr>
  ));

  return (
    <div className="table-responsive">
      <Table className="table mb-0">
        <thead className="table-light">
          <tr>
            <th>{t("Background.Period")}</th>
            {headers}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </div>
  );

};

BackgroundList.propTypes = {
  items: PropTypes.object
};

BackgroundList.defaultProps = {
  items: {}
};

export default BackgroundList;
