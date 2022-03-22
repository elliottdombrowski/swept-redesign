import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import AnimatePage from '../../AnimatePage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import './styles.scss';
import './query.scss';

const backArrow = <FontAwesomeIcon icon={faArrowLeft} />
const lock = <FontAwesomeIcon icon={faLock} />
const showPwd = <FontAwesomeIcon icon={faEye} className='fa-lg' />
const hidePwd = <FontAwesomeIcon icon={faEyeSlash} className='fa-lg' />

const ChangePassword = ({ themeStyles, theme }) => {
  const [handleShowPwd, setHandleShowPwd] = useState(false);

  const handleUpdatePassword = () => {

  };

  return (
    <AnimatePage>
      <main className='change-password-wrapper'>
        <section
          className='change-password-inner'
        >
          <label
            style={!theme ? themeStyles.containerLight : themeStyles.containerDark}
          >
            Update Your Password!
          </label>

          <div style={!theme ? themeStyles.containerLight : themeStyles.containerDark}>
            <form
              onSubmit={handleUpdatePassword}
              className='update-password-form'
            >
              <label className='form-label'>
                UPDATE YOUR PASSWORD
              </label>

              <span className='input-wrapper'>
                <i
                  onClick={() => setHandleShowPwd((prev) => !prev)}
                >
                  {showPwd}
                </i>

                <input
                  placeholder='Enter your Password'
                  className='update-password-input'
                />
              </span>

              <span className='input-wrapper'>
                <i
                  onClick={() => setHandleShowPwd((prev) => !prev)}
                >
                  {hidePwd}
                </i>

                <input
                  placeholder='Enter a New Password'
                  className='update-password-input'
                />
              </span>

              <button
                type='submit'
                className='update-password-submit-btn'
              >
                <i>
                  {lock}
                </i>

                UPDATE
              </button>
            </form>
          </div>

          <div style={!theme ? themeStyles.containerLight : themeStyles.containerDark}>

          </div>

          <div style={!theme ? themeStyles.containerLight : themeStyles.containerDark}>
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