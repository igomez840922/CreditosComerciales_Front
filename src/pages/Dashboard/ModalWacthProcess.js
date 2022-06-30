import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTranslation } from 'react-i18next'

import {
    Modal,
} from "reactstrap";

import ApiServiceBpm from "../../services/BpmServices/Services";
import LoadingOverlay from "react-loading-overlay";
import { translationHelpers } from '../../helpers';


const ModalWatchProcess = (props) => {
    const [svg, setSvg] = useState(null);
    const [isActiveLoading, setisActiveLoading] = useState(false);
    const { t } = useTranslation();

    const api = new ApiServiceBpm();

    React.useEffect(() => {
        console.log('hola3')
        setSvg(null);
        setisActiveLoading(true);
        wacthprocess(props.processInstanceId);
    }, [props.processInstanceId])

    function wacthprocess(processInstanceId) {
        api.wacthprocess(processInstanceId)
            .then((data) => {

                const buff = new Buffer(data);
                const base64data = buff.toString('base64');

                setSvg(base64data)
                setisActiveLoading(false);

            })
            .catch((error) => {
                console.error(error);
            });
    }
    return (
        <Modal
            size="xl"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}
        >
            <div className="modal-header">
                <h5 className="modal-title mt-0">{props.t("ProcessImages")}</h5>
                <button
                    type="button"
                    onClick={props.toggle}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>
                {/* <SvgIcon component={Logo} viewBox="500 500 500 500" /> */}
                {/* <Logo></Logo> */}

                <div style={{ minHeight: '150px' }} className="m-3 d-flex justify-content-center" id="svgData">
                    <img src={"data:image/svg+xml;base64," + svg} alt="" />
                </div>
            </LoadingOverlay>
        </Modal>
    );
};

ModalWatchProcess.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    onSaveProcess: PropTypes.func,
};

export default withTranslation()(ModalWatchProcess);
