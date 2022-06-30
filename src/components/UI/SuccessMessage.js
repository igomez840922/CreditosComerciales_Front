import PropTypes from 'prop-types';

//SweetAlert
import SweetAlert from "react-bootstrap-sweetalert"

const SuccessMessage = (props) => {

  const { title, message } = props;

  return (
    <SweetAlert success title={ title }
      onConfirm={ () => {} }>
        {message}
    </SweetAlert>
  );
};

SuccessMessage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onDismiss: PropTypes.func
};


export default SuccessMessage;
