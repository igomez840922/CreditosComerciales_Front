import React from "react"
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
  Modal,
} from "reactstrap"
const FormGoogle = (props) => {
  const { searchGoogleTerms } = props;
  let query = '';
  if (Array.isArray(searchGoogleTerms)) {
    query = props.searchGoogleTerms.filter(item => item !== '').join('+');
  }
  else {
    query = searchGoogleTerms;
  }
  const searchUrl = `https://www.google.com/search?igu=1&gws_rd=ssl&q=${query}`;
  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">Google</h5>
        <button
          type="button"
          onClick={props.toggle}
          className="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body" style={{ minHeight: '500px' }}>
        <iframe style={{ height: '500px', width: '100%', border: 0 }}
          allowfullscreen="" aria-hidden="false" tabindex="0"
          src={searchUrl}
          sandbox='allow-modals allow-forms allow-popups allow-scripts allow-same-origin'></iframe>
      </div>
    </Modal>
  );
}
FormGoogle.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  searchGoogleTerms: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ])
};

export default (withTranslation()(FormGoogle));
