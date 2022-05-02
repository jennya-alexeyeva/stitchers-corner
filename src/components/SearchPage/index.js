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
  const search = window.location.search;
  const query = new URLSearchParams(search);
  const filter = query.get('filter');

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
      await findAllPatternsForSearch(dispatch, params.criteria, filter);
    }

    if (currentProfile && currentProfile.isMaker) {
      navigate("/my-patterns");
    } else {
      findPatterns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile, params, filter]);

  useEffect(() => {
    setMyPatterns(groupBy3(patterns));
  }, [patterns])

  const handleFilter = (filter) => {
    const currentLocation = window.location.toString()
          .replace(window.location.search, "")
          .replace(window.location.origin, "");
    navigate(`${currentLocation}${filter ? `?filter=${filter}` : ''}`);
  }

  return (
      <div>
        <div className="row mb-4">
          <input className= "col-9 me-5" ref={keywordRef} type="search" defaultValue={params.criteria} placeholder="Search" />
          <button className="col-2 ms-4 btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
        <div className="row">
          <div className="col-4">
            <input type="radio"
                   name="searchFilter"
                   id="all"
                   onChange={() => handleFilter(null)}
                   checked={!filter}
            />
            <label htmlFor="all">All Results</label>
          </div>
          <div className="col-4">
            <input type="radio"
                   name="searchFilter"
                   id="externalOnly"
                   onChange={() => handleFilter("external")}
                   checked={filter === "external"}
            />
            <label htmlFor="externalOnly">Only External Results</label>
          </div>
          <div className="col-4">
            <input type="radio"
                   name="searchFilter"
                   id="internalOnly"
                   onChange={() => handleFilter("internal")}
                   checked={filter === "internal"}
            />
            <label htmlFor="internalOnly">Only Internal Results</label>
          </div>
        </div>
        <div>
          {myPatterns?.length > 0 ? myPatterns.map(row => row && <div className="row">
            {row.map(pattern => pattern && <div className="col-4">
              <SearchItem
                  title={pattern.title}
                  id={pattern._id}
                  external={pattern.external}
                  author={pattern.author}
                  image={pattern.image} />
            </div>)}
          </div>) : <p>No search results found.</p>}
        </div>
      </div>
  );
};

export default SearchPage;