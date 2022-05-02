import {findUser} from "../../services/user-service";
import {useEffect, useState} from "react";

const SearchItem = ({title, id, external, author, image}) => {
  const [user, setUser] = useState(author);
  const [link, setLink] = useState("");

  useEffect(() => {
    async function normalizeAuthor() {
      if (external) {
        setUser(author);
      } else {
        const user = await findUser(author);
        setUser(user.username);
        setLink(`/profile/${author}`);
      }
    }

    normalizeAuthor();
  })

  return (
      <div className="card mb-3">
        <img className="card-img-top" height="40px" width="auto" src={image ?? "/images/no_pattern_image.png"}  alt="thumbnail"/>
        <div className="card-body">
          <h5 className="card-title">{title} <span className={`badge ${external ? 'bg-secondary' : 'bg-primary'}`}>{external ? "External" : "Internal"}</span></h5>
          <p className={`card-text ${external ? '' : 'd-none'}`}>{user}</p>
          <p className={`card-text ${external ? 'd-none' : ''}`}><a href={link}>{user}</a></p>
          <a className="btn btn-primary" href={`/details/${external ? "external" : "internal"}/${id}`}>See this pattern</a>
        </div>
      </div>
  )
}

export default SearchItem;