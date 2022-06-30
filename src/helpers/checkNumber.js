export default function checkNumber(e) {
    let value = e.target.value.length;
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (((tecla < 48 || tecla > 57) && tecla !== 45) || value >= 15) {
        e.preventDefault();
        return true;
    }

    return false;
}