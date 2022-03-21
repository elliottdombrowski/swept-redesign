import React from 'react';
import { Link } from 'react-router-dom';

import AnimatePage from '../../AnimatePage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import './styles.scss';
import './query.scss';

const backArrow = <FontAwesomeIcon icon={faArrowLeft} />

const ChangePassword = ({themeStyles, theme}) => {
  return (
    <AnimatePage>
      <main className='change-password-wrapper'>
        <section 
          className='change-password-inner'
          >
          <label
            style={!theme? themeStyles.containerLight : themeStyles.containerDark}
          >
            Update Your Password!
          </label>

          <div style={!theme? themeStyles.containerLight : themeStyles.containerDark}>
            
          </div>

          <div style={!theme? themeStyles.containerLight : themeStyles.containerDark}>
            
          </div>

          <div style={!theme? themeStyles.containerLight : themeStyles.containerDark}>
            <Link
             to='/me'
             className='back-to-profile'
            >
              <i>
                {backArrow}
              </i>
              CANCEL
            </Link>
          </div>
        </section>
      </main>
    </AnimatePage>
  );
};
 
export default ChangePassword;