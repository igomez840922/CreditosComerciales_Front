import PropTypes from 'prop-types';
import { formatCurrency, translationHelper } from '../../../helpers';

import {
  Table,
} from "reactstrap"



const Budgets = (props) => {

  const t = translationHelper('financial_report');

  // Budgets
  const rows = props.items.map((budget) => (
    <tr key={ "row-budget-" + budget.id }>
      <td>{ budget.description }</td>
      <td className="text-end">{ formatCurrency('$', budget.value) }</td>
    </tr>
  ));
  const totalBudget = props.items.reduce((total, current) => total + current.value, 0);
  const totalRow = (
    <tr className="table-info"> 
      <th>{ t("Total").toLocaleUpperCase() }</th>
      <th className="text-end">{ formatCurrency('$', totalBudget) }</th>
    </tr>
  );

  return (
    <div className="table-responsive">
      <Table className="table mb-0">
        <thead className="table-light">
          <tr>
            <th>{ t("Capex.Budget") }</th>
            <th className="text-end">{ t("Amount") }</th>
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

Budgets.propTypes = {
  items: PropTypes.array
};

Budgets.defaultProps = {
  items: []
};

export default Budgets;
