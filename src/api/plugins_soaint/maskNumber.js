import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Label,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
const MaskSoaint = (props) => {
    const { t, i18n } = useTranslation();
    const [valueSet, setvalueSet] = useState(0);


    // React.useEffect(()=>{
    //     setnumberExpresion(props.maskNumber)
    // }, []);

    function convertToNotation(numero) {
        let length = numero.length;
        let notation = ['', 'K', 'M', 'B', '-'];
        numero = numero.split('');
        let reducer = length <= 3 ? 0 : (length > 3 && length <= 6 ? 0 : (length > 6 && length <= 12 ? 3 : (length > 12 && length <= 16 ? 9 : 15)));
        numero.length = length <= 16 ? numero.length - reducer : 4;
        length > 3 && numero.splice(-3, 0, ',');
        numero = numero.join('') + notation[(length <= 3 ? 0 : (reducer === 0 ? 1 : (reducer === 3 ? 2 : (reducer >= 6 && reducer <= 9 ? 3 : 4))))];
       return numero;
    }
    return (
        <>
            <AvField
                type="text"
                name={props?.name ?? "mask"}
                id={props?.id ?? "mask"}
                placeholder="Ingrese su mascara en (K,M,B)"
                onChange={(e) => { props.setnumberExpresion(convertToNotation(e.target.value)) }}
                value={props.numberExpresion}
            />
        </>
    );
};
MaskSoaint.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}
export default MaskSoaint;
