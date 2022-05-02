import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import './vendors/bootstrap/css/bootstrap.min.css';
import './vendors/bootstrap/bootstrap.min.css';
import './vendors/fontawesome/css/all.css';
import MainPage from "./components/MainPage";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import ForumPage from "./components/ForumPage";
import ForbiddenAccess from "./components/ForbiddenAccess";
import PatternDetails from "./components/PatternDetails";
import PostPattern from "./components/PostPattern";
import ProfilePage from "./components/ProfilePage";
import SearchPage from "./components/SearchPage";
import {ProfileProvider} from "./services/profile-context";
import EditProfile from "./components/EditProfile";


function App() {
  return (
      <ProfileProvider>
        <BrowserRouter>
          <div>
            <Routes>
              <Route element={<MainPage/>}>
                <Route path="/" element={<HomePage/>} />
                <Route path="home" element={<HomePage/>} />
                <Route path="edit-profile" element={<EditProfile/>} />
                <Route path="login" element={<LoginPage/>} />
                <Route path="register" element={<RegisterPage/>} />
                <Route path="forum" element={<ForumPage/>} />
                <Route path="forbidden-access" element={<ForbiddenAccess/>} />
                <Route path="details/:externalOrInternal/:id" element={<PatternDetails/>} />
                <Route path="post-pattern" element={<PostPattern/>} />
                <Route path="profile" element={<ProfilePage/>}>
                  <Route path=":pid" />
                </Route>
                <Route path="search" element={<SearchPage/>}>
                  <Route path=":criteria" />
                </Route>
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </ProfileProvider>
  );
}

export default App;
