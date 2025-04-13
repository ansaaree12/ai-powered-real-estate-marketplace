import { useContext, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import useAuthCheck from "../../hooks/useAuthCheck";
import { useMutation } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { checkFavourites, updateFavourites } from "../../utils/common.js";
import { toFav } from "../../utils/api.js";
import "./Heart.css";

const Heart = ({ id }) => {
  const [heartColor, setHeartColor] = useState("white");
  const [animate, setAnimate] = useState(false);
  const { validateLogin } = useAuthCheck();
  const { user } = useAuth0();

  const {
    userDetails: { favourites, token },
    setUserDetails,
  } = useContext(UserDetailContext);

  useEffect(() => {
    setHeartColor(checkFavourites(id, favourites));
  }, [favourites, id]);

  const { mutate } = useMutation({
    mutationFn: () => toFav(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        favourites: updateFavourites(id, prev.favourites),
      }));
    },
  });

  const handleLike = () => {
    if (validateLogin()) {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
        mutate();
        setHeartColor((prev) => (prev === "#fa3e5f" ? "white" : "#fa3e5f"));
      }, 500);
    }
  };

  return (
    <div className="heart-container" onClick={(e) => {
      e.stopPropagation();
      handleLike();
    }}>
      {animate && <AiFillHeart className="big-heart" size={50} color="#fa3e5f" />}
      <AiFillHeart size={24} color={heartColor} className="small-heart" />
    </div>
  );
};

export default Heart;
