import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_USER_SWEEPERS, QUERY_USER_SNOW } from '../../utils/queries';
import SavedSweepers from "./SavedSweepers"
import SavedSnow from "./SavedSnow"

import './styles.scss';
import './query.scss';

const Profile = () => {
  const { username: userParam } = useParams();

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
          <SavedSweepers />
          <SavedSnow />
        </section>
      </section>
    </main>
  );
};

export default Profile;