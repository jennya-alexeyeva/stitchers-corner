import React, {useEffect, useRef, useState} from 'react';
import {findPatternById, updatePattern} from "../../services/pattern-service";
import {useNavigate, useParams} from "react-router-dom";
import {useProfile} from "../../services/profile-context";
import {Convert} from "mongo-image-converter";
import {useDispatch} from "react-redux";

const EditPattern = () => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [patternInfo, setPatternInfo] = useState(null);
  const {id} = useParams();
  const {currentProfile} = useProfile();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentProfile === null) {
      navigate("/forbidden-access", {state: {reason: "notLoggedIn"}});
    } else if (currentProfile && !currentProfile.isMaker) {
      navigate("/forbidden-access", {state: {reason: "notMaker"}});
    }

    async function getPatternInfo() {
      setPatternInfo(await findPatternById(id));
    }

    getPatternInfo();
  });

  const verifyUpload = async (image) => {
    let convertedImage = await Convert(image);
    if (convertedImage) {
      setImageFile(convertedImage);
    } else {
      alert('Please upload a valid image.');
    }
  }

  const handleUpdate = async () => {
    await updatePattern(dispatch, {...patternInfo,
      title: titleRef.current.value,
      price: priceRef.current.value,
      description: descriptionRef.current.value,
      image: imageFile ?? patternInfo.image
    });

    navigate(`/details/internal/${patternInfo._id}`);
  }

  return (
      <div>
        <h2>Edit Pattern</h2>
          {patternInfo &&
          <div>
            {imageFile && <img className="thumbnail-preview" src={imageFile.toString()} alt="thumbnail"/>}
            <div className="row mb-3 mt-2">
              <input type='file' id="imageFile" onChange={e => verifyUpload(e.target.files[0])} />
              <label htmlFor="imageFile">Upload a thumbnail image for your pattern. Max size 16mb</label>
            </div>
            <input defaultValue={patternInfo.title} ref={titleRef} placeholder="Title" className='form-control'/>
            <input defaultValue={patternInfo.price ?? 0} type="number" ref={priceRef} placeholder="Price" className='form-control' />
            <textarea defaultValue={patternInfo.description} ref={descriptionRef} placeholder="Description" className='form-control' />
            <button onClick={handleUpdate} className="btn btn-primary">Update Pattern</button>
          </div>
          }
      </div>
  );
}

export default EditPattern;