import React, {useEffect, useRef, useState} from "react";
import {useProfile} from "../../services/profile-context";
import {useNavigate} from "react-router-dom";
import {updateUser} from "../../services/user-service";
import {Convert} from 'mongo-image-converter';

const EditProfile = () => {
  const {currentProfile, setUser} = useProfile();
  const navigate = useNavigate();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const aboutMeRef = useRef();
  const [imageFile, setImageFile] = useState(null);

  const updateProfile = async () => {
    let uploadedImage;
    if (imageFile) {
      uploadedImage = await Convert(imageFile);
      if (!uploadedImage) {
        alert('Please upload a valid image.');
        return;
      }
    } else {
      uploadedImage = currentProfile.profilePic;
    }
    const newProfile = {
      ...currentProfile,
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      aboutMe: aboutMeRef.current.value,
      profilePic: uploadedImage
    }
    updateUser(newProfile).then(async response => {
      console.log(response);
      if (response === 409) {
        alert("This username is already taken.");
        return;
      }
      setUser(newProfile);
      navigate("/profile");
    });
  }

  useEffect(() => {
    if (currentProfile === null) {
      navigate('/forbidden-access', {state: {reason: "notLoggedIn"}});
    }
  }, [currentProfile]);

  return (
      <div>
        {currentProfile && <div>
          <input type='file' onChange={e => setImageFile(e.target.files[0])} />
          <input ref={usernameRef} className="form-control" defaultValue={currentProfile.username} />
          <input ref={passwordRef} className="form-control" defaultValue={currentProfile.password} />
          <textarea ref={aboutMeRef} className="form-control">{currentProfile.aboutMe}</textarea>
          <button className="btn btn-primary" onClick={updateProfile}>Update</button>
        </div>}
      </div>
  )
}

export default EditProfile;