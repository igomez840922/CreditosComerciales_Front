import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    makeStyles,
    Slide
  } from "@material-ui/core";
  import { setDefaults, useTranslation } from "react-i18next";

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const SessionTimeoutDialog = ({  open, countdown, onLogout,onContinue }) => {
  const { t, i18n } = useTranslation();
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
    >
 <DialogTitle>
 {t("SessionTimeOut")}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {t("SessionTimeOut1")}{" "}
          <span className="countdown">{countdown}</span> {t("SessionTimeOut2")}.
        </Typography>
        <Typography variant="body2"> {t("SessionTimeOut3")}</Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onLogout}
          variant="contained"
          color="secondary"
          className="btn btn-danger-dialog">
           {t("Logout")}
        </Button>
        <Button
          onClick={onContinue}
          variant="contained"
          color="success"
          className="btn btn-success-dialog">
          {t("Continue")}
        </Button>
      </DialogActions>


    </Dialog>


  );
    
  
}


export default SessionTimeoutDialog;