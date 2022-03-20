import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import SignUpButton from '../SignUpButton/SignUpButton';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

import Auth from '../../utils/auth';

import './styles.scss';
import './query.scss';

const profile = <FontAwesomeIcon icon={faUserCircle} className='fa-md' />
const settings = <FontAwesomeIcon icon={faCog} className='fa-md' />

const Navbar = ({ themeStyles, theme, setTheme }) => {
  const [moveSlider, setMoveSlider] = useState(false);

  const mobile = window.matchMedia("(max-width: 768px)");
  const mobileMenu = () => {
    document.getElementById('hamburger').classList.toggle('active');
    document.getElementById('navbar-right').classList.toggle('active');
  };

  //CLOSE NAV MENU ON SCROLL
  window.onscroll = () => {
    document.getElementById('hamburger').classList.remove('active');
    document.getElementById('navbar-right').classList.remove('active');
  };
  //CLOSE NAV MENU IF USER CLICKS ANYWHERE OUTSIDE OF NAV CONTAINER
  window.onclick = (event) => {
    console.log(event.target);
    if (event.target == document.getElementById('checkbox') || event.target == document.getElementById('slider-round')) {
      setTimeout(() => {
        document.getElementById('hamburger').classList.remove('active');
        document.getElementById('navbar-right').classList.remove('active');
      }, 300);
    } else if (event.target !== document.getElementById('hamburger') && event.target !== document.getElementById('bar1') && event.target !== document.getElementById('bar2') && event.target !== document.getElementById('bar3')) {
      document.getElementById('hamburger').classList.remove('active');
      document.getElementById('navbar-right').classList.remove('active');
    }
  }

  return (
    <main className='navbar-wrapper'>
      <header className='navbar-header' id='navbar-header' >
        {/* NAV LEFT */}
        <nav className='nav-left'>
          <Link to='/' className='nav-item nav-logo'>
            SWEPT!!!
          </Link>
        </nav>

        {/* NAV CENTER  */}
        <nav className='nav-center'>
          <label className='switch' id='link-switcher'>
            <input type='checkbox' />
            <Link
              to='/sweeper'
              className='slider slider-one nav-item nav-links'
              id='sweeper-link'
              onClick={() => setMoveSlider(false)}
            >
              SWEEPER
            </Link>

            <Link
              to='/snow'
              className='slider slider-two nav-item nav-links'
              id='snow-link'
              onClick={() => setMoveSlider(true)}
            >
              SNOW
            </Link>
            <div className={moveSlider ? 'switch-overlay-right' : 'switch-overlay-left'} id='switcher' />
          </label>
        </nav>

        {/* NAV RIGHT */}
        <nav className='nav-right' id='navbar-right'>
          <div className='mobile-wrapper'>
            <div className='mobile-img-wrapper'>
              <img src={require('../../assets/chiflag.jpeg')} />
            </div>

            <Link to={Auth.loggedIn() ? ('/me') : ('/login')} className='nav-item nav-links nav-profile'>
              <i>
                {profile}
              </i>
              PROFILE
            </Link>

            <Link to={Auth.loggedIn() ? ('/me') : ('/login')} className='nav-item nav-links nav-settings'>
              <i>
                {settings}
              </i>
              SETTINGS
            </Link>

            <Link to={Auth.loggedIn() ? ('/me') : ('/login')} className='nav-item nav-links nav-extra'>
              <i>
                {profile}
              </i>
              PROFILE
            </Link>
          </div>

          {Auth.loggedIn() ? (
            <div className='mobile-wrapper-lower'>
              <div className='mobile-theme-wrapper' id='theme-wrapper'>
                <ThemeToggle setTheme={setTheme} />
              </div>

              <div className='login-btn mobile-login'>
                <Link
                  to='/'
                  className='nav-links'
                  onClick={Auth.logout}
                >
                  LOG OUT
                </Link>
              </div>
            </div>
          ) : (
            <SignUpButton />
          )}
        </nav>
        <div
          className='hamburger'
          id="hamburger"
          onClick={() => mobileMenu()}
        >
          <span className='bar' id='bar1'></span>
          <span className='bar' id='bar2'></span>
          <span className='bar' id='bar3'></span>
        </div>
      </header>
      <div className='deco'>
        <div
          className='deco-inner'
          style={!theme ? themeStyles.light : themeStyles.dark}
        ></div>
      </div>
    </main>
  );
};

export default Navbar;