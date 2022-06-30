import PropTypes from 'prop-types';
import { formatCurrency, translationHelper } from '../../../helpers';

import {
  Table,
} from "reactstrap"



const Projects = (props) => {

  const t = translationHelper('financial_report');

  // Projects
  const rows = props.items.map((project) => (
    <tr key={ "row-project-" + project.id }>
      <td>{ project.description }</td>
      <td className="text-end">{ formatCurrency('$', project.value) }</td>
    </tr>
  ));

  const total = props.items.reduce((total, current) => total + current.value, 0);

  const totalRow = (
    <tr className="table-info">
      <th>{ t("Total").toLocaleUpperCase() }</th>
      <th className="text-end">{ formatCurrency('$', total) }</th>
    </tr>
  );

  return (
    <div className="table-responsive">
      <Table className="table mb-0">
        <thead className="table-light">
          <tr>
            <th>{ t("Capex.ProjectDetails") }</th>
            <th className="text-end">{ t("Value") }</th>
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

Projects.propTypes = {
  items: PropTypes.array
};

Projects.defaultProps = {
  items: []
};

export default Projects;
