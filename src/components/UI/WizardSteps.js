import PropTypes from 'prop-types';

import {
  NavItem,
  NavLink,
} from "reactstrap"

import classnames from "classnames"


const WizardSteps = (props) => {

  const { activeTab, setActiveTab, tabs, displaySectionNumber } = props;

  const navItems = tabs.map((tab, index) => {
    const { key, label } = tab;
    return (
      <NavItem key={ 'navitem-' + index } className={ classnames({ current: activeTab === key }) }>
        <NavLink className={ classnames({ current: activeTab === key }) }
          onClick={ () => { setActiveTab(key)} }>
            { displaySectionNumber && (<span className="number">{ index + 1 }</span>) }
          { label }
        </NavLink>
      </NavItem>
    );
  })

  return (<div className="steps clearfix" style={{ overflowX: 'scroll' }}>
    <ul>
      { navItems }
    </ul>
  </div>);

};

WizardSteps.propTypes = {
  tabs: PropTypes.array.isRequired,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  displaySectionNumber: PropTypes.bool
};

WizardSteps.defaultProps = {
  displaySectionNumber: true
};

export default WizardSteps;
