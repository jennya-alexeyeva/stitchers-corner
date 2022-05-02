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
     findPatterns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, filter]);

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
        <div className="row mb-2">
          <input className= "col-9 col-lg-8 col-md-7 col-sm-6 me-5" ref={keywordRef} type="search" defaultValue={params.criteria} placeholder="Search" />
          <button className="col-2 ms-4 btn btn-primary" onClick={handleSearch}>
            <span className="fa-solid fa-magnifying-glass float-start w-25 mt-1" />
            <span className="float-end d-xl-block d-lg-block d-md-block d-sm-none w-75">Search</span>
          </button>
        </div>
        <div className="row mb-2">
          <div className="col-4">
            <input type="radio"
                   name="searchFilter"
                   id="all"
                   onChange={() => handleFilter(null)}
                   checked={!filter}
            />
            <label className="ms-2" htmlFor="all">All Results</label>
          </div>
          <div className="col-4">
            <input type="radio"
                   name="searchFilter"
                   id="externalOnly"
                   onChange={() => handleFilter("external")}
                   checked={filter === "external"}
            />
            <label className="ms-2" htmlFor="externalOnly">
              <span className="d-xl-block d-lg-block d-md-none d-sm-none">Only External Results</span>
              <span className="d-xl-none d-lg-none d-md-block d-sm-block">External</span>
            </label>
          </div>
          <div className="col-4">
            <input type="radio"
                   name="searchFilter"
                   id="internalOnly"
                   onChange={() => handleFilter("internal")}
                   checked={filter === "internal"}
            />
            <label className="ms-2" htmlFor="internalOnly">
              <span className="d-xl-block d-lg-block d-md-none d-sm-none">Only Internal Results</span>
              <span className="d-xl-none d-lg-none d-md-block d-sm-block">Internal</span>
            </label>
          </div>
        </div>
        <div>
          {myPatterns?.length > 0 ? myPatterns.map(row => row && <div className="row">
            {row.map(pattern => pattern && <div className="col-4">
              <SearchItem key={pattern._id}
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