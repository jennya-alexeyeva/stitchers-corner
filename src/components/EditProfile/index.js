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
    const newProfile = {
      ...currentProfile,
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      aboutMe: aboutMeRef.current.value,
      profilePic: imageFile ?? currentProfile.profilePic
    }
    updateUser(newProfile).then(async response => {
      if (response === 409) {
        alert("This username is already taken.");
        return;
      }
      setUser(newProfile);
      navigate("/profile");
    });
  }

  const verifyUpload = async (image) => {
    let convertedImage = await Convert(image);
    if (convertedImage) {
      setImageFile(convertedImage);
    } else {
      alert('Please upload a valid image.');
    }
  }

  useEffect(() => {
    if (currentProfile === null) {
      navigate('/forbidden-access', {state: {reason: "notLoggedIn"}});
    }
  }, [currentProfile, navigate]);

  return (
      <div>
        {currentProfile && <div>
          <h2>Edit Profile</h2>
          {imageFile && <img className="thumbnail-preview" src={imageFile.toString()} alt="thumbnail"/>}
          <div className="row mb-3 mt-2">
            <input className="col-8" type='file' id="imageFile" onChange={e => verifyUpload(e.target.files[0])} />
            <label className="col-4" htmlFor="imageFile">Upload a profile picture. Max size 16mb</label>
          </div>
          <input ref={usernameRef} className="form-control" defaultValue={currentProfile.username} />
          <input ref={passwordRef} className="form-control" defaultValue={currentProfile.password} />
          <textarea ref={aboutMeRef} className="form-control">{currentProfile.aboutMe}</textarea>
          <button className="btn btn-primary mt-2" onClick={updateProfile}>Update</button>
        </div>}
      </div>
  )
}

export default EditProfile;