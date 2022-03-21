import React from 'react';
import AnimatePage from '../../AnimatePage';

import './styles.scss';
import './query.scss';

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
            one
          </div>

          <div style={!theme? themeStyles.containerLight : themeStyles.containerDark}>
            two
          </div>
          
          <div style={!theme? themeStyles.containerLight : themeStyles.containerDark}>
            three
          </div>
        </section>
      </main>
    </AnimatePage>
  );
};
 
export default ChangePassword;