import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";

import {
  AuthContext,
} from "../context/AuthContext";

export default function FoodDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } =
    useContext(AuthContext);

  const [food, setFood] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  useEffect(() => {

    fetchFood();

  }, [id]);

  const fetchFood =
  async () => {

    try {

      const { data } =
        await API.get(
          `/foods/${id}`
        );

      setFood(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const addToCart =
  async () => {

    if (!user) {

      alert("Login First");

      return;
    }

    try {

      await API.post(

        "/cart/add",

        {
          foodId: food._id,
          quantity: 1,
        },

        {
          headers: {
            Authorization:
              `Bearer ${user.token}`,
          },
        }

      );

      alert(
        "Added To Cart"
      );

    } catch (error) {

      console.log(error);

    }

  };

  const submitReview =
  async () => {

    if (!user) {

      alert("Login First");

      return;
    }

    try {

      await API.post(

        `/foods/${food._id}/review`,

        {
          rating,
          comment,
        },

        {
          headers: {
            Authorization:
              `Bearer ${user.token}`,
          },
        }

      );

      alert(
        "Review Added"
      );

      setComment("");

      fetchFood();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message
      );

    }

  };

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        <h1 className="
          text-3xl
          font-bold
        ">
          Loading...
        </h1>

      </div>

    );

  }

  if (!food) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Food Not Found

      </div>

    );

  }

  return (

    <div className="
      min-h-screen
      bg-gray-100
    ">

      <Navbar />

      <div className="
        max-w-7xl
        mx-auto
        p-6
      ">

        <div className="
          bg-white
          rounded-2xl
          shadow-lg
          overflow-hidden
          grid
          md:grid-cols-2
          gap-8
        ">

          {/* IMAGE */}

          <div>

            <img
              src={`http://localhost:5000/${food.image}`}
              alt={food.title}
              className="
                w-full
                h-full
                object-cover
              "
            />

          </div>

          {/* DETAILS */}

          <div className="
            p-8
          ">

            <h1 className="
              text-4xl
              font-bold
              mb-4
            ">
              {food.title}
            </h1>

            <p className="
              text-gray-600
              mb-6
            ">
              {food.description}
            </p>

            <h2 className="
              text-3xl
              font-bold
              text-orange-500
              mb-4
            ">
              ₹{food.price}
            </h2>

            <div className="
              space-y-2
              mb-6
            ">

              <p>
                <b>Category:</b>
                {" "}
                {food.category}
              </p>

              <p>
                <b>Seller:</b>
                {" "}
                {food.sellerId?.name}
              </p>

              <p>
                <b>Phone:</b>
                {" "}
                {food.sellerId?.phone || "N/A"}
              </p>

              <p>
                <b>Address:</b>
                {" "}
                {food.sellerId?.address || "N/A"}
              </p>

              <p>
                <b>Bio:</b>
                {" "}
                {food.sellerId?.bio || "N/A"}
              </p>

            </div>

            {/* RATING */}

            <div className="
              bg-yellow-50
              p-4
              rounded-xl
              mb-6
            ">

              <h3 className="
                text-xl
                font-bold
              ">
                ⭐ Rating
              </h3>

              <p className="
                text-lg
              ">
                {food.rating?.toFixed(1)}
                {" "}
                / 5
              </p>

              <p>
                {food.totalReviews}
                {" "}
                Reviews
              </p>

            </div>

            {/* BUTTONS */}

            <div className="
              grid
              md:grid-cols-2
              gap-4
            ">

              <button
                onClick={addToCart}
                className="
                  bg-orange-500
                  text-white
                  py-3
                  rounded-lg
                  font-bold
                "
              >
                Add To Cart
              </button>

              <button
                onClick={()=>
                  navigate(`/chat/${food._id}`)
                }
                className="
                  bg-green-600
                  text-white
                  py-3
                  rounded-lg
                  font-bold
                "
              >
                Chat Seller
              </button>

              {/* WHATSAPP */}

              {
                food.sellerId?.whatsapp &&
                (
                  <a
                    href={`https://wa.me/${food.sellerId.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      bg-green-500
                      text-white
                      py-3
                      rounded-lg
                      font-bold
                      text-center
                    "
                  >
                    WhatsApp Seller
                  </a>
                )
              }

              {/* CALL */}

              {
                food.sellerId?.phone &&
                (
                  <a
                    href={`tel:${food.sellerId.phone}`}
                    className="
                      bg-blue-500
                      text-white
                      py-3
                      rounded-lg
                      font-bold
                      text-center
                    "
                  >
                    Call Seller
                  </a>
                )
              }

            </div>

          </div>

        </div>

        {/* ADD REVIEW */}

        <div className="
          bg-white
          mt-8
          p-6
          rounded-2xl
          shadow
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-4
          ">
            Add Review
          </h2>

          <select
            value={rating}
            onChange={(e)=>
              setRating(e.target.value)
            }
            className="
              border
              p-3
              rounded
              mb-4
              w-full
            "
          >

            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>

          </select>

          <textarea
            rows="4"
            value={comment}
            onChange={(e)=>
              setComment(e.target.value)
            }
            placeholder="Write Review..."
            className="
              w-full
              border
              p-3
              rounded
              mb-4
            "
          />

          <button
            onClick={submitReview}
            className="
              bg-orange-500
              text-white
              px-6
              py-3
              rounded-lg
              font-bold
            "
          >
            Submit Review
          </button>

        </div>

        {/* REVIEWS */}

        <div className="
          bg-white
          mt-8
          p-6
          rounded-2xl
          shadow
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-4
          ">
            Customer Reviews
          </h2>

          {
            food.reviews?.length > 0
              ? (
                food.reviews.map(
                  (review, index) => (

                    <div
                      key={index}
                      className="
                        border-b
                        py-4
                      "
                    >

                      <h3 className="
                        font-bold
                      ">
                        {review.userName}
                      </h3>

                      <p>
                        ⭐ {review.rating}
                      </p>

                      <p>
                        {review.comment}
                      </p>

                    </div>

                  )
                )
              )
              : (
                <p>
                  No Reviews Yet
                </p>
              )
          }

        </div>

      </div>

    </div>

  );

}