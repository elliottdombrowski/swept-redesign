import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';

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
  const { username: userParam } = useParams();
  
  //STATE TO HANDLE SHOW / HIDE PASSWORD INPUT
  const [handleShowPwd, setHandleShowPwd] = useState(false);

  //HIT CONTEXT USER QUERY
  const { loading, data } = useQuery(QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || [];

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
                UPDATE PASSWORD FOR: <span>{user.email}</span>
              </label>

              <span className='input-wrapper'>
                <i
                  onClick={() => setHandleShowPwd((prev) => !prev)}
                >
                  {!handleShowPwd ? showPwd : hidePwd}
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
                  {!handleShowPwd ? showPwd : hidePwd}
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