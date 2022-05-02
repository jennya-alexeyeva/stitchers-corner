import {useProfile} from "../../services/profile-context";
import {useNavigate} from "react-router-dom";

const NavigationSidebar = ({active}) => {
  const {logout, currentProfile} = useProfile();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/home');
  }

  return(
    <div>
      <div className="list-group">
        <a href="/home" className={`list-group-item ${active === '/home' || active === '/' ? 'active' : ''}`}>Home</a>
        <a href="/search" className={`list-group-item ${active === '/search' ? 'active' : ''} ${!currentProfile?.isMaker ? "" : "d-none"}`}>Search for Patterns</a>
        <a href="/forum" className={`list-group-item ${active === '/forum' ? 'active' : ''} ${currentProfile ? "" : "d-none"}`}>Forum</a>
        <a href="/profile" className={`list-group-item ${active === '/profile' ? 'active' : ''} ${currentProfile ? "" : "d-none"}`}>My Profile</a>
      </div>
      <a href="/login" className={`mt-1 w-100 btn btn-primary ${currentProfile ? "d-none" : ""}`}>Log In</a>
      <a href="/register" className={`mt-1 w-100 btn btn-primary ${currentProfile ? "d-none" : ""}`}>Register</a>
      <a href="/post-pattern" className={`mt-1 w-100 btn btn-primary ${currentProfile && currentProfile.isMaker ? "" : "d-none"}`}>Post a Pattern</a>
      <button onClick={handleLogout} className={`mt-1 w-100 btn btn-primary ${currentProfile ? "" : "d-none"}`}>Log Out</button>
    </div>
  );
};

export default NavigationSidebar;