import ModalData from "../../../components/Common/ModalData";

const ModalQuoterCalculator = () => {
    return (
        <>
            <ModalData
                titleModal={t("Quoter")}
                show={showModal}
                toggle={handleClickCloseModal}
            />
        </>
    )
}

export default ModalQuoterCalculator