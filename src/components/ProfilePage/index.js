import {useNavigate, useParams} from "react-router-dom";
import {useProfile} from "../../services/profile-context";
import {findUser} from "../../services/user-service";
import React, {useEffect, useState} from "react";
import {
  findAllPatternsForProfile
} from "../../services/pattern-service";
import {useDispatch, useSelector} from "react-redux";
import SearchItem from "../SearchItem";

const groupBy3 = (data) => {
  let result = [];
  for (let i = 0; i < data.length; i += 3) {
    result.push(data.slice(i, i + 3));
  }
  return result;
};

const ProfilePage = () => {
  const {currentProfile} = useProfile();
  const params = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const patterns = useSelector(
      state => state.patterns
  );
  const myPatterns = groupBy3(patterns.filter(pattern => {
    if (user?.isMaker) {
      return pattern.author === user._id
    } else if (user) {
      return pattern.favoritedUsers?.includes(user._id);
    } else {
      return false;
    }
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    async function getUser() {
      await findAllPatternsForProfile(dispatch);
      if (params.pid) {
        let user = await findUser(params.pid);
        await setUser(user);
      } else if (currentProfile === null) {
        navigate('/forbidden-access', {state: {reason: "notLoggedIn"}});
      } else if (currentProfile) {
        await setUser(currentProfile);
      }
    }

    getUser().catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile])

  return(
      <div>
        {
          user &&
            <div>
              <div className="row">
                <div className="col-3">
                  <img className="w-100" src={user.profilePic ?? '/images/no_pfp.png'} alt="profile pic" />
                </div>
                <div className="col-9">
                  <p>{user.username}</p>
                  <p>{user.aboutMe}</p>
                </div>
              </div>
              <div>
                {
                    myPatterns && myPatterns.map(row => row && <div className="row">
                      {row.map(pattern => pattern && <div className="col-4">
                        <SearchItem
                            title={pattern.title}
                            id={pattern._id}
                            external={pattern.external}
                            author={pattern.author}
                            image={pattern.image} />
                      </div>)}
                    </div>)
                }
              </div>
              <a href="/edit-profile" className={`btn btn-primary ${currentProfile && currentProfile._id !== user._id ? 'd-none' : ''}`}>Edit Profile</a>
            </div>
        }
      </div>
  );
};

export default ProfilePage;