import {Outlet} from "react-router-dom";
import NavigationSidebar from "../NavigationSidebar";
import {useProfile} from "../../services/profile-context";
import React, {useEffect} from "react";
import patternReducer from "../../reducers/pattern-reducer";
import {combineReducers, legacy_createStore as createStore} from "redux";
import {Provider} from "react-redux";
import './stitchers-corner-style.css';

const reducer = combineReducers({
  patterns: patternReducer
});
const store = createStore(reducer);

const MainPage = () => {
  const {checkLogin} = useProfile();

  useEffect(() => {
    async function checkLoggedIn() {
      await checkLogin();
    }

    checkLoggedIn().catch(e => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
      <div className="container">
        <div className="row mt-3">
          <Provider className="row" store={store}>
            <div className="col-3">
              <NavigationSidebar active={window.location.pathname} />
            </div>
            <div className="col-9">
              <Outlet />
            </div>
          </Provider>
        </div>
      </div>
  );
};

export default MainPage;