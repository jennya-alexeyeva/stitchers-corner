import {useLocation} from "react-router-dom";

const ForbiddenAccess = () => {
  const location = useLocation();
  const reason = location.state.reason;
  let text;

  if (reason === 'notMaker') {
    text = "This resource requires a Pattern Maker account."
  } else if (reason === 'notLoggedIn') {
    text = "This resource requires users to be logged in."
  } else {
    text = "This resource is forbidden."
  }
  return(
      <div>
        <p>{text}</p>
      </div>
  );
};

export default ForbiddenAccess;