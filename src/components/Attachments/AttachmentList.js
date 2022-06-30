import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { translationHelpers } from "../../helpers";

import {
  Table,
  Button
} from "reactstrap"

import ModalAttachments from './ModalAttachments';



const AttachmentList = (props) => {

  const [displayModal, setDisplayModal] = useState(false);

  const [t, c] = translationHelpers('translation', 'common');

  const { attachments, editMode } = props;

  const attachmentRows = attachments.map((attachment, index) => {
    return (<tr key={index}>
      <td>{attachment.filename}</td>
      <td>{attachment.details}</td>
      <td><Link to="/view">{c("View")}</Link></td>
    </tr>)
  });

  function toggleModal() {
    setDisplayModal(!displayModal);
  }

  return (
    <>

      <Table className="table m-0" responsive>
        <thead className="table-light">
          <tr>
            {!props.preview && <th colSpan={3}>
              <h6 className="float-start">{t("Attachments")}</h6>
              <Link className="float-end" onClick={() => { toggleModal() }}><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i>{t("")}</Link>
            </th>}
          </tr>
        </thead>
        <tbody className="m-0">
          {attachments.length > 0 ? attachmentRows : (
            <tr>
              <td colSpan="4" className="px-0">
                <div className="alert alert-info m-0">{t("No attachments yet")}</div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {editMode && <ModalAttachments isOpen={displayModal} toggle={toggleModal} onAttach={props.onAttach} />}
    </>
  );
};

AttachmentList.propTypes = {
  attachments: PropTypes.array,
  editMode: PropTypes.bool,
  onAttach: PropTypes.func
};

AttachmentList.defaultProps = {
  attachments: [],
  editMode: false
};

export default AttachmentList;
