import PropTypes from 'prop-types';
import { translationHelper } from '../../helpers';

import {
  Table,
  Card,
  CardBody,
} from "reactstrap"
import React from 'react';
import HeaderSections from '../Common/HeaderSections';


const ChangeSummary = (props) => {

  if (!props.items) {
    return null;
  }

  const dataRows = [];

  for (let i = 0; i < props.items.length; i += 2) {
    const leftItem = props.items[i];
    const rightItem = props.items[i + 1];
    if (leftItem && rightItem) {
      dataRows.push(<tr key={'row-' + i}>
        <td>{leftItem.description}</td>
        <td>{rightItem.description}</td>
      </tr>);
    }
    else if (leftItem) {
      dataRows.push(<tr key={'row-' + i}>
        <td>{leftItem.description}</td>
        <td></td>
      </tr>);
    }
  }

  const t = translationHelper('commercial_credit');

  return (
    <React.Fragment>
      <>
        <CardBody>
          <HeaderSections title={props.title} t={t}></HeaderSections>
          <div className="table-responsive">
            <Table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th width="50%">&nbsp;</th>
                  <th width="50%">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {dataRows}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </>
    </React.Fragment>
  );
};

ChangeSummary.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array.isRequired
}

export default ChangeSummary;
