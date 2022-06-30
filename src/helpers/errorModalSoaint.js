import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import SweetAlert from "react-bootstrap-sweetalert"
import PropTypes from 'prop-types';
import error from '../assets/images/error.png'
import {
    Row,
    Col,
    Button,
    Label,
    Modal,
    Card,
    CardBody,
    CardFooter,
} from "reactstrap"
// import './index.css';
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
const ModalErrrorMessage = (props) => {
    const { t, i18n } = useTranslation();
    const [activacion, setactivacion] = useState(false);
    const [datosError, setdatosError] = useState({
        code: "",
        message: "",
        functionName: "",
        serviceType: "",
        error: false
    });
    let jsonTypeService = {
        bk: "Backend Services",
        bpm: "JBPM Services",
        core: "Core Services"
    }
    let jsonErrorMessage = {
        400: "Bad Request",
        404: "Path not found",
        500: "Server error",
        503: "There are empty fields"
    }
    React.useEffect(() => {
        window.addEventListener('errorSoaint', storageSoaint);
        return () => {
            window.removeEventListener("errorSoaint", storageSoaint)
        }
    }, [])

    function storageSoaint() {
        let json = JSON.parse(localStorage.getItem('jsonError'));

        if(json.message.message!=null){
            json["subtitle"]=json.message.message;
        }

        if(json.message.status!=null){
            json["title"]=json.message.status;
        }

        if(json.message.exceptionMessage!=null){
            json["subtitle"]=json.message.exceptionMessage;
        }
        
        if(json.message.statusDesc!=null){
            json["title"]=json.message.statusDesc;
        }

        setdatosError(json)
        setactivacion(json?.error);
    }

    function cambiarStatus() {
        let jsonError = {
            code: "",
            error: false,
            functionName: "",
            message: "",
            method: "",
            serviceType: "",
            url: "",
        }
        localStorage.setItem("jsonError", JSON.stringify(jsonError))
        removeBodyCss()
        setactivacion(false)
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }
    return (
        <React.Fragment>
        {activacion ?
            <SweetAlert
            danger
            title={datosError?.title}
            confirmButtonText={t("Confirm")}
            cancelButtonText={t("Cancel")}
            onConfirm={() => {
             cambiarStatus();
            }}
          >
            {datosError?.subtitle}
          </SweetAlert>
        :null
        
    }

    </React.Fragment>)
};
export default ModalErrrorMessage;
