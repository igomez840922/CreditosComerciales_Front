import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers, formatDate } from '../../helpers';
import { Link } from "react-router-dom"

import {
  Table,
} from "reactstrap"

import ModalNewAttachment from "./ModalNewCheckListItem";

const CheckList = (props) => {

  const [displayModal, setDisplayModal] = useState(false);

  if (!props.items) {
    return null;
  }

  function toggleModal() {
    setDisplayModal(!displayModal);
  }

  const [t, c] = translationHelpers('commercial_credit', 'common');

  const dataRows = props.items.map((item, index) => (
    <tr key={'row-checklist-' + index}>
      <th scope="row">{ item.requerido ? c("Yes") : c("No") }</th>
      <td>{ item.descripcion }</td>
      <td>{ item.exception ? c("Yes") : c("No") }</td>
      <td>{ item.fechaExpiracion ? formatDate(item.fechaExpiracion, 'dd-mmm-yyyy') : '' }</td>
      <td>{ item.comentarios }</td>
      <td className="text-end">
        <Link to="/view" style={{ margin: '5px' }}><i className="mdi mdi-eye mdi-24px"></i></Link> | <Link to="#" onClick={ setDisplayModal(true) }><i className="mdi mdi-border-color mdi-24px"></i></Link>
      </td>
    </tr>)
  );

  return (
    <React.Fragment>
      <h5>{props.title}</h5>
      <p className="card-title-desc">
      </p>

      <div className="table-responsive mt-2">
        <Table className="table mb-0">
          <thead className="table-light">
            <tr>
              <th>{ t("Required") }</th>
              <th>{ t("Description") }</th>
              <th>{ t("Exception") }</th>
              <th>{ t("Expiration") }</th>
              <th>{ t("Comments") }</th>
              <th className="text-center">{ t("Attachment") }</th>
            </tr>
          </thead>
          <tbody>
            {dataRows}
          </tbody>
        </Table>
      </div>

      {displayModal?
      <ModalNewAttachment isOpen={ displayModal } toggle={ toggleModal } onSave={ props.onSaveItem } />
      :null}
      
    </React.Fragment>

  );
};

CheckList.propTypes = {
  items: PropTypes.array.isRequired,
  onSaveItem: PropTypes.func
};

export default CheckList;
