import {useProfile} from "../../services/profile-context";
import {
  findBookByIdFromGoogleApi,
  findPatternById,
  findBookByIdFromDatabase,
  favoritePattern,
  unfavoritePattern, deletePattern
} from "../../services/pattern-service";
import {findUser} from "../../services/user-service";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";

const PatternDetails = () => {
  const {currentProfile} = useProfile();
  const {externalOrInternal, id} = useParams();
  const [bookInfo, setBookInfo] = useState(null);
  const [favoritedUsers, setFavoritedUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFavorite = async () => {
    if (currentProfile) {
      await favoritePattern(dispatch, currentProfile, bookInfo, externalOrInternal === "external");
      setBookInfo({...bookInfo, favoritedUsers: [...favoritedUsers, currentProfile._id]});
    } else {
      navigate("/forbidden-access", {state: {reason: "notLoggedIn", goBackBy: -1}});
    }
  }

  const handleUnfavorite = async () => {
    await unfavoritePattern(dispatch, currentProfile, bookInfo, externalOrInternal === "external");
    setBookInfo({...bookInfo, favoritedUsers: favoritedUsers.filter(user => user._id !== currentProfile._id)});
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete pattern ${bookInfo.title}?`)) {
      await deletePattern(dispatch, bookInfo);
      navigate('/profile');
    }
  };

  const getPrice = (price) => {
    try {
      return price.toLocaleString('us-US', {style: 'currency', currency: 'USD'});
    } catch {
      return "N/A";
    }
  }

  useEffect(() => {
    async function getPatternInfo() {
      let info;
      if (externalOrInternal === "external") {
        let bookInfoFromGoogleApi = await findBookByIdFromGoogleApi(id);
        info = {
          ...bookInfo,
          image: bookInfoFromGoogleApi.volumeInfo.imageLinks?.thumbnail ?? "/images/no_book_cover.png",
          title: bookInfoFromGoogleApi.volumeInfo.title ?? "Unknown title",
          author: bookInfoFromGoogleApi.volumeInfo.authors?.join(", ") ?? "Unknown author",
          price: bookInfoFromGoogleApi.saleInfo.saleability === "FOR_SALE" ? bookInfoFromGoogleApi.saleInfo.retailPrice.amount : "N/A",
          description: bookInfoFromGoogleApi.volumeInfo.description,
          link: `https://books.google.com/books/about?id=${id}`,
          googleBooksId: id
        };
        let bookInfoFromDatabase = await findBookByIdFromDatabase(id);
        if (bookInfoFromDatabase) {
          info = {
            ...info,
            favoritedUsers: bookInfoFromDatabase.favoritedUsers
          };
        }
      } else if (externalOrInternal === "internal") {
        info = await findPatternById(id);
        const user = await findUser(info.author);
        info = {...info, author: user.username, image: info.image ?? "/images/no_pattern_image.png", authorId: user._id};
      }
      await setBookInfo(info);
    }

    getPatternInfo();
    dispatch({
      type: 'CREATE_PATTERN',
      pattern: bookInfo
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile])

  useEffect(() => {
    async function getFavoritedUsers() {
      if (bookInfo?.favoritedUsers) {
        await setFavoritedUsers(await Promise.all(
            bookInfo.favoritedUsers.map(user => findUser(user))));
      }
    }

    getFavoritedUsers();
  }, [bookInfo])
  const favorited = currentProfile && favoritedUsers.some(user => user._id === currentProfile._id);

  return (
      <div>
        {bookInfo && <div>
          <div className="row">
            <div className="col-4 d-flex justify-content-center">
              <img className="col-12" src={bookInfo.image} alt="book cover or pattern thumbnail"/>
            </div>
            <div className="col-8">
              <h3>{bookInfo.title}</h3>
              <a href={bookInfo.link} target="_blank" rel="noopener noreferrer"
                 className={`${externalOrInternal === 'external' ? '' : 'd-none'} btn btn-primary`}>View on Google Books
              </a>
              <h5 className="mt-2">Author: {bookInfo.authorId ? <a href={`/profile/${bookInfo.authorId}`}>{bookInfo.author}</a> : bookInfo.author}</h5>
              <p>Price: {getPrice(bookInfo.price)}</p>
              <button className={`btn btn-primary ${favorited || currentProfile?.isMaker ? 'd-none' : ''}`} onClick={handleFavorite}>Favorite Pattern</button>
              <button className={`btn btn-secondary ${favorited && !currentProfile?.isMaker ? '' : 'd-none'}`} onClick={handleUnfavorite}>Unfavorite Pattern</button>
              <button
                  className={`mb-2 btn btn-success ${currentProfile?.isMaker && bookInfo.authorId === currentProfile._id ? '' : 'd-none'}`}
                  onClick={() => navigate(`/edit-pattern/${bookInfo._id}`)}>
                Edit Pattern
              </button>
              <br />
              <button
                  className={`btn btn-danger ${currentProfile?.isMaker && bookInfo.authorId === currentProfile._id ? '' : 'd-none'}`}
                  onClick={handleDelete}>
                Delete Pattern
              </button>
            </div>
          </div>
          <h4 className="mt-2">About This {bookInfo.external ? "Book" : "Pattern"}</h4>
          <p dangerouslySetInnerHTML={{__html: bookInfo.description}} />
          <br />
          <h5>Favorited by:</h5>
          {favoritedUsers.length === 0 ? <p>This pattern has no favorites yet. Be the first!</p> :
                <div>
                  <ul>
                    {favoritedUsers.map(user => <li><a href={`/profile/${user._id}`}>{user.username}</a></li>)}
                  </ul>
                </div>}
          </div>}
      </div>
  );
};

export default PatternDetails;