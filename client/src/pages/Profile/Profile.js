import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_USER_SWEEPERS, QUERY_USER_SNOW } from '../../utils/queries';
import SavedSweepers from "./SavedSweepers"
import SavedSnow from "./SavedSnow"

import './styles.scss';
import './query.scss';

const Profile = () => {
  const { username: userParam } = useParams();
  const [moveSlider, setMoveSlider] = useState(false);

  const { loading, data } = useQuery(QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || [];


  return (
    <main className='profile-wrapper'>
      <section className='profile-inner-wrapper'>
        <div className='profile-user-info'>
          <h1 className='profile-header'>Welcome, <span>{user.username}!</span></h1>
          <p className='profile-email'>{user.email}</p>
        </div>

        <section className='saved-wrapper'>
          <div className='slider-wrapper'>

            <label className='switch' id='link-switcher'>
              <input type='checkbox' />
              <Link
                // to='/sweeper'
                className='slider slider-one nav-item nav-links'
                id='sweeper-link'
                onClick={() => setMoveSlider(false)}
              >
                SWEEPER
              </Link>

              <Link
                // to='/snow'
                className='slider slider-two nav-item nav-links'
                id='snow-link'
                onClick={() => setMoveSlider(true)}
              >
                SNOW
              </Link>
              <div className={moveSlider ? 'switch-overlay-right' : 'switch-overlay-left'} id='switcher' />
            </label>
          </div>

          {moveSlider ? <SavedSnow /> : <SavedSweepers />}
        </section>
      </section>
    </main>
  );
};

export default Profile;