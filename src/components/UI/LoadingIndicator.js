import PropTypes from 'prop-types';
import './LoadingIndicator.scss';

//SweetAlert
import SweetAlert from "react-bootstrap-sweetalert"
import { Spinner } from 'reactstrap';


const LoadingIndicator = (props) => {

  return (
  <SweetAlert showConfirm={false}>
    <Spinner color="success">
    </Spinner>
    <h5>{ props.message }</h5>
  </SweetAlert>
  );
};

LoadingIndicator.propTypes = {
  message: PropTypes.string
};

LoadingIndicator.defaultProps = {
  message: "Loading..."
};

export default LoadingIndicator;
