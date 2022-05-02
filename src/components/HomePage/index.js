import {useProfile} from "../../services/profile-context";
import {
  findAllPatternsForProfile
} from "../../services/pattern-service";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import SearchItem from "../SearchItem";

const groupBy3 = (data) => {
  let result = [];
  for (let i = 0; i < data.length; i += 3) {
    result.push(data.slice(i, i + 3));
  }
  return result;
};

const HomePage = () => {
  const {currentProfile} = useProfile();
  const patterns = useSelector(
      state => state.patterns
  );

  const [myPatterns, setMyPatterns] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getPatterns() {
      await findAllPatternsForProfile(dispatch);
    }

    getPatterns();
  }, [dispatch])

  useEffect(() => {
    let allPatterns = patterns.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    if (!currentProfile) {
      // generic content for not logged-in users
      setMyPatterns(groupBy3(allPatterns));
    } else if (currentProfile.isMaker) {
      // patterns that the user made
      setMyPatterns(groupBy3(allPatterns.filter(pattern => pattern.author === currentProfile._id)));
    } else {
      // patterns that the user favorited
      setMyPatterns(groupBy3(allPatterns.filter(pattern => pattern.favoritedUsers.includes(currentProfile._id))));
    }
  }, [currentProfile, patterns])
  return (
      <div>
        <div className="mt-4 p-5 bg-primary text-white rounded mb-4">
          <h1>Welcome{currentProfile ? " back" : ""}, {currentProfile ? currentProfile.username : "Anonymous Stitcher"}!</h1>
          <p>Stitcher's Corner is a social media platform that allows cross-stitchers to find and share patterns and other resources.</p>
        </div>
        <h3>{currentProfile?.isMaker ? 'Recently Posted Patterns'
            : (currentProfile ? 'Recently Favorited Patterns' : 'Recent Patterns')}</h3>
        <div>
          {myPatterns.map(row => row && <div className="row">
            {row.map(pattern => pattern && <div className="col-4"><SearchItem
                                           title={pattern.title}
                                           id={pattern.external
                                               ? pattern.googleBooksId
                                               : pattern._id}
                                           external={pattern.external}
                                           author={pattern.author}
                                           image={pattern.image}/></div>
            )}
          </div>
          )}
        </div>
      </div>
  );
};

export default HomePage;