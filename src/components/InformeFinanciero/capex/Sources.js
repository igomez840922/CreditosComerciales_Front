import PropTypes from 'prop-types';
import { formatCurrency, translationHelper } from '../../../helpers';

import {
  Table,
} from "reactstrap"



const Sources = (props) => {

  const t = translationHelper('financial_report');

  // Sources
  const rows = props.items.map((source) => (
    <tr key={ "row-source-" + source.id }>
      <td>{ source.description }</td>
      <td className="text-end">{ formatCurrency('$', source.usage, 0) }</td>
      <td className="text-end">{ formatCurrency('$', source.shareholders, 0) }</td>
      <td className="text-end">{ formatCurrency('$', source.bank, 0) }</td>
    </tr>
  ));

  const totals = props.items.reduce((total, source) => {
    return [total[0] + source.usage, total[1] + source.shareholders, total[2] + source.bank];
  }, [0, 0, 0]);

  const totalRow = (
    <tr className="table-info">
      <th>{ t("Total").toLocaleUpperCase() }</th>
      <th className="text-end">{ formatCurrency('$', totals[0]) }</th>
      <th className="text-end">{ formatCurrency('$', totals[1]) }</th>
      <th className="text-end">{ formatCurrency('$', totals[2]) }</th>
    </tr>
  );

  return (
    <div className="table-responsive">
      <Table className="table mb-0" bordered>
        <thead className="table-light">
          <tr>
            <th>{ t("Description") }</th>
            <th className="text-end">{ t("Capex.Usage") }</th>
            <th colSpan="2">{ t("Capex.Sources") }</th>
          </tr>
          <tr>
            <th>&nbsp;</th>
            <th>&nbsp;</th>
            <th>{ t("Capex.Shareholders") }</th>
            <th>{ t("Capex.Bank") }</th>
          </tr>
        </thead>
        <tbody>
          { rows }
          { totalRow }
        </tbody>
      </Table>
    </div>
  );

};

Sources.propTypes = {
  items: PropTypes.array
};

Sources.defaultProps = {
  items: []
};

export default Sources;
