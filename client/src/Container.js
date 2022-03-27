import React, { useState } from 'react';
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

import { useQuery } from '@apollo/client';
import { QUERY_ME } from './utils/queries';

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

  const { loading, data } = useQuery(QUERY_ME);
  const appUser = data?.me;

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
          <Route exact path='/' component={Homepage} />

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
            {!Auth.loggedIn() ? <Homepage /> : <Profile setTheme={setTheme} />}
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