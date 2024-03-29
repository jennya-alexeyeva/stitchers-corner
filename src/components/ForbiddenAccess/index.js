import {useNavigate, useLocation} from "react-router-dom";

const ForbiddenAccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reason = location.state.reason;
  const goBackBy = location.state.goBackBy ?? -2;
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
        <h5>{text}</h5>
        <button className="btn btn-danger" onClick={() => navigate(goBackBy)}>Go to Previous Page</button>
      </div>
  );
};

export default ForbiddenAccess;