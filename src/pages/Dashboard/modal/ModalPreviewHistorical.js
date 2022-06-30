import React, { useState } from "react"
import PropTypes from 'prop-types';

import {
    Modal,
} from "reactstrap"
import { translationHelpers } from "../../../helpers";
import PreviewHistorical from "./PreviewHistorical";


const ModalPreviewHistorical = (props) => {
    const [t] = translationHelpers('translation');
    React.useEffect(() => {
    }, [props])

    return (
        <>
            {props?.page ? <PreviewHistorical autonomyBank={props?.autonomyBank} title={props.title} transactId={props.transactId} instanceId={props.instanceId} closingPreview={props.closingPreview} /> :
                <Modal
                    size="xl"
                    isOpen={props.isOpen}
                    toggle={props.toggle}
                    centered={true}>
                    <div className="modal-header">
                        <div className="d-flex justify-content-between w-100 mx-3">
                            <h5 className="modal-title mt-0">{t(props.title)}</h5>
                            <h5 className="card-title" style={{ textAlign: "right" }}>{t("Tramit")}:{" "}#{props?.transactId}</h5>
                        </div>
                        <button
                            type="button"
                            onClick={props.toggle}
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <PreviewHistorical title={props.title} transactId={props.transactId} instanceId={props.instanceId} prueba={true} closingPreview={props.closingPreview} />
                    </div>
                </Modal>
            }
        </>
    );
};

ModalPreviewHistorical.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    onAttach: PropTypes.func
};

export default ModalPreviewHistorical;
