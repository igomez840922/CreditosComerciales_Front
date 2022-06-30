import { useTranslation } from "react-i18next";
import { Modal, ModalBody } from "reactstrap";
import FormContainerQuoter from "../../pages/CommercialCredit/20_Cotizador/FormContainerQuoter";
import FormQuoterScreen from "../../pages/CommercialCredit/20_Cotizador/FormQuoterScreen";
import FormQuoterTypeNatural from "../../pages/CommercialCredit/20_Cotizador/FormQuoterTypeNatural";

const ModalData = (props) => {
  const { t, i18n } = useTranslation();
  const { titleModal, show, toggle, data } = props;

  return (
    <Modal size="xl" isOpen={show} toggle={toggle}>
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
        <FormContainerQuoter>
          <FormQuoterScreen dataPrefillClient={data} />
        </FormContainerQuoter>
      </ModalBody>
    </Modal>
  );
};

export default ModalData;
