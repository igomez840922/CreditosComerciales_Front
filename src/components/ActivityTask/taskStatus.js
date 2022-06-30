import { useTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@material-ui/core";
const TaskStatus = props => {

    const { t, i18n } = useTranslation();
    const [showSweetAlert, setshowSweetAlert] = useState(false);
    const history = useHistory();

    function validateStatus(taskStatus, pathname, data) {
        console.log(taskStatus);
        if (taskStatus == "Reservado") {
            setshowSweetAlert(true);
        } 
    }

    function cancelShow() {
        setshowSweetAlert(false);
    }

    function readOnly() {
        props.data.readOnly = true;
        console.log(props.data);
        history.push({
            pathname: props.pathname,
            data: props.data,
        });
    }

    function claim() {
        props.data.readOnly = false;
        console.log(props.data);
        history.push({
            pathname: props.pathname,
            data: props.data,
        });
    }


    return (
        <React.Fragment>
            {props.taskStatus == "Reservado" ?
                <Link to="#"

                    onClick={(e) => { validateStatus(props.taskStatus, props.pathname, props.data) }}
                >
                    <i className="mdi mdi-file-search-outline mdi-24px"></i>
                </Link> :
                <Link
                    to={{
                        pathname: props.pathname,
                        data: props.data,
                    }}
                >
                    <i className="mdi mdi-file-search-outline mdi-24px"></i>
                </Link>
            }

            <Dialog
                open={showSweetAlert}
            >
                <DialogTitle>
                    {t("taskStatusTitle")}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        {t("taskStatusMessage")}
                    </Typography>
                    <Typography variant="body2"> {t("taskStatusMessageDetail")}</Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={cancelShow}
                        variant="contained"
                        className="btn btn-danger-dialog">
                        {t("Cancel")}
                    </Button>
                    <Button
                        onClick={claim}
                        variant="contained"
                        className="btn btn-success-dialog">
                        {t("taskStatusClaim")}
                    </Button>
                    <Button
                        onClick={readOnly}
                        variant="contained"
                        className="btn btn-success-dialog">
                        {t("taskStatusReadOnly")}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
TaskStatus.propTypes = {
    taskStatus: PropTypes.any,
    pathname: PropTypes.any,
    data: PropTypes.any
}
export default TaskStatus;

