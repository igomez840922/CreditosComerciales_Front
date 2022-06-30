import React, { useState ,useRef} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import { useLocation, useHistory } from 'react-router-dom'

import HorizontalTimeline from 'react-horizontal-timeline';


const HorizontalTimeLine = (props) => {

  const [value, setvalue] = useState(0);
  const [previous, setprevious] = useState(0);

    const VALUES = [

        '2015-03-01',
        '2019-01-01',
        '2019-06-17',
        '2019-08-01',
    ];

    //const { t, i18n } = useTranslation();
  
    const { stepsAmt } = props;
  
    //On Mounting (componentDidMount) if selectedData has changes
    React.useEffect(() => {
      //loadData();
    }, []);
   
    
  
    return (
  
      <React.Fragment>
        
        <div>
        {/* Bounding box for the Timeline */}
        <div style={{ width: '100%', height: '100px', margin: '0 auto' }}>
          <HorizontalTimeline
            index={value}
            indexClick={(index) => {
                setprevious(value);
                setvalue(index);
            }}
            values={ VALUES } />
        </div>
        <div className='text-center'>
          {/* any arbitrary component can go here */}    
          {value}
        </div>
      </div>

      </React.Fragment>
  
    )
  }
  
  HorizontalTimeLine.propTypes = {  
      stepsAmt: PropTypes.any
  }
  
  //export default (withTranslation()(DatosGenerales));
  export default HorizontalTimeLine;
  
  