import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useProfile} from "../../services/profile-context";
import {createPattern} from "../../services/pattern-service";
import {useDispatch} from "react-redux";
import {Convert} from 'mongo-image-converter';

const PostPattern = () => {
  const {currentProfile} = useProfile();
  const navigate = useNavigate();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const handlePostPattern = async () => {
    let convertedImage;
    if (imageFile) {
      convertedImage = await Convert(imageFile);
      if (!convertedImage) {
        alert('Please upload a valid image.');
        return;
      }
    }
    await createPattern(dispatch, {
      title: titleRef.current.value,
      price: priceRef.current.value,
      description: descriptionRef.current.value,
      author: currentProfile,
      favoritedUsers: [],
      image: convertedImage
    })

    navigate('/profile');
  }

  useEffect(() => {
    if (currentProfile === null) {
      navigate("/forbidden-access", {state: {reason: "notLoggedIn"}});
    } else if (currentProfile && !currentProfile.isMaker) {
      navigate("/forbidden-access", {state: {reason: "notMaker"}});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return (
      <div>
        <h2>Post a Pattern</h2>
        <input type='file' id="imageFile" onChange={e => setImageFile(e.target.files[0])} />
        <label htmlFor="imageFile">Upload a thumbnail image for your pattern. Max size 16mb</label>
        <input ref={titleRef} placeholder="Title" className={`form-control`}/>
        <input type="number" ref={priceRef} placeholder="Price" className={`form-control`} />
        <textarea ref={descriptionRef} placeholder="Description" className={`form-control`} />
        <button onClick={handlePostPattern} className="btn btn-primary">Post Pattern</button>
      </div>
  );
};

export default PostPattern;