import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRestaurant } from "../redux/actions/restaurantAction";

const Restaurant = ({ restaurant }) => {
  const dispatch = useDispatch();
  const [showAI, setShowAI] = useState(false);

  const { isAuthenticated, user } = useSelector(
    (state) => state.user || {}
  );

  //DELETE
  const handleDelete = () => {
    if (!window.confirm("Delete this restaurant?")) return;

    dispatch(deleteRestaurant(restaurant._id)).catch(() => {
      alert("Unable to delete");
    });
  };
  const defaultImageUrl = restaurant.images?.[0]?.url || `${import.meta.env.BASE_URL}images/images.png`;
  const customImageUrl =
    restaurant.name === "Food Court Express" ||
    restaurant.name === "Spice Kitchen"
      ? "https://static.vecteezy.com/system/resources/previews/055/741/940/non_2x/welcome-to-our-restaurant-sign-illustration-free-vector.jpg"
      : defaultImageUrl;

  return (
    <div className="col-12 my-3">
    <div className="card restaurant-card p-3">

  <Link to={`/eats/stores/${restaurant._id}/menus`}>
    <img
      className="restaurant-image"
      src={customImageUrl}
      alt={restaurant.name}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `${import.meta.env.BASE_URL}images/images.png`;
      }}
    />
  </Link>

  <div className="restaurant-info">

    <h4>{restaurant.name}</h4>

    <p className="rest_address">
      {restaurant.address}
    </p>

    <div className="ratings">
      <div className="rating-outer">
        <div
          className="rating-inner"
          style={{
            width: `${(restaurant.ratings / 5) * 100}%`,
          }}
        ></div>
      </div>

      <span>
        ({restaurant.numOfReviews} Reviews)
      </span>
    </div>

    {restaurant.reviewSentiment && (
  <>


    <button
      className="ai-btn"
      onClick={() => setShowAI(!showAI)}
    >
      {showAI
        ? "➖ Hide Summary"
        : "💬 View Review Summary"}
    </button>

  
  </>
)}

  </div>

    {showAI && (
      <div className="ai-insights-box">

      <div className="ai-status">
      Review Summary : 
          😊 <strong>
            {restaurant.reviewSentiment}
          </strong>
       
        </div>

        <ul>
          {(restaurant.reviewSummaryBullets || []).map(
            (point, index) => (
              <li key={index}>{point}</li>
            )
          )}
        </ul>

        <div className="mentions">
          {(restaurant.reviewTopMentions || []).map(
            (item, index) => (
              <span
                key={index}
                className="mention-tag"
              >
                #{item}
              </span>
            )
          )}
        </div>

      </div>
    )}

</div>

      {isAuthenticated && user && user.role === "admin" ? (
        <div className="restaurant-card-footer">
          <button
            className="btn btn-danger btn-sm delete-btn"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Restaurant;