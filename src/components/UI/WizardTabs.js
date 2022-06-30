import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import WizardSteps from './WizardSteps';

import {
  TabContent,
  Button
} from 'reactstrap';


const WizardTabs = React.forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    NextPrevious(Index) {
      NextPrevious(Index)
    }
  }))

  const [currentTabIndex, setCurrentTabIndex] = useState(props.currentTabIndex);
  const [currentTab, setCurrentTab] = useState(props.tabs[currentTabIndex].key);

  function selectTab(key) {
    const currentItem = props.tabs.find(section => section.key === key);
    if( !currentItem ) {
      return;
    }
    const currentIndex = props.tabs.indexOf(currentItem);
    setCurrentTabIndex(currentIndex);
    setCurrentTab(currentItem.key);
    if( props.onSelectTab ) {
      props.onSelectTab(currentItem.key, currentIndex);
    }
  }

  function NextPrevious(Index){
    //console.log(props.tabs[Index].key);
    selectTab(props.tabs[Index].key);

    window.scrollTo(0, 0)
  }

  return (
    <div className="form-wizard-wrapper wizard clearfix">

      <WizardSteps tabs={ props.tabs }
        activeTab={ currentTab }
        setActiveTab={ selectTab }
        displaySectionNumber={ props.displaySectionNumber } />

      <div className="content clearfix">
        <TabContent className="body" activeTab={ currentTab }>
          { props.children }
        </TabContent>
      </div>

    </div>
  );

});

WizardTabs.propTypes = {
  tabs: PropTypes.array,
  currentTabIndex: PropTypes.number,
  displaySectionNumber: PropTypes.bool,
  onSelectTab: PropTypes.func
};

WizardTabs.defaultProps = {
  tabs: [],
  currentTab: null,
  displaySectionNumber: true
};

export default WizardTabs;
