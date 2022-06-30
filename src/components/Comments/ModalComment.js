import { useTranslation } from "react-i18next";
import {
    Modal,
    ModalBody,
} from "reactstrap";
import NewComment from "./NewComment";

import "./stylesComments.css";

const ModalComment = (props) => {

    const { t, i18n } = useTranslation();

    return (
        <Modal
            size='xl'
            isOpen={props.show}
            toggle={props.toggle}
        >
            <div className="modal-header">
                <h5 className="modal-title mt-0">{props.titleModal}</h5>
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={props.toggle}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <ModalBody>
                <NewComment />
            </ModalBody>
        </Modal>
    )
}

export default ModalComment;