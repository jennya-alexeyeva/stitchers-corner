import {useProfile} from "../../services/profile-context";
import {useNavigate, useParams} from "react-router-dom";
import {
  findAllPatternsForSearch
} from "../../services/pattern-service";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import SearchItem from "../SearchItem";

const groupBy3 = (data) => {
  let result = [];
  for (let i = 0; i < data.length; i += 3) {
    result.push(data.slice(i, i + 3));
  }
  return result;
};

const SearchPage = () => {
  const {currentProfile} = useProfile();
  const params = useParams();

  const navigate = useNavigate();
  const patterns = useSelector(
      state => state.patterns
  );
  const dispatch = useDispatch();
  const keywordRef = useRef();

  const handleSearch = () => {
    setMyPatterns(null);
    navigate(`/search/${keywordRef.current.value}`);
  }

  const [myPatterns, setMyPatterns] = useState(null);

  useEffect(() => {
    async function findPatterns() {
      await findAllPatternsForSearch(dispatch, params.criteria);
    }

    if (currentProfile && currentProfile.isMaker) {
      navigate("/my-patterns");
    } else {
      findPatterns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile, params]);

  useEffect(() => {
    setMyPatterns(groupBy3(patterns));
  }, [patterns])

  return (
      <div>
        <input ref={keywordRef} type="search" defaultValue={params.criteria} placeholder="Search" />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        <div>
          {myPatterns && myPatterns.map(row => row && <div className="row">
            {row.map(pattern => pattern && <div className="col-4">
              <SearchItem
                  title={pattern.title}
                  id={pattern._id}
                  external={pattern.external}
                  author={pattern.author}
                  image={pattern.image} />
            </div>)}
          </div>)}
        </div>
      </div>
  );
};

export default SearchPage;