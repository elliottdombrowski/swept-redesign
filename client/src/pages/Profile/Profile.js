import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { QUERY_ME, QUERY_USER_SWEEPERS, QUERY_USER_SNOW } from '../../utils/queries';
import { UPDATE_PASSWORD } from '../../utils/mutations';
import { validateEmail } from '../../utils/helpers';

import SavedSweepers from '../../components/SavedSweepers/SavedSweepers';
import SavedSnow from '../../components/SavedSnow/SavedSnow';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faSun, faMoon, faLock } from '@fortawesome/free-solid-svg-icons';

import './styles.scss';
import './query.scss';

const saved = <FontAwesomeIcon icon={faBookmark} className='profile-bookmark fa-sm' />
const sun = <FontAwesomeIcon icon={faSun} className='profile-light-mode' />
const moon = <FontAwesomeIcon icon={faMoon} className='profile-dark-mode' />
const password = <FontAwesomeIcon icon={faLock} className='profile-password' />

const Profile = ({ setTheme }) => {
  const [userId, setUserId] = useState(localStorage.getItem('uuid'));

  const [updatePassword, { error: updateError, data: updateData }] = useMutation(UPDATE_PASSWORD);

  const { username: userParam } = useParams();
  const [moveSlider, setMoveSlider] = useState(false);

  const { loading, data } = useQuery(QUERY_ME, {
    variables: { username: userParam },
  });

  const { loading: displaySavedSweeperLoading, data: displaySavedSweeperData } = useQuery(QUERY_USER_SWEEPERS, {
    variables: { user: userId },
    fetchPolicy: 'network-only'
  });

  const { loading: displaySavedSnowLoading, data: displaySavedSnowData } = useQuery(QUERY_USER_SNOW, {
    variables: { user: userId },
    fetchPolicy: 'network-only'
  });

  const user = data?.me || [];
  const userSweeperSearches = displaySavedSweeperData?.getUserSweepers || [];
  const userSnowSearches = displaySavedSnowData?.getUserSnow || [];

  const testUpdate = async (event) => {
    event.preventDefault();
    try {
      const { updateData } = await updatePassword({
        variables: { email: 'elliottroyal@me.com', password: 'Hi12345!'}
      })
      console.log('success');
    } catch {
      console.log('error');
    }
  };

  return (
    <main className='profile-wrapper'>
      <section className='profile-inner-wrapper'>
        <div className='profile-user-info'>
          <h1 className='profile-header'>Welcome, <span className='profile-username'>{user.username}!</span></h1>
          <p className='profile-email'>{user.email}</p>
        </div>

        <div className='profile-save-info'>
          <p className='profile-saved-sweeper profile-save'>Saved Sweeper Searches:
            <span
              onClick={() => setMoveSlider(false)}
            >
              {userSweeperSearches.length}
            </span>
          </p>

          <p className='profile-saved-snow profile-save'>Saved Snow Searches:
            <span
              onClick={() => setMoveSlider(true)}
            >
              {userSnowSearches.length}
            </span>
          </p>
        </div>

        <div className='profile-options'>
          <Link 
            to='/resetpassword'
            className='profile-change-password'
            onClick={testUpdate}
          >
            <i>
              {password}
            </i>

            Change Password
          </Link>

          <ThemeToggle setTheme={setTheme} />
        </div>

        <section className='saved-wrapper'>
          <div className='slider-wrapper'>
            <label className='switch' id='link-switcher'>
              <input type='checkbox' />
              <h2
                className='slider slider-one nav-item nav-links'
                id='sweeper-link'
                onClick={() => setMoveSlider(false)}
              >
                <i>
                  {saved}
                </i>
                SWEEPER
              </h2>

              <h2
                className='slider slider-two nav-item nav-links'
                id='snow-link'
                onClick={() => setMoveSlider(true)}
              >
                <i>
                  {saved}
                </i>
                SNOW
              </h2>
              <div className={moveSlider ? 'switch-overlay-right' : 'switch-overlay-left'} id='switcher' />
            </label>
          </div>

          <section className='saved-component-wrapper'>
            {moveSlider ? <SavedSnow /> : <SavedSweepers />}
          </section>
        </section>
      </section>
    </main>
  );
};

export default Profile;