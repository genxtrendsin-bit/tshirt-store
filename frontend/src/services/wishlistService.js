import API from "../utils/axios"

/* GET WISHLIST */

export const getWishlist = async () => {

  const res = await API.get("/wishlist");

  return res.data;

};

/* ADD TO WISHLIST */

export const addToWishlist = async (productId) => {

  const res = await API.post("/wishlist/add", {
    productId
  });

  return res.data;

};

/* REMOVE FROM WISHLIST */

export const removeFromWishlist = async (productId) => {

  const res = await API.delete(`/wishlist/${productId}`);

  return res.data;

};