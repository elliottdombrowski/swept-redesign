import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from '../src/components/Navbar/Navbar';
import Footer from '../src/components/Footer/Footer';
import Homepage from '../src/pages/Homepage/Homepage';
import Sweeper from '../src/pages/Sweeper/Sweeper';
import Snow from '../src/pages/Snow/Snow';
import Profile from './pages/Profile/Profile';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import NotFound from './pages/NotFound/NotFound';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from './utils/queries';
import { DARKMODE } from './utils/mutations';

import Auth from './utils/auth';

const themeStyles = {
  light: {
    background: '#b5def2',
  },
  dark: {
    background: '#0e1825',
  },
  containerLight: {
    background: '#005178',
  },
  containerDark: {
    background: '#00507885',
  },
  searchFormErrorLight: {
    background: '#112e5385',
  },
  searchFormErrorDark: {
    background: '#00293c',
  },
};


const Container = () => {
  
  const [theme, setTheme] = useState(false);
  
  const [darkmode, { error: darkmodeError, data: darkmodeData }] = useMutation(DARKMODE);
  const { loading, data } = useQuery(QUERY_ME);
  const appUser = data?.me || [];
  console.log(appUser.darkmode);

  const setDarkmode = async () => {
    try {
      const { darkmodeData } = await darkmode({
        variables: { ...theme },
      });
    } catch (err) {
      console.log('testing darkmode mutation ', err);
    }
  };
  
  return (
    <div className="App" style={
      !theme ? themeStyles.light : themeStyles.dark
    }>
      <Router>
        <Navbar
          themeStyles={themeStyles}
          theme={theme}
          setTheme={setTheme}
        />

        <Switch>
          <Route exact path='/'>
            <Homepage
              themeStyles={themeStyles}
              theme={theme}
            />
          </Route>

          <Route exact path='/sweeper'>
            <Sweeper
              themeStyles={themeStyles}
              theme={theme}
            />
          </Route>

          <Route exact path='/snow'>
            <Snow
              themeStyles={themeStyles}
              theme={theme}
            />
          </Route>

          <Route exact path='/login'>
            <LoginSignup
              themeStyles={themeStyles}
              theme={theme}
            />
          </Route>

          <Route exact path='/me'>
            {!Auth.loggedIn() ? <Homepage /> : <Profile setTheme={setTheme} setDarkmode={setDarkmode} />}
          </Route>

          <Route exact path='/updateuser'>
            {!Auth.loggedIn() ? <Homepage /> : <ChangePassword themeStyles={themeStyles} theme={theme} />}
          </Route>

          <Route component={NotFound} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default Container;