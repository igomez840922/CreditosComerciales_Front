import { useTranslation } from "react-i18next";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import Alert from 'react-bootstrap/Alert'

const ModalSearchClient = (props) => {
    const { t, i18n } = useTranslation();
    const { titleModal, show, toggle, content } = props;

    return (
        <Modal
            size='xl'
            centered
            isOpen={show}
            toggle={toggle}
        >
            <div className="modal-header">
                <h5 className="modal-title mt-0">{titleModal}</h5>
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={toggle}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <ModalBody>
                {content}
            </ModalBody>
            <ModalFooter>
                <Button color="danger" type="button">
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalSearchClient