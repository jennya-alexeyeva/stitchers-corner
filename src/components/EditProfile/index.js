import React, {useEffect, useRef, useState} from "react";
import {useProfile} from "../../services/profile-context";
import {useNavigate} from "react-router-dom";
import {updateUser} from "../../services/user-service";

const EditProfile = () => {
  const {currentProfile, setUser} = useProfile();
  const navigate = useNavigate();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const aboutMeRef = useRef();

  const updateProfile = async () => {
    const newProfile = {
      ...currentProfile,
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      aboutMe: aboutMeRef.current.value
    }
    updateUser(newProfile);
    await setUser(newProfile);
    navigate("/profile");
  }

  useEffect(() => {
    if (currentProfile === null) {
      navigate('/forbidden-access', {state: {reason: "notLoggedIn"}});
    }
  }, [currentProfile]);

  return (
      <div>
        {currentProfile && <div>
          <input ref={usernameRef} className="form-control" defaultValue={currentProfile.username} />
          <input ref={passwordRef} className="form-control" defaultValue={currentProfile.password} />
          <textarea ref={aboutMeRef} className="form-control">{currentProfile.aboutMe}</textarea>
          <button className="btn btn-primary" onClick={updateProfile}>Update</button>
        </div>}
      </div>
  )
}

export default EditProfile;