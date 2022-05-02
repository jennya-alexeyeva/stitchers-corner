import React, {useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useProfile} from "../../services/profile-context";

const RegisterPage = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const {signup, currentProfile} = useProfile();
  const [isMaker, setIsMaker] = useState(null);
  const navigate = useNavigate();
  const handleSignUp = async () => {
    const signupStatus = await signup(
        {
          "username": usernameRef.current.value,
          "password": passwordRef.current.value,
          "isMaker": isMaker
        }
    );
    if (signupStatus === 403) {
      alert('This username is already taken.');
      return;
    }
    navigate('/profile');
  }

  if (currentProfile) {
    navigate('/profile');
  }

  return (
      <div>
        <h5>Sign Up</h5>
        <input ref={usernameRef} placeholder="Username" className="form-control"/>
        <input type="password" ref={passwordRef} placeholder="Password" className="mb-2 form-control"/>
        <input type="radio" name="isMaker" id="notMaker" onChange={() => setIsMaker(false)} />
        <label className="ms-1" htmlFor="notMaker">Generic Account</label>
        <br />
        <input type="radio" name="isMaker" id="maker" onChange={() => setIsMaker(true)} />
        <label className="ms-1" htmlFor="maker">Pattern Maker Account</label>
        <br />
        <button onClick={handleSignUp} className="mt-2 btn btn-primary">Sign Up</button>
      </div>
  );
};

export default RegisterPage;