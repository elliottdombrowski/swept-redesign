import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import './styles.scss';
import './query.scss';

const sun = <FontAwesomeIcon icon={faSun} className='profile-light-mode' />
const moon = <FontAwesomeIcon icon={faMoon} className='profile-dark-mode' />

const ThemeToggle = ({setTheme}) => {
  return (
    <div className='switch'>
      <i>
        {sun}
      </i>

      <label
        className='theme-switch'
        htmlFor='checkbox'
      >
        <input
          type='checkbox'
          id='checkbox'
          onClick={() => setTheme((prev) => !prev)}
        />
        <div className='slider round' />
      </label>

      <i>
        {moon}
      </i>

    </div>
  );
};

export default ThemeToggle;