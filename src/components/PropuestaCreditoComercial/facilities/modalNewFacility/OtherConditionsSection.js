import React, { useState } from "react"
import { translationHelpers } from '../../../../helpers/translation-helper';
import { Link } from "react-router-dom"

import { AvField, AvGroup } from "availity-reactstrap-validation"

import {
  Row,
  Col,
  Table,
  Button,
  Alert
} from "reactstrap"


const OtherConditionsList = (props) => {

  const [displayModal, setDisplayModal] = useState(false);

  function handleAdd() {
    setDisplayModal(true);
  }

  function toggleModal() {
    setDisplayModal(!displayModal);
  }

  if( !props.items ) {
    return null;
  }

  const [t, c] = translationHelpers('commercial_credit', 'common');

  const emptyResultsMessage = (<Alert color="warning" className="my-2">{ t("No Other Condition Message") }</Alert>);

  const displayTable = props.items.length > 0;

  const dataRows = props.items.map((item, index) => {
    return (<tr key={ 'row-condition-' + index }>
      <td>{ item.type }</td>
      <td>{ item.description }</td>
      <td></td>
    </tr>)
  });

  return (
    <React.Fragment>
      <h5>{ t("OtherConditions") }</h5>
      
      <Row>
      <Col md="12">
        <AvGroup className="mb-3">
          
          <AvField
            className="form-control"
            name="otherConditions"
            // value={props.dataSet.otherConditions}
            type="textarea"
            id="otherConditions"
            rows="4" />
        </AvGroup>
      </Col>
    </Row>

    </React.Fragment>
  );

};



const OtherConditionsSection = (props) => {

  return (
    <>
      <OtherConditionsList items={ props.otherconditions } onSave={ props.onSaveOtherConditions } />
    </>
  );
};

export default OtherConditionsSection;
