import React, {useRef} from 'react';
import {useProfile} from '../../services/profile-context';
import {Link, useNavigate} from "react-router-dom";

const LoginPage = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const {login, currentProfile} = useProfile();
  const handleSignIn = async () => {
    const loginStatus = await login(
        {
          username: usernameRef.current.value,
          password: passwordRef.current.value
        }
    );
    if (loginStatus === 403) {
      alert("Incorrect username or password.");
      return;
    }
    navigate('/profile');
  };

  if (currentProfile) {
    navigate('/profile');
  }

  return (
      <div>
        <h5>Log In</h5>
        <input ref={usernameRef}
               id="username"
               placeholder="Username"
               className={`form-control`}/>
        <input ref={passwordRef}
               id="password"
               type="password"
               placeholder="Password"
               className="form-control" />
        <button onClick={handleSignIn}
                className="mt-2 btn btn-primary">Sign In</button>
        <Link className="float-end mt-2" to="/register">Sign Up</Link>
      </div>
  );
}

export default LoginPage;