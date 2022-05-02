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
        <div>
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
                  className="btn btn-primary">Sign In</button>
        </div>
        <Link className="float-end" to="/register">Sign Up</Link>
      </div>
  );
}

export default LoginPage;