import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import SignupForm from '../../components/SignupForm/SignupForm';

import './styles.scss';
import './query.scss';

import AnimatePage from '../../AnimatePage';

const LoginSignup = () => {
  const [switchAuthForm, setSwitchAuthForm] = useState(false);

  return (
    <AnimatePage>
      <main className='login-signup-wrapper'>
        <section className='login-signup-inner'>
          {!switchAuthForm ? <SignupForm /> : <LoginForm />}
          <a
            href='#'
            rel='noopener noreferrer'
            className='login-signup-form-switcher'
            onClick={(event) => setSwitchAuthForm((prev) => !prev)}
          >
            {!switchAuthForm ? 'Already have an account? Log in!' : "Don't have an account? Sign up!"}
          </a>
        </section>
      </main>
    </AnimatePage>
  );
};

export default LoginSignup