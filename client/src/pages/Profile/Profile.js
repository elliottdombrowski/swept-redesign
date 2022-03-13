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
      <div className='profile-info-wrapper'>
        <div className='profile-welcome-header'>
          <h1 className='profile-header'>Welcome, </h1> <span className='profile-username'>{user.username}!</span>
        </div>
        <p className='profile-email'>{user.email}</p>
      </div>
      <SavedSweepers />
      <SavedSnow />
    </main>
  );
};

export default Profile;